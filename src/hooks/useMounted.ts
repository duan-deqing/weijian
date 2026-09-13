import { useEffect, useState } from 'react'

export function useMounted(delay = 0) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const id = window.setTimeout(() => setMounted(true), delay)
    return () => window.clearTimeout(id)
  }, [delay])

  return mounted
}
