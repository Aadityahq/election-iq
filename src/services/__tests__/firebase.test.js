import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getMessages, saveMessage, saveQuizScore, getQuizScores, initFirebaseAnalytics } from '../../services/firebase';

// Mock Firebase modules
vi.mock('firebase/app', () => ({
  initializeApp: vi.fn().mockReturnValue({}),
}));
vi.mock('firebase/analytics', () => ({
  isSupported: vi.fn(),
  getAnalytics: vi.fn()
}));
vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(() => ({ mockDb: true })),
  collection: vi.fn((db, name) => ({ collectionName: name })),
  addDoc: vi.fn(),
  getDocs: vi.fn(),
  query: vi.fn((...args) => ({ queryArgs: args })),
  where: vi.fn((field, op, value) => ({ field, op, value })),
  orderBy: vi.fn((field, direction) => ({ field, direction })),
}));

// Mock getEnv
vi.mock('../../services/env', () => ({
  getEnv: (key) => {
    const mockConfig = {
      'VITE_FIREBASE_API_KEY': 'test-key',
      'VITE_FIREBASE_AUTH_DOMAIN': 'test.firebaseapp.com',
      'VITE_FIREBASE_PROJECT_ID': 'test-project',
      'VITE_FIREBASE_STORAGE_BUCKET': 'test-bucket',
      'VITE_FIREBASE_MESSAGING_SENDER_ID': '123456789',
      'VITE_FIREBASE_APP_ID': 'test-app-id',
      'VITE_FIREBASE_MEASUREMENT_ID': 'test-measurement',
    };
    return mockConfig[key] || '';
  },
}));

