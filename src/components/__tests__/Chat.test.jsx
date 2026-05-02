import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Chat from '../../components/Chat';

// Mock services
vi.mock('../../services/geminiService', () => ({
  getAIResponse: vi.fn(),
  detectIntent: vi.fn(),
}));

vi.mock('../../services/firebase', () => ({
  saveMessage: vi.fn().mockResolvedValue(undefined),
  getMessages: vi.fn().mockResolvedValue([]),
  initFirebaseAnalytics: vi.fn(),
}));

vi.mock('../../utils/helpers', () => ({
  generateSessionId: vi.fn(() => 'test-session-123'),
  formatTime: vi.fn((date) => new Date(date).toLocaleTimeString()),
  formatDate: vi.fn((date) => new Date(date).toLocaleDateString()),
}));

describe('Chat Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render chat container with initial message', () => {
      render(<Chat />);
      
      expect(screen.getByText(/ElectionIQ/)).toBeInTheDocument();
      expect(screen.getByText(/Ask me anything about how elections work/)).toBeInTheDocument();
    });

    it('should render message input field', () => {
      render(<Chat />);
      
      const input = screen.getByPlaceholderText(/Ask about elections/i);
      expect(input).toBeInTheDocument();
    });

    it('should render language selector', () => {
      render(<Chat />);
      
      const languageSelect = screen.getByDisplayValue('English');
      expect(languageSelect).toBeInTheDocument();
    });

    it('should render quick action buttons', () => {
      render(<Chat />);
      
      expect(screen.getByText(/Register to vote/)).toBeInTheDocument();
      expect(screen.getByText(/Voting day/)).toBeInTheDocument();
      expect(screen.getByText(/Vote counting/)).toBeInTheDocument();
    });

    it('should render voice input button', () => {
      render(<Chat />);
      
      const voiceBtn = screen.getByRole('button', { name: /microphone|voice/i });
      expect(voiceBtn).toBeInTheDocument();
    });
  });

  describe('Message Sending', () => {
    it('should send message and display user text', async () => {
      const { getAIResponse } = await import('../../services/geminiService');
      getAIResponse.mockResolvedValueOnce('Test AI response');

      render(<Chat />);

      const input = screen.getByPlaceholderText(/Ask about elections/i);
      await userEvent.type(input, 'How do I vote?');

      const sendBtn = screen.getByRole('button', { name: /send|arrow/i });
      fireEvent.click(sendBtn);

      await waitFor(() => {
        expect(screen.getByText('How do I vote?')).toBeInTheDocument();
      });
    });

    it('should display AI response after sending message', async () => {
      const { getAIResponse } = await import('../../services/geminiService');
      const mockResponse = 'Here is information about voting';
      getAIResponse.mockResolvedValueOnce(mockResponse);

      render(<Chat />);

      const input = screen.getByPlaceholderText(/Ask about elections/i);
      await userEvent.type(input, 'How do I vote?');

      fireEvent.click(screen.getByRole('button', { name: /send|arrow/i }));

      await waitFor(() => {
        expect(screen.getByText(mockResponse)).toBeInTheDocument();
      });
    });

    it('should not send empty message', async () => {
      const { getAIResponse } = await import('../../services/geminiService');

      render(<Chat />);

      const sendBtn = screen.getByRole('button', { name: /send|arrow/i });
      fireEvent.click(sendBtn);

      expect(getAIResponse).not.toHaveBeenCalled();
    });

    it('should clear input field after sending message', async () => {
      const { getAIResponse } = await import('../../services/geminiService');
      getAIResponse.mockResolvedValueOnce('Response');

       render(<Chat />);

       const input = screen.getByPlaceholderText(/Ask about elections/i);
       await userEvent.type(input, 'Test message');

       fireEvent.click(screen.getByRole('button', { name: /send|arrow/i }));

      await waitFor(() => {
        expect(input).toHaveValue('');
      });
    });

    it('should send message on Enter key', async () => {
      const { getAIResponse } = await import('../../services/geminiService');
      getAIResponse.mockResolvedValueOnce('Response');

      render(<Chat />);

      const input = screen.getByPlaceholderText(/Ask about elections/i);
      await userEvent.type(input, 'Test message{Enter}');

      await waitFor(() => {
        expect(getAIResponse).toHaveBeenCalled();
      });
    });

    it('should not send on Shift+Enter', async () => {
      const { getAIResponse } = await import('../../services/geminiService');

      render(<Chat />);

      const input = screen.getByPlaceholderText(/Ask about elections/i);
      await userEvent.type(input, 'Line 1');
      fireEvent.keyDown(input, { key: 'Enter', shiftKey: true });

      // Should allow newline, not send
      await waitFor(() => {
        expect(getAIResponse).not.toHaveBeenCalled();
      });
    });
  });

  describe('Error Handling', () => {
    it('should display error message on API failure', async () => {
      const { getAIResponse } = await import('../../services/geminiService');
      getAIResponse.mockRejectedValueOnce(new Error('Network error'));

      render(<Chat />);

      const input = screen.getByPlaceholderText(/Ask about elections/i);
      await userEvent.type(input, 'Test question');

      fireEvent.click(screen.getByRole('button', { name: /send|arrow/i }));

      await waitFor(() => {
        expect(screen.getByText(/Could not reach ElectionIQ/i)).toBeInTheDocument();
      });
    });

    it('should show quota error message on 429 status', async () => {
      const { getAIResponse } = await import('../../services/geminiService');
      getAIResponse.mockRejectedValueOnce(new Error('429: Rate limited'));

      render(<Chat />);

      const input = screen.getByPlaceholderText(/Ask about elections/i);
      await userEvent.type(input, 'Test');

      fireEvent.click(screen.getByRole('button', { name: /send|arrow/i }));

      await waitFor(() => {
        expect(screen.getByText(/quota reached/i)).toBeInTheDocument();
      });
    });

    it('should display retry button on error', async () => {
      const { getAIResponse } = await import('../../services/geminiService');
      getAIResponse.mockRejectedValueOnce(new Error('Network error'));

      render(<Chat />);

      const input = screen.getByPlaceholderText(/Ask about elections/i);
      await userEvent.type(input, 'Test');

      fireEvent.click(screen.getByRole('button', { name: /send|arrow/i }));

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
      });
    });

    it('should allow retrying failed message', async () => {
      const { getAIResponse } = await import('../../services/geminiService');
      getAIResponse
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce('Success response');

      render(<Chat />);

      const input = screen.getByPlaceholderText(/Ask about elections/i);
      await userEvent.type(input, 'Test message');

      fireEvent.click(screen.getByRole('button', { name: /send|arrow/i }));

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole('button', { name: /retry/i }));

      await waitFor(() => {
        expect(screen.getByText('Success response')).toBeInTheDocument();
      });
    });
  });

  describe('Quick Actions', () => {
    it('should send predefined query on quick action click', async () => {
      const { getAIResponse } = await import('../../services/geminiService');
      getAIResponse.mockResolvedValueOnce('Registration info');

      render(<Chat />);

      const registerBtn = screen.getByText(/Register to vote/);
      fireEvent.click(registerBtn);

      await waitFor(() => {
        expect(getAIResponse).toHaveBeenCalledWith(
          expect.stringContaining('register'),
          expect.any(String)
        );
      });
    });
  });

  describe('Language Selection', () => {
    it('should change language selection', async () => {
      render(<Chat />);

      const languageSelect = screen.getByDisplayValue('English');
      await userEvent.selectOptions(languageSelect, 'Hindi');

      expect(languageSelect).toHaveValue('Hindi');
    });

    it('should use selected language in AI prompts', async () => {
      const { getAIResponse } = await import('../../services/geminiService');
      getAIResponse.mockResolvedValueOnce('हिंदी response');

      render(<Chat />);

      const languageSelect = screen.getByDisplayValue('English');
      await userEvent.selectOptions(languageSelect, 'Spanish');

      const input = screen.getByPlaceholderText(/Ask about elections/i);
      await userEvent.type(input, 'Test');

      fireEvent.click(screen.getByRole('button', { name: /send|arrow/i }));

      await waitFor(() => {
        expect(getAIResponse).toHaveBeenCalledWith(
          expect.any(String),
          'Spanish'
        );
      });
    });
  });

  describe('Chat State Management', () => {
    it('should show loading state while sending message', async () => {
      const { getAIResponse } = await import('../../services/geminiService');
      getAIResponse.mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve('Response'), 100))
      );

      render(<Chat />);

      const input = screen.getByPlaceholderText(/Ask about elections/i);
      await userEvent.type(input, 'Test');

      fireEvent.click(screen.getByRole('button', { name: /send|arrow/i }));

      // Should show "Thinking..." state
      expect(screen.getByText(/Thinking/)).toBeInTheDocument();
    });

    it('should clear chat history on clear button click', async () => {
      const { getAIResponse } = await import('../../services/geminiService');
      getAIResponse.mockResolvedValueOnce('Test response');

      render(<Chat />);

       // Send a message
       const input = screen.getByPlaceholderText(/Ask about elections/i);
       await userEvent.type(input, 'Test message');
       fireEvent.click(screen.getByRole('button', { name: /send|arrow/i }));

      await waitFor(() => {
        expect(screen.getByText('Test message')).toBeInTheDocument();
      });

      // Clear chat
      const clearBtn = screen.getByRole('button', { name: /clear|trash|reset/i });
      fireEvent.click(clearBtn);

      // User message should be gone
      expect(screen.queryByText('Test message')).not.toBeInTheDocument();
    });
  });

  describe('Voice Input', () => {
    it('should have voice input button', () => {
      render(<Chat />);

      const voiceBtn = screen.getByRole('button', { name: /voice|microphone/i });
      expect(voiceBtn).toBeInTheDocument();
    });

    it('should show browser alert if SpeechRecognition not supported', () => {
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
      
      // Remove SpeechRecognition
      const originalSR = window.SpeechRecognition;
      delete window.SpeechRecognition;
      delete window.webkitSpeechRecognition;

      render(<Chat />);

      const voiceBtn = screen.getByRole('button', { name: /voice|microphone/i });
      fireEvent.click(voiceBtn);

      expect(alertSpy).toHaveBeenCalled();

      // Restore
      window.SpeechRecognition = originalSR;
      alertSpy.mockRestore();
    });
  });

  describe('Message Persistence', () => {
    it('should save user message to Firebase', async () => {
      const { getAIResponse } = await import('../../services/geminiService');
      const { saveMessage } = await import('../../services/firebase');
      
      getAIResponse.mockResolvedValueOnce('Response');

      render(<Chat />);

      const input = screen.getByPlaceholderText(/Ask about elections/i);
      await userEvent.type(input, 'Test message');

      fireEvent.click(screen.getByRole('button', { name: /send|arrow/i }));

      await waitFor(() => {
        expect(saveMessage).toHaveBeenCalledWith(
          'test-session-123',
          'Test message',
          'user'
        );
      });
    });

    it('should save AI response to Firebase', async () => {
      const { getAIResponse } = await import('../../services/geminiService');
      const { saveMessage } = await import('../../services/firebase');
      
      getAIResponse.mockResolvedValueOnce('AI Response text');

      render(<Chat />);

      const input = screen.getByPlaceholderText(/Ask about elections/i);
      await userEvent.type(input, 'Test');

      fireEvent.click(screen.getByRole('button', { name: /send|arrow/i }));

      await waitFor(() => {
        expect(saveMessage).toHaveBeenCalledWith(
          'test-session-123',
          'AI Response text',
          'bot'
        );
      });
    });
  });
});
