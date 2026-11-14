import { useState } from 'react'
import { Save, Globe, UserPlus, Receipt, Wrench, RotateCcw } from 'lucide-react'
import { usePlatform } from '../../store/platform'
import { Panel } from '../../components/dashboard/widgets'
import { Field, TextInput, Toggle, Modal, ModalActions } from '../../components/ui/Modal'

function Row({ title, desc, children }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-line last:border-0">
      <div className="min-w-0">
        <p className="text-fg text-sm font-medium">{title}</p>
        <p className="text-fg-muted text-xs">{desc}</p>
      </div>
      {children}
    </div>
  )
}

export default function PlatformSettingsPage() {
  const settings = usePlatform(s => s.settings)
  const updateSettings = usePlatform(s => s.updateSettings)
  const resetDemoData = usePlatform(s => s.resetDemoData)
  const [form, setForm] = useState(settings)
  const [saved, setSaved] = useState(false)
  const [confirmReset, setConfirmReset] = useState(false)
  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setSaved(false) }
  const dirty = JSON.stringify(form) !== JSON.stringify(settings)

  const save = () => {
    updateSettings({ ...form, trialDays: +form.trialDays || 0, gstRate: +form.gstRate || 0 })
    setSaved(true)
  }

  return (
    <div className="space-y-5 max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-[20px] font-bold text-fg">Platform settings</h2>
          <p className="text-[13px] text-fg-muted">Applies to every salon on {settings.platformName}.</p>
        </div>
        <button onClick={save} disabled={!dirty}
          className="btn-primary px-4 py-2 rounded-xl text-[13px] flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
          <Save size={15} /> {saved && !dirty ? 'Saved' : 'Save changes'}
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Panel title="General" subtitle="Shown to salons in emails and the app" action={<Globe size={17} className="text-fg-muted" />} delay={0}>
          <div className="space-y-4">
            <Field label="Platform name"><TextInput value={form.platformName} onChange={e => set('platformName', e.target.value)} /></Field>
            <Field label="Support email"><TextInput type="email" value={form.supportEmail} onChange={e => set('supportEmail', e.target.value)} /></Field>
            <Field label="Support phone"><TextInput value={form.supportPhone} onChange={e => set('supportPhone', e.target.value)} /></Field>
          </div>
        </Panel>

        <Panel title="Salon registration" subtitle="How new salon businesses join" action={<UserPlus size={17} className="text-fg-muted" />} delay={0.05}>
          <Row title="Allow self-registration" desc="Salon owners can sign up from the website">
            <Toggle checked={form.allowRegistration} onChange={v => set('allowRegistration', v)} label="Allow self-registration" />
          </Row>
          <Row title="Require approval" desc="New salons wait for your approval before they can sign in">
            <Toggle checked={form.requireApproval} onChange={v => set('requireApproval', v)} label="Require approval" />
          </Row>
          <div className="pt-3">
            <Field label="Free trial (days)">
              <TextInput inputMode="numeric" value={form.trialDays} onChange={e => set('trialDays', e.target.value.replace(/\D/g, ''))} />
            </Field>
          </div>
        </Panel>

        <Panel title="Billing" subtitle="Subscription invoices sent to salons" action={<Receipt size={17} className="text-fg-muted" />} delay={0.1}>
          <div className="grid grid-cols-2 gap-4">
            <Field label="GST rate (%)"><TextInput inputMode="numeric" value={form.gstRate} onChange={e => set('gstRate', e.target.value.replace(/\D/g, ''))} /></Field>
            <Field label="Invoice prefix"><TextInput value={form.invoicePrefix} onChange={e => set('invoicePrefix', e.target.value.toUpperCase())} /></Field>
          </div>
        </Panel>

        <Panel title="Maintenance" subtitle="Temporarily close the app for every salon" action={<Wrench size={17} className="text-fg-muted" />} delay={0.15}>
          <Row title="Maintenance mode" desc="Salon users see the message below instead of their dashboard">
            <Toggle checked={form.maintenanceMode} onChange={v => set('maintenanceMode', v)} label="Maintenance mode" />
          </Row>
          <div className="pt-3">
            <Field label="Message"><TextInput value={form.maintenanceMessage} onChange={e => set('maintenanceMessage', e.target.value)} /></Field>
          </div>
        </Panel>
      </div>

      <div className="glass rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-fg">Reset demo data</p>
          <p className="text-xs text-fg-muted">Restore the original sample salons, plans, accounts and settings.</p>
        </div>
        <button onClick={() => setConfirmReset(true)} className="btn-ghost px-3.5 py-2 rounded-xl text-[13px] font-medium flex items-center gap-1.5">
          <RotateCcw size={14} /> Reset
        </button>
      </div>

      {confirmReset && (
        <Modal title="Reset all demo data?" subtitle="Every change made in this browser is lost." onClose={() => setConfirmReset(false)}>
          <form onSubmit={e => { e.preventDefault(); resetDemoData(); setForm(usePlatform.getState().settings); setConfirmReset(false) }}>
            <ModalActions onCancel={() => setConfirmReset(false)} submitLabel="Reset data" danger />
          </form>
        </Modal>
      )}
    </div>
  )
}
