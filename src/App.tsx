import './App.css'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'

function App() {
  return (
    <main className="landing">
      <div className="landing-shell">
        <section className="brand-block" aria-label="vuDS-x brand">
          <img
            src="/favicon.svg"
            className="brand-mark"
            width="168"
            height="180"
            alt="vuDS-x logo mark"
          />
          <div className="brand-copy">
            <h1 className="brand-title">vuDS-x</h1>
            <p className="brand-subtitle">
              Experimental vuDS&mdash;
              <br />
              VuNet Design System
            </p>
          </div>
        </section>
        <hr className="landing-divider" />
        <nav className="landing-actions" aria-label="Primary links">
          <Button asChild variant="outline">
            <Link to="/trial">Trial Playground</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/changelog">Changelog</Link>
          </Button>
        </nav>
      </div>
    </main>
  )
}

export default App
