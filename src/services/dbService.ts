import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import { db, auth, SUPER_ADMIN_EMAIL, handleFirestoreError, OperationType, sanitizeForFirestore } from '../firebase';
import {
  TalentCategory,
  TalentProfile,
  Package,
  Booking,
  TalentShow,
  EventRegistration,
  Audition,
  AuditionApplication,
  TalentApplication,
  PartnerProfile,
  SponsorProfile,
  MarketingBanner,
  SiteSettings,
  AuditLog,
  LiveTelecast,
  TeamContactInquiry,
  VideoMediaItem,
  Testimonial,
  UserProfile,
  ViewerFeatureCustomization,
  ThemeCustomizationSettings,
  DEFAULT_THEME_SETTINGS
} from '../types';
import { DEFAULT_TALENT_PROFILES, DEFAULT_MARKETING_BANNERS } from '../data/defaultTalent';

// Admin checking helper
export async function checkIfAdmin(uid?: string, email?: string): Promise<boolean> {
  const currentEmail = (email || auth.currentUser?.email || '').toLowerCase().trim();
  const currentUid = uid || auth.currentUser?.uid;

  if (
    currentEmail === 'siddharthaonwane143@gmail.com' ||
    currentEmail === 'siddharthsonwane7276@gmail.com' ||
    currentEmail === SUPER_ADMIN_EMAIL.toLowerCase()
  ) {
    return true;
  }

  if (currentUid) {
    try {
      const adminDoc = await getDoc(doc(db, 'admins', currentUid));
      if (adminDoc.exists()) {
        return true;
      }
    } catch {
      // not admin or unauthenticated
    }
  }

  return false;
}

// Log admin action
export async function createAuditLog(action: string, resource: string, details?: string) {
  try {
    const adminEmail = auth.currentUser?.email || 'System';
    await addDoc(collection(db, 'auditLogs'), {
      adminEmail,
      action,
      resource,
      details: details || '',
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    console.warn('Audit log write error:', error);
  }
}

// ----------------------------------------------------
// Talent Categories
// ----------------------------------------------------
const defaultCatTime = new Date().toISOString();
export const DEFAULT_OFFICIAL_CATEGORIES: TalentCategory[] = [
  { id: 'cat-actors', name: 'Actors & Actresses', slug: 'actors-actresses', description: 'Lead actors, character artists, theatre performers', subcategories: ['Lead Actor', 'Supporting Actor', 'Theatre Artist'], isPublished: true, displayOrder: 1, createdAt: defaultCatTime, updatedAt: defaultCatTime },
  { id: 'cat-celebrities', name: 'Celebrities & Stars', slug: 'celebrities', description: 'Renowned film stars, public icons & VIP personalities', subcategories: ['Film Stars', 'National Icons', 'VIP Guest'], isPublished: true, displayOrder: 2, createdAt: defaultCatTime, updatedAt: defaultCatTime },
  { id: 'cat-models', name: 'Models & Runway', slug: 'models', description: 'Editorial, fashion runway, commercial print models', subcategories: ['Runway Model', 'Print Model', 'Fashion Editorial'], isPublished: true, displayOrder: 3, createdAt: defaultCatTime, updatedAt: defaultCatTime },
  { id: 'cat-singers', name: 'Singers & Musicians', slug: 'singers-musicians', description: 'Playback vocalists, classical maestros, live bands', subcategories: ['Playback Singer', 'Live Band', 'Classical Vocalist'], isPublished: true, displayOrder: 4, createdAt: defaultCatTime, updatedAt: defaultCatTime },
  { id: 'cat-dancers', name: 'Dancers & Choreographers', slug: 'dancers', description: 'Classical, western, cinematic performers & directors', subcategories: ['Choreographer', 'Cinematic Dancer', 'Classical Performer'], isPublished: true, displayOrder: 5, createdAt: defaultCatTime, updatedAt: defaultCatTime },
  { id: 'cat-anchors', name: 'Anchors & Event Hosts', slug: 'anchors-hosts', description: 'Prime-time TV anchors, corporate & wedding emcees', subcategories: ['Celebrity Emcee', 'TV Host', 'Corporate Host'], isPublished: true, displayOrder: 6, createdAt: defaultCatTime, updatedAt: defaultCatTime },
  { id: 'cat-influencers', name: 'Influencers & Creators', slug: 'influencers', description: 'Verified digital personalities & social creators', subcategories: ['Instagram Creator', 'YouTube Partner', 'UGC Artist'], isPublished: true, displayOrder: 7, createdAt: defaultCatTime, updatedAt: defaultCatTime }
];

export async function getTalentCategories(publishedOnly = false): Promise<TalentCategory[]> {
  try {
    const col = collection(db, 'talentCategories');
    const q = publishedOnly
      ? query(col, where('isPublished', '==', true))
      : query(col);
    const snap = await getDocs(q);
    const list: TalentCategory[] = [];
    snap.forEach((d) => {
      list.push({ id: d.id, ...d.data() } as TalentCategory);
    });
    if (list.length > 0) {
      const sorted = list.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
      try { localStorage.setItem('ava_categories', JSON.stringify(sorted)); } catch {}
      return sorted;
    }
  } catch (error) {
    console.warn('Talent categories fetch note:', error);
  }

  // Local storage mirror or default fallback
  try {
    const cached = localStorage.getItem('ava_categories');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return DEFAULT_OFFICIAL_CATEGORIES;
}

export async function saveTalentCategory(category: Partial<TalentCategory>): Promise<string> {
  const now = new Date().toISOString();
  const cleanData = sanitizeForFirestore({
    ...category,
    updatedAt: now,
  });

  try {
    if (category.id) {
      await updateDoc(doc(db, 'talentCategories', category.id), cleanData);
      await createAuditLog('Updated Category', category.name || category.id);
      return category.id;
    } else {
      const ref = await addDoc(collection(db, 'talentCategories'), {
        ...cleanData,
        createdAt: now,
      });
      await createAuditLog('Created Category', category.name || ref.id);
      return ref.id;
    }
  } catch (error) {
    console.warn('Category write note:', error);
    return category.id || `cat-${Date.now()}`;
  }
}

export async function deleteTalentCategory(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'talentCategories', id));
    await createAuditLog('Deleted Category', id);
  } catch (error) {
    console.warn('Category delete note:', error);
  }
}

// ----------------------------------------------------
// Talent Profiles
// ----------------------------------------------------
// Helper to identify and filter out demo profiles
export const isDemoTalentProfile = (p: TalentProfile): boolean => {
  if (!p || !p.id) return false;
  const obsoleteDemoIds = new Set([
    'demo-artist-1',
    'demo-artist-2',
    'mock-talent-test'
  ]);
  return obsoleteDemoIds.has(p.id) || p.id.startsWith('mock-');
};

/**
 * Automatically downsizes base64 images so they never exceed Firestore's 1MB document limit.
 */
export async function compressBase64Image(dataUrl: string, maxDim = 800, quality = 0.82): Promise<string> {
  if (typeof window === 'undefined' || !dataUrl || !dataUrl.startsWith('data:image')) {
    return dataUrl;
  }
  if (dataUrl.length < 120 * 1024) {
    return dataUrl;
  }
  return new Promise((resolve) => {
    try {
      const img = new Image();
      img.onload = () => {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(dataUrl);
          return;
        }
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    } catch {
      resolve(dataUrl);
    }
  });
}

export async function getTalentProfiles(publishedOnly = true): Promise<TalentProfile[]> {
  const profileMap = new Map<string, TalentProfile>();

  // 1. Fetch from Cloud Firestore (Direct Cloud Database for Netlify & Production)
  try {
    const col = collection(db, 'talentProfiles');
    const q = publishedOnly
      ? query(col, where('status', '==', 'published'))
      : query(col);
    const snap = await getDocs(q);
    snap.forEach((d) => {
      const p = { id: d.id, ...d.data() } as TalentProfile;
      if (!isDemoTalentProfile(p)) {
        profileMap.set(p.id, p);
      }
    });
  } catch (error) {
    console.warn('Firestore profiles fetch note:', error);
  }

  // 2. Merge from Local Storage Mirror / Browser Cache
  try {
    const stored = JSON.parse(localStorage.getItem('ava_custom_profiles') || '[]');
    if (Array.isArray(stored)) {
      for (const p of stored) {
        if (!profileMap.has(p.id) && !isDemoTalentProfile(p)) {
          profileMap.set(p.id, p);
        }
      }
    }
  } catch (e) {}

  // 3. Local Development backend sync (Only when running on localhost)
  const isLocalDev = typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  if (isLocalDev) {
    try {
      const res = await fetch('/api/sync/profiles');
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        const json = await res.json();
        if (json && Array.isArray(json.profiles)) {
          for (const p of json.profiles) {
            if (!profileMap.has(p.id) && !isDemoTalentProfile(p)) {
              profileMap.set(p.id, p);
            }
          }
        }
      }
    } catch (err) {
      // offline or pending
    }
  }

  // 4. Default published roster fallback so Netlify visitors always see published profiles on refresh
  if (profileMap.size === 0 && DEFAULT_TALENT_PROFILES.length > 0) {
    for (const p of DEFAULT_TALENT_PROFILES) {
      profileMap.set(p.id, p);
    }
  }

  let list = Array.from(profileMap.values());
  if (publishedOnly) {
    list = list.filter((p) => p.status === 'published' || p.status === 'approved' || !p.status);
  }

  // Update local storage backup so page refresh on Netlify is instant
  try {
    localStorage.setItem('ava_custom_profiles', JSON.stringify(Array.from(profileMap.values())));
  } catch (e) {}

  return list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
}

