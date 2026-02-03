const API_BASE = 'http://localhost:3001'

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
