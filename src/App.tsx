import './App.css'

function App() {
  return (
    <main className="landing">
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
    </main>
  )
}

export default App
