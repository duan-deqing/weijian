import { useEffect, useState } from 'react'

export function useToast(duration = 2200) {
  const [toast, setToast] = useState('')

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(''), duration)
    return () => window.clearTimeout(timer)
  }, [toast, duration])

  return { toast, showToast: setToast }
}
