export function Rating({ value }: { value: number }) {
  return (
    <span className="rounded-md bg-amber-100 px-2 py-0.5 text-sm font-semibold text-amber-900 dark:bg-amber-900/40 dark:text-amber-200">
      {value}/100
    </span>
  );
}
