import OpenAI from 'openai'

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})


export async function generateEmail(lead: any) {
  const prompt = `
You are an SDR writing a short, friendly cold outreach email.

Write an email personalized for the following lead.

Name: ${lead.firstName} ${lead.lastName}
Company: ${lead.company || 'their company'}
Role: ${lead.role || 'their role'}

Rules:
- Keep under 120 words
- Friendly, professional tone
- No emojis
- End with a soft call to action
- Return ONLY valid JSON with keys "subject" and "body"
`

  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.6
  })

  const content = response.choices[0].message.content

  try {
    return JSON.parse(content!)
  } catch {
    throw new Error('Failed to parse AI response')
  }
}



///////////////////// DUMMY
///////////////////// switch when api key works
// export async function generateEmail(lead: any) {
//   return {
//     subject: `Quick hello ${lead.firstName}`,
//     body: `
// Hi ${lead.firstName},

// Came across your work at ${lead.company}.
// Thought it might be worth a quick intro.

// If this sounds interesting, happy to chat.

// Best,
// Ruchi
//     `.trim()
//   }
// }