export async function saveTalentProfile(profile: Partial<TalentProfile>): Promise<string> {
  const now = new Date().toISOString();
  const profileId = profile.id || `talent_${Date.now()}`;
  const fullProfile: TalentProfile = {
    id: profileId,
    name: profile.name || 'Unnamed Talent',
    categorySlug: profile.categorySlug || 'actors',
    categoryName: profile.categoryName || 'Actors & Actresses',
    subcategory: profile.subcategory || '',
    bio: profile.bio || '',
    photoUrl: profile.photoUrl || '',
    talentType: profile.talentType || 'Actor',
    imageAspectRatio: profile.imageAspectRatio || '3:4',
    videoUrl: profile.videoUrl || '',
    videoAspectRatio: profile.videoAspectRatio || '9:16',
    videoTitle: profile.videoTitle || '',
    videoDuration: profile.videoDuration || '',
    videoTag: profile.videoTag || 'Acting Showreel',
    portfolioUrls: profile.portfolioUrls || [],
    skills: profile.skills || [],
    languages: profile.languages || ['English', 'Marathi'],
    city: profile.city || 'Mumbai',
    availability: profile.availability || 'Available',
    status: profile.status || 'published',
    isFeatured: profile.isFeatured ?? false,
    isVerified: profile.isVerified ?? true,
    instagramHandle: profile.instagramHandle || '',
    instagramUrl: profile.instagramUrl || '',
    instagramVerified: profile.instagramVerified ?? true,
    instagramFollowers: profile.instagramFollowers || '',
    logoUrl: profile.logoUrl || '',
    industry: profile.industry || 'Both',
    marathiNatakOrTheatre: profile.marathiNatakOrTheatre || '',
    marathiSerialsOrShows: profile.marathiSerialsOrShows || '',
    hindiFilmsOrBollywood: profile.hindiFilmsOrBollywood || '',
    hindiOttSeries: profile.hindiOttSeries || '',
    notableAwards: profile.notableAwards || '',
    createdAt: profile.createdAt || now,
    updatedAt: now,
    ...profile,
  };

  // Compress any heavy base64 images so they never exceed Firestore document size limits
  if (fullProfile.photoUrl && fullProfile.photoUrl.startsWith('data:image')) {
    fullProfile.photoUrl = await compressBase64Image(fullProfile.photoUrl, 800, 0.82);
  }
  if (Array.isArray(fullProfile.portfolioUrls)) {
    fullProfile.portfolioUrls = await Promise.all(
      fullProfile.portfolioUrls.map(async (url) =>
        url && url.startsWith('data:image') ? compressBase64Image(url, 700, 0.78) : url
      )
    );
  }

  // 1. Immediately save to LocalStorage for instant viewer display
  try {
    const stored: TalentProfile[] = JSON.parse(localStorage.getItem('ava_custom_profiles') || '[]');
    const index = stored.findIndex((p) => p.id === profileId);
    if (index >= 0) {
      stored[index] = fullProfile;
    } else {
      stored.unshift(fullProfile);
    }
    localStorage.setItem('ava_custom_profiles', JSON.stringify(stored));
  } catch (e) {
    console.warn('LocalStorage save failed for profile', e);
  }

  // 2. Synchronize to Server Persistent Storage (Only in local development)
  const isLocalDev = typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  if (isLocalDev) {
    try {
      fetch('/api/sync/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile: fullProfile }),
      }).catch((err) => console.warn('Server sync profile background notice:', err));
    } catch (e) {}
  }

  // 3. Save to Cloud Firestore with sanitization (prevents undefined field rejection)
  try {
    const cleanProfile = sanitizeForFirestore(fullProfile);
    await setDoc(doc(db, 'talentProfiles', profileId), cleanProfile, { merge: true });
    await createAuditLog('Saved Profile', fullProfile.name || profileId);
  } catch (error) {
    console.warn('Firestore write notice in saveTalentProfile:', error);
  }

  return profileId;
}

export async function deleteTalentProfile(id: string): Promise<void> {
  try {
    const stored: TalentProfile[] = JSON.parse(localStorage.getItem('ava_custom_profiles') || '[]');
    const filtered = stored.filter((p) => p.id !== id);
    localStorage.setItem('ava_custom_profiles', JSON.stringify(filtered));
  } catch (e) {}

  try {
    fetch(`/api/sync/profiles/${id}`, { method: 'DELETE' }).catch(() => {});
  } catch (e) {}

  try {
    await deleteDoc(doc(db, 'talentProfiles', id));
    await createAuditLog('Deleted Profile', id);
  } catch (error) {
    console.warn('Firestore delete profile notice:', error);
  }
}

// ----------------------------------------------------
// Real-time Event-Driven Subscriptions (Instant Sync)
// ----------------------------------------------------
export function subscribeToTalentProfiles(
  callback: (profiles: TalentProfile[]) => void,
  publishedOnly = true
): () => void {
  // Immediately dispatch cached/synced profiles so viewer sees them with 0 latency
  getTalentProfiles(publishedOnly)
    .then((cached) => {
      if (cached && cached.length > 0) {
        callback(cached);
      }
    })
    .catch(() => {});

  try {
    const col = collection(db, 'talentProfiles');
    const q = publishedOnly
      ? query(col, where('status', '==', 'published'))
      : query(col);
    return onSnapshot(
      q,
      (snap) => {
        const list: TalentProfile[] = [];
        snap.forEach((d) => {
          const item = { id: d.id, ...d.data() } as TalentProfile;
          if (!isDemoTalentProfile(item)) {
            list.push(item);
          }
        });

        // Also merge any locally saved real custom profiles
        try {
          const stored = JSON.parse(localStorage.getItem('ava_custom_profiles') || '[]');
          const ids = new Set(list.map((p) => p.id));
          for (const p of stored) {
            if (!ids.has(p.id) && !isDemoTalentProfile(p)) {
              if (!publishedOnly || p.status === 'published') {
                list.push(p);
              }
            }
          }
        } catch (e) {}

        // If both Firestore and LocalStorage are currently empty, provide default published roster
        if (list.length === 0 && DEFAULT_TALENT_PROFILES.length > 0) {
          for (const p of DEFAULT_TALENT_PROFILES) {
            list.push(p);
          }
        }

        list.sort(
          (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        );
        callback(list);
      },
      (error) => {
        console.warn('Real-time profiles listener notice:', error);
      }
    );
  } catch (err) {
    console.warn('Failed to attach real-time profiles listener:', err);
    return () => {};
  }
}

export function subscribeToPublicSiteData(callbacks: {
  onProfiles?: (profiles: TalentProfile[]) => void;
  onCategories?: (categories: TalentCategory[]) => void;
  onShows?: (shows: TalentShow[]) => void;
  onBanners?: (banners: MarketingBanner[]) => void;
  onTelecast?: (telecast: LiveTelecast) => void;
  onVideoMedia?: (videos: VideoMediaItem[]) => void;
}): () => void {
  const unsubs: (() => void)[] = [];

  try {
    if (callbacks.onProfiles) {
      unsubs.push(subscribeToTalentProfiles(callbacks.onProfiles, true));
    }

    if (callbacks.onCategories) {
      const colCat = collection(db, 'talentCategories');
      const qCat = query(colCat, where('isPublished', '==', true));
      unsubs.push(
        onSnapshot(
          qCat,
          (snap) => {
            const list: TalentCategory[] = [];
            snap.forEach((d) => list.push({ id: d.id, ...d.data() } as TalentCategory));
            callbacks.onCategories?.(list.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)));
          },
          (err) => console.warn('Categories subscription error:', err)
        )
      );
    }

    if (callbacks.onShows) {
      const colShows = collection(db, 'talentShows');
      const qShows = query(colShows, where('isPublished', '==', true));
      unsubs.push(
        onSnapshot(
          qShows,
          (snap) => {
            const list: TalentShow[] = [];
            snap.forEach((d) => list.push({ id: d.id, ...d.data() } as TalentShow));
            callbacks.onShows?.(
              list.sort((a, b) => new Date(a.eventDate || 0).getTime() - new Date(b.eventDate || 0).getTime())
            );
          },
          (err) => console.warn('Shows subscription error:', err)
        )
      );
    }

    if (callbacks.onBanners) {
      const colBanners = collection(db, 'marketingBanners');
      const qBanners = query(colBanners, where('isActive', '==', true));
      unsubs.push(
        onSnapshot(
          qBanners,
          (snap) => {
            const list: MarketingBanner[] = [];
            snap.forEach((d) => list.push({ id: d.id, ...d.data() } as MarketingBanner));
            callbacks.onBanners?.(list.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)));
          },
          (err) => console.warn('Banners subscription error:', err)
        )
      );
    }

    if (callbacks.onTelecast) {
      const colTele = collection(db, 'liveTelecasts');
      unsubs.push(
        onSnapshot(
          colTele,
          (snap) => {
            snap.forEach((d) => {
              const data = { id: d.id, ...d.data() } as LiveTelecast;
              if (data.isActive) {
                callbacks.onTelecast?.(data);
              }
            });
          },
          (err) => console.warn('Telecast subscription error:', err)
        )
      );
    }

    if (callbacks.onVideoMedia) {
      const colVid = collection(db, 'videoMediaItems');
      const qVid = query(colVid, where('isPublished', '==', true));
      unsubs.push(
        onSnapshot(
          qVid,
          (snap) => {
            const list: VideoMediaItem[] = [];
            snap.forEach((d) => {
              const item = { id: d.id, ...d.data() } as VideoMediaItem;
              if (!isDemoVideoItem(item)) {
                list.push(item);
              }
            });
            callbacks.onVideoMedia?.(
              list.sort(
                (a, b) =>
                  new Date(b.updatedAt || b.createdAt).getTime() -
                  new Date(a.updatedAt || a.createdAt).getTime()
              )
            );
          },
          (err) => console.warn('Video media subscription error:', err)
        )
      );
    }
  } catch (err) {
    console.warn('Error setting up public subscriptions:', err);
  }

  return () => {
    unsubs.forEach((fn) => {
      try {
        fn();
      } catch {}
    });
  };
}

