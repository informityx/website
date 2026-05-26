export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

export function formatField(label: string, value: string | null | undefined): string {
  const display = value?.trim() ? value.trim() : "—"
  return `${label}: ${display}`
}

export function formatFieldHtml(
  label: string,
  value: string | null | undefined
): string {
  const display = value?.trim() ? escapeHtml(value.trim()) : "—"
  return `<tr><td style="padding:8px 12px 8px 0;font-weight:600;vertical-align:top;color:#374151;">${escapeHtml(label)}</td><td style="padding:8px 0;color:#111827;">${display}</td></tr>`
}

export function wrapHtmlEmail(title: string, rowsHtml: string): string {
  return `<!DOCTYPE html>
<html>
  <body style="font-family:Arial,Helvetica,sans-serif;line-height:1.5;color:#111827;">
    <h2 style="margin:0 0 16px;font-size:20px;">${escapeHtml(title)}</h2>
    <table style="border-collapse:collapse;">${rowsHtml}</table>
  </body>
</html>`
}

export function formatBoolean(value: boolean | undefined): string {
  if (value === undefined) return "—"
  return value ? "Yes" : "No"
}

export function formatRecordFields(
  data: Record<string, unknown>,
  labels: Record<string, string>
): { text: string; htmlRows: string } {
  const textLines: string[] = []
  const htmlRows: string[] = []

  for (const [key, label] of Object.entries(labels)) {
    const raw = data[key]
    let display: string

    if (typeof raw === "boolean") {
      display = formatBoolean(raw)
    } else if (raw === null || raw === undefined || raw === "") {
      display = "—"
    } else {
      display = String(raw)
    }

    textLines.push(formatField(label, display))
    htmlRows.push(formatFieldHtml(label, display))
  }

  return {
    text: textLines.join("\n"),
    htmlRows: htmlRows.join(""),
  }
}
