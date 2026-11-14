import { useEffect } from 'react'

// Calls onClose on a pointer press outside `ref` or on Escape while `open`.
export default function useDismiss(ref, open, onClose) {
  useEffect(() => {
    if (!open) return
    const onPointer = e => { if (ref.current && !ref.current.contains(e.target)) onClose() }
    const onKey = e => { if (e.key === 'Escape') onClose() }
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [ref, open, onClose])
}
