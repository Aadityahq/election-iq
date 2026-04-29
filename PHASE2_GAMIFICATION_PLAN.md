# Phase 2: Gamification Implementation Plan

**Estimated Duration:** 3 hours  
**Status:** In Progress  
**Start Date:** April 30, 2026

---

## 🎮 Overview

Add a gamification layer to ElectionIQ that rewards user engagement and learning across all features (Chat, Quiz, Timeline, Map). This increases time-on-app, learning retention, and makes the product feel more engaging.

---

## 🏆 Gamification Features

### 1. Badge System (5 Unique Badges)
Each badge represents achievement in a specific area:

| Badge | Icon | Unlock Condition | Points |
|-------|------|------------------|--------|
| **Civic Genius** | 🧠 | Complete 3 quizzes with 80%+ score | 50 pts |
| **Fact Checker Pro** | ✓ | Fact-check 5 claims | 40 pts |
| **Election Explorer** | 🗺️ | Find polling locations in 3 different cities | 30 pts |
| **Timeline Master** | 📅 | Visit all 7 timeline phases | 35 pts |
| **Conversation Expert** | 💬 | Ask 20 questions in chat | 25 pts |

### 2. Points System
Users earn points from various activities:

| Activity | Points | Notes |
|----------|--------|-------|
| Quiz completion (80%+) | 20 | Per quiz |
| Quiz completion (60-79%) | 10 | Per quiz |
| Fact check verification | 8 | Per claim |
| Chat message | 2 | Per question asked |
| Timeline phase visited | 5 | Per phase |
| Polling location search | 10 | Per city |
| First achievement | 5 | Bonus |

### 3. Leaderboard
- Global leaderboard showing top users (anonymized)
- Personal stats dashboard
- Rank badges (Bronze/Silver/Gold/Platinum)
- Week/Month/All-time filtering

---

## 📋 Implementation Breakdown

### Phase 2.1: Service Layer (45 min)
**File:** `src/services/gamificationService.js`

```javascript
// Core functions:
- addPoints(userId, activity, points)
- checkBadgeUnlock(userId, badge)
- getBadges(userId)
- getLeaderboard(timeframe='all')
- getPersonalStats(userId)
- getTopBadges()
```

Stores data in Firestore:
- `users/{userId}/points` — Point history
- `users/{userId}/badges` — Earned badges
- `global/leaderboard` — Top 100 users

### Phase 2.2: Components (90 min)

#### BadgeShowcase.jsx (60 min)
- Display earned badges with animation
- Show progress towards locked badges
- Toast notifications on badge unlock
- Responsive grid layout

#### Leaderboard.jsx (30 min)
- Top 10 users list
- Personal rank indicator
- Time period filter (Week/Month/All)
- Loading states and error handling

### Phase 2.3: Integration (30 min)
Update existing features to emit gamification events:

**Chat.jsx:**
- Track message sent as "chat activity"
- Update on submit

**Quiz.jsx:**
- Track score and completion
- Emit points on finish

**Map.jsx:**
- Track location search
- Emit points on search

**Timeline.jsx:**
- Track phase visits
- Emit points on scroll/click

**FactChecker.jsx:**
- Track fact checks
- Emit points on verification

### Phase 2.4: UI/Styling (45 min)
**Files:** 
- `src/styles/badges.css` — Badge grid and animations
- `src/styles/leaderboard.css` — Leaderboard styling

Features:
- Confetti animation on badge unlock
- Smooth gradient backgrounds
- Mobile responsive
- Dark mode compatible

### Phase 2.5: Testing (30 min)
**File:** `src/services/__tests__/gamification.test.js`

Tests:
- Point accumulation logic
- Badge unlock conditions
- Leaderboard ranking
- Data persistence
- Edge cases (negative points, duplicate badges)

---

## 📊 Data Schema

### Firestore Structure
```
users/
  {userId}/
    stats/
      totalPoints: number
      badges: array<badge>
      activities: array<{type, points, timestamp}>
      favoriteFeature: string
      
global/
  leaderboard/
    topUsers: array<{userId, displayName, points, badges}>
```

### Badge Data Structure
```javascript
{
  id: 'civic_genius',
  name: 'Civic Genius',
  description: 'Complete 3 quizzes with 80%+ score',
  icon: '🧠',
  unlocked: boolean,
  unlockedDate: timestamp,
  progress: {
    current: 1,
    target: 3,
    percentage: 33
  }
}
```

---

## 🎯 Success Criteria

✅ All 5 badges properly unlock based on conditions  
✅ Points accumulate across all 5 features  
✅ Leaderboard updates in real-time  
✅ Badge notifications appear on unlock  
✅ Personal stats dashboard functional  
✅ All tests passing (8+ tests)  
✅ Responsive on mobile (< 768px)  
✅ Accessibility compliant (WCAG 2.1 AA)  
✅ Build size increase < 30KB gzipped  
✅ Zero console errors

---

## 🚀 Implementation Steps

### Step 1: Create gamificationService.js
- Add to `src/services/`
- Implement all 7 core functions
- Add Firebase integration
- Create helper functions for badge logic

### Step 2: Create UI Components
- BadgeShowcase.jsx in `src/components/`
- Leaderboard.jsx in `src/components/`
- Create wrapper page SettingsPage enhancement
- Add to existing nav

### Step 3: Create Styling
- badges.css with animations
- leaderboard.css with responsive grid
- Integration with existing globals.css

### Step 4: Integrate with Features
- Update Chat.jsx to track messages
- Update Quiz.jsx to track scores
- Update Map.jsx to track searches
- Update Timeline.jsx to track visits
- Update FactChecker.jsx to track verifications

### Step 5: Add Tests
- Unit tests for service layer
- Mock Firebase calls
- Test badge unlocking logic
- Test point calculations

### Step 6: Update Documentation
- doc/logs.md with Phase 2 entry
- doc/todo.md check off gamification
- doc/context.md add gamification to features
- Create PHASE2_SUMMARY.md

---

## 📈 Expected Impact

**Engagement:**
- +30% time-on-app (based on gamification studies)
- +40% feature discovery (users try all features for badges)
- +25% return visits (progress tracking)

**Code Quality:**
- Follows service layer pattern
- 95%+ test coverage
- Responsive design
- Accessibility compliant
- Production-ready

---

## ⏱️ Timeline

| Phase | Duration | Status |
|-------|----------|--------|
| 2.1: Service Layer | 45 min | ⏳ Starting |
| 2.2: Components | 90 min | ⏳ Next |
| 2.3: Integration | 30 min | ⏳ Next |
| 2.4: Styling | 45 min | ⏳ Next |
| 2.5: Testing | 30 min | ⏳ Next |
| **Total** | **3 hours** | ⏳ In Progress |

---

## 🔄 Continuation Notes

- All data persists to Firebase Firestore
- Points/badges update in real-time across devices
- Leaderboard updates every 5 seconds
- Badge notifications use toast system
- Features not blocked if gamification fails
- Graceful degradation if Firebase unavailable

---

**Ready to implement!** Following the same patterns as Phase 1 (Fact Checker).

