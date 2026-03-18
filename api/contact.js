/**
 * POST /api/contact
 * Body JSON: { name, email, message, subject? }
 * Env: RESEND_API_KEY, CONTACT_EMAIL (your inbox)
 * Optional: RESEND_FROM (e.g. "Jordan <notifications@yourdomain.com>") after domain verify at Resend
 */

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let parsed = req.body;
  if (Buffer.isBuffer(parsed)) {
    try {
      parsed = JSON.parse(parsed.toString() || '{}');
    } catch {
      return res.status(400).json({ error: 'Invalid JSON' });
    }
  } else if (typeof parsed === 'string') {
    try {
      parsed = JSON.parse(parsed || '{}');
    } catch {
      return res.status(400).json({ error: 'Invalid JSON' });
    }
  }
  if (!parsed || typeof parsed !== 'object') parsed = {};

  if (parsed.website && String(parsed.website).trim()) {
    return res.status(200).json({ ok: true });
  }

  const name = String(parsed.name || '').trim().slice(0, 200);
  const email = String(parsed.email || '').trim().slice(0, 320);
  const message = String(parsed.message || '').trim().slice(0, 50000);
  const subject = String(parsed.subject || 'Website enquiry').trim().slice(0, 200);

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Please fill in every field.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_EMAIL;

  if (!apiKey || !toEmail) {
    return res.status(503).json({
      error: 'Email delivery is not configured. Add RESEND_API_KEY and CONTACT_EMAIL in Vercel (see SETUP.md).',
    });
  }

  const from =
    process.env.RESEND_FROM || 'Jordan Croome contact <onboarding@resend.dev>';

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [toEmail],
        reply_to: email,
        subject: `${subject} — ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      }),
    });

    const j = await r.json().catch(() => ({}));
    if (!r.ok) {
      console.error('Resend API error', r.status, j);
      return res.status(502).json({
        error: j.message || j.error || 'Could not send email. Check Resend dashboard.',
      });
    }
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(502).json({ error: 'Could not send email.' });
  }
};
