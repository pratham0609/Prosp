import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendEmail(
  to: string,
  subject: string,
  body: string
) {
  return resend.emails.send({
    from: process.env.EMAIL_FROM as string,
    to,
    subject,
    text: body   // 👈 use text instead of html
  })
}
