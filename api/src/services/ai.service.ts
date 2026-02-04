import OpenAI from 'openai'

function getClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY not configured')
  }

  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  })
}


export async function generateEmail(lead: any) {
  try {
    const client = getClient()
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an SDR writing concise, friendly cold outreach emails.'
        },
        {
          role: 'user',
          content: `
Write a short, personalized cold outreach email.

Context:
You are writing on behalf of Prosp, an AI-powered outbound tool.
The goal is to start a genuine conversation, not to sell aggressively.

Lead details:
Name: ${lead.firstName} ${lead.lastName}
Company: ${lead.company}
Role: ${lead.role}

Guidelines:
- Under 100 words
- Friendly, natural, and human
- Mention the lead’s role or company naturally
- Do NOT pitch features
- Do NOT claim expertise in their domain
- Do NOT use placeholders or brackets in responses
- End with a soft question that invites a reply
- Sign off as "Prosp"

Return ONLY valid JSON with:
{
  "subject": "...",
  "body": "..."
}

`
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.6
    })

    const content = response.choices[0].message.content
    if (!content) throw new Error('Empty AI response')

    return JSON.parse(content)
  } catch (err) {
    console.warn('[AI] Falling back to default template:', err)

    // 🔒 Demo-safe fallback
    return {
      subject: `Quick intro, ${lead.firstName}`,
      body: `Hi ${lead.firstName},

I wanted to quickly reach out and introduce myself.

If it makes sense, happy to share more details.

Best,
Prosp`
    }
  }
}
