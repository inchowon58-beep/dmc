export default function Loading() {
  return (
    <main className="mx-auto max-w-7xl animate-pulse px-4 py-8 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6">
        <div className="mb-6 h-8 w-48 rounded bg-slate-200" />
        <div className="mb-6 h-20 rounded-2xl bg-slate-100" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((card) => (
            <div key={card} className="aspect-square rounded-2xl bg-slate-100" />
          ))}
        </div>
      </div>
    </main>
  );
}
