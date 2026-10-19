import { initializeApp } from 'firebase/app';
import { initializeFirestore, collection, addDoc, serverTimestamp, getDocFromServer, doc, getDocs, query, where, orderBy } from 'firebase/firestore';
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

// Service functions
export async function submitProjectRequest(data: any) {
  const path = 'projectRequests';
  try {
    return await addDoc(collection(db, path), {
      ...data,
      status: 'pending',
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function submitContactMessage(data: any) {
  const path = 'contactMessages';
  try {
    return await addDoc(collection(db, path), {
      ...data,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
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

