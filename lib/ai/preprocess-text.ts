/**
 * Normalize PDF-extracted text into continuous prose for summarization models.
 */
export function preprocessPdfText(raw: string): string {
  let text = raw
    .replace(/\uFFFD/g, "")
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, " ")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')

  // Rejoin hyphenated line breaks: "deriv-\natives" -> "derivatives"
  text = text.replace(/(\w)-\s*\n\s*(\w)/g, "$1$2")

  // Single newlines within a paragraph -> space
  text = text.replace(/([^\n])\n([^\n])/g, "$1 $2")
  text = text.replace(/\n{3,}/g, "\n\n")

  // Collapse repeated whitespace
  text = text.replace(/[ \t]+/g, " ")
  text = text.replace(/\n{2,}/g, "\n\n")

  // Fix missing space after sentence-ending punctuation
  text = text.replace(/([.!?])([A-Za-z])/g, "$1 $2")

  return text.trim()
}

/**
 * Split long documents at sentence boundaries for the model's context window.
 */
export function splitIntoChunks(text: string, maxChars = 2400): string[] {
  if (text.length <= maxChars) {
    return [text]
  }

  const chunks: string[] = []
  let start = 0

  while (start < text.length) {
    let end = Math.min(start + maxChars, text.length)

    if (end < text.length) {
      const slice = text.slice(start, end)
      const breakAt = Math.max(
        slice.lastIndexOf(". "),
        slice.lastIndexOf("? "),
        slice.lastIndexOf("! "),
        slice.lastIndexOf(".\n")
      )
      if (breakAt > maxChars * 0.4) {
        end = start + breakAt + 1
      }
    }

    const chunk = text.slice(start, end).trim()
    if (chunk.length >= 80) {
      chunks.push(chunk)
    }
    start = end
  }

  return chunks.length > 0 ? chunks : [text.slice(0, maxChars)]
}