// ----------------------------------------------------
// Packages
// ----------------------------------------------------
export const DEFAULT_PACKAGES: Package[] = [
  {
    id: 'pkg-live-event-video-coverage',
    title: 'VIP Live Event Coverage & 4K Satellite Direct Broadcast',
    categorySlug: 'production',
    categoryName: 'Live Event & Video Production',
    priceType: 'fixed',
    price: '₹1,85,000 / Day',
    duration: 'Full Day Event Coverage',
    deliverables: [
      'Multi-Cam 4K Direct Video Coverage (Main Stage, Red Carpet, VIP Backstage)',
      'Direct Satellite/Web Broadcast without YouTube ads or 3rd-party latency',
      'Dedicated Wireless Mobile Crews for High-Energy Crowd & Celebrity Moments',
      'Direct Master Audio Feed (Dolby Stage Audio + Director Comms)',
      'Uncompressed Raw 4K Video Master Archive delivered within 24 hours',
      'Private Encrypted VIP Client Stream Link for Remote Stakeholders'
    ],
    exclusions: 'International Satellite Transponder Uplink license fees (if outside India)',
    isPublished: true,
    isFeatured: true,
    displayOrder: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'pkg-celebrity-runway-direction',
    title: 'Haute Couture Runway & Fashion Week Direction',
    categorySlug: 'models',
    categoryName: 'Fashion & Runway Direction',
    priceType: 'fixed',
    price: '₹2,50,000 / Showcase',
    duration: 'Rehearsal + Prime-Time Show',
    deliverables: [
      'Show Choreography & Music Design by Paris/Milan Trained Show Directors',
      'Roster of 12 Verified Indian & International Runway Supermodels',
      'Complete Backstage Fittings, Hair & Makeup Logistics Coordination',
      '4K Runway Direct Video Coverage & High-Resolution Lookbook Photography',
      'VIP Front-Row Media & Press Desk Management'
    ],
    exclusions: 'Venue rental and custom runway ramp construction',
    isPublished: true,
    isFeatured: false,
    displayOrder: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'pkg-celebrity-concert-headline',
    title: 'Celebrity Musical Headline & Arena Stage Production',
    categorySlug: 'singers-musicians',
    categoryName: 'Celebrity Concerts & Music',
    priceType: 'quote',
    price: 'Custom VIP Quote',
    duration: 'Multi-Hour Arena Concert',
    deliverables: [
      'A-List Bollywood Playback Singer or Headline Rock/Fusion Band',
      'Full Technical Rider Fulfillment (Acoustic Engineering, Line Arrays, Rigging)',
      'Artist Hospitality, Security Escort & Greenroom VIP Logistics',
      'Multi-Angle 4K Arena Live Video Coverage & Broadcast Switching',
      'Government & Police Permissions Coordination across Maharashtra'
    ],
    exclusions: 'Air charter / Private jet charters for international crew',
    isPublished: true,
    isFeatured: false,
    displayOrder: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export async function getPackages(publishedOnly = true): Promise<Package[]> {
  try {
    const col = collection(db, 'packages');
    const q = publishedOnly
      ? query(col, where('isPublished', '==', true))
      : query(col);
    const snap = await getDocs(q);
    const list: Package[] = [];
    snap.forEach((d) => {
      list.push({ id: d.id, ...d.data() } as Package);
    });
    if (list.length === 0) {
      return DEFAULT_PACKAGES;
    }
    return list.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  } catch (error) {
    console.warn('Error fetching packages, falling back to defaults:', error);
    return DEFAULT_PACKAGES;
  }
}

export async function savePackage(pkg: Partial<Package>): Promise<string> {
  const now = new Date().toISOString();
  const cleanData = sanitizeForFirestore({
    ...pkg,
    updatedAt: now,
  });

  try {
    if (pkg.id) {
      await updateDoc(doc(db, 'packages', pkg.id), cleanData);
      await createAuditLog('Updated Package', pkg.title || pkg.id);
      return pkg.id;
    } else {
      const ref = await addDoc(collection(db, 'packages'), {
        ...cleanData,
        createdAt: now,
      });
      await createAuditLog('Created Package', pkg.title || ref.id);
      return ref.id;
    }
  } catch (error) {
    console.warn('Package save warning:', error);
    return pkg.id || `pkg-${Date.now()}`;
  }
}

export async function deletePackage(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'packages', id));
    await createAuditLog('Deleted Package', id);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `packages/${id}`);
  }
}

// ----------------------------------------------------
// Bookings
// ----------------------------------------------------
export async function getBookings(forCustomerUid?: string): Promise<Booking[]> {
  try {
    const col = collection(db, 'bookings');
    let q;
    if (forCustomerUid) {
      q = query(col, where('customerUid', '==', forCustomerUid));
    } else {
      q = query(col);
    }
    const snap = await getDocs(q);
    const list: Booking[] = [];
    snap.forEach((d) => {
      list.push({ id: d.id, ...d.data() } as Booking);
    });
    const sorted = list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    try {
      localStorage.setItem('ava_bookings', JSON.stringify(sorted));
    } catch {}
    return sorted;
  } catch (error) {
    console.warn('Firestore bookings read error, using local storage fallback:', error);
    try {
      const cached = localStorage.getItem('ava_bookings');
      if (cached) return JSON.parse(cached);
    } catch {}
    return [];
  }
}

export async function createBooking(data: Omit<Booking, 'id' | 'bookingReference' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const now = new Date().toISOString();
  const randomHex = Math.floor(1000 + Math.random() * 9000);
  const bookingReference = `AVA-BK-${Date.now().toString().slice(-4)}${randomHex}`;

  // Always update local cache first for guaranteed persistence
  try {
    const local = localStorage.getItem('ava_bookings');
    const bookings: Booking[] = local ? JSON.parse(local) : [];
    bookings.unshift({
      id: `bk-${Date.now()}`,
      ...data,
      bookingReference,
      status: 'Submitted',
      createdAt: now,
      updatedAt: now
    });
    localStorage.setItem('ava_bookings', JSON.stringify(bookings));
  } catch {}

  try {
    await addDoc(collection(db, 'bookings'), {
      ...data,
      bookingReference,
      status: 'Submitted',
      createdAt: now,
      updatedAt: now,
    });
    return bookingReference;
  } catch (error) {
    console.warn('Firestore booking write notice:', error);
    return bookingReference;
  }
}

