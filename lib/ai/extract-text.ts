import { existsSync } from "fs"
import { readFile } from "fs/promises"
import path from "path"
import { pathToFileURL } from "url"

const MIN_EXTRACTED_CHARS = 50

function resolvePdfWorkerSrc(): string {
  const candidates = [
    path.join(process.cwd(), "node_modules/pdf-parse/dist/pdf-parse/esm/pdf.worker.mjs"),
    path.join(process.cwd(), "node_modules/pdf-parse/dist/worker/pdf.worker.mjs"),
    path.join(
      process.cwd(),
      "node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs"
    ),
  ]

  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      return pathToFileURL(candidate).href
    }
  }

  throw new Error("PDF worker file not found. Reinstall pdf-parse.")
}

let workerConfigured = false

async function ensurePdfWorker() {
  if (workerConfigured) return

  const { PDFParse } = await import("pdf-parse")
  PDFParse.setWorker(resolvePdfWorkerSrc())
  workerConfigured = true
}

export async function extractPdfText(filePath: string): Promise<string> {
  await ensurePdfWorker()

  const { PDFParse } = await import("pdf-parse")
  const fullPath = path.join(process.cwd(), filePath.replace(/^\//, ""))
  const buffer = await readFile(fullPath)

  const parser = new PDFParse({ data: buffer })

  try {
    const result = await parser.getText()
    const text = result.text.trim()

    if (text.length < MIN_EXTRACTED_CHARS) {
      throw new Error(
        "Could not extract enough text from the PDF. The file may be scanned images or empty."
      )
    }

    return text
  } finally {
    await parser.destroy()
  }
}
