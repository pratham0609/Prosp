'use client'

import { sendEmail, simulateReply } from '../lib/api'

export default function LeadRow({ lead, onAction }: any) {
  return (
    <div style={{ border: '1px solid #ddd', padding: 12, marginBottom: 8 }}>
      <div>
        <strong>{lead.firstName} {lead.lastName}</strong> — {lead.company}
      </div>

      <div style={{ marginTop: 8 }}>
        Status:{' '}
        {lead.repliedAt
          ? 'REPLIED'
          : lead.sends?.length
          ? 'EMAIL SENT'
          : 'NEW'}
      </div>

      <div style={{ marginTop: 8 }}>
        <button 
        disabled={lead.repliedAt}
        onClick={async () => {
          await sendEmail(lead.id)
          onAction()
        }}>
          Send Email
        </button>

        <button
          style={{ marginLeft: 8 }}
          onClick={async () => {
            await simulateReply(lead.id)
            onAction()
          }}
        >
          Simulate Reply
        </button>
      </div>
    </div>
  )
}
