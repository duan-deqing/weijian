import { useEffect, useMemo, useState } from 'react'

export type Route = 'home' | 'editor' | 'articles' | 'docs'

function parseHash(hash: string): Route {
  const path = hash.replace(/^#\/?/, '').toLowerCase()
  if (path.startsWith('editor')) return 'editor'
  if (path.startsWith('articles') || path.startsWith('my') || path.startsWith('posts')) {
    return 'articles'
  }
  if (path.startsWith('docs') || path.startsWith('guide') || path.startsWith('changelog')) {
    return 'docs'
  }
  return 'home'
}

export function useRouter() {
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash))

  useEffect(() => {
    const onHashChange = () => setRoute(parseHash(window.location.hash))
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const navigate = useMemo(
    () => (next: Route) => {
      const hashMap: Record<Route, string> = {
        home: '#/',
        editor: '#/editor',
        articles: '#/articles',
        docs: '#/docs',
      }
      const hash = hashMap[next]
      if (window.location.hash === hash) {
        setRoute(next)
        return
      }
      window.location.hash = hash
    },
    [],
  )

  return { route, navigate }
}
