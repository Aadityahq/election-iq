# Project Context - ElectionIQ

## Goal
ElectionIQ is an AI-powered civic education assistant that helps people understand the election process in a simple, interactive, and trustworthy way.

## Problem
Many users, especially first-time voters, do not clearly understand:
- how to register
- where to vote
- what happens during the election cycle
- how vote counting and results work

Most available resources are too long, too technical, or not interactive.

## Solution
ElectionIQ combines:
- conversational AI guidance through Gemini
- a step-by-step election timeline
- a polling location finder using Google Maps
- a quiz module for learning and retention
- voice input and multilingual support
- a polished premium UI so the product feels submission-ready

## Target Users
- first-time voters
- students
- general citizens
- users who need a simpler explanation of election procedures

## Product Shape
The app is currently a frontend-first React application with a lightweight Node/Express server for Cloud Run deployment.

Main user-facing screens:
- Home landing page with feature highlights and CTA paths
- Chat assistant for election questions
- Timeline page for election phases
- Quiz page for learning checks
- Map page for polling station discovery
- Settings page for accessibility and language preferences

## Technology Stack

Frontend:
- React 18
- Vite
- React Router
- Framer Motion
- CSS with a glassmorphism design system

Services:
- Google Gemini API for AI responses and intent detection
- Google Gemini API for fact-checking election claims
- Google Maps API for polling location discovery
- Google Charts for timeline visualization
- Web Speech API for voice input
- Firebase Firestore for persistence
- Firebase Analytics for usage insight

Deployment:
- Cloud Run with a Node.js Express server serving the Vite build
- Firebase Hosting as an alternate deployment option

## Key Features
1. AI chat assistant with quick prompts, voice input, and multilingual responses
2. Election timeline with phase cards and Google Charts visualization
3. Polling booth finder with geolocation and manual location fallback
4. Quiz module with topic selection, scoring, and explanation feedback
5. **Fact Checker** — AI-powered election claim verification (TRUE/FALSE/PARTIALLY_TRUE) with confidence levels
6. **Multi-Country Support** — Explore elections in 12+ countries (India, US, UK, Australia, Canada, Germany, France, Japan, Brazil, South Africa, New Zealand, Singapore) with direct links to official election commission websites
7. Accessibility settings for high contrast and large text
8. Responsive premium UI with shared SVG icons and Lovable.dev design system

## Current Architecture Notes
- `src/App.jsx` uses route-level lazy loading with a Suspense fallback
- `src/services/geminiService.js` centralizes AI prompts and intent detection for chat
- `src/services/factCheckerService.js` handles fact verification with Gemini API and response parsing
- `src/services/firebase.js` handles Firestore reads, writes, and analytics init
- `src/services/mapsService.js` loads Google Maps and queries nearby polling places
- `src/components/CountrySelector.jsx` displays 12 countries with search, selection, and official links
- `server.js` serves the production `dist/` bundle on port `8080` for Cloud Run
- All services follow the same error handling and fallback patterns for reliability

## Design System (Lovable.dev Inspired)
**Color Palette:**
- Primary: #2563eb (blue-600), #60a5fa (blue-400), #1e40af (blue-800)
- Text: #0f172a (primary), #334155 (secondary), #64748b (muted)
- Backgrounds: White gradient to soft blue (#e0f2fe, #dbeafe)
- Borders: #e2e8f0 (light gray)
- Glass effect: rgba(255,255,255,0.7) with blur(16px)

**Visual Features:**
- Glassmorphism: Semi-transparent cards with backdrop blur
- Soft shadows: 0 2px 8px to 0 16px 40px with low opacity
- Rounded corners: 12px-32px depending on element
- Smooth transitions: 0.2s-0.3s ease for all interactions
- Responsive design: Mobile-first, optimized for all screen sizes

## Recent Changes (Phases 10-12)
- **Phase 10:** Removed gamification system - focused on core civic education features
- **Phase 11:** Applied Lovable.dev color palette and design system - modern premium look
  - Updated globals.css, navbar.css, and App.css
  - Fixed CSS syntax errors and variable naming
  - Optimized performance (reduced blur, simplified gradients)
- **Phase 12:** Added multi-country support - CountrySelector component with 12 countries

## Why It Matters
- Promotes civic awareness
- Makes election education less intimidating
- Combines AI and real-world data
- **Combats voter misinformation** with fact-checking tool
- **Helps voters verify claims** before voting decisions
- Feels like a complete product, not just a chatbot
- Has a deployment story that fits hackathon submission requirements