describe('firebase.js', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('saveMessage', () => {
    it('should save message with session ID, text, and sender', async () => {
      const { addDoc } = await import('firebase/firestore');
      
      await saveMessage('session_123', 'Hello', 'user');
      
      expect(addDoc).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          sessionId: 'session_123',
          message: 'Hello',
          sender: 'user',
        })
      );
    });

    it('should save message with timestamp', async () => {
      const { addDoc } = await import('firebase/firestore');
      const beforeSave = Date.now();
      
      await saveMessage('session_123', 'Test', 'ai');
      
      const callArgs = addDoc.mock.calls[0][1];
      const timestamp = callArgs.timestamp.getTime();
      const afterSave = Date.now();
      
      expect(timestamp).toBeGreaterThanOrEqual(beforeSave);
      expect(timestamp).toBeLessThanOrEqual(afterSave + 1000);
    });

    it('should handle save errors gracefully', async () => {
      const { addDoc } = await import('firebase/firestore');
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      addDoc.mockRejectedValueOnce(new Error('Save failed'));
      
      await saveMessage('session_123', 'Test', 'user');
      
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error saving message:',
        expect.any(Error)
      );
      
      consoleErrorSpy.mockRestore();
    });
  });

  describe('getMessages', () => {
    it('should return messages for session ID', async () => {
      const { getDocs } = await import('firebase/firestore');
      
      const mockMessages = [
        { data: () => ({ message: 'Hello', sender: 'user' }) },
        { data: () => ({ message: 'Hi there', sender: 'ai' }) },
      ];
      
      getDocs.mockResolvedValueOnce({
        docs: mockMessages,
      });
      
      const result = await getMessages('session_123');
      
      expect(result).toEqual([
        { message: 'Hello', sender: 'user' },
        { message: 'Hi there', sender: 'ai' },
      ]);
    });

    it('should return empty array if no messages found', async () => {
      const { getDocs } = await import('firebase/firestore');
      
      getDocs.mockResolvedValueOnce({
        docs: [],
      });
      
      const result = await getMessages('session_123');
      expect(result).toEqual([]);
    });

    it('should return empty array on error', async () => {
      const { getDocs } = await import('firebase/firestore');
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      getDocs.mockRejectedValueOnce(new Error('Query failed'));
      
      const result = await getMessages('session_123');
      
      expect(result).toEqual([]);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error fetching messages:',
        expect.any(Error)
      );
      
      consoleErrorSpy.mockRestore();
    });
  });

  describe('saveQuizScore', () => {
    it('should save quiz score with calculated percentage', async () => {
      const { addDoc } = await import('firebase/firestore');
      
      await saveQuizScore('session_123', 'elections', 8, 10);
      
      expect(addDoc).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          sessionId: 'session_123',
          topicId: 'elections',
          score: 8,
          totalQuestions: 10,
          percentage: 80,
        })
      );
    });

    it('should calculate percentage correctly for various scores', async () => {
      const { addDoc } = await import('firebase/firestore');
      
      // Test 50%
      await saveQuizScore('session_1', 'topic1', 5, 10);
      expect(addDoc.mock.calls[0][1].percentage).toBe(50);
      
      // Test 33%
      addDoc.mockClear();
      await saveQuizScore('session_2', 'topic2', 1, 3);
      expect(addDoc.mock.calls[0][1].percentage).toBe(33);
      
      // Test 100%
      addDoc.mockClear();
      await saveQuizScore('session_3', 'topic3', 20, 20);
      expect(addDoc.mock.calls[0][1].percentage).toBe(100);
    });

    it('should save quiz score with timestamp', async () => {
      const { addDoc } = await import('firebase/firestore');
      
      await saveQuizScore('session_123', 'topic', 10, 10);
      
      const callArgs = addDoc.mock.calls[0][1];
      expect(callArgs.timestamp).toBeInstanceOf(Date);
    });

    it('should handle save errors gracefully', async () => {
      const { addDoc } = await import('firebase/firestore');
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      addDoc.mockRejectedValueOnce(new Error('Save failed'));
      
      await saveQuizScore('session_123', 'topic', 5, 10);
      
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error saving quiz score:',
        expect.any(Error)
      );
      
      consoleErrorSpy.mockRestore();
    });
  });

  describe('getQuizScores', () => {
    it('should return quiz scores for session ID', async () => {
      const { getDocs } = await import('firebase/firestore');
      
      const mockScores = [
        { data: () => ({ topicId: 'elections', score: 8, percentage: 80 }) },
        { data: () => ({ topicId: 'voting', score: 9, percentage: 90 }) },
      ];
      
      getDocs.mockResolvedValueOnce({
        docs: mockScores,
      });
      
      const result = await getQuizScores('session_123');
      
      expect(result).toEqual([
        { topicId: 'elections', score: 8, percentage: 80 },
        { topicId: 'voting', score: 9, percentage: 90 },
      ]);
    });

    it('should return empty array if no scores found', async () => {
      const { getDocs } = await import('firebase/firestore');
      
      getDocs.mockResolvedValueOnce({
        docs: [],
      });
      
      const result = await getQuizScores('session_123');
      expect(result).toEqual([]);
    });

    it('should return empty array on error', async () => {
      const { getDocs } = await import('firebase/firestore');
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      getDocs.mockRejectedValueOnce(new Error('Query failed'));
      
      const result = await getQuizScores('session_123');
      
      expect(result).toEqual([]);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error fetching quiz scores:',
        expect.any(Error)
      );
      
      consoleErrorSpy.mockRestore();
    });
  });

  describe('initFirebaseAnalytics', () => {
    it('should initialize analytics if supported', async () => {
      const analyticsModule = await import('firebase/analytics');
      analyticsModule.isSupported = vi.fn().mockResolvedValueOnce(true);
      analyticsModule.getAnalytics = vi.fn().mockReturnValueOnce({ mockAnalytics: true });
      
      const result = await initFirebaseAnalytics();
      
      expect(result).toBeDefined();
    });

    it('should return null if analytics not supported', async () => {
      const analyticsModule = await import('firebase/analytics');
      analyticsModule.isSupported = vi.fn().mockResolvedValueOnce(false);
      
      const result = await initFirebaseAnalytics();
      
      expect(result).toBeNull();
    });

     it('should return null on error', async () => {
       const analyticsModule = await import('firebase/analytics');
       const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
       
       analyticsModule.isSupported = vi.fn().mockResolvedValueOnce(true);
       analyticsModule.getAnalytics = vi.fn().mockImplementationOnce(() => {
         throw new Error('Init failed');
       });
       
       const result = await initFirebaseAnalytics();
       
       expect(result).toBeNull();
       expect(consoleErrorSpy).toHaveBeenCalledWith(
         'Error initializing analytics:',
         expect.any(Error)
       );
       
       consoleErrorSpy.mockRestore();
     });
  });
});
