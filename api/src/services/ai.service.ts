import OpenAI from 'openai'

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

// export async function generateEmail(lead: any) {
//   const prompt = `
// Write a short cold outreach email.

// Name: ${lead.firstName} ${lead.lastName}
// Company: ${lead.company}
// Role: ${lead.role}

// Keep it friendly, under 120 words.
// Return JSON with "subject" and "body".
// `

//   const response = await client.chat.completions.create({
//     model: 'gpt-4o-mini',
//     messages: [{ role: 'user', content: prompt }]
//   })

//   return JSON.parse(response.choices[0].message.content!)
// }


// switch when api key works
export async function generateEmail(lead: any) {
  return {
    subject: `Quick hello ${lead.firstName}`,
    body: `
Hi ${lead.firstName},

Came across your work at ${lead.company}.
Thought it might be worth a quick intro.

If this sounds interesting, happy to chat.

Best,
Ruchi
    `.trim()
  }
}

