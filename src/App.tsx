export default function App() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-nx-bg px-6 text-nx-cream">
      <section className="w-full max-w-2xl rounded-2xl border border-nx-border bg-nx-surface p-8 shadow-panel">
        <p className="text-sm uppercase tracking-[0.24em] text-nx-muted">
          Nexus
        </p>
        <h1 className="mt-3 text-2xl font-semibold">
          Project paths are aligned with the current root.
        </h1>
        <p className="mt-4 text-base text-nx-muted">
          This app now loads from root-level entry files in the
          <code className="mx-1 rounded bg-nx-surface2 px-2 py-1 text-nx-cream">
            msteams/src
          </code>
          project folder, which matches the existing package setup.
        </p>
      </section>
    </main>
  )
}
