export type EmailConfig = {
  host: string
  port: number
  secure: boolean
  user: string
  password: string
  from: string
  fromName: string
  to: string
}

function readBool(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined || value.trim() === "") return fallback
  return value === "true" || value === "1"
}

export function getEmailConfig(): EmailConfig | null {
  const host = process.env.SMTP_HOST?.trim()
  const user = process.env.SMTP_USER?.trim()
  const password = process.env.SMTP_PASSWORD
  const from = process.env.MAIL_FROM?.trim() || user
  const to = process.env.MAIL_TO?.trim() || from

  if (!host || !user || !password || !from || !to) {
    return null
  }

  const port = Number(process.env.SMTP_PORT ?? 465)
  const secure =
    process.env.SMTP_SECURE !== undefined
      ? readBool(process.env.SMTP_SECURE, port === 465)
      : port === 465

  return {
    host,
    port,
    secure,
    user,
    password,
    from,
    fromName: process.env.MAIL_FROM_NAME?.trim() || "InforMityx",
    to,
  }
}

export function isEmailConfigured(): boolean {
  return getEmailConfig() !== null
}
