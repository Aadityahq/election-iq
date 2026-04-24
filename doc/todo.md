# TODO - ElectionIQ Project

## Core Features
- [x] Setup React + Vite project
- [x] Create routing for Home, Chat, Timeline, Quiz, Map, and Settings
- [x] Build chat UI
- [x] Integrate Gemini API
- [x] Add premium styling and layout foundation

## Advanced Features
- [x] Add Firebase persistence for chat and quiz scores
- [x] Implement quiz module
- [x] Add Google Maps polling finder
- [x] Create election timeline with Google Charts
- [x] Add multilingual support
- [x] Add voice input
- [x] Add accessibility settings page

## UI/UX Improvements
- [x] Add animations with Framer Motion
- [x] Add quick action buttons
- [x] Add loading state and typing indicator
- [x] Improve mobile responsiveness
- [x] Replace emoji icons with shared SVG icons
- [x] Create a more premium landing page and hero layout

## Smart Features
- [x] Improve the system prompt
- [x] Add intent detection logic
- [ ] Restore chat history on app reload
- [ ] Route chat prompts from timeline and feature cards into the assistant automatically

## Security & Optimization
- [x] Move API keys to `.env.local`
- [x] Add Cloud Run server entrypoint
- [x] Add Dockerfile for container deployment
- [x] Add route-level lazy loading
- [ ] Add automated bundle analysis or size budget check
- [ ] Add stricter runtime validation for missing keys in the UI

## Testing
- [ ] Add unit tests for chat, quiz, and service logic
- [ ] Add smoke tests for map and timeline pages
- [ ] Add accessibility test pass with axe or similar
- [ ] Add a production smoke checklist for Cloud Run

## Deployment
- [ ] Complete Cloud Run deployment for final submission
- [x] Keep Firebase Hosting as an alternative deployment path
- [ ] Final end-to-end test before demo
- [x] Confirm server responds on port 8080

## Documentation
- [x] Add docs folder with context, logs, todo, and bugs
- [ ] Sync the root README with the latest Cloud Run deployment notes
