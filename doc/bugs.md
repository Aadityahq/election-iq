# Bug Tracker

## Critical Issues
- [ ] Gemini responses can fail if the API key is missing or invalid
- [ ] Maps features depend on the Google Maps API key being configured
- [ ] Cloud Run deployment will fail if the build output is not generated first

## Medium Issues
- [ ] Chat history is not restored after a full page reload
- [ ] Some network failures still surface as generic error messages
- [ ] Timeline rendering depends on the Google Charts script loading successfully
- [ ] The quiz score flow depends on delayed state updates and should be covered by tests

## Minor Issues
- [ ] Large content blocks can make mobile pages feel tall
- [ ] Some button states could use even more hover feedback
- [ ] The root README still needs a final sync with the Cloud Run workflow
- [ ] Automated tests are still missing

## Fix Plan

### Gemini
- Keep the existing fallback message behavior
- Add more user-friendly retry prompts
- Show clearer UI when the API key is missing

### Maps
- Keep the manual location search fallback
- Add clearer validation when keys are missing
- Add a friendlier empty-state message when no stations are found

### Voice
- Keep the browser support check
- Add a manual text-first fallback path

### Deployment
- Keep the Express server on port 8080
- Verify Cloud Run deploys from the built `dist/` folder

### Testing
- Add unit tests for the main service functions
- Add component tests for chat and quiz flows
- Add a basic accessibility audit pass

## Fixed Items
- [x] Chat UI alignment issues
- [x] Firebase write error fallback
- [x] Routing refresh support
- [x] Emoji-style icons replaced with SVG icons
- [x] Cloud Run server entrypoint added
- [x] Manual polling search fallback added
