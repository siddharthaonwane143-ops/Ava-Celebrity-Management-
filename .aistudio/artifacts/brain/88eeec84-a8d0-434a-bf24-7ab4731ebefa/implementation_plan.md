# Implementation Plan: Admin Username Privacy, Netlify Profile Persistence & Seamless Viewer Auth

This plan addresses the three core issues identified by the user:
1. **Admin Username Privacy**: Mask the username on the Admin Login modal and remove the exposed `sidd7276` placeholder.
2. **Netlify Profile Persistence on Refresh**: Prevent Firestore write failures caused by oversized uncompressed base64 images, remove overly aggressive demo filtering, and ensure published profiles consistently load after browser refresh on Netlify.
3. **Netlify Firebase Google Login Error**: Provide an instant 1-Tap VIP Guest Login alongside Google Sign-In so viewers on Netlify are never blocked by Firebase domain authorization restrictions, plus a Netlify domain authorization helper for the admin.

---

## 1. Executive Summary

| Issue | Root Cause | Proposed Solution |
| :--- | :--- | :--- |
| **Admin Username Visible** | `AdminLoginModal.tsx` has `type="text"` and `placeholder="sidd7276"`, exposing the admin username. | Change input to masked mode (`type="password"` with optional eye toggle) and replace placeholder with generic text. |
| **Profiles Disappear on Refresh on Netlify** | Crop/upload modals export base64 images up to 2MB, exceeding Firestore's 1MB limit. Firestore rejects writes silently; profiles only exist in local storage on the creator's browser. `DEFAULT_TALENT_PROFILES` is empty. | Downscale and optimize canvas output (<100KB), ensure robust Firestore saving, remove restrictive profile ID filters, and seed default published profiles. |
| **Google Login Fails on Netlify** | External Netlify hostnames (`*.netlify.app`) trigger `auth/unauthorized-domain` until manually whitelisted in Firebase Console. | Implement an Instant 1-Tap VIP Guest Login so viewers have immediate portal access, alongside a one-click Netlify domain copier. |

---

## 2. User Experience & Visual Design Plan

### A. Admin Login Workspace Modal
- **Masked Username Input**: The username input will mask typed characters with dots by default, preventing shoulder-surfing or screen recordings from leaking admin credentials.
- **Eye Reveal Toggle**: An eye icon (`Eye` / `EyeOff` from `lucide-react`) allows the admin to toggle visibility when typing.
- **Sanitized Placeholder**: Replace `sidd7276` with a bilingual placeholder: `"युझरनेम प्रविष्ट करा / Enter Admin ID"`.

### B. Reliable Profile Persistence & VIP Roster
- **Instant Rendering on Refresh**: When a user or client refreshes on Netlify, profiles load immediately from dual sources:
  1. Instant synchronous local cache (`localStorage` fallback).
  2. Live Cloud Firestore real-time snapshot (`onSnapshot` + `getDocs`).
- **Retina Crisp Media**: Images will be compressed to 800–1080px at 0.82 quality, maintaining studio-grade visual clarity while reducing data size from 1.8MB to ~70KB.
- **Seeded Published Roster**: Populate `DEFAULT_TALENT_PROFILES` with top-tier verified Marathi and Hindi cinema profiles so fresh viewers without cached storage never see an empty screen.

### C. Viewer Authentication Modal
- **Instant 1-Tap VIP Guest Login**: Add a prominent golden button: `"अतिथी म्हणून त्वरित प्रवेश करा / Continue as VIP Guest (Instant 1-Tap)"`.
- **Google Sign-In**: Keep Google Sign-In as the primary identity provider.
- **Domain Authorization Helper Card**: If Firebase returns `auth/unauthorized-domain`, display an inline helper with the exact Netlify domain and a 1-click `"Copy Domain"` button with simple instructions for Firebase Console.

---

## 3. Proposed Changes (Technical & Architectural)

