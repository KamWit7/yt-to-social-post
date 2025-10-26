import { serverEnv } from '@/lib/env/server-env'
import nodemailer from 'nodemailer'

const resetPasswordEmailTemplate = (resetUrl: string) => `
  <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.6;color:#222">
    <h2 style="color:#0d6efd;"> Zresetuj swoje hasło</h2>
    <p>Cześć,</p>
    <p>Otrzymaliśmy prośbę o zresetowanie Twojego hasła. <br/> Kliknij poniższy przycisk, aby ustawić nowe hasło:</p>
    <a href="${resetUrl}" 
       style="display:inline-block;background:#0d6efd;color:#fff;padding:10px 16px;border-radius:6px;text-decoration:none;font-weight:bold;">
       Zresetuj hasło
    </a>

    <p>Lub skopiuj ten link do przeglądarki:</p>
    <a href="${resetUrl}" style="color:#0d6efd;text-decoration:underline;">${resetUrl}</a>
    
    <p>Ten link jest ważny przez <b>1 godzinę</b>. <br/> Jeżeli to nie Ty, po prostu zignoruj tę wiadomość.</p>
    <hr style="margin-top:20px;">
    <p style="font-size:12px;color:#555;">© ${new Date().getFullYear()} YT Scribe</p>
  </div>
`

export async function sendResetPasswordEmial({
  email,
  resetUrl,
}: {
  email: string
  resetUrl: string
}) {
  const html = resetPasswordEmailTemplate(resetUrl)

  const transporter = nodemailer.createTransport(
    {
      service: 'gmail',
      auth: {
        user: serverEnv.EMAIL_USER,
        pass: serverEnv.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: serverEnv.NODE_ENV === 'production' ? true : false,
      },
    },
    {
      dnsTimeout: 10000,
    }
  )

  try {
    await transporter.sendMail({
      from: serverEnv.EMAIL_USER,
      to: email,
      subject: 'Reset hasła',
      html,
    })
  } catch (error) {
    console.error('Error sending email:', error)
    throw error
  }
}
