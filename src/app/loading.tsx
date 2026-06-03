export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-mist">
      <div className="flex items-center gap-3">
        <span className="relative inline-flex h-3 w-3 rounded-full bg-navy-600">
          <span className="absolute inset-0 inline-flex h-full w-full animate-pulse-soft rounded-full bg-navy-600/70" />
        </span>
        <span className="text-[0.95rem] font-medium text-navy-900/65">Loading Vaishnavi…</span>
      </div>
    </div>
  );
}
