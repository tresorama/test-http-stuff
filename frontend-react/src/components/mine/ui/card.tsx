
export function UICard({ children }: { children: React.ReactNode; }) {
  return (
    <div className="pt-8 px-6 pb-6 flex flex-col gap-8 border rounded bg-muted">
      {children}
    </div>
  );
}


export function UICardTitle({ children }: { children: React.ReactNode; }) {
  return (
    <h2>
      {children}
    </h2>
  );
}

export function UICardContent({ children }: { children: React.ReactNode; }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(12rem,1fr))] gap-8">
      {children}
    </div>
  );
}

export function UICardContentBlock({ children }: { children: React.ReactNode; }) {
  return (
    <div className="p-5 flex flex-col gap-8 border rounded bg-background">
      {children}
    </div>
  );
}
export function UICardContentBlockTitle({ children }: { children: React.ReactNode; }) {
  return (
    <h3>
      {children}
    </h3>
  );
}
