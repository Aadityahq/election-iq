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
5. Accessibility settings for high contrast and large text
6. Responsive premium UI with shared SVG icons

## Current Architecture Notes
- `src/App.jsx` uses route-level lazy loading with a Suspense fallback
- `src/services/geminiService.js` centralizes AI prompts and intent detection
- `src/services/firebase.js` handles Firestore reads, writes, and analytics init
- `src/services/mapsService.js` loads Google Maps and queries nearby polling places
- `server.js` serves the production `dist/` bundle on port `8080` for Cloud Run

## Why It Matters
- Promotes civic awareness
- Makes election education less intimidating
- Combines AI and real-world data
- Feels like a complete product, not just a chatbot
- Has a deployment story that fits hackathon submission requirements
