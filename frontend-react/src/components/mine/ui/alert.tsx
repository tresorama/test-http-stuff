import { tv } from 'tailwind-variants';

const alertVariants = tv({
  defaultVariants: {
    status: 'idle',
  },
  slots: {
    root: "border rounded",
    header: "px-4 py-2 uppercase text-sm font-medium tracking-wide",
  },
  variants: {
    status: {
      idle: {
        root: ''
      },
      loading: {
        root: 'bg-muted text-muted-foreground animate-pulse',
        header: ''
      },
      success: {
        root: 'bg-green-300/20',
        header: 'bg-green-300/10 text-green-200'
      },
      error: {
        root: 'bg-red-300/20',
        header: 'bg-red-500/30 text-red-200/90'
      },
    },
  },
});

const capitalize = (x: string) => x.slice(0, 1).toUpperCase() + x.slice(1).toLowerCase();

export function UIAlert({ status, children }: {
  status: 'idle' | 'loading' | 'success' | 'error';
  children: React.ReactNode;
}) {

  const finalClassName = alertVariants({ status });

  if (status === 'idle') {
    return null;
  }

  if (status === 'loading') {
    return (
      <div
        data-status={status}
        className={finalClassName.root()}
      >
        <div className={finalClassName.header()}>
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div
      data-status={status}
      className={finalClassName.root()}
    >
      <div className={finalClassName.header()}>
        {capitalize(status)}
      </div>
      {children}
    </div>
  );

}