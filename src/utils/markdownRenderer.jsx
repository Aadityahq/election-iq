/* ─────────────────────────────────────────────────────────────────────────
    Lightweight markdown → React elements renderer
    Handles: **bold**, *italic*, numbered lists, bullet lists, line breaks
    ───────────────────────────────────────────────────────────────────────── */
import React from 'react';

export function renderMarkdown(text) {
  // Split into paragraphs / list items
  const lines = text.split('\n');
  const elements = [];
  let key = 0;

  let listBuffer = [];
  let listType = null; // 'ol' | 'ul'

  const flushList = () => {
    if (!listBuffer.length) return;
    const Tag = listType;
    elements.push(
      React.createElement(
        Tag,
        { key: key++, className: `md-list md-${listType}` },
        listBuffer.map((item, i) =>
          React.createElement('li', { key: i }, renderInline(item))
        )
      )
    );
    listBuffer = [];
    listType = null;
  };

  for (const raw of lines) {
    const line = raw.trimEnd();

    // Ordered list:  1. item
    const olMatch = line.match(/^\s*\d+\.\s+(.+)/);
    if (olMatch) {
      if (listType === 'ul') flushList();
      listType = 'ol';
      listBuffer.push(olMatch[1]);
      continue;
    }

    // Unordered list: - item  or • item
    const ulMatch = line.match(/^\s*[-•*]\s+(.+)/);
    if (ulMatch) {
      if (listType === 'ol') flushList();
      listType = 'ul';
      listBuffer.push(ulMatch[1]);
      continue;
    }

    // Empty line → flush list + add spacer
    if (!line.trim()) {
      flushList();
      elements.push(<span key={key++} className="md-br" />);
      continue;
    }

    // Regular paragraph
    flushList();
    elements.push(
      <p key={key++} className="md-p">
        {renderInline(line)}
      </p>
    );
  }

  flushList();
  return elements;
}

function renderInline(text) {
  // Bold **text** or __text__
  const parts = text.split(/(\*\*[^*]+\*\*|__[^_]+__|\*[^*]+\*|_[^_]+_)/g);
  return parts.map((part, i) => {
    if (/^\*\*(.+)\*\*$/.test(part) || /^__(.+)__$/.test(part)) {
      const inner = part.slice(2, -2);
      return <strong key={i}>{inner}</strong>;
    }
    if (/^\*(.+)\*$/.test(part) || /^_(.+)_$/.test(part)) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    return part;
  });
}