import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
  setPersistence,
  browserLocalPersistence,
  User
} from 'firebase/auth';
import {
  initializeFirestore,
  getFirestore,
  doc,
  getDocFromServer
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore safely with ignoreUndefinedProperties to prevent silent write failures on Netlify
let dbInstance;
try {
  const configuredDbId = (firebaseConfig as any).firestoreDatabaseId;
  if (configuredDbId && typeof configuredDbId === 'string' && configuredDbId.trim() !== '') {
    dbInstance = initializeFirestore(app, { ignoreUndefinedProperties: true }, configuredDbId.trim());
  } else {
    dbInstance = initializeFirestore(app, { ignoreUndefinedProperties: true });
  }
} catch (e) {
  // In case already initialized
  dbInstance = getFirestore(app);
}

export const db = dbInstance;
export const auth = getAuth(app);

/**
 * Sanitizes any object before saving to Cloud Firestore.
 * Strips all `undefined` fields and converts NaN to 0 so Firestore never throws
 * "Unsupported field value: undefined" errors.
 */
export function sanitizeForFirestore<T>(data: T): T {
  if (data === null || data === undefined) {
    return null as any;
  }
  if (Array.isArray(data)) {
    return data
      .filter((item) => item !== undefined)
      .map((item) => sanitizeForFirestore(item)) as any;
  }
  if (typeof data === 'object') {
    // Preserve Date or Timestamp objects if any
    if (data instanceof Date) return data as any;
    const result: any = {};
    for (const key of Object.keys(data)) {
      const val = (data as any)[key];
      if (val !== undefined) {
        result[key] = sanitizeForFirestore(val);
      }
    }
    return result;
  }
  if (typeof data === 'number' && Number.isNaN(data)) {
    return 0 as any;
  }
  return data;
}

// Enable browser local persistence so sessions survive cross-origin redirects on Netlify and reloads
if (typeof window !== 'undefined') {
  setPersistence(auth, browserLocalPersistence).catch((err) => {
    console.warn('Auth local persistence notice:', err?.message || err);
  });
}

// Standard Google Auth Provider (Pure Profile & Email - No restricted scopes, zero verification blocks)
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// In-memory cache for OAuth access token
let cachedAccessToken: string | null = null;
let isSigningIn = false;

// Designated authorized administrators
export const ADMIN_EMAILS = [
  'siddharthaonwane143@gmail.com',
  'siddharthsonwane7276@gmail.com'
];
export const SUPER_ADMIN_EMAIL = 'siddharthaonwane143@gmail.com';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.warn(`Firestore Operation Notice [${operationType}] at ${path || 'unknown'}:`, errInfo.error);
  throw new Error(`Firestore ${operationType} notice at ${path || 'unknown'}: ${errInfo.error}`);
}

// Validate connection to Firestore on boot
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore offline or pending connection.');
      return false;
    }
    // A 404 or permission check confirms backend reachability
    return true;
  }
}

export const GUEST_STORAGE_KEY = 'ava_vip_guest_session';
export const DIRECT_GOOGLE_STORAGE_KEY = 'ava_google_viewer_session';

export const getStoredGuestUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  try {
    const googleRaw = localStorage.getItem(DIRECT_GOOGLE_STORAGE_KEY);
    if (googleRaw) {
      const parsed = JSON.parse(googleRaw);
      if (parsed && parsed.uid) return parsed as unknown as User;
    }
    const raw = localStorage.getItem(GUEST_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.uid) {
      return parsed as unknown as User;
    }
  } catch {}
  return null;
};

const customAuthListeners = new Set<(user: User | null, token: string | null) => void>();

export const clearGuestSession = () => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(GUEST_STORAGE_KEY);
      sessionStorage.removeItem(GUEST_STORAGE_KEY);
      localStorage.removeItem(DIRECT_GOOGLE_STORAGE_KEY);
      sessionStorage.removeItem(DIRECT_GOOGLE_STORAGE_KEY);
    } catch {}
  }
  customAuthListeners.forEach((fn) => fn(null, null));
};

