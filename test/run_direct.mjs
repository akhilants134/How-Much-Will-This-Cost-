// run_direct.mjs — calls OpenRouter directly, no HTTP server needed
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import fetch from 'node-fetch'
import dotenv from 'dotenv'

dotenv.config()

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const TEST_DIR  = __dirname
const PROJ_DIR  = path.resolve(__dirname, '..')

const SYSTEM_PROMPT = `You are an academic study assistant. Analyze the provided notes and return a structured JSON response with exactly these three fields:
- overview: A 3-sentence summary of the main topic
- keyConcepts: An array of exactly 5 key concepts as strings
- examQuestions: An array of exactly 2 likely exam questions as strings

Return ONLY valid JSON. No markdown. No explanation. Just the JSON object.`

const NOTES = [
  { file: 'short-note.txt',   label: 'short (~200w)'   },
  { file: 'medium-note.txt',  label: 'medium (~500w)'  },
  { file: 'long-note.txt',    label: 'long (~800w)'    },
  { file: 'extra-note-1.txt', label: 'climate (~300w)' },
  { file: 'extra-note-2.txt', label: 'immune (~600w)'  },
]

async function callAI(noteContent, callIndex) {
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://noteai.app',
      'X-Title': 'NoteAI'
    },
    body: JSON.stringify({
      model: 'openai/gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user',   content: noteContent   }
      ],
      max_tokens: 500,
      temperature: 0.3
    })
  })

  const data = await res.json()

  if (!data.usage) {
    console.error(`Call ${callIndex}: No usage data. Response:`, JSON.stringify(data))
    return null
  }

  const usage = {
    call:              callIndex,
    model:             'openai/gpt-4o-mini',
    promptTokens:      data.usage.prompt_tokens,
    completionTokens:  data.usage.completion_tokens,
    totalTokens:       data.usage.total_tokens,
  }

  console.log('[AI_USAGE]', JSON.stringify({ ...usage, timestamp: new Date().toISOString() }))
  return usage
}

async function main() {
  console.log('===== NoteAI — Direct Token Usage Test =====\n')
  const results = []

  for (let i = 0; i < NOTES.length; i++) {
    const { file, label } = NOTES[i]
    const filePath = path.join(TEST_DIR, file)
    const noteContent = fs.readFileSync(filePath, 'utf8').trim()
    const wordCount = noteContent.split(/\s+/).length

    console.log(`--- Call ${i + 1}: ${file} (${label}, ${wordCount} words) ---`)

    try {
      const usage = await callAI(noteContent, i + 1)
      if (usage) results.push({ ...usage, file, label, wordCount })
    } catch (err) {
      console.error(`Call ${i + 1} failed:`, err.message)
    }

    if (i < NOTES.length - 1) {
      console.log('  (waiting 3s to avoid rate limit...)')
      await new Promise(r => setTimeout(r, 3000))
    }
  }

  console.log('\n===== SUMMARY =====')
  let totalPrompt = 0, totalCompletion = 0, totalAll = 0

  results.forEach(r => {
    totalPrompt     += r.promptTokens
    totalCompletion += r.completionTokens
    totalAll        += r.totalTokens
    console.log(`Call ${r.call} | ${r.file.padEnd(18)} | words: ${String(r.wordCount).padStart(4)} | prompt: ${String(r.promptTokens).padStart(5)} | completion: ${String(r.completionTokens).padStart(4)} | total: ${String(r.totalTokens).padStart(5)}`)
  })

  const n = results.length
  if (n > 0) {
    console.log('---')
    console.log(`Average | prompt: ${Math.round(totalPrompt/n)} | completion: ${Math.round(totalCompletion/n)} | total: ${Math.round(totalAll/n)}`)
  }

  console.log('\n===== Done =====')
}

main().catch(console.error)
