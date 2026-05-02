import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { PerformanceMonitor, debounce, throttle, memoize, VirtualList } from '../performance';

describe('PerformanceMonitor', () => {
  beforeEach(() => {
    // Mock performance API
    global.performance = {
      mark: vi.fn(),
      measure: vi.fn(),
      getEntriesByType: vi.fn(),
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should call performance.mark when available', () => {
    PerformanceMonitor.test('test-mark');
    expect(performance.mark).toHaveBeenCalledWith('test-mark');
  });

  it('should call performance.measure when available', () => {
    PerformanceMonitor.measure('test-measure', 'start', 'end');
    expect(performance.measure).toHaveBeenCalledWith('test-measure', 'start', 'end');
  });

  it('should return empty array when performance API not available', () => {
    delete global.performance;
    const metrics = PerformanceMonitor.getMetrics();
    expect(metrics).toEqual([]);
  });
});

describe('debounce', () => {
  it('should delay function execution', async () => {
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, 100);

    debouncedFn();
    debouncedFn();
    expect(mockFn).not.toHaveBeenCalled();

    // Wait for debounce delay
    await new Promise(resolve => setTimeout(resolve, 150));
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('should pass arguments to the function', async () => {
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, 50);

    debouncedFn('arg1', 'arg2');
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
  });
});

describe('throttle', () => {
  it('should limit function calls', async () => {
    const mockFn = vi.fn();
    const throttledFn = throttle(mockFn, 100);

    throttledFn();
    throttledFn();
    throttledFn();
    expect(mockFn).toHaveBeenCalledTimes(1);

    // Wait for throttle period
    await new Promise(resolve => setTimeout(resolve, 150));
    throttledFn();
    expect(mockFn).toHaveBeenCalledTimes(2);
  });
});

describe('memoize', () => {
  it('should cache function results', () => {
    const mockFn = vi.fn().mockImplementation((x) => x * 2);
    const memoizedFn = memoize(mockFn);

    expect(memoizedFn(5)).toBe(10);
    expect(memoizedFn(5)).toBe(10); // Should return cached result
    expect(mockFn).toHaveBeenCalledTimes(1); // Function only called once

    expect(memoizedFn(10)).toBe(20);
    expect(mockFn).toHaveBeenCalledTimes(2); // Called again with new arg
  });

  it('should handle object arguments', () => {
    const mockFn = vi.fn().mockImplementation((obj) => obj.value);
    const memoizedFn = memoize(mockFn);

    const obj1 = { value: 42 };
    const obj2 = { value: 42 }; // Different object with same content

    expect(memoizedFn(obj1)).toBe(42);
    expect(memoizedFn(obj2)).toBe(42); // Should be cached since JSON.stringify produces same key
    expect(mockFn).toHaveBeenCalledTimes(1);
  });
});

describe('VirtualList', () => {
  it('should calculate correct range for scroll offset', () => {
    const virtualList = new VirtualList(50, 5); // 50px item height, 5 visible items

    // At scroll offset 0
    let range = virtualList.getRangeForScrollOffset(0);
    expect(range.startIndex).toBe(0);
    expect(range.endIndex).toBe(7); // 0 + 5 + 2 buffer

    // At scroll offset 100
    range = virtualList.getRangeForScrollOffset(100);
    expect(range.startIndex).toBe(2); // 100 / 50 = 2
    expect(range.endIndex).toBe(9); // 2 + 5 + 2 buffer

    // At scroll offset 250
    range = virtualList.getRangeForScrollOffset(250);
    expect(range.startIndex).toBe(5); // 250 / 50 = 5
    expect(range.endIndex).toBe(12); // 5 + 5 + 2 buffer
  });
});