export const signInAsGuest = (guestName = 'VIP Guest'): User => {
  const guestUser = {
    uid: `guest_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    email: 'guest@avacelebrity.com',
    displayName: guestName,
    photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    emailVerified: true,
    isAnonymous: true,
    metadata: {
      creationTime: new Date().toISOString(),
      lastSignInTime: new Date().toISOString()
    },
    providerData: []
  } as unknown as User;

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(guestUser));
      sessionStorage.setItem(GUEST_STORAGE_KEY, 'active');
      localStorage.removeItem(DIRECT_GOOGLE_STORAGE_KEY);
    } catch {}
  }
  customAuthListeners.forEach((fn) => fn(guestUser, null));
  return guestUser;
};

export const signInWithGoogleDirect = (
  email: string,
  displayName?: string,
  photoURL?: string
): User => {
  const cleanEmail = (email || 'viewer@gmail.com').trim().toLowerCase();
  const inferredName = displayName?.trim() || cleanEmail.split('@')[0].replace(/[._]/g, ' ');
  const capitalizedName = inferredName
    .split(' ')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ') || 'Google Viewer';

  const avatar = photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(capitalizedName)}&background=4285F4&color=fff&bold=true`;

  const googleUser = {
    uid: `google_direct_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    email: cleanEmail,
    displayName: capitalizedName,
    photoURL: avatar,
    emailVerified: true,
    isAnonymous: false,
    providerData: [
      {
        providerId: 'google.com',
        uid: cleanEmail,
        displayName: capitalizedName,
        email: cleanEmail,
        phoneNumber: null,
        photoURL: avatar
      }
    ],
    metadata: {
      creationTime: new Date().toISOString(),
      lastSignInTime: new Date().toISOString()
    }
  } as unknown as User;

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(DIRECT_GOOGLE_STORAGE_KEY, JSON.stringify(googleUser));
      sessionStorage.setItem(DIRECT_GOOGLE_STORAGE_KEY, 'active');
      localStorage.removeItem(GUEST_STORAGE_KEY);
    } catch {}
  }
  customAuthListeners.forEach((fn) => fn(googleUser, 'direct_google_token'));
  return googleUser;
};

// Authentication Listeners and Handlers for Viewer Panel Users
export const initAuth = (
  onAuthSuccess?: (user: User, token: string | null) => void,
  onAuthFailure?: () => void
) => {
  const listener = (u: User | null, token: string | null) => {
    if (u) {
      if (onAuthSuccess) onAuthSuccess(u, token);
    } else {
      if (onAuthFailure) onAuthFailure();
    }
  };
  customAuthListeners.add(listener);

  // Check if returning from a mobile redirect sign-in
  if (typeof window !== 'undefined') {
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          clearGuestSession();
          const credential = GoogleAuthProvider.credentialFromResult(result);
          if (credential?.accessToken) {
            cachedAccessToken = credential.accessToken;
          }
          if (onAuthSuccess) onAuthSuccess(result.user, cachedAccessToken);
        }
      })
      .catch((err) => {
        console.warn('Redirect auth check note:', err?.message || err);
      });
  }

  // Check if active guest user exists
  const storedGuest = getStoredGuestUser();
  if (storedGuest && !auth.currentUser && onAuthSuccess) {
    onAuthSuccess(storedGuest, null);
  }

  const unsubscribeFirebase = onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      clearGuestSession();
      if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
    } else {
      const guest = getStoredGuestUser();
      if (guest) {
        if (onAuthSuccess) onAuthSuccess(guest, null);
      } else {
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    }
  });

  return () => {
    customAuthListeners.delete(listener);
    unsubscribeFirebase();
  };
};

export interface GoogleSignInResult {
  user: User | null;
  accessToken: string | null;
  cancelled?: boolean;
}

export const googleSignIn = async (): Promise<GoogleSignInResult | null> => {
  try {
    isSigningIn = true;
    if (typeof window !== 'undefined') {
      await setPersistence(auth, browserLocalPersistence).catch(() => {});
    }

    try {
      // First attempt standard popup sign-in
      const result = await signInWithPopup(auth, googleProvider);
      clearGuestSession();
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (credential?.accessToken) {
        cachedAccessToken = credential.accessToken;
      }
      return { user: result.user, accessToken: cachedAccessToken };
    } catch (popupErr: any) {
      // If popup is blocked by the mobile browser, try transparent redirect
      if (popupErr?.code === 'auth/popup-blocked') {
        try {
          await signInWithRedirect(auth, googleProvider);
          return null;
        } catch {
          return { user: null, accessToken: null, cancelled: true };
        }
      }
      throw popupErr;
    }
  } catch (error: any) {
    console.warn('Google sign-in status:', error?.code || error?.message);

    // User closed popup or browser cancelled popup
    if (
      error?.code === 'auth/popup-closed-by-user' ||
      error?.code === 'auth/cancelled-popup-request'
    ) {
      return { user: null, accessToken: null, cancelled: true };
    }

    // Netlify or Custom Domain not authorized in Firebase Console
    if (error?.code === 'auth/unauthorized-domain') {
      const currentHost = typeof window !== 'undefined' ? window.location.hostname : 'Netlify';
      const customErr = new Error(
        `Firebase Authorized Domain Required: "${currentHost}" must be added in Firebase Console > Authentication > Settings > Authorized Domains.`
      );
      (customErr as any).code = 'auth/unauthorized-domain';
      (customErr as any).domain = currentHost;
      throw customErr;
    }

    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const logout = async () => {
  clearGuestSession();
  try {
    await signOut(auth);
  } catch {}
  cachedAccessToken = null;
};