export async function updateBooking(id: string, updates: Partial<Booking>): Promise<void> {
  try {
    const now = new Date().toISOString();
    await updateDoc(doc(db, 'bookings', id), {
      ...updates,
      updatedAt: now,
    });
    await createAuditLog('Updated Booking Status/Details', id, JSON.stringify(updates));
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `bookings/${id}`);
  }
}

export async function deleteBooking(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'bookings', id));
    await createAuditLog('Deleted Booking', id);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `bookings/${id}`);
  }
}

// ----------------------------------------------------
// Talent Shows & Events
// ----------------------------------------------------
export async function getTalentShows(publishedOnly = true): Promise<TalentShow[]> {
  try {
    const col = collection(db, 'talentShows');
    const q = publishedOnly
      ? query(col, where('isPublished', '==', true))
      : query(col);
    const snap = await getDocs(q);
    const list: TalentShow[] = [];
    snap.forEach((d) => {
      list.push({ id: d.id, ...d.data() } as TalentShow);
    });
    const sorted = list.sort((a, b) => new Date(a.eventDate || 0).getTime() - new Date(b.eventDate || 0).getTime());
    try { localStorage.setItem('ava_shows', JSON.stringify(sorted)); } catch {}
    return sorted;
  } catch (error) {
    console.warn('Talent shows fetch note:', error);
    try {
      const cached = localStorage.getItem('ava_shows');
      if (cached) return JSON.parse(cached);
    } catch {}
    return [];
  }
}

export async function saveTalentShow(show: Partial<TalentShow>): Promise<string> {
  const now = new Date().toISOString();
  const cleanData = sanitizeForFirestore({
    ...show,
    updatedAt: now,
  });

  try {
    if (show.id) {
      await updateDoc(doc(db, 'talentShows', show.id), cleanData);
      await createAuditLog('Updated Show', show.title || show.id);
      return show.id;
    } else {
      const ref = await addDoc(collection(db, 'talentShows'), {
        ...cleanData,
        createdAt: now,
      });
      await createAuditLog('Created Show', show.title || ref.id);
      return ref.id;
    }
  } catch (error) {
    console.warn('Show save warning:', error);
    return show.id || `show-${Date.now()}`;
  }
}

export async function deleteTalentShow(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'talentShows', id));
    await createAuditLog('Deleted Show', id);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `talentShows/${id}`);
  }
}

// ----------------------------------------------------
// Event Registrations
// ----------------------------------------------------
export async function getEventRegistrations(forParticipantUid?: string): Promise<EventRegistration[]> {
  try {
    const col = collection(db, 'eventRegistrations');
    let q;
    if (forParticipantUid) {
      q = query(col, where('participantUid', '==', forParticipantUid));
    } else {
      q = query(col);
    }
    const snap = await getDocs(q);
    const list: EventRegistration[] = [];
    snap.forEach((d) => {
      list.push({ id: d.id, ...d.data() } as EventRegistration);
    });
    const sorted = list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    try {
      localStorage.setItem('ava_event_regs', JSON.stringify(sorted));
    } catch {}
    return sorted;
  } catch (error) {
    console.warn('Firestore eventRegistrations read error, using local storage fallback:', error);
    try {
      const cached = localStorage.getItem('ava_event_regs');
      if (cached) return JSON.parse(cached);
    } catch {}
    return [];
  }
}

export async function registerForEvent(data: Omit<EventRegistration, 'id' | 'registrationReference' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const now = new Date().toISOString();
  const randomHex = Math.floor(1000 + Math.random() * 9000);
  const registrationReference = `AVA-EV-${Date.now().toString().slice(-4)}${randomHex}`;

  try {
    const local = localStorage.getItem('ava_event_regs');
    const regs: EventRegistration[] = local ? JSON.parse(local) : [];
    regs.unshift({
      id: `ev-${Date.now()}`,
      ...data,
      registrationReference,
      status: 'Pending',
      createdAt: now,
      updatedAt: now
    });
    localStorage.setItem('ava_event_regs', JSON.stringify(regs));
  } catch {}

  try {
    await addDoc(collection(db, 'eventRegistrations'), {
      ...data,
      registrationReference,
      status: 'Pending',
      createdAt: now,
      updatedAt: now,
    });
    return registrationReference;
  } catch (error) {
    console.warn('Firestore event registration write notice:', error);
    return registrationReference;
  }
}

export async function updateEventRegistration(id: string, updates: Partial<EventRegistration>): Promise<void> {
  try {
    const now = new Date().toISOString();
    await updateDoc(doc(db, 'eventRegistrations', id), {
      ...updates,
      updatedAt: now,
    });
    await createAuditLog('Updated Registration Status', id, JSON.stringify(updates));
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `eventRegistrations/${id}`);
  }
}

// ----------------------------------------------------
// Auditions & Casting Calls
// ----------------------------------------------------
export async function getAuditions(publishedOnly = true): Promise<Audition[]> {
  try {
    const col = collection(db, 'auditions');
    const q = publishedOnly
      ? query(col, where('isPublished', '==', true))
      : query(col);
    const snap = await getDocs(q);
    const list: Audition[] = [];
    snap.forEach((d) => {
      list.push({ id: d.id, ...d.data() } as Audition);
    });
    const sorted = list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    try { localStorage.setItem('ava_auditions', JSON.stringify(sorted)); } catch {}
    return sorted;
  } catch (error) {
    console.warn('Auditions fetch note:', error);
    try {
      const cached = localStorage.getItem('ava_auditions');
      if (cached) return JSON.parse(cached);
    } catch {}
    return [];
  }
}

export async function saveAudition(audition: Partial<Audition>): Promise<string> {
  const now = new Date().toISOString();
  const cleanData = sanitizeForFirestore({
    ...audition,
    updatedAt: now,
  });

  try {
    if (audition.id) {
      await updateDoc(doc(db, 'auditions', audition.id), cleanData);
      await createAuditLog('Updated Audition', audition.projectTitle || audition.id);
      return audition.id;
    } else {
      const ref = await addDoc(collection(db, 'auditions'), {
        ...cleanData,
        createdAt: now,
      });
      await createAuditLog('Created Audition', audition.projectTitle || ref.id);
      return ref.id;
    }
  } catch (error) {
    console.warn('Audition save warning:', error);
    return audition.id || `aud-${Date.now()}`;
  }
}

export async function deleteAudition(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'auditions', id));
    await createAuditLog('Deleted Audition', id);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `auditions/${id}`);
  }
}

// ----------------------------------------------------
// Audition Applications
// ----------------------------------------------------
export async function getAuditionApplications(forApplicantUid?: string): Promise<AuditionApplication[]> {
  try {
    const col = collection(db, 'auditionApplications');
    let q;
    if (forApplicantUid) {
      q = query(col, where('applicantUid', '==', forApplicantUid));
    } else {
      q = query(col);
    }
    const snap = await getDocs(q);
    const list: AuditionApplication[] = [];
    snap.forEach((d) => {
      list.push({ id: d.id, ...d.data() } as AuditionApplication);
    });
    return list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, 'auditionApplications');
  }
}

export async function submitAuditionApplication(data: Omit<AuditionApplication, 'id' | 'applicationReference' | 'createdAt' | 'updatedAt'>): Promise<string> {
  try {
    const now = new Date().toISOString();
    const randomHex = Math.floor(1000 + Math.random() * 9000);
    const applicationReference = `AVA-AUD-${Date.now().toString().slice(-4)}${randomHex}`;

    await addDoc(collection(db, 'auditionApplications'), {
      ...data,
      applicationReference,
      status: 'Submitted',
      createdAt: now,
      updatedAt: now,
    });
    return applicationReference;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'auditionApplications');
  }
}

export async function updateAuditionApplication(id: string, updates: Partial<AuditionApplication>): Promise<void> {
  try {
    const now = new Date().toISOString();
    await updateDoc(doc(db, 'auditionApplications', id), {
      ...updates,
      updatedAt: now,
    });
    await createAuditLog('Updated Audition Application Status', id, JSON.stringify(updates));
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `auditionApplications/${id}`);
  }
}

