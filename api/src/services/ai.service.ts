import OpenAI from 'openai'

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function generateEmail(lead: any) {
  try {
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
Write a personalized cold outreach email.

Name: ${lead.firstName} ${lead.lastName}
Company: ${lead.company || 'their company'}
Role: ${lead.role || 'their role'}

Rules:
- Under 120 words
- Friendly, professional tone
- No emojis
- Soft call to action
- Return ONLY valid JSON with keys "subject" and "body".
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
