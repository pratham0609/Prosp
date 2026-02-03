'use client'

import AddLeadForm from '../components/AddLeadForm'
import { useEffect, useState } from 'react'
import { fetchLeads } from '../lib/api'
import LeadRow from '../components/LeadRow'

export default function Page() {
  const [leads, setLeads] = useState<any[]>([])

  const load = async () => {
    const data = await fetchLeads()
    console.log('LEADS:', data)
    setLeads(data)
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <main style={{ padding: 24 }}>
      <h1>Prosp – Outreach Dashboard</h1>

      <p>
        Send AI-personalized outreach and automated follow-ups.
      </p>

      <AddLeadForm onCreated={load} />

      <div style={{ marginTop: 24 }}>
        {leads.map((lead) => (
          <LeadRow key={lead.id} lead={lead} onAction={load} />
        ))}
      </div>
    </main>
  )
}
