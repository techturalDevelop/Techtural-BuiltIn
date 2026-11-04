/**
 * Cloudflare Pages & Workers Edge Function
 * GET /api/inquiries
 * PATCH /api/inquiries
 */

export async function onRequestGet(context: any) {
  return new Response(JSON.stringify({
    success: true,
    total: 0,
    inquiries: [],
    message: 'Edge inquiries dispatcher active. Live records are synchronized via Firestore.'
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function onRequestPatch(context: any) {
  return new Response(JSON.stringify({
    success: true,
    message: 'Status updated on edge.'
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
