import { describe, it, expect, beforeEach, vi } from 'vitest';
import { generateSessionId, formatTime, formatDate } from '../../utils/helpers';

describe('helpers.js', () => {
  describe('generateSessionId', () => {
    it('should generate a unique session ID with correct prefix', () => {
      const sessionId = generateSessionId();
      expect(sessionId).toMatch(/^session_\d+_[a-z0-9]+$/);
    });

    it('should generate different session IDs on multiple calls', () => {
      const id1 = generateSessionId();
      const id2 = generateSessionId();
      expect(id1).not.toBe(id2);
    });

    it('should have timestamp in session ID', () => {
      const before = Date.now();
      const sessionId = generateSessionId();
      const after = Date.now();
      
      const timestamp = parseInt(sessionId.split('_')[1]);
      expect(timestamp).toBeGreaterThanOrEqual(before);
      expect(timestamp).toBeLessThanOrEqual(after);
    });
  });

  describe('formatTime', () => {
    it('should format time in 12-hour format with leading zeros', () => {
      const testDate = new Date('2024-04-30T09:05:00');
      const result = formatTime(testDate);
      expect(result).toMatch(/\d{2}:\d{2}/);
    });

    it('should handle different times correctly', () => {
      const morningDate = new Date('2024-04-30T08:30:00');
      const eveningDate = new Date('2024-04-30T20:45:00');
      
      const morningResult = formatTime(morningDate);
      const eveningResult = formatTime(eveningDate);
      
      expect(morningResult).toBeTruthy();
      expect(eveningResult).toBeTruthy();
      expect(morningResult).not.toBe(eveningResult);
    });

    it('should accept string date and format correctly', () => {
      const dateString = '2024-04-30T14:30:00Z';
      const result = formatTime(dateString);
      expect(result).toMatch(/\d{2}:\d{2}/);
    });
  });

  describe('formatDate', () => {
    it('should format date as "Mon, Day, Year" format', () => {
      const testDate = new Date('2024-04-30T12:00:00');
      const result = formatDate(testDate);
      expect(result).toMatch(/^[A-Z][a-z]{2}\s+\d{1,2},\s+\d{4}$/);
    });

    it('should handle different dates correctly', () => {
      const earlyDate = new Date('2024-01-05T12:00:00');
      const lateDate = new Date('2024-12-25T12:00:00');
      
      const earlyResult = formatDate(earlyDate);
      const lateResult = formatDate(lateDate);
      
      expect(earlyResult).toContain('Jan');
      expect(lateResult).toContain('Dec');
    });

    it('should format single digit days with proper spacing', () => {
      const singleDayDate = new Date('2024-04-05T12:00:00');
      const doubleDayDate = new Date('2024-04-15T12:00:00');
      
      const singleResult = formatDate(singleDayDate);
      const doubleResult = formatDate(doubleDayDate);
      
      expect(singleResult).toBeTruthy();
      expect(doubleResult).toBeTruthy();
    });

    it('should accept string date and format correctly', () => {
      const dateString = '2024-04-30T12:00:00Z';
      const result = formatDate(dateString);
      expect(result).toMatch(/^[A-Z][a-z]{2}\s+\d{1,2},\s+\d{4}$/);
    });
  });
});
