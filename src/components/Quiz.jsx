import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { quizQuestions } from '../data/quizData';
import { saveQuizScore } from '../services/firebase';
import { generateSessionId } from '../utils/helpers';
import UiIcon from './UiIcon';
import '../styles/quiz.css';

function Quiz() {
  const [activeCategory, setActiveCategory] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [sessionId] = useState(() => generateSessionId());
  const [quizComplete, setQuizComplete] = useState(false);

  const categories = [
    { key: 'voter_registration', name: 'Voter Registration', icon: 'registration' },
    { key: 'voting_process', name: 'Voting Process', icon: 'voting' },
    { key: 'vote_counting', name: 'Vote Counting', icon: 'counting' },
    { key: 'election_results', name: 'Election Results', icon: 'results' },
  ];

  const startQuiz = (category) => {
    setActiveCategory(category);
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setSelectedAnswer(null);
    setQuizComplete(false);
  };

  const handleAnswer = async (optionIndex) => {
    setSelectedAnswer(optionIndex);
    setShowResult(true);

    const questions = quizQuestions[activeCategory];
    if (optionIndex === questions[currentQuestion].correct) {
      setScore(score + 1);
    }

    setTimeout(async () => {
      if (currentQuestion + 1 < questions.length) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        setQuizComplete(true);
        await saveQuizScore(
          sessionId,
          activeCategory,
          score + (optionIndex === questions[currentQuestion].correct ? 1 : 0),
          questions.length
        );
      }
    }, 2000);
  };

  if (!activeCategory) {
    return (
      <div className="quiz-container">
        <h2>Election Quiz</h2>
        <p className="quiz-intro">Test your knowledge about elections!</p>
        
        <div className="categories-grid">
          {categories.map((cat) => (
            <motion.button
              key={cat.key}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => startQuiz(cat.key)}
              className="category-btn"
            >
              <span className="cat-icon">
                <UiIcon name={cat.icon} size={24} />
              </span>
              <span className="cat-name">{cat.name}</span>
              <span className="cat-questions">
                {quizQuestions[cat.key].length} Questions
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  if (quizComplete) {
    const questions = quizQuestions[activeCategory];
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="quiz-result"
      >
        <h2>Quiz Complete</h2>
        <div className="score-display">
          <div className="score-number">{score}/{questions.length}</div>
          <div className="score-percentage">{percentage}%</div>
        </div>

        {percentage === 100 && <p className="feedback perfect">Perfect! You're an election expert! 🏆</p>}
        {percentage >= 80 && percentage < 100 && <p className="feedback great">Great job! You know a lot about elections! ⭐</p>}
        {percentage >= 60 && percentage < 80 && <p className="feedback good">Good! Keep learning more! 📖</p>}
        {percentage < 60 && <p className="feedback keep-trying">Keep learning! You're on your way! 💪</p>}

        <div className="result-actions">
          <button onClick={() => startQuiz(activeCategory)} className="retry-btn">
            Retry This Quiz
          </button>
          <button onClick={() => setActiveCategory(null)} className="back-btn">
            Choose Another Quiz
          </button>
        </div>
      </motion.div>
    );
  }

  const questions = quizQuestions[activeCategory];
  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <button onClick={() => setActiveCategory(null)} className="back-btn">
          ← Back
        </button>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
        <span className="question-counter">
          {currentQuestion + 1}/{questions.length}
        </span>
      </div>

      <motion.div
        key={currentQuestion}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="question-card"
      >
        <h3>{question.question}</h3>

        <div className="options">
          {question.options.map((option, idx) => (
            <motion.button
              key={idx}
              whileHover={!showResult ? { x: 5 } : {}}
              onClick={() => handleAnswer(idx)}
              disabled={showResult}
              className={`option-btn ${
                selectedAnswer === idx
                  ? idx === question.correct
                    ? 'correct'
                    : 'incorrect'
                  : ''
              }`}
            >
              <span className="option-letter">
                {String.fromCharCode(65 + idx)}
              </span>
              <span className="option-text">{option}</span>
              {showResult && idx === question.correct && (
                <span className="check-mark">✓</span>
              )}
              {showResult && selectedAnswer === idx && idx !== question.correct && (
                <span className="check-mark">✗</span>
              )}
            </motion.button>
          ))}
        </div>

        {showResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="explanation"
          >
            <p>
              {selectedAnswer === question.correct ? '✓ Correct!' : '✗ Incorrect!'}
            </p>
            <p>{question.explanation}</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default Quiz;
