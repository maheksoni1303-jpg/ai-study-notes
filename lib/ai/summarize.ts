import { preprocessPdfText, splitIntoChunks } from "./preprocess-text"

const MODEL = "Xenova/distilbart-cnn-6-6"

type SummarizationOutput = Array<{ summary_text: string }>
type SummarizationOptions = {
  max_new_tokens?: number
  num_beams?: number
  early_stopping?: boolean
  no_repeat_ngram_size?: number
  length_penalty?: number
}
type SummarizationPipeline = (
  text: string,
  options?: SummarizationOptions
) => Promise<SummarizationOutput>

const GENERATION_OPTIONS: SummarizationOptions = {
  max_new_tokens: 160,
  num_beams: 4,
  early_stopping: true,
  no_repeat_ngram_size: 3,
  length_penalty: 1.5,
}

let cachedPipeline: SummarizationPipeline | null = null

async function getSummarizationPipeline(): Promise<SummarizationPipeline> {
  if (cachedPipeline) {
    return cachedPipeline
  }

  const { pipeline } = await import("@xenova/transformers")
  cachedPipeline = (await pipeline("summarization", MODEL)) as SummarizationPipeline
  return cachedPipeline
}

function formatSummaryParagraph(text: string): string {
  let summary = text.trim().replace(/\s+/g, " ")
  if (!summary) return summary

  summary = summary.charAt(0).toUpperCase() + summary.slice(1)
  if (!/[.!?]$/.test(summary)) {
    summary += "."
  }
  return summary
}

function isLowQualitySummary(summary: string): boolean {
  const words = summary.split(/\s+/).filter(Boolean)
  if (words.length < 10) return true

  const quoteCount = (summary.match(/['"]/g) || []).length
  if (quoteCount > 6) return true

  // Many very short quoted fragments = model echoing PDF tokens
  const shortQuoted = summary.match(/['"][^'"]{1,12}['"]/g) || []
  if (shortQuoted.length >= 3) return true

  return false
}

function extractiveFallback(cleanedText: string, maxSentences = 6): string {
  const sentences =
    cleanedText.match(/[^.!?]+[.!?]+/g)?.map((s) => s.trim()).filter(Boolean) ??
    []

  if (sentences.length === 0) {
    return cleanedText.slice(0, 600).trim()
  }

  return sentences.slice(0, maxSentences).join(" ")
}

async function summarizeChunk(text: string): Promise<string> {
  const summarizer = await getSummarizationPipeline()
  const output = await summarizer(text, GENERATION_OPTIONS)
  const summary = output[0]?.summary_text?.trim()

  if (!summary) {
    throw new Error("Failed to generate summary")
  }

  return formatSummaryParagraph(summary)
}

export async function summarizeText(rawText: string): Promise<string> {
  const cleaned = preprocessPdfText(rawText)
  const chunks = splitIntoChunks(cleaned)

  if (chunks.length === 1) {
    const summary = await summarizeChunk(chunks[0])
    if (isLowQualitySummary(summary)) {
      return formatSummaryParagraph(extractiveFallback(cleaned))
    }
    return summary
  }

  const partialSummaries: string[] = []
  for (const chunk of chunks) {
    partialSummaries.push(await summarizeChunk(chunk))
  }

  const combined = partialSummaries.join(" ")
  let finalSummary: string

  if (combined.length <= 2400) {
    finalSummary = await summarizeChunk(combined)
  } else {
    finalSummary = partialSummaries
      .map((part, index) => `${index + 1}. ${part}`)
      .join("\n\n")
  }

  if (isLowQualitySummary(finalSummary)) {
    return formatSummaryParagraph(extractiveFallback(cleaned))
  }

  return finalSummary
}
