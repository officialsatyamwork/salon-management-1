import { useState } from 'react'
import { Pencil, CheckCircle2, XCircle, Power, PauseCircle, Ban, Trash2 } from 'lucide-react'
import { usePlatform } from '../../store/platform'
import { Modal, ModalActions } from '../ui/Modal'
import SalonFormModal from './SalonFormModal'
import ReasonDialog from './ReasonDialog'

// Menu items and dialogs for every salon-level action, shared by the salons
// list and the salon detail page.
export default function useSalonActions({ onDeleted, onCreated, startWithCreate = false } = {}) {
  const [dialog, setDialog] = useState(startWithCreate ? { type: 'create' } : null)
  const approve = usePlatform(s => s.approve)
  const reject = usePlatform(s => s.reject)
  const setStatus = usePlatform(s => s.setStatus)
  const deleteBusiness = usePlatform(s => s.deleteBusiness)
  const close = () => setDialog(null)
  const open = (type, business) => () => setDialog({ type, business })

  const itemsFor = b => [
    { label: 'Edit details', icon: Pencil, onClick: open('edit', b) },
    b.status === 'pending' && { label: 'Approve', icon: CheckCircle2, onClick: () => approve(b.id) },
    b.status === 'pending' && { label: 'Reject', icon: XCircle, danger: true, onClick: open('reject', b) },
    ['inactive', 'suspended', 'rejected'].includes(b.status) && { label: 'Activate', icon: Power, onClick: () => setStatus(b.id, 'active') },
    b.status === 'active' && { label: 'Deactivate', icon: PauseCircle, onClick: open('deactivate', b) },
    ['active', 'inactive'].includes(b.status) && { label: 'Suspend', icon: Ban, danger: true, onClick: open('suspend', b) },
    { label: 'Delete', icon: Trash2, danger: true, onClick: open('delete', b) },
  ].filter(Boolean)

  const b = dialog?.business
  const dialogs = !dialog ? null
    : dialog.type === 'create' ? <SalonFormModal onSaved={onCreated} onClose={close} />
      : dialog.type === 'edit' ? <SalonFormModal business={b} onClose={close} />
        : dialog.type === 'reject' ? (
          <ReasonDialog title={`Reject ${b.name}?`} subtitle="The owner sees this reason when they try to sign in."
            placeholder="e.g. Could not verify GST details" submitLabel="Reject request"
            onSubmit={r => reject(b.id, r)} onClose={close} />
        ) : dialog.type === 'suspend' ? (
          <ReasonDialog title={`Suspend ${b.name}?`} subtitle="The owner, managers and staff are signed out and blocked until you reactivate it."
            placeholder="e.g. Subscription payment overdue" submitLabel="Suspend salon"
            onSubmit={r => setStatus(b.id, 'suspended', r)} onClose={close} />
        ) : dialog.type === 'deactivate' ? (
          <ReasonDialog title={`Deactivate ${b.name}?`} subtitle="Use this when the salon pauses or closes. You can reactivate it any time."
            placeholder="e.g. Closed for renovation" submitLabel="Deactivate" danger={false}
            onSubmit={r => setStatus(b.id, 'inactive', r)} onClose={close} />
        ) : (
          <Modal title={`Delete ${b.name}?`} subtitle="This permanently removes the salon, its branches and all of its user accounts." onClose={close}>
            <form onSubmit={e => { e.preventDefault(); deleteBusiness(b.id); close(); onDeleted?.() }}>
              <p className="text-[13px] text-fg-2 mb-4">
                {b.branches.length} branch{b.branches.length === 1 ? '' : 'es'} and every account linked to {b.name} will be deleted. This cannot be undone.
              </p>
              <ModalActions onCancel={close} submitLabel="Delete permanently" danger />
            </form>
          </Modal>
        )

  return { itemsFor, dialogs, openCreate: () => setDialog({ type: 'create' }) }
}
