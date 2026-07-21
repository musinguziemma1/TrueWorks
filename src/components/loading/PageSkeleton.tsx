export function PageSkeleton() {
  return (
    <div className="space-y-4 p-4 md:p-6">
      <div className="h-8 w-48 rounded bg-section animate-pulse" />
      <div className="h-4 w-72 rounded bg-section animate-pulse" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="h-32 rounded-lg border border-border bg-white animate-pulse" />
        ))}
      </div>
    </div>
  );
}
