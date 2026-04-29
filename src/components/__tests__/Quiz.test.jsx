import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Quiz from '../../components/Quiz';

// Mock services
vi.mock('../../services/firebase', () => ({
  saveQuizScore: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('../../utils/helpers', () => ({
  generateSessionId: vi.fn(() => 'test-session-123'),
}));

// Mock quiz data
vi.mock('../../data/quizData', () => ({
  quizQuestions: {
    voter_registration: [
      {
        question: 'What is voter registration?',
        options: ['Process to enlist', 'Getting ID', 'Voting process', 'Registration fee'],
        correct: 0,
        explanation: 'Voter registration is the process...',
      },
      {
        question: 'When should you register?',
        options: ['1 month before', '2 weeks before', 'On voting day', 'Any time'],
        correct: 0,
        explanation: 'Register well in advance...',
      },
    ],
    voting_process: [
      {
        question: 'Where do you vote?',
        options: ['Polling booth', 'Home', 'Office', 'School'],
        correct: 0,
        explanation: 'Voting happens at polling booths...',
      },
    ],
    vote_counting: [
      {
        question: 'How are votes counted?',
        options: ['Manually', 'By EVM', 'By ballot', 'All of above'],
        correct: 3,
        explanation: 'Different methods are used...',
      },
    ],
    election_results: [
      {
        question: 'Who declares results?',
        options: ['Election Commission', 'Government', 'Media', 'Poll surveyors'],
        correct: 0,
        explanation: 'Election Commission declares results...',
      },
    ],
  },
}));

describe('Quiz Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Category Selection', () => {
    it('should display quiz categories on initial render', () => {
      render(<Quiz />);

      expect(screen.getByText('Voter Registration')).toBeInTheDocument();
      expect(screen.getByText('Voting Process')).toBeInTheDocument();
      expect(screen.getByText('Vote Counting')).toBeInTheDocument();
      expect(screen.getByText('Election Results')).toBeInTheDocument();
    });

    it('should show question count for each category', () => {
      render(<Quiz />);

      const registrationCategory = screen.getByText('Voter Registration').closest('button');
      expect(registrationCategory).toHaveTextContent('2 Questions');
    });

    it('should start quiz when category is clicked', async () => {
      render(<Quiz />);

      const registrationBtn = screen.getByText('Voter Registration').closest('button');
      fireEvent.click(registrationBtn);

      await waitFor(() => {
        expect(screen.getByText('What is voter registration?')).toBeInTheDocument();
      });
    });
  });

  describe('Quiz Flow', () => {
    it('should display first question when quiz starts', () => {
      render(<Quiz />);

      const registrationBtn = screen.getByText('Voter Registration').closest('button');
      fireEvent.click(registrationBtn);

      expect(screen.getByText('What is voter registration?')).toBeInTheDocument();
    });

    it('should display all answer options', () => {
      render(<Quiz />);

      const registrationBtn = screen.getByText('Voter Registration').closest('button');
      fireEvent.click(registrationBtn);

      expect(screen.getByText('Process to enlist')).toBeInTheDocument();
      expect(screen.getByText('Getting ID')).toBeInTheDocument();
      expect(screen.getByText('Voting process')).toBeInTheDocument();
      expect(screen.getByText('Registration fee')).toBeInTheDocument();
    });

    it('should show progress counter', () => {
      render(<Quiz />);

      const registrationBtn = screen.getByText('Voter Registration').closest('button');
      fireEvent.click(registrationBtn);

      expect(screen.getByText('1/2')).toBeInTheDocument();
    });

    it('should show progress bar', () => {
      render(<Quiz />);

      const registrationBtn = screen.getByText('Voter Registration').closest('button');
      fireEvent.click(registrationBtn);

      const progressBar = document.querySelector('.progress-fill');
      expect(progressBar).toBeInTheDocument();
    });
  });

  describe('Answer Selection', () => {
    it('should mark correct answer with check mark', async () => {
      render(<Quiz />);

      const registrationBtn = screen.getByText('Voter Registration').closest('button');
      fireEvent.click(registrationBtn);

      const correctOption = screen.getByText('Process to enlist').closest('button');
      fireEvent.click(correctOption);

      await waitFor(() => {
        expect(screen.getByText('✓')).toBeInTheDocument();
      });
    });

    it('should mark incorrect answer with X', async () => {
      render(<Quiz />);

      const registrationBtn = screen.getByText('Voter Registration').closest('button');
      fireEvent.click(registrationBtn);

      const incorrectOption = screen.getByText('Getting ID').closest('button');
      fireEvent.click(incorrectOption);

      await waitFor(() => {
        expect(screen.getByText('✗')).toBeInTheDocument();
      });
    });

    it('should disable options after answer selection', async () => {
      render(<Quiz />);

      const registrationBtn = screen.getByText('Voter Registration').closest('button');
      fireEvent.click(registrationBtn);

      const firstOption = screen.getByText('Process to enlist').closest('button');
      fireEvent.click(firstOption);

      await waitFor(() => {
        const allOptions = screen.getAllByRole('button')
          .filter(btn => btn.className.includes('option-btn'));
        allOptions.forEach(btn => {
          expect(btn).toBeDisabled();
        });
      });
    });

    it('should increase score for correct answer', async () => {
      render(<Quiz />);

      const registrationBtn = screen.getByText('Voter Registration').closest('button');
      fireEvent.click(registrationBtn);

      const correctOption = screen.getByText('Process to enlist').closest('button');
      fireEvent.click(correctOption);

      // Wait for quiz to move to next question
      await waitFor(() => {
        expect(screen.getByText('When should you register?')).toBeInTheDocument();
      }, { timeout: 3000 });
    });

    it('should not increase score for incorrect answer', async () => {
      render(<Quiz />);

      const registrationBtn = screen.getByText('Voter Registration').closest('button');
      fireEvent.click(registrationBtn);

      const incorrectOption = screen.getByText('Getting ID').closest('button');
      fireEvent.click(incorrectOption);

      await waitFor(() => {
        expect(screen.getByText('When should you register?')).toBeInTheDocument();
      }, { timeout: 3000 });
    });
  });

  describe('Quiz Completion', () => {
    it('should show results screen after last answer', async () => {
      render(<Quiz />);

      const registrationBtn = screen.getByText('Voter Registration').closest('button');
      fireEvent.click(registrationBtn);

      // Answer first question
      let option = screen.getByText('Process to enlist').closest('button');
      fireEvent.click(option);

      await waitFor(() => {
        expect(screen.getByText('When should you register?')).toBeInTheDocument();
      }, { timeout: 3000 });

      // Answer second question
      option = screen.getByText('1 month before').closest('button');
      fireEvent.click(option);

      await waitFor(() => {
        expect(screen.getByText('Quiz Complete')).toBeInTheDocument();
      }, { timeout: 3000 });
    });

    it('should display score on completion', async () => {
      render(<Quiz />);

      const registrationBtn = screen.getByText('Voter Registration').closest('button');
      fireEvent.click(registrationBtn);

      // Answer both questions correctly
      let option = screen.getByText('Process to enlist').closest('button');
      fireEvent.click(option);

      await waitFor(() => {
        expect(screen.getByText('When should you register?')).toBeInTheDocument();
      }, { timeout: 3000 });

      option = screen.getByText('1 month before').closest('button');
      fireEvent.click(option);

      await waitFor(() => {
        expect(screen.getByText('2/2')).toBeInTheDocument();
      }, { timeout: 3000 });
    });

    it('should display feedback message for perfect score', async () => {
      render(<Quiz />);

      const votingBtn = screen.getByText('Voting Process').closest('button');
      fireEvent.click(votingBtn);

      const option = screen.getByText('Polling booth').closest('button');
      fireEvent.click(option);

      await waitFor(() => {
        expect(screen.getByText(/Perfect! You're an election expert!/)).toBeInTheDocument();
      }, { timeout: 3000 });
    });

    it('should save quiz score to Firebase', async () => {
      const { saveQuizScore } = await import('../../services/firebase');

      render(<Quiz />);

      const registrationBtn = screen.getByText('Voter Registration').closest('button');
      fireEvent.click(registrationBtn);

      // Answer questions
      let option = screen.getByText('Process to enlist').closest('button');
      fireEvent.click(option);

      await waitFor(() => {
        expect(screen.getByText('When should you register?')).toBeInTheDocument();
      }, { timeout: 3000 });

      option = screen.getByText('1 month before').closest('button');
      fireEvent.click(option);

      await waitFor(() => {
        expect(saveQuizScore).toHaveBeenCalledWith(
          'test-session-123',
          'voter_registration',
          2,
          2
        );
      }, { timeout: 3000 });
    });
  });

  describe('Navigation', () => {
    it('should show back button during quiz', () => {
      render(<Quiz />);

      const registrationBtn = screen.getByText('Voter Registration').closest('button');
      fireEvent.click(registrationBtn);

      const backBtn = screen.getByText('← Back');
      expect(backBtn).toBeInTheDocument();
    });

    it('should return to category selection on back', () => {
      render(<Quiz />);

      const registrationBtn = screen.getByText('Voter Registration').closest('button');
      fireEvent.click(registrationBtn);

      const backBtn = screen.getByText('← Back');
      fireEvent.click(backBtn);

      expect(screen.getByText('Voter Registration')).toBeInTheDocument();
    });

    it('should allow retrying quiz on completion', async () => {
      render(<Quiz />);

      const registrationBtn = screen.getByText('Voter Registration').closest('button');
      fireEvent.click(registrationBtn);

      // Answer questions
      let option = screen.getByText('Process to enlist').closest('button');
      fireEvent.click(option);

      await waitFor(() => {
        expect(screen.getByText('When should you register?')).toBeInTheDocument();
      }, { timeout: 3000 });

      option = screen.getByText('1 month before').closest('button');
      fireEvent.click(option);

      await waitFor(() => {
        expect(screen.getByText('Retry This Quiz')).toBeInTheDocument();
      }, { timeout: 3000 });

      const retryBtn = screen.getByText('Retry This Quiz');
      fireEvent.click(retryBtn);

      expect(screen.getByText('What is voter registration?')).toBeInTheDocument();
    });

    it('should allow choosing another quiz on completion', async () => {
      render(<Quiz />);

      const registrationBtn = screen.getByText('Voter Registration').closest('button');
      fireEvent.click(registrationBtn);

      // Answer questions
      let option = screen.getByText('Process to enlist').closest('button');
      fireEvent.click(option);

      await waitFor(() => {
        expect(screen.getByText('When should you register?')).toBeInTheDocument();
      }, { timeout: 3000 });

      option = screen.getByText('1 month before').closest('button');
      fireEvent.click(option);

      await waitFor(() => {
        expect(screen.getByText('Choose Another Quiz')).toBeInTheDocument();
      }, { timeout: 3000 });

      const chooseBtn = screen.getByText('Choose Another Quiz');
      fireEvent.click(chooseBtn);

      expect(screen.getByText('Voter Registration')).toBeInTheDocument();
    });
  });

  describe('Feedback Messages', () => {
    it('should show appropriate feedback for 100% score', async () => {
      render(<Quiz />);

      const votingBtn = screen.getByText('Voting Process').closest('button');
      fireEvent.click(votingBtn);

      const option = screen.getByText('Polling booth').closest('button');
      fireEvent.click(option);

      await waitFor(() => {
        expect(screen.getByText(/Perfect! You're an election expert!/)).toBeInTheDocument();
      }, { timeout: 3000 });
    });

    it('should show percentage score', async () => {
      render(<Quiz />);

      const votingBtn = screen.getByText('Voting Process').closest('button');
      fireEvent.click(votingBtn);

      const option = screen.getByText('Polling booth').closest('button');
      fireEvent.click(option);

      await waitFor(() => {
        expect(screen.getByText('100%')).toBeInTheDocument();
      }, { timeout: 3000 });
    });
  });
});
