import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getAIResponse, detectIntent } from '../../services/geminiService';

// Mock getEnv
vi.mock('../../services/env', () => ({
  getEnv: (key) => {
    if (key === 'VITE_GEMINI_API_KEY') return 'test-api-key';
    return '';
  },
}));

describe('geminiService.js', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
    vi.clearAllMocks();
  });

  describe('getAIResponse', () => {
    it('should return text response on successful API call', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          candidates: [
            {
              content: {
                parts: [{ text: 'Elections are held every 4 years.' }],
              },
            },
          ],
        }),
      };

      global.fetch.mockResolvedValueOnce(mockResponse);

      const result = await getAIResponse('When are elections held?');
      expect(result).toBe('Elections are held every 4 years.');
    });

    it('should include system prompt in request', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          candidates: [
            {
              content: {
                parts: [{ text: 'Test response' }],
              },
            },
          ],
        }),
      };

      global.fetch.mockResolvedValueOnce(mockResponse);

      await getAIResponse('Test prompt');
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('gemini-2.5-flash-lite'),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
      );
    });

    it('should try next model on 429 rate limit', async () => {
      const rateLimitResponse = {
        ok: false,
        status: 429,
        json: async () => ({ error: { message: 'Rate limited' } }),
      };

      const successResponse = {
        ok: true,
        status: 200,
        json: async () => ({
          candidates: [
            {
              content: {
                parts: [{ text: 'Success on second model' }],
              },
            },
          ],
        }),
      };

      global.fetch
        .mockResolvedValueOnce(rateLimitResponse)
        .mockResolvedValueOnce(successResponse);

      const result = await getAIResponse('Test');
      expect(result).toBe('Success on second model');
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    it('should throw error on 401 unauthorized', async () => {
      const unauthorizedResponse = {
        ok: false,
        status: 401,
        json: async () => ({ error: { message: 'Invalid API key' } }),
      };

      global.fetch.mockResolvedValueOnce(unauthorizedResponse);

      await expect(getAIResponse('Test')).rejects.toThrow();
    });

    it('should throw error on 400 bad request', async () => {
      const badRequestResponse = {
        ok: false,
        status: 400,
        json: async () => ({ error: { message: 'Bad request' } }),
      };

      global.fetch.mockResolvedValueOnce(badRequestResponse);

      await expect(getAIResponse('Test')).rejects.toThrow();
    });

    it('should handle empty response gracefully', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: async () => ({ candidates: [] }),
      };

      global.fetch.mockResolvedValueOnce(mockResponse);

      await expect(getAIResponse('Test')).rejects.toThrow();
    });

    it('should support language parameter in prompt', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          candidates: [
            {
              content: {
                parts: [{ text: 'Hola' }],
              },
            },
          ],
        }),
      };

      global.fetch.mockResolvedValueOnce(mockResponse);

      await getAIResponse('Test', 'Spanish');
      
      const callArgs = global.fetch.mock.calls[0];
      const body = JSON.parse(callArgs[1].body);
      expect(body.contents[0].parts[0].text).toContain('Spanish');
    });

    it('should throw error if all models fail', async () => {
      const failureResponse = {
        ok: false,
        status: 500,
        json: async () => ({ error: { message: 'Server error' } }),
      };

      global.fetch
        .mockResolvedValueOnce(failureResponse)
        .mockResolvedValueOnce(failureResponse);

      await expect(getAIResponse('Test')).rejects.toThrow();
    });
  });

  describe('detectIntent', () => {
    it('should return intent on successful detection', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          candidates: [
            {
              content: {
                parts: [{ text: 'voter_registration' }],
              },
            },
          ],
        }),
      };

      global.fetch.mockResolvedValueOnce(mockResponse);

      const intent = await detectIntent('How do I register to vote?');
      expect(intent).toBe('voter_registration');
    });

    it('should return trimmed and lowercase intent', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          candidates: [
            {
              content: {
                parts: [{ text: '  POLLING_LOCATION  ' }],
              },
            },
          ],
        }),
      };

      global.fetch.mockResolvedValueOnce(mockResponse);

      const intent = await detectIntent('Where do I vote?');
      expect(intent).toBe('polling_location');
    });

    it('should return "general" as fallback if detection fails', async () => {
      const failureResponse = {
        ok: false,
        status: 500,
        json: async () => ({ error: { message: 'Server error' } }),
      };

      global.fetch
        .mockResolvedValueOnce(failureResponse)
        .mockResolvedValueOnce(failureResponse);

      const intent = await detectIntent('Random question');
      expect(intent).toBe('general');
    });

    it('should try next model on 429 before falling back', async () => {
      const rateLimitResponse = {
        ok: false,
        status: 429,
        json: async () => ({ error: { message: 'Rate limited' } }),
      };

      const successResponse = {
        ok: true,
        json: async () => ({
          candidates: [
            {
              content: {
                parts: [{ text: 'voting_process' }],
              },
            },
          ],
        }),
      };

      global.fetch
        .mockResolvedValueOnce(rateLimitResponse)
        .mockResolvedValueOnce(successResponse);

      const intent = await detectIntent('How does voting work?');
      expect(intent).toBe('voting_process');
    });

    it('should return "general" on 401 error', async () => {
      const unauthorizedResponse = {
        ok: false,
        status: 401,
        json: async () => ({ error: { message: 'Invalid API key' } }),
      };

      global.fetch.mockResolvedValueOnce(unauthorizedResponse);

      const intent = await detectIntent('Test');
      expect(intent).toBe('general');
    });

    it('should handle response with extra whitespace', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          candidates: [
            {
              content: {
                parts: [{ text: 'election_results extra_text' }],
              },
            },
          ],
        }),
      };

      global.fetch.mockResolvedValueOnce(mockResponse);

      const intent = await detectIntent('Who won?');
      expect(intent).toBe('election_results');
    });
  });
});