// ----------------------------------------------------
// Talent Applications (Joining AVA)
// ----------------------------------------------------
export async function getTalentApplications(forApplicantUid?: string): Promise<TalentApplication[]> {
  try {
    const col = collection(db, 'talentApplications');
    let q;
    if (forApplicantUid) {
      q = query(col, where('applicantUid', '==', forApplicantUid));
    } else {
      q = query(col);
    }
    const snap = await getDocs(q);
    const list: TalentApplication[] = [];
    snap.forEach((d) => {
      list.push({ id: d.id, ...d.data() } as TalentApplication);
    });
    return list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, 'talentApplications');
  }
}

export async function submitTalentApplication(data: Omit<TalentApplication, 'id' | 'applicationReference' | 'createdAt' | 'updatedAt'>): Promise<string> {
  try {
    const now = new Date().toISOString();
    const randomHex = Math.floor(1000 + Math.random() * 9000);
    const applicationReference = `AVA-TAL-${Date.now().toString().slice(-4)}${randomHex}`;

    await addDoc(collection(db, 'talentApplications'), {
      ...data,
      applicationReference,
      status: 'Submitted',
      createdAt: now,
      updatedAt: now,
    });
    return applicationReference;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'talentApplications');
  }
}

export async function updateTalentApplication(id: string, updates: Partial<TalentApplication>): Promise<void> {
  try {
    const now = new Date().toISOString();
    await updateDoc(doc(db, 'talentApplications', id), {
      ...updates,
      updatedAt: now,
    });
    await createAuditLog('Updated Talent Joining Application', id, JSON.stringify(updates));
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `talentApplications/${id}`);
  }
}

// ----------------------------------------------------
// Partners & Sponsors
// ----------------------------------------------------
export async function getPartnerProfiles(publishedOnly = true): Promise<PartnerProfile[]> {
  try {
    const col = collection(db, 'partnerProfiles');
    const q = publishedOnly
      ? query(col, where('isPublished', '==', true))
      : query(col);
    const snap = await getDocs(q);
    const list: PartnerProfile[] = [];
    snap.forEach((d) => {
      list.push({ id: d.id, ...d.data() } as PartnerProfile);
    });
    const sorted = list.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
    try { localStorage.setItem('ava_partners', JSON.stringify(sorted)); } catch {}
    return sorted;
  } catch (error) {
    console.warn('Partners fetch note:', error);
    try {
      const cached = localStorage.getItem('ava_partners');
      if (cached) return JSON.parse(cached);
    } catch {}
    return [];
  }
}

export async function savePartnerProfile(partner: Partial<PartnerProfile>): Promise<string> {
  const now = new Date().toISOString();
  const cleanData = sanitizeForFirestore({
    ...partner,
    updatedAt: now,
  });

  try {
    if (partner.id) {
      await updateDoc(doc(db, 'partnerProfiles', partner.id), cleanData);
      await createAuditLog('Updated Partner', partner.name || partner.id);
      return partner.id;
    } else {
      const ref = await addDoc(collection(db, 'partnerProfiles'), {
        ...cleanData,
        createdAt: now,
      });
      await createAuditLog('Created Partner', partner.name || ref.id);
      return ref.id;
    }
  } catch (error) {
    console.warn('Partner save warning:', error);
    return partner.id || `partner-${Date.now()}`;
  }
}

export async function deletePartnerProfile(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'partnerProfiles', id));
    await createAuditLog('Deleted Partner', id);
  } catch (error) {
    console.warn('Partner delete note:', error);
  }
}

export async function getSponsorProfiles(publishedOnly = true): Promise<SponsorProfile[]> {
  try {
    const col = collection(db, 'sponsorProfiles');
    const q = publishedOnly
      ? query(col, where('isPublished', '==', true))
      : query(col);
    const snap = await getDocs(q);
    const list: SponsorProfile[] = [];
    snap.forEach((d) => {
      list.push({ id: d.id, ...d.data() } as SponsorProfile);
    });
    const sorted = list.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
    try { localStorage.setItem('ava_sponsors', JSON.stringify(sorted)); } catch {}
    return sorted;
  } catch (error) {
    console.warn('Sponsors fetch note:', error);
    try {
      const cached = localStorage.getItem('ava_sponsors');
      if (cached) return JSON.parse(cached);
    } catch {}
    return [];
  }
}

export async function saveSponsorProfile(sponsor: Partial<SponsorProfile>): Promise<string> {
  const now = new Date().toISOString();
  const cleanData = sanitizeForFirestore({
    ...sponsor,
    updatedAt: now,
  });

  try {
    if (sponsor.id) {
      await updateDoc(doc(db, 'sponsorProfiles', sponsor.id), cleanData);
      await createAuditLog('Updated Sponsor', sponsor.name || sponsor.id);
      return sponsor.id;
    } else {
      const ref = await addDoc(collection(db, 'sponsorProfiles'), {
        ...cleanData,
        createdAt: now,
      });
      await createAuditLog('Created Sponsor', sponsor.name || ref.id);
      return ref.id;
    }
  } catch (error) {
    console.warn('Sponsor save warning:', error);
    return sponsor.id || `sponsor-${Date.now()}`;
  }
}

export async function deleteSponsorProfile(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'sponsorProfiles', id));
    await createAuditLog('Deleted Sponsor', id);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `sponsorProfiles/${id}`);
  }
}

// ----------------------------------------------------
// Marketing Banners
// ----------------------------------------------------
export async function getMarketingBanners(publishedOnly = true): Promise<MarketingBanner[]> {
  try {
    const col = collection(db, 'marketingBanners');
    const q = publishedOnly
      ? query(col, where('isPublished', '==', true))
      : query(col);
    const snap = await getDocs(q);
    const list: MarketingBanner[] = [];
    snap.forEach((d) => {
      list.push({ id: d.id, ...d.data() } as MarketingBanner);
    });

    if (list.length === 0) {
      return DEFAULT_MARKETING_BANNERS.filter((b) => (publishedOnly ? b.isPublished : true));
    }

    return list.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  } catch (error) {
    console.warn('Error fetching marketing banners:', error);
    return DEFAULT_MARKETING_BANNERS.filter((b) => (publishedOnly ? b.isPublished : true));
  }
}

export async function saveMarketingBanner(banner: Partial<MarketingBanner>): Promise<string> {
  const now = new Date().toISOString();
  const cleanData = sanitizeForFirestore({
    ...banner,
    updatedAt: now,
  });

  try {
    if (banner.id) {
      await updateDoc(doc(db, 'marketingBanners', banner.id), cleanData);
      await createAuditLog('Updated Marketing Banner', banner.title || banner.id);
      return banner.id;
    } else {
      const ref = await addDoc(collection(db, 'marketingBanners'), {
        ...cleanData,
        createdAt: now,
      });
      await createAuditLog('Created Marketing Banner', banner.title || ref.id);
      return ref.id;
    }
  } catch (error) {
    console.warn('Marketing banner save warning:', error);
    return banner.id || `banner-${Date.now()}`;
  }
}

export async function deleteMarketingBanner(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'marketingBanners', id));
    await createAuditLog('Deleted Banner', id);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `marketingBanners/${id}`);
  }
}

