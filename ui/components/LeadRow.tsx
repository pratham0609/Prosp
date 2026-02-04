'use client'

import { sendEmail, simulateReply } from '../lib/api'

export default function LeadRow({ lead, onAction }: any) {
  const isReplied = !!lead.repliedAt
  const isEmailSent = !!lead.sends?.length

  let statusLabel = 'NEW'
  let statusColor = '#999'

  if (isReplied) {
    statusLabel = 'REPLIED'
    statusColor = '#2e7d32' // green
  } else if (isEmailSent) {
    statusLabel = 'EMAIL SENT'
    statusColor = '#1565c0' // blue
  }

  return (
    <div
      style={{
        border: '1px solid #e5e5e5',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        background: '#fafafa'
      }}
    >
      <div style={{ fontSize: 16, fontWeight: 600 }}>
        {lead.firstName} {lead.lastName}
      </div>

      <div style={{ color: '#666', marginTop: 4 }}>
        {lead.company}
      </div>

      <div style={{ marginTop: 12 }}>
        Status:{' '}
        <span style={{ fontWeight: 500, color: statusColor }}>
          {statusLabel}
        </span>
      </div>

      <div style={{ marginTop: 12 }}>
        <button
          disabled={isEmailSent || isReplied}
          onClick={async () => {
            await sendEmail(lead.id)
            onAction()
          }}
        >
          Send Email
        </button>

        <button
          style={{ marginLeft: 8 }}
          disabled={isReplied}
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
