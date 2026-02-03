'use client'

import { useState } from 'react'
import { createLead } from '../lib/api'

export default function AddLeadForm({ onCreated }: any) {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    role: ''
  })

  const update = (key: string, value: string) =>
    setForm({ ...form, [key]: value })

  const submit = async (e: any) => {
    e.preventDefault()
    await createLead(form)
    setForm({
      firstName: '',
      lastName: '',
      email: '',
      company: '',
      role: ''
    })
    onCreated()
  }

  return (
    <form onSubmit={submit} style={{ marginBottom: 24 }}>
      <h3>Add Lead</h3>

      <input
        placeholder="First name"
        value={form.firstName}
        onChange={(e) => update('firstName', e.target.value)}
      />
      <input
        placeholder="Last name"
        value={form.lastName}
        onChange={(e) => update('lastName', e.target.value)}
      />
      <input
        placeholder="Email"
        value={form.email}
        onChange={(e) => update('email', e.target.value)}
      />
      <input
        placeholder="Company"
        value={form.company}
        onChange={(e) => update('company', e.target.value)}
      />
      <input
        placeholder="Role"
        value={form.role}
        onChange={(e) => update('role', e.target.value)}
      />

      <div style={{ marginTop: 8 }}>
        <button type="submit">Add Lead</button>
      </div>
    </form>
  )
}

