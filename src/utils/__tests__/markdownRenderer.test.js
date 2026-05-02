import { describe, it, expect } from 'vitest';
import { renderMarkdown } from '../markdownRenderer.jsx';

describe('markdownRenderer', () => {
  it('should render plain text', () => {
    const result = renderMarkdown('Hello world');
    expect(result.type).toBe('p');
    expect(result.props.children).toBe('Hello world');
  });

  it('should render bold text', () => {
    const result = renderMarkdown('This is **bold** text');
    expect(result.type).toBe('p');
    expect(result.props.children[0]).toBe('This is ');
    expect(result.props.children[1].type).toBe('strong');
    expect(result.props.children[1].props.children).toBe('bold');
    expect(result.props.children[2]).toBe(' text');
  });

  it('should render italic text', () => {
    const result = renderMarkdown('This is *italic* text');
    expect(result.type).toBe('p');
    expect(result.props.children[0]).toBe('This is ');
    expect(result.props.children[1].type).toBe('em');
    expect(result.props.children[1].props.children).toBe('italic');
    expect(result.props.children[2]).toBe(' text');
  });

  it('should render ordered list', () => {
    const result = renderMarkdown('1. First item\n2. Second item\n3. Third item');
    expect(result.type).toBe('ol');
    expect(result.props.children.length).toBe(3);
    expect(result.props.children[0].props.children).toBe('First item');
    expect(result.props.children[1].props.children).toBe('Second item');
    expect(result.props.children[2].props.children).toBe('Third item');
  });

  it('should render unordered list', () => {
    const result = renderMarkdown('- First item\n- Second item\n- Third item');
    expect(result.type).toBe('ul');
    expect(result.props.children.length).toBe(3);
    expect(result.props.children[0].props.children).toBe('First item');
    expect(result.props.children[1].props.children).toBe('Second item');
    expect(result.props.children[2].props.children).toBe('Third item');
  });

  it('should handle empty lines', () => {
    const result = renderMarkdown('First paragraph\n\nSecond paragraph');
    expect(result.type).toBe(React.Fragment);
    // Should have two paragraphs separated by a spacer
    expect(result.props.children.length).toBe(3);
    expect(result.props.children[0].type).toBe('p');
    expect(result.props.children[1].type).toBe('span'); // spacer
    expect(result.props.children[2].type).toBe('p');
  });

  it('should handle mixed content', () => {
    const result = renderMarkdown('Here is **bold** and *italic* text\n\n- List item 1\n- List item 2');
    expect(result.type).toBe(React.Fragment);
    expect(result.props.children.length).toBe(5); // p, spacer, ul, li, li
  });
});