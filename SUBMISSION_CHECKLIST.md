# ElectionIQ - Pre-Submission Checklist

**Status:** Ready for final verification before hackathon submission  
**Date:** April 30, 2026  
**Deadline:** [Your hackathon deadline]

---

## ✅ Phase 1: Code Quality & Testing

- [ ] Run all tests: `npm test`
  - Expected: All 70+ tests pass
  - Time: ~2 minutes
  - Command output: `PASS - 70+ tests passed`

- [ ] Check test coverage: `npm run test:coverage`
  - Expected: Services 80%+ coverage, Components 70%+ coverage
  - Location: Open `coverage/index.html` in browser

- [ ] Verify no console errors:
  - Run: `npm run dev`
  - Check: Browser DevTools Console tab (should be empty)
  - Look for: Any red errors, yellow warnings

- [ ] Check ESLint (if configured):
  - Verify: No linting errors in code
  - Files: All `.jsx`, `.js` files in `src/` folder

- [ ] Verify component structure:
  - [ ] Modular and reusable components
  - [ ] Clear separation of concerns (services, components, pages)
  - [ ] No hardcoded values (use constants/config)

---

## ✅ Phase 2: Security Verification

- [ ] No API keys in repository:
  - Command: `grep -r "VITE_" src/ index.html` 
  - Expected: No actual key values, only variable names
  - Run: `grep -r "sk_" .` (should find nothing)

- [ ] .env.local is git-ignored:
  - Check: `.gitignore` contains `.env.local`
  - Command: `git status | grep -i env`
  - Expected: No `.env.local` in tracking

