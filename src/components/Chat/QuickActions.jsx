import React from 'react';
import { ClipboardCheck, CheckCircle, BarChart3, Clock, Shield } from 'lucide-react';

function QuickActions({ sendMessage, loading }) {
  const QUICK_ACTIONS = [
    { label: 'Register to vote', Icon: ClipboardCheck, query: 'How do I register to vote in India?' },
    { label: 'Voting day', Icon: CheckCircle, query: 'What happens on voting day?' },
    { label: 'Vote counting', Icon: BarChart3, query: 'How are votes counted in India?' },
    { label: 'Election timeline', Icon: Clock, query: 'Explain the election timeline step by step.' },
    { label: 'EVM & VVPAT', Icon: Shield, query: 'What is an EVM and VVPAT?' },
  ];

  return (
    <div className="quick-actions" aria-label="Suggested questions">
      <span className="quick-actions-label">Quick questions</span>
      {QUICK_ACTIONS.map((action) => {
        const { Icon } = action;
        return (
          <button
            key={action.label}
            onClick={() => sendMessage(action.query)}
            className="action-btn"
            disabled={loading}
            aria-label={`Ask: ${action.query}`}
          >
            <Icon size={14} strokeWidth={1.8} />
            {action.label}
          </button>
        );
      })}
    </div>
  );
}

export default QuickActions;