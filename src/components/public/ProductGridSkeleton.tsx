export default function ProductGridSkeleton() {
  return (
    <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-5">
      {[1, 2, 3, 4].map((item) => (
        <div
          key={item}
          className="aspect-[4/5] animate-pulse rounded-2xl bg-muted"
        />
      ))}
    </div>
  );
}