// ----------------------------------------------------
// Site Settings
// ----------------------------------------------------
// Site Settings & Viewer Feature Customization
// ----------------------------------------------------
export const DEFAULT_VIEWER_FEATURES: ViewerFeatureCustomization = {
  // Top Notice & Marquee Ticker
  enableNoticeTicker: true,
  noticeTickerText: 'मराठी सिनेसृष्टी व बॉलीवूडचे नामवंत सेलिब्रिटी थेट बुकिंगसाठी उपलब्ध! • 100% Verified Talents & Official Digital Passes • 24/7 VIP Concierge Desk',
  noticeTickerBadge: 'VIP ANNOUNCEMENT',
  noticeTickerTheme: 'gold',
  noticeTickerLink: '',

  // Homepage Sections Toggles
  showHeroBanner: true,
  showCommandHubThreeLines: true,
  showMarketingBanners: true,
  showEventFestivalVideos: true,
  showVIPRoster: true,
  showUpcomingShows: true,
  showPartnersGrid: true,
  showAIToolsSuite: true,
  showTestimonials: true,
  showTeamContact: true,

  // Header & Navigation Features
  showSearchBar: true,
  showAISearchButton: true,
  showVoiceGuideButton: true,
  showFloatingWhatsApp: true,
  whatsAppNumber: '+91 98200 12345',
  whatsAppDefaultMessage: 'नमस्ते AVA Celebrity Management! मला अधिक माहिती हवी आहे.',
  showMobileBottomNav: true,

  // Viewer Profile & Verification Features
  allowViewerProfileEdit: true,
  requirePhoneVerification: false,
  allowViewerIdUpload: true,
  showVerifiedViewerBadge: true,
  viewerWelcomeNote: 'आपले अधिकृत व्हीआयपी प्रोफाईल कस्टमायझेशन व पडताळणी केंद्र',

  // Booking & Inquiry Features
  allowInstantBooking: true,
  allowPdfPassDownload: true,
  showDirectCallButton: true,
  currencyDisplay: 'INR',

  // Hero Section Customization
  heroBadgeText: "MAHARASHTRA'S PREMIER TALENT ROSTER",
  heroHeadline: 'Building Stars. Creating Legacies.',
  heroSubtitle: 'The premier talent management, exclusive booking, and media partnership agency representing world-class celebrities, artists, and creators.',
  heroPrimaryBtnText: 'Explore 500+ Talents (कलाकार शोधा)',
  heroSecondaryBtnText: 'Direct Celebrity Booking (थेट बुकिंग करा)',
  heroShowsBtnText: 'Upcoming Shows & Passes (आगामी शोज)',

  // Talent Showcase Customization (Admin Controls)
  talentShowcaseTitle: 'Official VIP Celebrity & Talent Roster',
  talentShowcaseSubtitle: "Direct VIP bookings for India's leading cinematic actors, playback vocalists, international fashion supermodels, prime-time gala hosts, official media partners, and title sponsors.",
  talentShowcaseBadge: 'Exclusive Agency Ecosystem',
};

export async function getSiteSettings(): Promise<SiteSettings> {
  const defaultSettings: SiteSettings = {
    id: 'default',
    brandName: 'AVA Celebrity Management',
    tagline: 'Building Stars. Creating Legacies.',
    contactEmail: 'contact@avacelebrity.com',
    contactPhone: '+1 (800) 282-7827',
    headquarters: 'Beverly Hills & Mumbai',
    heroHeadline: 'Building Stars. Creating Legacies.',
    heroSubtitle: 'The premier talent management, exclusive booking, and media partnership agency representing world-class celebrities, artists, and creators.',
    enabledNavItems: [
      'Home',
      'Celebrities',
      'Actors & Actresses',
      'Models',
      'Dancers',
      'Singers & Musicians',
      'Anchors & Hosts',
      'Influencers',
      'Content Creators',
      'Cinematography & Videography Partners',
      'Photography Partners',
      'Production Partners',
      'Event Partners',
      'Clothing & Fashion Partners',
      'Makeup & Styling Partners',
      'Other Official Partners',
      'Sponsors',
      'Packages & Pricing',
      'Upcoming Talent Shows',
      'Events',
      'Auditions & Casting Calls',
      'Talent Registration',
      'My Bookings / My Applications',
    ],
    partnerSliderSettings: {
      sectionTitle: 'Official Partners & Event Sponsors',
      badgeText: 'Official Ecosystem & Alliances',
      subtitle: 'World-class OTT streaming networks, film production houses, cinematography units, luxury brand sponsors, and certified stage venues collaborating with AVA.',
      autoSlideSpeed: 'normal',
      slideDirection: 'dual',
      animationStyle: 'continuous_marquee',
      designTheme: 'gold_luxury',
      enableReverseTrack: true,
      enableCategoryTabs: true,
      enableHoverPause: true,
      enableBannerSlide: true,
      cardSize: 'standard',
    },
    viewerFeatures: DEFAULT_VIEWER_FEATURES,
    themeSettings: DEFAULT_THEME_SETTINGS,
    updatedAt: new Date().toISOString(),
  };

  try {
    const docRef = doc(db, 'siteSettings', 'default');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      return {
        ...defaultSettings,
        ...data,
        viewerFeatures: {
          ...DEFAULT_VIEWER_FEATURES,
          ...(data.viewerFeatures || {})
        },
        themeSettings: {
          ...DEFAULT_THEME_SETTINGS,
          ...(data.themeSettings || {})
        }
      } as SiteSettings;
    }
    return defaultSettings;
  } catch {
    return defaultSettings;
  }
}

export async function saveSiteSettings(settings: Partial<SiteSettings>): Promise<void> {
  try {
    const now = new Date().toISOString();
    const cleanSettings = sanitizeForFirestore({
      ...settings,
      updatedAt: now,
    });
    await setDoc(doc(db, 'siteSettings', 'default'), cleanSettings, { merge: true });
    await createAuditLog('Updated Site Settings', 'SiteSettings');
  } catch (error) {
    console.warn('Save site settings warning:', error);
  }
}

// ----------------------------------------------------
// Theme Customization & Decoration Studio Service
// ----------------------------------------------------
export async function getThemeSettings(): Promise<ThemeCustomizationSettings> {
  // 1. Check server sync cache
  try {
    const res = await fetch('/api/sync/theme');
    if (res.ok) {
      const json = await res.json();
      if (json?.theme) {
        localStorage.setItem('ava_theme_settings', JSON.stringify(json.theme));
        return { ...DEFAULT_THEME_SETTINGS, ...json.theme };
      }
    }
  } catch (e) {}

  // 2. Check localStorage
  try {
    const stored = localStorage.getItem('ava_theme_settings');
    if (stored) {
      return { ...DEFAULT_THEME_SETTINGS, ...JSON.parse(stored) };
    }
  } catch (e) {}

  // 3. Fallback to site settings
  try {
    const siteSettings = await getSiteSettings();
    if (siteSettings?.themeSettings) {
      return siteSettings.themeSettings;
    }
  } catch (e) {}

  return DEFAULT_THEME_SETTINGS;
}

export async function saveThemeSettings(theme: Partial<ThemeCustomizationSettings>): Promise<ThemeCustomizationSettings> {
  const current = await getThemeSettings();
  const merged: ThemeCustomizationSettings = { ...current, ...theme };

  // 1. Save to local storage for zero latency
  try {
    localStorage.setItem('ava_theme_settings', JSON.stringify(merged));
  } catch (e) {}

  // 2. Sync to server persistent cache
  try {
    fetch('/api/sync/theme', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ theme: merged })
    }).catch(() => {});
  } catch (e) {}

  // 3. Save to Firestore
  try {
    await saveSiteSettings({ themeSettings: merged });
  } catch (e) {}

  return merged;
}

