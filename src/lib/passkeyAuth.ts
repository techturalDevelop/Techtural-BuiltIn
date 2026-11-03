/**
 * Techtural BuiltIn Passkey Authentication Service
 * Manages authorized personnel passkeys stored and verified against Firestore / Backend API.
 * Eliminates reliance on external Google OAuth while keeping Firebase session active.
 */

import { auth } from './firebase';
import { signInAnonymously, signOut as firebaseSignOut } from 'firebase/auth';

export interface PasskeyUser {
  uid: string;
  displayName: string;
  role: 'admin' | 'engineer' | 'estimator' | 'manager' | 'staff';
  passkeyId?: string;
  authenticatedAt: string;
}

const STORAGE_KEY = 'tb_authorized_session';

/**
 * Retrieves currently active verified passkey session from storage.
 */
export function getStoredPasskeyUser(): PasskeyUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed as PasskeyUser;
  } catch {
    return null;
  }
}

/**
 * Saves verified session to storage.
 */
export function setStoredPasskeyUser(user: PasskeyUser | null) {
  if (typeof window === 'undefined') return;
  if (!user) {
    localStorage.removeItem(STORAGE_KEY);
  } else {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }
}

/**
 * Verifies entered passkey with backend verification service.
 */
export async function verifyPasskey(enteredPasskey: string): Promise<{ success: boolean; user?: PasskeyUser; message?: string }> {
  const cleanKey = enteredPasskey.trim();
  if (!cleanKey) {
    return { success: false, message: 'Please enter a valid passkey.' };
  }

  try {
    const response = await fetch('/api/verify-passkey', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passkey: cleanKey }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return { 
        success: false, 
        message: data.message || 'Invalid or revoked passkey. Please check with your system administrator.' 
      };
    }

    // Connect to Firebase via Anonymous Auth if available so Firestore rules receive an authenticated token
    try {
      if (!auth.currentUser) {
        await signInAnonymously(auth);
      }
    } catch (fbErr) {
      console.warn('Firebase anonymous session optional fallback:', fbErr);
    }

    const passkeyUser: PasskeyUser = {
      uid: data.user?.uid || auth.currentUser?.uid || `tb-user-${Date.now()}`,
      displayName: data.user?.displayName || 'Techtural Engineer',
      role: data.user?.role || 'admin',
      passkeyId: data.user?.passkeyId,
      authenticatedAt: new Date().toISOString()
    };

    setStoredPasskeyUser(passkeyUser);
    return { success: true, user: passkeyUser };
  } catch (error: any) {
    return {
      success: false,
      message: 'Network error communicating with authentication service. Please try again.'
    };
  }
}

/**
 * Logs out the passkey session.
 */
export async function logoutPasskeyUser(): Promise<void> {
  setStoredPasskeyUser(null);
  try {
    await firebaseSignOut(auth);
  } catch (err) {
    console.warn('Firebase signout non-fatal:', err);
  }
}
