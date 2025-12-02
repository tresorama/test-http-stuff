import { useMemo } from "react";
import { cn, tv } from 'tailwind-variants';


// card

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


// debug json

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

// form field

export function UIFormField({ children }: { children: React.ReactNode; }) {
  return (
    <div className="grid grid-cols-[7rem_minmax(0,1fr)] gap-4 items-center justify-items-stretch">
      {children}
    </div>
  );
}

export function UIFormFieldHelperText({ children }: { children: React.ReactNode; }) {
  return (
    <p className="col-span-full text-muted-foreground">
      {children}
    </p>
  );
}

export function UIFormLabel({ ...labelProps }: React.ComponentProps<'label'>) {
  return (
    <label
      {...labelProps}
      className="text-[0.9rem] font-light"
    />
  );
}

// form control - select

export function UISelect<TOption extends { label: string, value: string; }>({
  options,
  onSelectOption,
  ...selectProps
}: {
  options: TOption[] | ReadonlyArray<TOption>,
  onSelectOption?: (option: TOption) => void,
} & React.ComponentProps<'select'>) {
  const optionsMap = useMemo(() => new Map(options.map(option => [option.value, option])), [options]);

  return (
    <select
      {...selectProps}
      onChange={e => {
        const newValue = e.target.value;
        const option = optionsMap.get(newValue);
        if (!option) {
          throw new Error(`Unknown option: ${newValue}`);
        }
        onSelectOption?.(option);
      }}
    >
      {options.map(option => (
        <option
          key={option.value}
          value={option.value}
        >
          {option.label}
        </option>
      ))}
    </select>
  );

}


// form control - input

export function UIInput({ ...inputProps }: React.ComponentProps<'input'>) {
  return (
    <input
      type="text"
      {...inputProps}
    />
  );
}


// form error

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