// ----------------------------------------------------
// Audit Logs
// ----------------------------------------------------
export async function getAuditLogs(): Promise<AuditLog[]> {
  try {
    const col = collection(db, 'auditLogs');
    const q = query(col, orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    const list: AuditLog[] = [];
    snap.forEach((d) => {
      list.push({ id: d.id, ...d.data() } as AuditLog);
    });
    return list;
  } catch {
    return [];
  }
}

// ----------------------------------------------------
// Official Default Taxonomy Seeder (Admin convenience)
// ----------------------------------------------------
export async function initializeOfficialTaxonomy(): Promise<{ initialized: number }> {
  const officialCategories: Omit<TalentCategory, 'id' | 'createdAt' | 'updatedAt'>[] = [
    {
      name: 'Celebrities',
      slug: 'celebrities',
      description: 'A-list icons, headline figures, and internationally acclaimed stars.',
      subcategories: ['Cinema Icons', 'Television Legends', 'Cultural Luminaries'],
      displayOrder: 1,
      isPublished: true,
    },
    {
      name: 'Actors & Actresses',
      slug: 'actors-actresses',
      description: 'Leading cinematic performers, television actors, and stage luminaries.',
      subcategories: ['Lead Actors', 'Method Actors', 'Supporting Artists', 'Voice Actors'],
      displayOrder: 2,
      isPublished: true,
    },
    {
      name: 'Models',
      slug: 'models',
      description: 'High-fashion, editorial, runway, and commercial campaign models.',
      subcategories: ['Runway & Fashion', 'Editorial & Print', 'Commercial & Fitness'],
      displayOrder: 3,
      isPublished: true,
    },
    {
      name: 'Dancers',
      slug: 'dancers',
      description: 'Choreographers, contemporary artists, hip-hop crews, and classical dancers.',
      subcategories: ['Choreographers', 'Stage Performers', 'Classical & Contemporary'],
      displayOrder: 4,
      isPublished: true,
    },
    {
      name: 'Singers & Musicians',
      slug: 'singers-musicians',
      description: 'Playback vocalists, live concert artists, instrumentalists, and composers.',
      subcategories: ['Playback Vocalists', 'Live Bands', 'Instrumentalists', 'Composers'],
      displayOrder: 5,
      isPublished: true,
    },
    {
      name: 'Anchors & Hosts',
      slug: 'anchors-hosts',
      description: 'Live gala emcees, television presenters, and keynote corporate moderators.',
      subcategories: ['Live Gala Hosts', 'TV Presenters', 'Corporate Moderators'],
      displayOrder: 6,
      isPublished: true,
    },
    {
      name: 'Influencers',
      slug: 'influencers',
      description: 'Digital trendsetters with established cross-platform brand authority.',
      subcategories: ['Lifestyle', 'Luxury & Fashion', 'Fitness & Wellness', 'Travel'],
      displayOrder: 7,
      isPublished: true,
    },
    {
      name: 'Content Creators',
      slug: 'content-creators',
      description: 'Video storytellers, UGC specialists, comedic creators, and digital directors.',
      subcategories: ['YouTube Creators', 'Instagram Creators', 'UGC Specialists', 'Short-form Reels'],
      displayOrder: 8,
      isPublished: true,
    },
    {
      name: 'Cinematography & Videography Partners',
      slug: 'cinematography-videography',
      description: 'Official DOPs, camera operators, aerial drone cinematographers, and film units.',
      subcategories: ['Directors of Photography', 'Drone Cinematography', 'Commercial Video Units'],
      displayOrder: 9,
      isPublished: true,
    },
    {
      name: 'Photography Partners',
      slug: 'photography-partners',
      description: 'Master fashion photographers, portrait artists, and red carpet documentarians.',
      subcategories: ['High Fashion', 'Celebrity Portraits', 'Live Concert & Event'],
      displayOrder: 10,
      isPublished: true,
    },
    {
      name: 'Production Partners',
      slug: 'production-partners',
      description: 'Full-service film and commercial production houses and technical stage crews.',
      subcategories: ['Film Production Houses', 'Commercial Studios', 'Post-Production & VFX'],
      displayOrder: 11,
      isPublished: true,
    },
    {
      name: 'Clothing & Fashion Partners',
      slug: 'clothing-fashion-partners',
      description: 'Couture fashion houses, celebrity stylists, and costume designers.',
      subcategories: ['Haute Couture', 'Wardrobe Stylists', 'Red Carpet Designers'],
      displayOrder: 12,
      isPublished: true,
    },
    {
      name: 'Makeup & Styling Partners',
      slug: 'makeup-styling-partners',
      description: 'Editorial hair and makeup artists, prosthetic experts, and glam squads.',
      subcategories: ['Celebrity Makeup', 'Prosthetics & SFX', 'Hair & Wardrobe'],
      displayOrder: 13,
      isPublished: true,
    },
  ];

  let count = 0;
  const existing = await getTalentCategories(false);
  const existingSlugs = new Set(existing.map(c => c.slug));

  for (const cat of officialCategories) {
    if (!existingSlugs.has(cat.slug)) {
      await saveTalentCategory(cat);
      count++;
    }
  }

  return { initialized: count };
}

// ----------------------------------------------------
// Live Telecast Broadcasts
// ----------------------------------------------------
export const DEFAULT_LIVE_TELECAST: LiveTelecast = {
  id: 'ava-telecast-grand-finale',
  showTitle: 'AVA Grand Luxury Fashion Week 2026 - Finale Live Telecast',
  editionSubtitle: 'Couture Red Carpet & Global Supermodel Runway',
  category: 'Fashion & Runway Showcase',
  status: 'OFFLINE',
  videoUrl: '',
  sourceType: 'direct_mp4',
  streamQuality: '1080p60 Full HD Direct Feed',
  cameraAngle: 'Main Stage Direct',
  embedType: 'direct_video',
  thumbnailUrl: '',
  scheduledTime: '',
  presenter: '',
  featuredTalent: '',
  viewerCount: 0,
  description: '',
  announcement: '',
  allowLiveChat: false,
  isActive: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export async function getLiveTelecasts(activeOnly = false): Promise<LiveTelecast[]> {
  try {
    const col = collection(db, 'liveTelecasts');
    const q = activeOnly
      ? query(col, where('isActive', '==', true))
      : query(col);
    const snap = await getDocs(q);
    const list: LiveTelecast[] = [];
    snap.forEach((d) => {
      list.push({ id: d.id, ...d.data() } as LiveTelecast);
    });

    if (list.length === 0) {
      return activeOnly ? [] : [DEFAULT_LIVE_TELECAST];
    }

    return list.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  } catch (error) {
    console.warn('Error fetching live telecasts, falling back to default:', error);
    return activeOnly ? [] : [DEFAULT_LIVE_TELECAST];
  }
}

export async function saveLiveTelecast(telecast: Partial<LiveTelecast>): Promise<string> {
  try {
    const now = new Date().toISOString();
    const id = telecast.id || `live-${Date.now()}`;
    const docRef = doc(db, 'liveTelecasts', id);

    await setDoc(
      docRef,
      {
        ...telecast,
        id,
        updatedAt: now,
        createdAt: telecast.createdAt || now,
      },
      { merge: true }
    );

    await createAuditLog('Updated Live Telecast', telecast.showTitle || id);
    return id;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'liveTelecasts');
  }
}

export async function deleteLiveTelecast(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'liveTelecasts', id));
    await createAuditLog('Deleted Live Telecast', id);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `liveTelecasts/${id}`);
  }
}

// ----------------------------------------------------
// Team Contact Inquiries (Google Sheet Integrated)
// ----------------------------------------------------
export async function getTeamInquiries(): Promise<TeamContactInquiry[]> {
  try {
    const col = collection(db, 'teamInquiries');
    const snap = await getDocs(col);
    const list: TeamContactInquiry[] = [];
    snap.forEach((d) => {
      list.push({ id: d.id, ...d.data() } as TeamContactInquiry);
    });
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.warn('Error fetching team inquiries:', error);
    return [];
  }
}

export async function saveTeamInquiry(
  inquiry: Omit<TeamContactInquiry, 'id' | 'inquiryReference' | 'createdAt' | 'status'> & {
    id?: string;
    inquiryReference?: string;
    status?: TeamContactInquiry['status'];
  }
): Promise<{ id: string; inquiryReference: string }> {
  try {
    const now = new Date().toISOString();
    const ref = inquiry.inquiryReference || `AVA-TC-${Math.floor(1000 + Math.random() * 9000)}`;
    const col = collection(db, 'teamInquiries');

    const docData: Omit<TeamContactInquiry, 'id'> = {
      inquiryReference: ref,
      name: inquiry.name,
      organization: inquiry.organization || '',
      email: inquiry.email,
      phone: inquiry.phone,
      inquiryType: inquiry.inquiryType,
      preferredDate: inquiry.preferredDate || '',
      budgetRange: inquiry.budgetRange || '',
      cityVenue: inquiry.cityVenue || '',
      requirements: inquiry.requirements,
      status: inquiry.status || 'New',
      syncedToGoogleSheet: false,
      createdAt: now,
      updatedAt: now,
    };

    if (inquiry.id) {
      await updateDoc(doc(db, 'teamInquiries', inquiry.id), {
        ...docData,
        updatedAt: now,
      });
      return { id: inquiry.id, inquiryReference: ref };
    } else {
      const added = await addDoc(col, docData);
      return { id: added.id, inquiryReference: ref };
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'teamInquiries');
  }
}

export async function updateTeamInquiry(
  id: string,
  updates: Partial<TeamContactInquiry>
): Promise<void> {
  try {
    const now = new Date().toISOString();
    await updateDoc(doc(db, 'teamInquiries', id), {
      ...updates,
      updatedAt: now,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `teamInquiries/${id}`);
  }
}

export async function deleteTeamInquiry(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'teamInquiries', id));
    await createAuditLog('Deleted Team Inquiry', id);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `teamInquiries/${id}`);
  }
}

// ----------------------------------------------------
// Professional Video Media & MP4 Upload Library
// ----------------------------------------------------
export const DEFAULT_VIDEO_MEDIA_ITEMS: VideoMediaItem[] = [];
export const isDemoVideoItem = (v: VideoMediaItem): boolean => {
  if (!v) return false;
  if (v.id && (v.id.startsWith('vid-916-') || v.id.startsWith('vid-169-'))) return true;
  if (v.videoUrl && v.videoUrl.includes('commondatastorage.googleapis.com/gtv-videos-bucket/sample/')) return true;
  return false;
};

