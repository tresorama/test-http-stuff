
import { useMemo } from "react";


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
