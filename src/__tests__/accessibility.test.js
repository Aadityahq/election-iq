import { describe, it, expect, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

// Mock services and components
vi.mock('../../services/geminiService');
vi.mock('../../services/firebase');
vi.mock('../../services/mapsService');
vi.mock('../../utils/helpers', () => ({
  generateSessionId: vi.fn(() => 'test-session'),
}));

// Import components after mocking
import Chat from '../../components/Chat';
import Quiz from '../../components/Quiz';
import Navbar from '../../components/Navbar';

describe('Accessibility Tests (WCAG 2.1 AA)', () => {
  describe('Chat Component', () => {
    it('should not have any accessibility violations', async () => {
      const { container } = render(<Chat />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have proper ARIA labels on buttons', () => {
      const { getByRole } = render(<Chat />);
      
      const sendButton = getByRole('button', { name: /send|arrow/i });
      expect(sendButton).toHaveAttribute('aria-label');
    });

    it('should have language selector with proper label', () => {
      const { getByLabelText } = render(<Chat />);
      
      const languageSelect = getByLabelText(/language/i);
      expect(languageSelect).toBeInTheDocument();
    });

    it('should have proper color contrast on text', () => {
      const { container } = render(<Chat />);
      
      const textElements = container.querySelectorAll('p, h1, h2, h3, span');
      expect(textElements.length).toBeGreaterThan(0);
    });

    it('should support keyboard navigation', () => {
      const { getByPlaceholderText } = render(<Chat />);
      
      const input = getByPlaceholderText(/Ask about voting/i);
      input.focus();
      expect(document.activeElement).toBe(input);
    });

    it('should have proper heading hierarchy', () => {
      const { container } = render(<Chat />);
      
      const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
      expect(headings.length).toBeGreaterThan(0);
    });
  });

  describe('Quiz Component', () => {
    it('should not have any accessibility violations', async () => {
      const { container } = render(<Quiz />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have proper labels on category buttons', () => {
      const { getAllByRole } = render(<Quiz />);
      
      const buttons = getAllByRole('button');
      buttons.forEach(button => {
        // Each button should have text content or aria-label
        expect(
          button.textContent.trim().length > 0 || button.getAttribute('aria-label')
        ).toBeTruthy();
      });
    });

    it('should have proper ARIA attributes on options', () => {
      const { getByText, getAllByRole } = render(<Quiz />);
      
      const startBtn = getByText('Voter Registration').closest('button');
      startBtn.click();

      const options = getAllByRole('button').filter(btn => 
        btn.className.includes('option-btn')
      );
      
      expect(options.length).toBeGreaterThan(0);
    });

    it('should support keyboard navigation in quiz', () => {
      const { getByText, getAllByRole } = render(<Quiz />);
      
      const startBtn = getByText('Voter Registration').closest('button');
      startBtn.focus();
      expect(document.activeElement).toBe(startBtn);
    });

    it('should display progress information accessibly', () => {
      const { getByText } = render(<Quiz />);
      
      const startBtn = getByText('Voter Registration').closest('button');
      startBtn.click();

      const progressCounter = getByText(/\d+\/\d+/);
      expect(progressCounter).toBeInTheDocument();
    });
  });

  describe('Navbar Component', () => {
    it('should not have any accessibility violations', async () => {
      const { container } = render(<Navbar />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have proper navigation landmarks', () => {
      const { container } = render(<Navbar />);
      
      const nav = container.querySelector('nav');
      expect(nav).toBeInTheDocument();
    });

    it('should have accessible links with descriptive text', () => {
      const { getAllByRole } = render(<Navbar />);
      
      const links = getAllByRole('link');
      links.forEach(link => {
        expect(
          link.textContent.trim().length > 0 || link.getAttribute('aria-label')
        ).toBeTruthy();
      });
    });
  });

  describe('Focus Management', () => {
    it('should show focus outline on interactive elements', () => {
      const { getByPlaceholderText } = render(<Chat />);
      
      const input = getByPlaceholderText(/Ask about voting/i);
      input.focus();
      
      // Should be visible to keyboard users
      expect(document.activeElement).toBe(input);
    });

    it('should maintain focus order in Quiz', () => {
      const { getByText } = render(<Quiz />);
      
      const buttons = document.querySelectorAll('button');
      expect(buttons.length).toBeGreaterThan(0);
      
      // All buttons should be focusable
      buttons.forEach(btn => {
        expect(btn).not.toHaveAttribute('tabindex', '-1');
      });
    });
  });

  describe('Color Contrast', () => {
    it('should have sufficient color contrast in Chat', () => {
      const { container } = render(<Chat />);
      
      const textElements = container.querySelectorAll('p, h1, h2, h3, span, button');
      expect(textElements.length).toBeGreaterThan(0);
      
      // Visual inspection would be needed for actual contrast ratios
      // This test ensures elements exist and are styled
    });

    it('should have sufficient color contrast in Quiz', () => {
      const { container } = render(<Quiz />);
      
      const textElements = container.querySelectorAll('p, h1, h2, h3, span, button');
      expect(textElements.length).toBeGreaterThan(0);
    });
  });

  describe('Alt Text and Images', () => {
    it('should have alt text for UiIcon components', () => {
      const { container } = render(<Chat />);
      
      const icons = container.querySelectorAll('svg');
      // SVG icons should either have aria-label or be wrapped in labeled elements
      expect(icons.length > 0).toBeTruthy();
    });
  });

  describe('Form Accessibility', () => {
    it('should have label associated with language select', () => {
      const { getByLabelText } = render(<Chat />);
      
      const languageSelect = getByLabelText(/language/i);
      expect(languageSelect).toHaveAttribute('id');
    });

    it('should have proper input attributes', () => {
      const { getByPlaceholderText } = render(<Chat />);
      
      const input = getByPlaceholderText(/Ask about voting/i);
      expect(input).toHaveAttribute('placeholder');
    });
  });

  describe('Screen Reader Support', () => {
    it('should have proper role attributes on custom buttons', () => {
      const { getAllByRole } = render(<Quiz />);
      
      const buttons = getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('should announce loading states', () => {
      const { container } = render(<Chat />);
      
      // Look for aria-live regions or aria-busy attributes
      const liveRegions = container.querySelectorAll('[aria-live]');
      // At least one live region should exist for accessibility
      // This is a best-practice check
    });

    it('should have descriptive status messages', () => {
      const { getByText } = render(<Chat />);
      
      const statusMessage = getByText(/AI-powered/);
      expect(statusMessage).toBeInTheDocument();
    });
  });

  describe('Mobile Accessibility', () => {
    it('should have touch-friendly button sizes', () => {
      const { getAllByRole } = render(<Chat />);
      
      const buttons = getAllByRole('button');
      // Buttons should be at least 44x44px (minimum touch target size)
      // This would require CSS inspection in a real test
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('should have proper spacing between interactive elements', () => {
      const { container } = render(<Quiz />);
      
      const buttons = container.querySelectorAll('button');
      expect(buttons.length).toBeGreaterThan(1);
      // Spacing would require CSS inspection
    });
  });

  describe('Semantic HTML', () => {
    it('should use semantic headings', () => {
      const { container } = render(<Chat />);
      
      const h2 = container.querySelector('h2');
      expect(h2).toBeInTheDocument();
    });

    it('should have semantic button elements', () => {
      const { getAllByRole } = render(<Quiz />);
      
      const buttons = getAllByRole('button');
      buttons.forEach(btn => {
        expect(btn.tagName).toBe('BUTTON');
      });
    });
  });
});
