/**
 * Techtural BuiltIn Passkey Authentication Service
 * Manages authorized personnel passkeys stored and verified against Firestore / Backend API.
 * Includes native WebCrypto cryptographic fallback for edge and static environments (Cloudflare Workers/Pages).
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

// Cryptographic one-way SHA-256 hash of authorized passkeys (Plaintext is NEVER stored in code)
const GEREA_GEORGE_PASSKEY_HASH = '1db9759f6f161c532d48b5722f3f8e66f8c4e608c4bcd8b5e8d77d6c84289804';
const GEREA_GEORGE_PASSKEY_HASH_UPPER = '4e8cfc2807e3a6ce80d1e3895e3477e625a666e8fa134d1aa417bc03e7f4c568';
const STAFF_PASSKEY_HASH = '170bcf42a03429fa926beae08216fae54c794ce16f6b0f34c207d3bce555d4ee';

/**
 * Native in-browser SHA-256 calculation
 */
async function computeBrowserSha256(input: string): Promise<string> {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  return '';
}

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
 * Verifies entered passkey with backend verification service, with instant WebCrypto fallback
 * to support Cloudflare Workers, Cloudflare Pages, and edge environments.
 */
export async function verifyPasskey(enteredPasskey: string): Promise<{ success: boolean; user?: PasskeyUser; message?: string }> {
  const cleanKey = enteredPasskey.trim();
  if (!cleanKey) {
    return { success: false, message: 'Please enter a valid passkey.' };
  }

  // 1. Try server/edge API endpoint
  let serverVerified = false;
  let serverUser: any = null;

  try {
    const response = await fetch('/api/verify-passkey', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passkey: cleanKey }),
    });

    if (response.ok) {
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await response.json();
        if (data.success && data.user) {
          serverVerified = true;
          serverUser = data.user;
        }
      }
    }
  } catch (apiErr) {
    // Edge or static host without Express backend; proceed smoothly to native WebCrypto verification
    console.info('Edge verification fallback active:', apiErr);
  }

  // 2. If server verified, build session
  if (serverVerified && serverUser) {
    try {
      if (!auth.currentUser) await signInAnonymously(auth);
    } catch (_) {}

    const passkeyUser: PasskeyUser = {
      uid: serverUser.uid || auth.currentUser?.uid || `tb-user-${Date.now()}`,
      displayName: serverUser.displayName || 'Gerea George',
      role: serverUser.role || 'admin',
      passkeyId: serverUser.passkeyId,
      authenticatedAt: new Date().toISOString()
    };

    setStoredPasskeyUser(passkeyUser);
    return { success: true, user: passkeyUser };
  }

  // 3. Resilient Cryptographic WebCrypto Verification (for Cloudflare Workers / Static Deployments)
  try {
    const inputHash = await computeBrowserSha256(cleanKey);
    const inputHashUpper = await computeBrowserSha256(cleanKey.toUpperCase());

    if (inputHash === GEREA_GEORGE_PASSKEY_HASH || inputHashUpper === GEREA_GEORGE_PASSKEY_HASH_UPPER) {
      try {
        if (!auth.currentUser) await signInAnonymously(auth);
      } catch (_) {}

      const passkeyUser: PasskeyUser = {
        uid: 'tb-admin-gerea-george',
        displayName: 'Gerea George',
        role: 'admin',
        authenticatedAt: new Date().toISOString()
      };

      setStoredPasskeyUser(passkeyUser);
      return { success: true, user: passkeyUser };
    }

    if (inputHashUpper === STAFF_PASSKEY_HASH) {
      try {
        if (!auth.currentUser) await signInAnonymously(auth);
      } catch (_) {}

      const passkeyUser: PasskeyUser = {
        uid: 'tb-staff-member',
        displayName: 'Techtural Staff',
        role: 'staff',
        authenticatedAt: new Date().toISOString()
      };

      setStoredPasskeyUser(passkeyUser);
      return { success: true, user: passkeyUser };
    }
  } catch (cryptoErr) {
    console.error('Cryptographic verification error:', cryptoErr);
  }

  return {
    success: false,
    message: 'Invalid passkey. Access denied.'
  };
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
