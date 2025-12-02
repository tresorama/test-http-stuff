import { cn } from "tailwind-variants";

export function UIDebugJson({ data, className }: { data: unknown, className?: React.ComponentProps<'pre'>['className']; }) {
  return (
    <pre
      className={cn(
        "w-full max-w-full overflow-auto p-4 whitespace-pre text-[0.9rem]/[1.5] bg-background text-muted-foreground border rounded",
        className
      )}
    >
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}