import nodemailer from "nodemailer"
import type SMTPTransport from "nodemailer/lib/smtp-transport"
import { getEmailConfig } from "./config"

let cachedTransporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo> | null =
  null

export function getMailTransporter():
  | nodemailer.Transporter<SMTPTransport.SentMessageInfo>
  | null {
  if (cachedTransporter) return cachedTransporter

  const config = getEmailConfig()
  if (!config) return null

  cachedTransporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.password,
    },
  })

  return cachedTransporter
}
