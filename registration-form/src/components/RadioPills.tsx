type Option = { value: string; label: string };

type Props = {
  name: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
};

export default function RadioPills({ name, options, value, onChange, error }: Props) {
  return (
    <div>
      <div className="flex flex-wrap gap-2.5">
        {options.map((opt) => {
          const active = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              aria-pressed={active}
              className={`rounded-full border-2 px-4 py-2 text-sm font-bold transition ${
                active
                  ? "border-sky-deep bg-sky-deep text-white"
                  : "border-ink/10 bg-white text-ink/60 hover:border-ink/25"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
      <input type="hidden" name={name} value={value} />
      {error && <p className="mt-1 text-xs font-semibold text-red-500">{error}</p>}
    </div>
  );
}