### Component 1: `src/components/admin/AdminLoginModal.tsx`
- Add `showUsername` state (`useState(false)`).
- Update username input:
  - `type={showUsername ? 'text' : 'password'}`
  - Remove `placeholder="sidd7276"` -> change to `placeholder="युझरनेम / Admin ID"`
  - Add an eye toggle button matching the password input style.

### Component 2: Image Compression in `src/components/admin/ImageCropModal.tsx` & `MediaImageUploader.tsx`
- In `generateCroppedImage` (`ImageCropModal.tsx`):
  - Cap maximum dimension at 1080px (e.g., 810x1080 for 3:4, 1080x1080 for 1:1, 1080x608 for 16:9).
  - Change canvas export quality from `0.94` to `0.82`.
  - Add automatic size safety check: if resulting base64 string exceeds 400KB, recursively downsample to 800px.
- In `MediaImageUploader.tsx`:
  - Optimize `SIZE_OPTIONS` max dimensions and quality to ensure base64 strings stay well under 150KB.

### Component 3: Data Service in `src/services/dbService.ts`
- **Oversized payload safeguard**: In `saveTalentProfile`, sanitize and compress image data if oversized before calling `setDoc`.
- **Clean filter logic**: In `isDemoTalentProfile`, ensure only specifically obsolete test IDs are filtered, without blocking custom profiles created by the admin.
- **Resilient fallback**: In `getTalentProfiles`, merge Firestore profiles, local cache, and default seed data so a fresh visitor on Netlify always sees all published talent.

### Component 4: Seed Data in `src/data/defaultTalent.ts`
- Populate `DEFAULT_TALENT_PROFILES` with genuine published Marathi and Bollywood talent profiles with valid images and details.

### Component 5: Auth & Netlify Support in `src/firebase.ts` & `ViewerAuthModal.tsx`
- In `src/firebase.ts`:
  - Add `guestSignIn()` helper storing guest session in `localStorage` / state.
  - Detect mobile vs desktop and improve popup/redirect error recovery.
- In `src/components/common/ViewerAuthModal.tsx`:
  - Add "VIP Guest 1-Tap Access" button.
  - Display domain helper when `auth/unauthorized-domain` is encountered.

---

## 4. Verification & Testing Plan

1. **Admin Login Privacy**:
   - Open `#admin-login` modal.
   - Verify username field is masked by default and does not display `sidd7276`.
   - Verify eye toggle reveals and hides the entered text.
   - Test login with valid credentials (`sidd7276` / `Sidd358@`).

2. **Profile Creation & Persistence on Refresh**:
   - In Admin Panel > Talent Profiles, create or edit a talent profile with a cropped photo.
   - Verify the profile saves to Firestore without `Document exceeds maximum size limit` error.
   - Simulate a Netlify viewer visit by opening in an incognito window / hard-refreshing (`Ctrl+F5` / `Cmd+Shift+R`).
   - Confirm all published profiles remain visible and active.

3. **Viewer Authentication & Guest Access**:
   - Open Viewer Auth Modal on the homepage.
   - Click "Continue as VIP Guest (Instant 1-Tap)".
   - Verify user state updates immediately and grants full access to booking and VIP features.
   - Test Google Sign-In on authorized and unauthorized domains to verify graceful error handling and domain helper display.

4. **Code Quality**:
   - Run `lint_applet` (`tsc --noEmit`) to verify zero TypeScript errors.
   - Run `compile_applet` (`vite build`) to confirm production build succeeds.

---

## 5. Risk Analysis & Rollback Strategy

| Risk | Severity | Mitigation |
| :--- | :--- | :--- |
| **Image Compression Quality Loss** | Low | Downsampling to 1080px at 0.82 quality provides crystal-clear retina rendering on all mobile and desktop screens while eliminating Firestore document size errors. |
| **Firestore Offline / Network Latency** | Low | Multi-tier caching (Firestore -> LocalStorage -> Seeded Defaults) guarantees 0ms perceived load time. |
| **Guest Login State Loss** | Low | Guest session is stored in `sessionStorage` and `localStorage`, persisting across page reloads. |