- [ ] Security headers present in server.js:
  - Check: `X-Content-Type-Options`, `X-Frame-Options`, `CSP`
  - Location: [server.js](../server.js#L10-L35)

- [ ] Input sanitization:
  - Location: [Chat.jsx](../src/components/Chat.jsx) - user input sanitized before API call
  - Check: HTML tags removed, content escaped

- [ ] Firebase Firestore rules reviewed:
  - Go to Firebase Console → Firestore → Rules
  - Verify: No wildcard allow rules
  - Check: Proper authentication/validation

- [ ] .env.example documented:
  - Check: All variables explained
  - Verify: Security notes included
  - Location: [.env.example](../.env.example)

---

## ✅ Phase 3: Functionality Testing

### Chat Feature
- [ ] Send message and receive AI response (5+ prompts)
  - Prompt 1: "How do I register to vote?"
  - Prompt 2: "What is the voting process?"
  - Prompt 3: "How are votes counted?"
  - Prompt 4: "Explain election timeline"
  - Prompt 5: "What is VVPAT?"
  - Expected: Natural, election-focused responses

- [ ] Error handling:
  - Disconnect internet → Send message → See error
  - Wait 2+ min → Try again → Should recover
  - Expected: User-friendly error messages (not JSON)

- [ ] Language selection works:
  - Select "Hindi" → Send message
  - Expected: Response in Hindi
  - Try: Spanish, French, Bengali

- [ ] Voice input works:
  - Grant microphone permission
  - Click voice button
  - Say "How do I vote?"
  - Expected: Text appears in input field

- [ ] Quick action buttons work:
  - Click "Register to vote" button
  - Expected: Predefined question sent, AI responds

### Timeline Feature
- [ ] Timeline loads without errors:
  - Expected: 6 election phases visible
  - Google Charts renders timeline
  - No console errors

- [ ] Timeline interactions:
  - Hover over phases (should highlight)
  - Click "Learn More" → Should open chat with topic

### Quiz Feature
- [ ] Category selection shows all 4 categories:
  - Voter Registration (2 questions)
  - Voting Process (2 questions)
  - Vote Counting (2 questions)
  - Election Results (2 questions)

- [ ] Answer selection and scoring:
  - Select wrong answer → See ✗ mark
  - Select right answer → See ✓ mark
  - Complete quiz → Verify score calculation (e.g., 6/6 = 100%)

- [ ] Feedback messages display:
  - 100% = "Perfect! You're an election expert!"
  - 80-99% = "Great job!"
  - 60-79% = "Good! Keep learning!"
  - <60% = "Keep trying!"

- [ ] Score persistence:
  - Complete a quiz
  - Refresh page
  - Check Firebase Console → Firestore → quizScores collection
  - Expected: Score saved with sessionId, topicId, percentage

### Polling Finder Feature
- [ ] Map loads without errors:
  - Expected: Google Maps visible
  - No console errors

- [ ] Geolocation request:
  - Click "Use My Location"
  - Expected: Permission prompt appears
  - If granted: User location shows on map

- [ ] Polling stations display:
  - Expected: 5 nearest stations listed below map
  - Each has: Name, address, distance, rating
  - One-click directions link works

- [ ] Manual location search:
  - Enter address without geolocation
  - Expected: Map updates to show that location + 5 stations

### Settings Feature
- [ ] Language selector saves preference:
  - Select "Hindi"
  - Refresh page
  - Expected: Hindi still selected

- [ ] High Contrast mode works:
  - Toggle on
  - Expected: Page colors invert/increase contrast
  - Refresh page: Still on

- [ ] Large Text mode works:
  - Toggle on
  - Expected: All text enlarged
  - Refresh page: Still on

- [ ] Navbar links work:
  - Click each navigation link
  - Expected: Correct page loads

---

## ✅ Phase 4: Performance & Accessibility

### Performance Metrics
- [ ] Build succeeds: `npm run build`
  - Expected: No errors, `dist/` folder created
  - Size: < 1MB total (check terminal output)

- [ ] Production preview: `npm run preview`
  - Expected: App runs on localhost:5173 with production build
  - No console errors

- [ ] Lighthouse audit:
  - Open `http://localhost:5173` in Chrome
  - DevTools → Lighthouse → Run audit (all categories)
  - Expected scores:
    - Performance: 80+
    - Accessibility: 95+
    - Best Practices: 90+
    - SEO: 90+

- [ ] Bundle size check:
  - Command: `npm run build`
  - Check: Terminal output for gzip size
  - Expected: ~450KB gzipped (< 1MB)

- [ ] First Load Performance:
  - Open app in incognito mode
  - DevTools → Network tab
  - Reload page
  - Expected:
    - Initial HTML loads < 2s
    - All resources load < 3s
    - No 404 errors

### Accessibility Compliance
- [ ] WCAG 2.1 AA Tests Pass:
  - Command: `npm test` (includes accessibility tests)
  - Expected: All accessibility tests pass

- [ ] Keyboard Navigation:
  - Click on input field (focus visible)
  - Tab through all buttons
  - Expected: All interactive elements reachable by keyboard
  - Press Enter on buttons → Actions trigger

- [ ] Screen Reader Test (use VoiceOver on Mac, NVDA on Windows):
  - Open Chat page
  - Use screen reader
  - Expected: All text, buttons, labels read correctly

- [ ] Color Contrast:
  - DevTools → Lighthouse → Accessibility report
  - Expected: No color contrast violations

- [ ] Form Accessibility:
  - Language selector has label
  - Message input has placeholder/aria-label
  - Expected: All form inputs properly labeled

---

## ✅ Phase 5: Deployment Readiness

### Local Deployment Test
- [ ] Express server runs:
  - Command: `npm start`
  - Expected: Server on `localhost:8080`
  - Visit `http://localhost:8080` → App loads

- [ ] Docker builds (if using Cloud Run):
  - Command: `docker build -t election-iq .`
  - Expected: Build completes with no errors
  - Command: `docker run -p 8080:8080 election-iq`
  - Expected: App runs on `localhost:8080`

### Cloud Run Preparation
- [ ] Dockerfile is valid:
  - Check: [Dockerfile](../Dockerfile) exists and is correct
  - Build test completed above

- [ ] .dockerignore exists:
  - Check: [.dockerignore](../.dockerignore)
  - Expected: Excludes `node_modules`, `.git`, etc.

- [ ] port 8080 used:
  - Check: [server.js](../server.js) line 8
  - Expected: `const port = process.env.PORT || 8080;`

### Firebase Hosting Preparation (if deploying there)
- [ ] Firebase CLI installed: `firebase --version`
  - Expected: Shows version number (e.g., "11.0.0")

- [ ] Firebase project configured:
  - Command: `firebase projects:list`
  - Expected: Your project listed

---

## ✅ Phase 6: GitHub Repository

- [ ] Repository is public:
  - Go to repository settings
  - Expected: Visibility = Public
  - Anyone can access without credentials

- [ ] Single branch only:
  - Command: `git branch -a`
  - Expected: Only `main` or `master` branch
  - Delete any feature/dev branches before submitting

- [ ] No large files in history:
  - Command: `git rev-list --all --objects | sort -k2 | tail -5`
  - Expected: No files > 5MB
  - Expected total repo size: < 10MB

- [ ] Repository size < 10MB:
  - Command: `du -sh .git`
  - Expected: < 10MB
  - If too large: Use `git gc --aggressive`

- [ ] README is complete:
  - Check: All sections filled (Features, Setup, Testing, Deployment, etc.)
  - Check: Links work (test in GitHub)
  - Check: Code examples are correct

- [ ] .gitignore is correct:
  - Expected: Contains `.env.local`, `node_modules/`, `dist/`, `.DS_Store`
  - Command: `git check-ignore -v .env.local`
  - Expected: `.env.local` listed

- [ ] Clean commit history:
  - Command: `git log --oneline | head -10`
  - Expected: Meaningful commit messages
  - No hundreds of test/temp commits

- [ ] All files added:
  - Command: `git status`
  - Expected: `working tree clean` (no uncommitted changes)

- [ ] Latest push successful:
  - Command: `git log origin/main -1`
  - Expected: Latest commit matches local

---

## ✅ Phase 7: Documentation

### README Completeness
- [ ] Features section complete with checkmarks
- [ ] Problem statement explained
- [ ] Technology stack documented
- [ ] Google Services Integration table filled
- [ ] Setup instructions clear and tested
- [ ] Testing section with commands
- [ ] Security & Privacy section present
- [ ] Evaluation criteria table filled
- [ ] Assumptions documented
- [ ] Future enhancements listed
- [ ] Submission checklist present

### Code Documentation
- [ ] Complex functions have comments
- [ ] Components have prop explanations (JSDoc or comments)
- [ ] Services have usage examples in comments
- [ ] API integrations documented

### Project Documentation
- [ ] [doc/context.md](../doc/context.md) - Updated with final architecture
- [ ] [doc/todo.md](../doc/todo.md) - All implemented items checked
- [ ] [doc/bugs.md](../doc/bugs.md) - All fixes applied and noted
- [ ] [doc/logs.md](../doc/logs.md) - Development history complete

- [ ] [IMPLEMENTATION_PLAN.md](../IMPLEMENTATION_PLAN.md) - Reference guide created

---

## ✅ Phase 8: Testing on Real Devices

### Mobile Testing
- [ ] Test on real smartphone (Android or iPhone):
  - Layout responsive (text readable, buttons clickable)
  - Touch interactions work smoothly
  - No horizontal scroll needed
  - Performance acceptable (< 3s load time)

- [ ] Test at different breakpoints:
  - 375px (iPhone SE)
  - 768px (iPad)
  - 1024px (desktop)
  - Expected: All layouts work

### Cross-Browser Testing
- [ ] Chrome (Version 120+):
  - All features work
  - No console errors
  
- [ ] Firefox (Version 120+):
  - All features work
  - Voice input works (if supported)

- [ ] Safari (Version 17+):
  - All features work
  - Check: Web Speech API works

- [ ] Edge (Version 120+):
  - All features work

---

## ✅ Phase 9: Final Verification

### API Keys Test
- [ ] Gemini API key works:
  - Run: `npm run dev`
  - Send message in Chat
  - Expected: AI responds (not error message)

- [ ] Google Maps API key works:
  - Go to Polling Finder page
  - Click location button
  - Expected: Map loads, stations display (not grey/broken)

- [ ] Firebase keys work:
  - Send chat message
  - Check Firebase Console → Firestore → messages collection
  - Expected: Message saved with timestamp

- [ ] All keys are different:
  - Gemini key ≠ Maps key ≠ Firebase key
  - Expected: Three distinct values

### Content Quality
- [ ] No typos or grammatical errors:
  - Check: README, comments, UI text
  - Use: Spell checker or Grammarly

- [ ] All links work:
  - README links to doc files ✓
  - GitHub links to code ✓
  - External links (Firebase, Cloud, etc.) ✓

- [ ] UI/UX is polished:
  - No weird spacing or alignment
  - Colors are consistent
  - Animations smooth (60fps)
  - No placeholder text visible

### Demo-Ready
- [ ] Create demo script (mental note):
  - 1. Show Chat: Ask 3 questions (registration, voting, counting)
  - 2. Show Timeline: Click Learn More
  - 3. Show Quiz: Answer 5 questions
  - 4. Show Map: Finder shows stations
  - 5. Show Settings: Change language, high contrast
  - Time: 3-5 minutes total

- [ ] Record quick video demo (optional but recommended):
  - 1-2 minutes showing all features
  - Upload to YouTube or include link in README
  - Shows app works end-to-end

---

## ✅ Phase 10: Submission Preparation

### 24 Hours Before Deadline

- [ ] **Final Tests:**
  - `npm test` — All tests pass ✓
  - `npm run build` — Build succeeds ✓
  - `npm start` — Server runs ✓
  - `docker build .` — Docker builds (if Cloud Run) ✓

- [ ] **Final Commit:**
  - Command: `git status` (should be clean)
  - Command: `git log -1` (verify latest changes)
  - Message: "Final submission for hackathon"

- [ ] **Push to GitHub:**
  - Command: `git push origin main`
  - Verify: GitHub repo updated

- [ ] **Double-Check Repository:**
  - Is it public?
  - Single branch only?
  - < 10MB total size?
  - README present and complete?

### At Submission Time

- [ ] **Collect Required Links:**
  - [ ] GitHub repository URL: `https://github.com/your-username/election-iq`
  - [ ] Live demo URL (if deployed):
    - Firebase Hosting: `https://election-iq.web.app`
    - Cloud Run: `https://election-iq-xxx.run.app`
  - [ ] Demo video link (if recorded)

- [ ] **Fill Submission Form:**
  - Project name: `ElectionIQ`
  - Category/Vertical: `Civic Education & Public Awareness`
  - Description: Copy from README problem statement
  - GitHub link: Your public repo URL
  - Tech stack: React, Vite, Gemini, Firebase, Maps, etc.
  - Demo link: Include if applicable

- [ ] **Final Checklist:**
  - [ ] No API keys in submission files
  - [ ] All tests pass
  - [ ] Build succeeds
  - [ ] Documentation complete
  - [ ] Repository public
  - [ ] Links work

---

## 🎯 Success Criteria

Your submission wins if:

✅ **Code Quality:** Tests pass, no console errors, clean structure  
✅ **Security:** No keys exposed, headers present, input sanitized  
✅ **Testing:** 70+ tests, good coverage, accessibility tests included  
✅ **Performance:** Lighthouse 80+, bundle < 500KB gzipped  
✅ **Google Services:** 5+ services meaningfully integrated  
✅ **Functionality:** All 6 features work end-to-end  
✅ **Documentation:** README complete, inline comments, deployment guide  
✅ **Accessibility:** WCAG 2.1 AA compliant, keyboard nav, screen reader support  

---

## 📋 Final Status

| Item | Status | Notes |
|------|--------|-------|
| Testing | ✅ 70+ tests | gemini, firebase, helpers, chat, quiz, a11y |
| Security | ✅ Headers added | CSP, HSTS, X-Frame-Options, sanitization |
| Docs | ✅ Complete | README, setup, testing, deployment, checklist |
| Chat History | ✅ Implemented | Loads on mount from Firestore |
| Performance | ✅ Optimized | Code splitting, lazy loading, bundle analysis |
| .env Example | ✅ Documented | All vars explained with security notes |
| Build | ✅ Ready | dist/ < 10MB, Dockerfile valid |
| Repository | ⏳ Ready | Public, single branch, clean history |

---

## ⚠️ Last-Minute Reminders

1. **DO NOT** commit `.env.local` — It's git-ignored, but verify with `git check-ignore`
2. **DO NOT** expose API keys in README code examples
3. **DO NOT** leave console.log() statements (removed by Terser in build)
4. **DO** test in production build, not just dev mode
5. **DO** verify all images/assets load correctly
6. **DO** check that links in README are not broken
7. **DO** run `npm audit` and address any security vulnerabilities

---

**Status:** All items implemented and ready for submission! 🚀

Good luck with your hackathon submission! ElectionIQ is a strong, well-tested project with excellent Google Services integration and professional documentation.

