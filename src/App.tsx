import { useEffect } from 'react'
import { LandingPage } from './pages/LandingPage'
import { EditorPage } from './pages/EditorPage'
import { ArticlesPage } from './pages/ArticlesPage'
import { DocsPage } from './pages/DocsPage'
import { SiteShell } from './components/SiteShell'
import { useRouter } from './hooks/useRouter'
import { useColorMode } from './hooks/useColorMode'

export default function App() {
  const { route, navigate } = useRouter()
  const colorMode = useColorMode()

  useEffect(() => {
    document.documentElement.dataset.theme = colorMode.mode
  }, [colorMode.mode])

  if (route === 'editor') {
    return (
      <div key="editor" className="route-stage route-stage--fill">
        <EditorPage
          onOpenArticles={() => navigate('articles')}
          colorMode={colorMode.mode}
          onToggleColorMode={colorMode.toggle}
        />
      </div>
    )
  }

  return (
    <SiteShell
      route={route}
      onNavigate={navigate}
      colorMode={colorMode.mode}
      onToggleColorMode={colorMode.toggle}
    >
      {route === 'articles' && <ArticlesPage onEnterEditor={() => navigate('editor')} />}
      {route === 'docs' && <DocsPage />}
      {route === 'home' && (
        <LandingPage
          onEnter={() => navigate('editor')}
          onOpenArticles={() => navigate('articles')}
          onOpenDocs={() => navigate('docs')}
        />
      )}
    </SiteShell>
  )
}
