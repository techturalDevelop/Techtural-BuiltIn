/**
 * Cloudflare Pages & Workers Edge Function
 * POST /api/verify-passkey
 */

export async function onRequestPost(context: any) {
  try {
    const request = context.request;
    const body: any = await request.json().catch(() => ({}));
    const passkey = body?.passkey;

    if (!passkey || typeof passkey !== 'string') {
      return new Response(JSON.stringify({ success: false, message: 'Passkey is required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const cleanKey = passkey.trim();

    // Use Web Crypto API available natively in Cloudflare Workers
    const encoder = new TextEncoder();
    const data = encoder.encode(cleanKey);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const inputHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    const dataUpper = encoder.encode(cleanKey.toUpperCase());
    const hashUpperBuffer = await crypto.subtle.digest('SHA-256', dataUpper);
    const hashUpperArray = Array.from(new Uint8Array(hashUpperBuffer));
    const inputHashUpper = hashUpperArray.map(b => b.toString(16).padStart(2, '0')).join('');

    // SHA-256 hash of Gerea George's authorized passkey (plaintext is never stored)
    const GEREA_GEORGE_PASSKEY_HASH = '1db9759f6f161c532d48b5722f3f8e66f8c4e608c4bcd8b5e8d77d6c84289804';
    const GEREA_GEORGE_PASSKEY_HASH_UPPER = '4e8cfc2807e3a6ce80d1e3895e3477e625a666e8fa134d1aa417bc03e7f4c568';

    const envKey = context.env?.ADMIN_PASSKEY ? context.env.ADMIN_PASSKEY.trim() : null;

    const isAuthorizedAdmin = 
      inputHash === GEREA_GEORGE_PASSKEY_HASH ||
      inputHashUpper === GEREA_GEORGE_PASSKEY_HASH_UPPER ||
      (envKey && cleanKey === envKey);

    if (isAuthorizedAdmin) {
      return new Response(JSON.stringify({
        success: true,
        message: 'Passkey verified successfully. Welcome, Gerea George.',
        user: {
          uid: 'tb-admin-gerea-george',
          displayName: 'Gerea George',
          role: 'admin',
          title: 'Managing Director & Principal'
        }
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Staff Passkey
    const STAFF_PASSKEY_HASH = '170bcf42a03429fa926beae08216fae54c794ce16f6b0f34c207d3bce555d4ee';
    if (inputHashUpper === STAFF_PASSKEY_HASH) {
      return new Response(JSON.stringify({
        success: true,
        message: 'Passkey verified successfully.',
        user: {
          uid: 'tb-staff-member',
          displayName: 'Techtural Staff',
          role: 'staff',
          title: 'Project Estimator'
        }
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({
      success: false,
      message: 'Invalid passkey. Access denied.'
    }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({
      success: false,
      message: 'Server error processing passkey on edge.'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
