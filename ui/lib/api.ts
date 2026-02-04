const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001'

export async function fetchLeads() {
  const res = await fetch(`${API_BASE}/leads`)
  return res.json()
}

export async function sendEmail(leadId: string) {
  return fetch(`${API_BASE}/emails/send/${leadId}`, {
    method: 'POST'
  })
}

export async function simulateReply(leadId: string) {
  return fetch(`${API_BASE}/leads/${leadId}/reply`, {
    method: 'POST'
  })
}

export async function createLead(data: any) {
  const res = await fetch(`${API_BASE}/leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })

  return res.json()
}

