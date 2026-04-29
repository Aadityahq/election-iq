# ElectionIQ - Hackathon Submission Implementation Plan

**Goal:** Transform ElectionIQ from "good submission" to "hackathon winner" tier  
**Timeline:** ~3-4 hours of implementation  
**Date:** April 30, 2026

---

## 📋 Detailed Implementation Roadmap

### **Phase 1: Testing Infrastructure (HIGH PRIORITY)**
**Goal:** Add 15+ automated tests to demonstrate quality  
**Estimated Time:** 1.5 hours

#### Step 1.1: Install Testing Dependencies
```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-axe axios-mock-adapter
```

#### Step 1.2: Create Test Configuration
- Add vitest config to `vite.config.js`
- Create `src/services/__tests__/` directory structure
- Create `src/components/__tests__/` directory structure

#### Step 1.3: Service Layer Tests (Unit Tests)
**Files to create:**
- `src/services/__tests__/geminiService.test.js`
  - Test: API call success
  - Test: Model fallback on 429
  - Test: Error handling
  - Test: Empty response handling
  
- `src/services/__tests__/firebase.test.js`
  - Test: Message saving
  - Test: Message retrieval
  - Test: Missing config handling
  
- `src/utils/__tests__/helpers.test.js`
  - Test: Session ID generation
  - Test: Date formatting
  - Test: Time formatting

#### Step 1.4: Component Tests (Integration Tests)
**Files to create:**
- `src/components/__tests__/Chat.test.jsx`
  - Test: Message submission
  - Test: Typing indicator display
  - Test: Voice button (with mock)
  
- `src/components/__tests__/Quiz.test.jsx`
  - Test: Question display
  - Test: Answer selection
  - Test: Score calculation

#### Step 1.5: Accessibility Tests
**Files to create:**
- `src/__tests__/accessibility.test.js`
  - Run axe-core on main pages
  - Test keyboard navigation
  - Test ARIA labels

#### Step 1.6: Update package.json Scripts
```json
"test": "vitest",
"test:ui": "vitest --ui",
"test:coverage": "vitest --coverage",
"test:watch": "vitest --watch"
```

---

### **Phase 2: Security Hardening (MEDIUM PRIORITY)**
**Goal:** Add security headers and input validation  
**Estimated Time:** 15 minutes

#### Step 2.1: Update server.js
- Add security headers (CSP, HSTS, X-Frame-Options, etc.)
- Add rate limiting (optional: express-rate-limit)
- Add input validation middleware

---

### **Phase 3: Documentation Updates (HIGH PRIORITY)**
**Goal:** Complete README.md with all required sections  
**Estimated Time:** 30 minutes

#### Step 3.1: Root README.md Sections to Add/Update
1. **Google Services Integration** - Currently empty
2. **Local Development Setup**
3. **Environment Variables**
4. **Testing Guide**
5. **Deployment Guide** (Cloud Run detailed steps)
6. **Performance Metrics**
7. **Contributing Guidelines**

---

### **Phase 4: Chat History Restoration (MEDIUM PRIORITY)**
**Goal:** Auto-load chat history on page reload  
**Estimated Time:** 20 minutes

#### Step 4.1: Update ChatPage.jsx
- Add useEffect to load messages on mount
- Restore session ID from localStorage
- Display loading state while fetching

---

### **Phase 5: Performance Optimizations (MEDIUM PRIORITY)**
**Goal:** Add bundle analysis and size tracking  
**Estimated Time:** 20 minutes

#### Step 5.1: Update vite.config.js
- Add rollup optimization
- Add chunk size warnings
- Add build report

#### Step 5.2: Update package.json Scripts
```json
"build": "vite build && vite build --mode analyze"
```

---

### **Phase 6: Pre-Submission Checklist (HIGH PRIORITY)**
**Goal:** Verify all requirements met before GitHub submission  
**Estimated Time:** 30 minutes

#### Step 6.1: Update .env.example
- Document all required environment variables
- Add helpful comments

#### Step 6.2: Final Verification
- [ ] Run tests and verify all pass
- [ ] Run build and verify size < 10MB
- [ ] Run Lighthouse audit
- [ ] Test Cloud Run deployment
- [ ] Verify .env.local not committed
- [ ] Verify repo is public
- [ ] Test on mobile device

---

## ✅ Completion Criteria

| Item | Requirement | Status |
|------|-------------|--------|
| **Unit Tests** | ≥10 tests for services | ❌ |
| **Component Tests** | ≥5 tests for UI components | ❌ |
| **Accessibility Tests** | ≥1 axe audit per major page | ❌ |
| **Security Headers** | All OWASP headers present | ❌ |
| **Documentation** | All sections in README complete | ⚠️ |
| **Chat History** | Persists across reloads | ❌ |
| **Performance** | Lighthouse >80 all metrics | ⚠️ |
| **Bundle Size** | < 10MB | ✅ |
| **Deployment** | Cloud Run ready | ✅ |
| **GitHub** | Public repo, single branch | ✅ |

---

## 🎯 Success Metrics for Judges

✅ **Code Quality** — Clean structure + 15+ tests = comprehensive coverage  
✅ **Testing** — Unit + component + accessibility tests = "good breadth"  
✅ **Security** — Headers + input validation = defensive practices  
✅ **Performance** — Optimized chunks + monitoring = efficient behavior  
✅ **Documentation** — Complete guide = professional submission  
✅ **Google Services** — 5+ APIs integrated = "effective use"  

---

## 📅 Implementation Timeline

| Phase | Duration | Priority |
|-------|----------|----------|
| Phase 1: Testing | 1.5h | 🔴 CRITICAL |
| Phase 2: Security | 15m | 🟡 HIGH |
| Phase 3: Documentation | 30m | 🟡 HIGH |
| Phase 4: Chat History | 20m | 🟡 HIGH |
| Phase 5: Performance | 20m | 🟢 MEDIUM |
| Phase 6: Final Check | 30m | 🔴 CRITICAL |
| **TOTAL** | **~3.5 hours** | |

---

## Notes

- Tests should follow AAA pattern: Arrange, Act, Assert
- Use meaningful test names that describe the behavior
- Mock external APIs (Gemini, Firebase, Maps) to avoid quota issues
- Run tests locally before each commit
- Verify coverage report after tests pass
