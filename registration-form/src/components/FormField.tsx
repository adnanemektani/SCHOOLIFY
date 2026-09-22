import { InputHTMLAttributes, ReactNode } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  children?: ReactNode;
};

export default function FormField({ label, error, children, id, ...inputProps }: Props) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-bold text-ink/80">
        {label}
      </label>
      <div className="mt-1.5">
        {children ?? (
          <input
            id={id}
            {...inputProps}
            className={`w-full rounded-xl border-2 bg-white px-4 py-2.5 text-[15px] text-ink outline-none transition placeholder:text-ink/30 focus:border-sky-deep ${
              error ? "border-red-400" : "border-ink/10"
            }`}
          />
        )}
      </div>
      {error && <p className="mt-1 text-xs font-semibold text-red-500">{error}</p>}
    </div>
  );
}
