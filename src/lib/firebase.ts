import { initializeApp } from 'firebase/app';
import { initializeFirestore, collection, addDoc, serverTimestamp, getDocFromServer, doc, getDocs, query, where, orderBy, updateDoc, setDoc } from 'firebase/firestore';
import { getAuth, signInAnonymously, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
}, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

// Connection Test
async function testConnection() {
  try {
    // Attempt to read a non-existent doc to check connectivity
    await getDocFromServer(doc(db, '_connection_test_', 'ping'));
    console.log("Firebase connection established.");
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Firebase is offline. Check your configuration and network.");
    }
    // Ignore permission errors during test
  }
}
testConnection();

// Error Handling Types
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
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  };
  console.error('Firestore Error Details: ', JSON.stringify(errInfo, null, 2));
  throw new Error(JSON.stringify(errInfo));
}

// Helper to check current auth state
export async function ensureAuth() {
  return auth.currentUser;
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error: any) {
    // Gracefully handle user closing popup, redirect cancellation, or duplicate popups
    if (
      error?.code === 'auth/popup-closed-by-user' ||
      error?.code === 'auth/cancelled-popup-request' ||
      error?.code === 'auth/user-cancelled' ||
      String(error?.message || '').includes('popup-closed-by-user') ||
      String(error?.message || '').includes('cancelled-popup-request')
    ) {
      // User simply closed the popup before completing sign-in; do not log as an application error
      return null;
    }
    console.error("Google Sign-In failed:", error);
    throw error;
  }
}

export async function logout() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Logout failed:", error);
  }
}

// Inquiries Storage Key for Local Cache Fallback
const INQUIRIES_CACHE_KEY = 'tb_portal_inquiries_cache';