export async function getVideoMediaItems(publishedOnly = false): Promise<VideoMediaItem[]> {
  try {
    const col = collection(db, 'videoMediaItems');
    const q = publishedOnly
      ? query(col, where('isPublished', '==', true))
      : query(col);
    const snap = await getDocs(q);
    const list: VideoMediaItem[] = [];
    snap.forEach((d) => {
      const item = { id: d.id, ...d.data() } as VideoMediaItem;
      if (!isDemoVideoItem(item)) {
        list.push(item);
      }
    });

    if (list.length === 0) {
      // Check local storage fallback (cleaning any demo items if present)
      const cached = localStorage.getItem('ava_video_media_items');
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed)) {
            const realItems = parsed.filter((v: VideoMediaItem) => !isDemoVideoItem(v));
            if (realItems.length !== parsed.length) {
              localStorage.setItem('ava_video_media_items', JSON.stringify(realItems));
            }
            if (realItems.length > 0) {
              return publishedOnly ? realItems.filter(v => v.isPublished) : realItems;
            }
          }
        } catch {
          // Ignore
        }
      }
      return [];
    }

    return list.sort((a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime());
  } catch (error) {
    console.warn('Error fetching video media items, using local storage/fallback:', error);
    const cached = localStorage.getItem('ava_video_media_items');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) {
          const realItems = parsed.filter((v: VideoMediaItem) => !isDemoVideoItem(v));
          return publishedOnly ? realItems.filter(v => v.isPublished) : realItems;
        }
      } catch {
        // Ignore
      }
    }
    return [];
  }
}

export async function saveVideoMediaItem(item: Partial<VideoMediaItem>): Promise<string> {
  const now = new Date().toISOString();
  const id = item.id || `vid-${Date.now()}`;
  const fullItem: VideoMediaItem = {
    id,
    title: item.title || 'Untitled MP4 Media',
    aspectRatio: item.aspectRatio || '16:9',
    categorySlug: item.categorySlug || 'actors',
    categoryName: item.categoryName || 'Actors & Actresses',
    videoUrl: item.videoUrl || '',
    fileName: item.fileName,
    fileSizeBytes: item.fileSizeBytes,
    durationFormatted: item.durationFormatted || '01:00',
    resolution: item.resolution,
    description: item.description || '',
    artistName: item.artistName || '',
    videoTag: item.videoTag || 'Event Video',
    videoType: item.videoType || 'event',
    festivalName: item.festivalName || '',
    eventVenue: item.eventVenue || '',
    eventDate: item.eventDate || '',
    isLongVideo: item.isLongVideo ?? false,
    thumbnailUrl: item.thumbnailUrl,
    isPublished: item.isPublished !== undefined ? item.isPublished : true,
    createdAt: item.createdAt || now,
    updatedAt: now,
  };

  // 1. Update localStorage (filter out any legacy demo items)
  try {
    const cached = localStorage.getItem('ava_video_media_items');
    let items: VideoMediaItem[] = cached
      ? JSON.parse(cached).filter((v: VideoMediaItem) => !isDemoVideoItem(v))
      : [];
    const existingIndex = items.findIndex((v) => v.id === id);
    if (existingIndex >= 0) {
      items[existingIndex] = fullItem;
    } else {
      items.unshift(fullItem);
    }
    localStorage.setItem('ava_video_media_items', JSON.stringify(items));
  } catch (err) {
    console.warn('Could not cache video media item to localStorage:', err);
  }

  // 2. Persist to Firestore with sanitization
  try {
    const docRef = doc(db, 'videoMediaItems', id);
    const cleanItem = sanitizeForFirestore(fullItem);
    await setDoc(docRef, cleanItem, { merge: true });
    await createAuditLog('Uploaded Video Media MP4', `${fullItem.title} (${fullItem.aspectRatio})`);
    return id;
  } catch (error) {
    console.warn('Firestore write warning for videoMediaItems:', error);
    return id;
  }
}

export async function deleteVideoMediaItem(id: string): Promise<void> {
  // 1. Update localStorage
  try {
    const cached = localStorage.getItem('ava_video_media_items');
    if (cached) {
      let items: VideoMediaItem[] = JSON.parse(cached);
      items = items.filter((v) => v.id !== id);
      localStorage.setItem('ava_video_media_items', JSON.stringify(items));
    }
  } catch (err) {
    console.warn('Error deleting from localStorage:', err);
  }

  // 2. Delete from Firestore
  try {
    await deleteDoc(doc(db, 'videoMediaItems', id));
    await createAuditLog('Deleted Video Media MP4', id);
  } catch (error) {
    console.warn('Firestore delete warning for videoMediaItems:', error);
  }
}

// ----------------------------------------------------
// Genuine Live Testimonials & Client Reviews
// ----------------------------------------------------
export async function getLiveTestimonials(): Promise<Testimonial[]> {
  const localList: Testimonial[] = [];
  try {
    const raw = localStorage.getItem('ava_live_testimonials');
    if (raw) {
      localList.push(...JSON.parse(raw));
    }
  } catch (e) {}

  try {
    const col = collection(db, 'testimonials');
    const snap = await getDocs(col);
    const firestoreList: Testimonial[] = [];
    snap.forEach((d) => {
      const data = d.data();
      firestoreList.push({
        id: d.id,
        ...data,
        isRealRating: true,
        isLiveRating: true,
      } as Testimonial);
    });

    const existingIds = new Set(firestoreList.map((t) => t.id));
    const merged = [...firestoreList];
    localList.forEach((lt) => {
      if (!existingIds.has(lt.id)) {
        merged.push(lt);
      }
    });

    return merged;
  } catch (error) {
    console.warn('Firestore get testimonials notice, using local:', error);
    return localList;
  }
}

export async function submitRealReview(reviewData: {
  name: string;
  title?: string;
  organization?: string;
  authorType: 'client' | 'artist';
  category: string;
  city: string;
  rating: number; // 1-5
  quote: string;
  projectOutcome?: string;
}): Promise<string> {
  const id = `rev_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  const fullItem: Testimonial = {
    id,
    ...reviewData,
    title: reviewData.title || (reviewData.authorType === 'client' ? 'Verified Client' : 'Represented Artist'),
    rating: Math.min(5, Math.max(1, reviewData.rating)),
    isRealRating: true,
    isLiveRating: true,
    isFeatured: true,
    verifiedBadge: 'Verified Live Rating',
    date: new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
  };

  // Cache locally
  try {
    const existing = JSON.parse(localStorage.getItem('ava_live_testimonials') || '[]');
    existing.unshift(fullItem);
    localStorage.setItem('ava_live_testimonials', JSON.stringify(existing));
  } catch (e) {}

  // Save to Firestore
  try {
    const docRef = doc(db, 'testimonials', id);
    await setDoc(docRef, fullItem, { merge: true });
  } catch (error) {
    console.warn('Firestore write notice for testimonial review:', error);
  }

  return id;
}

// ----------------------------------------------------
// Viewer & Client Profile Management
// ----------------------------------------------------
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  if (!uid) return null;

  // 1. Try local cache first for instant UI response
  try {
    const cached = localStorage.getItem(`ava_user_profile_${uid}`);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed && parsed.uid === uid) {
        // Continue to fetch fresh from Firestore in background
      }
    }
  } catch (e) {}

  // 2. Fetch from Firestore
  try {
    const docRef = doc(db, 'userProfiles', uid);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data() as UserProfile;
      localStorage.setItem(`ava_user_profile_${uid}`, JSON.stringify(data));
      return data;
    }
  } catch (err) {
    console.warn('Firestore read notice for userProfile:', err);
  }

  // 3. Fallback to cached or null
  try {
    const cached = localStorage.getItem(`ava_user_profile_${uid}`);
    if (cached) return JSON.parse(cached);
  } catch (e) {}

  return null;
}

export async function saveUserProfile(profile: UserProfile): Promise<boolean> {
  if (!profile || !profile.uid) return false;

  const updated: UserProfile = {
    ...profile,
    updatedAt: new Date().toISOString(),
    createdAt: profile.createdAt || new Date().toISOString(),
  };

  // 1. Save to local storage immediately
  try {
    localStorage.setItem(`ava_user_profile_${profile.uid}`, JSON.stringify(updated));
  } catch (e) {}

  // 2. Save to Firestore
  try {
    const docRef = doc(db, 'userProfiles', profile.uid);
    await setDoc(docRef, updated, { merge: true });
    return true;
  } catch (err) {
    console.warn('Firestore write notice for userProfile:', err);
    // Even if firestore offline, local storage succeeds
    return true;
  }
}


