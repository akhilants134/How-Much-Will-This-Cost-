# NoteAI — AI Cost Estimate

## Token Usage (5 Test Calls)

All 5 calls were made to `openai/gpt-4o-mini` via OpenRouter using `test/run_direct.mjs`.
The `[AI_USAGE]` log line was captured directly from the service for each call.

| Call | Note (words) | Prompt Tokens | Completion Tokens | Total Tokens |
|---|---|---|---|---|
| 1 | ~200 (short-note.txt) | 347 | 144 | 491 |
| 2 | ~500 (medium-note.txt) | 638 | 191 | 829 |
| 3 | ~800 (long-note.txt) | 1025 | 163 | 1188 |
| 4 | ~300 (extra-note-1.txt — Climate Change) | 394 | 149 | 543 |
| 5 | ~600 (extra-note-2.txt — Immune System) | 502 | 158 | 660 |
| **Average** | — | **581** | **161** | **742** |

## Model Pricing (from openrouter.ai/api/v1/models)

| Model | Input $/1M tokens | Output $/1M tokens |
|---|---|---|
| openai/gpt-4o-mini | $0.15 | $0.60 |
| google/gemini-2.0-flash-001 | $0.10 | $0.40 |

## Cost Projection Table

*Assumes 5 AI calls per user per day.*
*Formula: cost/req = (avg_prompt × input_$/1M) + (avg_completion × output_$/1M)*
*Daily = cost/req × users × 5 calls*
*Monthly = daily × 30*

**gpt-4o-mini cost/req:**
(581 × $0.15/1,000,000) + (161 × $0.60/1,000,000)
= $0.00008715 + $0.00009660
= **$0.000184 per request**

**gemini-2.0-flash-001 cost/req:**
(581 × $0.10/1,000,000) + (161 × $0.40/1,000,000)
= $0.00005810 + $0.00006440
= **$0.000122 per request**

| Model | Avg Tokens/Req | Cost/Request | Daily (10 users) | Daily (100 users) | Monthly (100 users) |
|---|---|---|---|---|---|
| gpt-4o-mini | 742 (581 in + 161 out) | $0.000184 | $0.0092 | $0.092 | $2.76 |
| gemini-2.0-flash-001 | 742 (581 in + 161 out) | $0.000122 | $0.0061 | $0.061 | $1.83 |

## Model Recommendation

**Recommended: `google/gemini-2.0-flash-001` at $1.83/month for 100 users.**
Compared to gpt-4o-mini ($2.76/month), Gemini 2.0 Flash costs 34% less while offering comparable instruction-following quality for structured JSON tasks; the trade-off is slightly lower benchmark scores on complex reasoning, but for the straightforward summarisation task NoteAI performs, the difference is negligible in practice.

## Token Plausibility Verification

Model tested: openai/gpt-4o-mini
Note used: short-note.txt
Note word count: approximately 200 words
Tokenizer result (from platform.openai.com/tokenizer): approximately 267 tokens for the note alone
System prompt tokens (estimate): approximately 70 tokens
Expected total prompt tokens: approximately 337 (267 note + 70 system prompt)
Logged promptTokens from [AI_USAGE]: 347
Difference explanation: The 10-token gap is expected — OpenAI's chat format adds ~3–4 tokens per message for role delimiters (`<|im_start|>`, `<|im_end|>`) and conversation framing, totalling ~10 overhead tokens across the two-message (system + user) request.