function getLocalCachedInquiries(): any[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(INQUIRIES_CACHE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveToLocalInquiriesCache(item: any) {
  if (typeof window === 'undefined') return;
  try {
    const list = getLocalCachedInquiries();
    const existingIndex = list.findIndex(i => i.id === item.id);
    if (existingIndex >= 0) {
      list[existingIndex] = { ...list[existingIndex], ...item };
    } else {
      list.unshift(item);
    }
    localStorage.setItem(INQUIRIES_CACHE_KEY, JSON.stringify(list.slice(0, 100)));
  } catch (_) {}
}

// Service functions
export async function submitProjectRequest(data: any) {
  const path = 'projectRequests';
  const autoId = `req-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  
  const cleanData = {
    id: autoId,
    type: 'project_consultation',
    name: String(data.name || '').trim(),
    email: String(data.email || '').trim().toLowerCase(),
    phone: data.phone ? String(data.phone).trim() : 'Not provided',
    projectType: data.projectType || 'residential',
    service: data.service || 'Full Turnkey Construction',
    location: data.location || 'Port Moresby',
    budget: data.budget || 'Custom Budget',
    status: 'new',
    receivedAt: new Date().toISOString(),
    ...(data.details ? { details: data.details } : {})
  };

  // 1. Instant local persistence
  saveToLocalInquiriesCache(cleanData);

  // 2. Dual delivery: Sync with server portal API
  try {
    fetch('/api/project-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cleanData),
      keepalive: true
    }).catch(e => console.warn('Server fallback non-fatal:', e));
  } catch (_) {}

  // 3. Direct Firestore SDK submission
  try {
    await ensureAuth();
    const docRef = await addDoc(collection(db, path), {
      ...cleanData,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.warn("Client Firestore write encountered error:", error);
    return cleanData.id;
  }
}

export async function submitContactMessage(data: any) {
  const path = 'contactMessages';
  const autoId = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  const cleanData = {
    id: autoId,
    type: 'contact_message',
    name: String(data.name || '').trim(),
    email: String(data.email || '').trim().toLowerCase(),
    subject: data.subject ? String(data.subject).trim() : 'General Project Inquiry',
    message: String(data.message || '').trim(),
    status: 'new',
    receivedAt: new Date().toISOString(),
    ...(data.phone ? { phone: String(data.phone).trim() } : {})
  };

  // 1. Instant local persistence
  saveToLocalInquiriesCache(cleanData);

  // 2. Dual delivery: Sync with server portal API
  try {
    fetch('/api/contact-message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cleanData),
      keepalive: true
    }).catch(e => console.warn('Server fallback non-fatal:', e));
  } catch (_) {}

  // 3. Direct Firestore SDK submission
  try {
    await ensureAuth();
    const docRef = await addDoc(collection(db, path), {
      ...cleanData,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.warn("Client Firestore write encountered error:", error);
    return cleanData.id;
  }
}

export async function submitWhatsAppInquiry(data: {
  modelCode?: string;
  modelName?: string;
  message: string;
  clientName?: string;
  clientPhone?: string;
  clientEmail?: string;
  location?: string;
  calculatedTotal?: number;
}) {
  const path = 'whatsappInquiries';
  const autoId = `wa-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  const cleanData = {
    id: autoId,
    type: 'whatsapp_inquiry',
    name: data.clientName ? String(data.clientName).trim() : 'WhatsApp Direct Lead',
    email: data.clientEmail ? String(data.clientEmail).trim().toLowerCase() : '',
    phone: data.clientPhone ? String(data.clientPhone).trim() : '',
    modelCode: data.modelCode ? String(data.modelCode).trim() : '',
    modelName: data.modelName ? String(data.modelName).trim() : '',
    location: data.location ? String(data.location).trim() : 'Papua New Guinea',
    subject: data.modelCode ? `WhatsApp Inquiry: ${data.modelName || data.modelCode}` : 'General WhatsApp Contact',
    message: data.message ? String(data.message).trim() : 'Customer initiated direct WhatsApp consultation',
    budget: data.calculatedTotal ? `K${Number(data.calculatedTotal).toLocaleString()}` : '',
    status: 'new',
    receivedAt: new Date().toISOString()
  };

  // 1. Instant local persistence
  saveToLocalInquiriesCache(cleanData);

  // 2. Dispatch to server API
  try {
    fetch('/api/whatsapp-inquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cleanData),
      keepalive: true
    }).catch(() => {});
  } catch (_) {}

  // 3. Direct Firestore submission
  try {
    await ensureAuth();
    await addDoc(collection(db, path), {
      ...cleanData,
      createdAt: serverTimestamp()
    });
  } catch (err) {
    console.warn('Firestore write for whatsappInquiry:', err);
  }
}

export async function fetchPortalInquiries(): Promise<any[]> {
  const mergedMap = new Map<string, any>();

  // 1. Fetch live documents from Firestore directly
  try {
    await ensureAuth();

    // A. Project Requests
    try {
      const snap = await getDocs(collection(db, 'projectRequests'));
      snap.forEach(docSnap => {
        const d = docSnap.data();
        const docId = docSnap.id;
        mergedMap.set(docId, {
          id: d.id || docId,
          docId: docId,
          collection: 'projectRequests',
          type: 'project_consultation',
          name: d.name || 'Anonymous Client',
          email: d.email,
          phone: d.phone,
          projectType: d.projectType,
          service: d.service,
          location: d.location,
          budget: d.budget,
          message: d.details ? (typeof d.details === 'string' ? d.details : JSON.stringify(d.details)) : (d.service || 'Project Consultation Request'),
          subject: `${d.projectType ? d.projectType.toUpperCase() : 'Project'}: ${d.service || 'Consultation'}`,
          status: d.status || 'new',
          receivedAt: d.createdAt?.toDate ? d.createdAt.toDate().toISOString() : (d.receivedAt || new Date().toISOString())
        });
      });
    } catch (e) {
      console.warn('Firestore projectRequests read error:', e);
    }

    // B. Contact Messages
    try {
      const snap = await getDocs(collection(db, 'contactMessages'));
      snap.forEach(docSnap => {
        const d = docSnap.data();
        const docId = docSnap.id;
        mergedMap.set(docId, {
          id: d.id || docId,
          docId: docId,
          collection: 'contactMessages',
          type: 'contact_message',
          name: d.name || 'Website Visitor',
          email: d.email,
          phone: d.phone,
          subject: d.subject || 'General Project Inquiry',
          message: d.message || '',
          status: d.status || 'new',
          receivedAt: d.createdAt?.toDate ? d.createdAt.toDate().toISOString() : (d.receivedAt || new Date().toISOString())
        });
      });
    } catch (e) {
      console.warn('Firestore contactMessages read error:', e);
    }

    // C. WhatsApp Inquiries
    try {
      const snap = await getDocs(collection(db, 'whatsappInquiries'));
      snap.forEach(docSnap => {
        const d = docSnap.data();
        const docId = docSnap.id;
        mergedMap.set(docId, {
          id: d.id || docId,
          docId: docId,
          collection: 'whatsappInquiries',
          type: 'whatsapp_inquiry',
          name: d.name || 'WhatsApp Visitor',
          email: d.email,
          phone: d.phone,
          modelCode: d.modelCode,
          modelName: d.modelName,
          location: d.location,
          budget: d.budget,
          subject: d.subject || `WhatsApp Inquiry: ${d.modelName || d.modelCode || 'Kit Home'}`,
          message: d.message || '',
          status: d.status || 'new',
          receivedAt: d.createdAt?.toDate ? d.createdAt.toDate().toISOString() : (d.receivedAt || new Date().toISOString())
        });
      });
    } catch (e) {
      console.warn('Firestore whatsappInquiries read error:', e);
    }
  } catch (authErr) {
    console.warn('Authentication error fetching Firestore inquiries:', authErr);
  }

  // 2. Fetch from backend / Cloudflare API
  try {
    const res = await fetch('/api/inquiries');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.inquiries)) {
        data.inquiries.forEach((item: any) => {
          if (!mergedMap.has(item.id)) {
            mergedMap.set(item.id, item);
          }
        });
      }
    }
  } catch (_) {}

  // 3. Fallback / Client Storage cache
  try {
    const cached = getLocalCachedInquiries();
    cached.forEach(item => {
      if (!mergedMap.has(item.id)) {
        mergedMap.set(item.id, item);
      }
    });
  } catch (_) {}

  // Sort newest first
  const result = Array.from(mergedMap.values());
  result.sort((a, b) => new Date(b.receivedAt || 0).getTime() - new Date(a.receivedAt || 0).getTime());
  return result;
}

