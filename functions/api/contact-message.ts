/**
 * Cloudflare Pages & Workers Edge Function
 * POST /api/contact-message
 */

export async function onRequestPost(context: any) {
  try {
    const request = context.request;
    const body: any = await request.json().catch(() => ({}));
    return new Response(JSON.stringify({
      success: true,
      id: body.id || `msg-${Date.now()}`,
      message: 'Contact message received by edge dispatcher.'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: 'Failed to process' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
