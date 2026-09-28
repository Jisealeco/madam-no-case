export default function FilterChips({ options, value, onChange, label }) {
  return (
    <div className="-mx-5 overflow-x-auto px-5 pb-1 sm:mx-0 sm:px-0" role="group" aria-label={label}>
      <div className="flex w-max gap-2 sm:w-auto sm:flex-wrap sm:justify-center">
        {['All', ...options].map((option) => {
          const active = value === option;
          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(option)}
              aria-pressed={active}
              className={`rounded-full px-4 py-2 text-sm whitespace-nowrap transition ${
                active ? 'bg-wine-800 text-ivory-50 shadow-soft' : 'bg-white text-ink/75 ring-1 ring-gold-500/25 hover:text-wine-800 hover:ring-gold-500'
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