export async function updatePortalInquiryStatus(id: string, newStatus: string, collectionName?: string) {
  // 1. Update Firestore
  try {
    const coll = collectionName || (id.startsWith('req-') ? 'projectRequests' : id.startsWith('msg-') ? 'contactMessages' : 'whatsappInquiries');
    await updateDoc(doc(db, coll, id), { status: newStatus });
  } catch (err) {
    console.warn('Firestore status update error:', err);
  }

  // 2. Update Server API
  try {
    fetch(`/api/inquiries/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    }).catch(() => {});
  } catch (_) {}

  // 3. Update localStorage
  try {
    const list = getLocalCachedInquiries();
    const updated = list.map(item => item.id === id ? { ...item, status: newStatus } : item);
    localStorage.setItem(INQUIRIES_CACHE_KEY, JSON.stringify(updated));
  } catch (_) {}
}

export async function submitCostEstimate(data: any) {
  await ensureAuth();
  const path = 'costEstimates';
  try {
    const payload: any = {
      ...data,
      createdAt: serverTimestamp(),
    };
    
    // Only add userId if it exists and is a string to avoid Firestore "undefined" error
    const uid = auth.currentUser?.uid;
    if (typeof uid === 'string') {
      payload.userId = uid;
    }

    return await addDoc(collection(db, path), payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function getCostEstimates(userId: string) {
  const path = 'costEstimates';
  try {
    const q = query(
      collection(db, path),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function submitDesignRecommendation(data: any) {
  await ensureAuth();
  const path = 'designRecommendations';
  try {
    const payload: any = {
      ...data,
      createdAt: serverTimestamp(),
    };

    // Only add userId if it exists and is a string to avoid Firestore "undefined" error
    const uid = auth.currentUser?.uid;
    if (typeof uid === 'string') {
      payload.userId = uid;
    }

    return await addDoc(collection(db, path), payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function saveContainerDesign(data: any) {
  await ensureAuth();
  const path = 'savedContainerDesigns';
  try {
    const payload: any = {
      ...data,
      createdAt: serverTimestamp(),
    };

    const uid = auth.currentUser?.uid;
    if (typeof uid === 'string') {
      payload.userId = uid;
    }

    return await addDoc(collection(db, path), payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function getSavedContainerDesigns(userId: string) {
  const path = 'savedContainerDesigns';
  try {
    const q = query(
      collection(db, path),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

