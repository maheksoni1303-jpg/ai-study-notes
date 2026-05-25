import { writeFile, mkdir } from "fs/promises"
import { existsSync } from "fs"
import path from "path"

const UPLOAD_DIR = path.join(process.cwd(), "uploads")
const MAX_FILE_SIZE = 200 * 1024 // 200KB
const ALLOWED_TYPES = ["application/pdf"]

export interface UploadResult {
  success: boolean
  filePath?: string
  originalFileName?: string
  fileSize?: number
  error?: string
}

export async function ensureUploadDir(): Promise<void> {
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true })
  }
}

export function validateFile(file: File): string | null {
  if (!file || file.size === 0) {
    return null
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return "Only PDF files are allowed"
  }

  if (file.size > MAX_FILE_SIZE) {
    return `File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB`
  }

  return null
}

export async function saveFile(file: File): Promise<UploadResult> {
  const validationError = validateFile(file)
  if (validationError) {
    return { success: false, error: validationError }
  }

  if (!file || file.size === 0) {
    return { success: false, error: "No file provided" }
  }

  try {
    await ensureUploadDir()

    const timestamp = Date.now()
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_")
    const uniqueFileName = `${timestamp}-${sanitizedName}`
    const filePath = path.join(UPLOAD_DIR, uniqueFileName)

    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(filePath, buffer)

    return {
      success: true,
      filePath: `/uploads/${uniqueFileName}`,
      originalFileName: file.name,
      fileSize: file.size,
    }
  } catch (error) {
    console.error("File save error:", error)
    return { success: false, error: "Failed to save file" }
  }
}

export function getFileUrl(filePath: string | null): string {
  return filePath || ""
}