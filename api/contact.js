/**
 * POST /api/contact — receives landing-page contact submissions and emails
 * them via Resend.
 *
 * The recipient address and API key are read from environment variables so no
 * personal email is ever committed to the repo or shipped in the client bundle.
 * Set these in the Vercel project (Settings → Environment Variables):
 *   CONTACT_TO_EMAIL    the inbox that receives inquiries
 *   RESEND_API_KEY      a Resend API key (https://resend.com)
 *   CONTACT_FROM_EMAIL  optional verified sender; defaults to Resend's sandbox
 */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, company, message } = req.body ?? {};

  if (!name || !email || !company) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const to = process.env.CONTACT_TO_EMAIL;
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL || "Setl <onboarding@resend.dev>";

  if (!to || !apiKey) {
    console.error("Contact form not configured: missing CONTACT_TO_EMAIL or RESEND_API_KEY");
    return res.status(500).json({ error: "Email service not configured" });
  }

  const text = [
    "New Setl inquiry",
    "",
    `Name:    ${name}`,
    `Email:   ${email}`,
    `Company: ${company}`,
    "",
    "Message:",
    message || "(none)",
  ].join("\n");

  try {
    const resp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: "Setl inquiry",
        text,
      }),
    });

    if (!resp.ok) {
      console.error("Resend error:", await resp.text());
      return res.status(502).json({ error: "Failed to send" });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Contact handler error:", err);
    return res.status(500).json({ error: "Failed to send" });
  }
}
