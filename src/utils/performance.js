// Performance optimization utilities for ElectionIQ
export class PerformanceMonitor {
  static mark(name) {
    if (window.performance && window.performance.mark) {
      window.performance.mark(name);
    }
  }

  static measure(name, startMark, endMark) {
    if (window.performance && window.performance.measure) {
      window.performance.measure(name, startMark, endMark);
    }
  }

  static getMetrics() {
    if (window.performance && window.performance.getEntriesByType) {
      return window.performance.getEntriesByType('measure');
    }
    return [];
  }
}

// Debounce utility to prevent excessive function calls
export function debounce(fn, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

// Throttle utility to limit function call frequency
export function throttle(fn, limit) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Memoize expensive computations
export function memoize(fn) {
  const cache = new Map();
  return function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

// Optimize list rendering with virtual scrolling concept
export class VirtualList {
  constructor(itemHeight, visibleItemsCount) {
    this.itemHeight = itemHeight;
    this.visibleItemsCount = visibleItemsCount;
  }

  getRangeForScrollOffset(scrollOffset) {
    const startIndex = Math.floor(scrollOffset / this.itemHeight);
    const endIndex = startIndex + this.visibleItemsCount + 2; // Add buffer
    return { startIndex, endIndex };
  }
}

export default {
  PerformanceMonitor,
  debounce,
  throttle,
  memoize,
  VirtualList,
};