import { useState } from 'react'
import { Modal, Field, ModalActions } from '../ui/Modal'

export default function ReasonDialog({ title, subtitle, submitLabel, placeholder, danger = true, onSubmit, onClose }) {
  const [reason, setReason] = useState('')
  const submit = e => { e.preventDefault(); onSubmit(reason.trim()); onClose() }
  return (
    <Modal title={title} subtitle={subtitle} onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <Field label="Reason (optional)">
          <textarea value={reason} onChange={e => setReason(e.target.value)} rows={3} autoFocus placeholder={placeholder}
            className="w-full bg-fg/5 border border-line rounded-xl px-4 py-2.5 text-fg text-sm placeholder:text-fg-muted focus:outline-none focus:border-violet-500 resize-none" />
        </Field>
        <ModalActions onCancel={onClose} submitLabel={submitLabel} danger={danger} />
      </form>
    </Modal>
  )
}
