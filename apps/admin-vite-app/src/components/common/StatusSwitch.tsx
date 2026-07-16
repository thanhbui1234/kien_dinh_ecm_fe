import { Loader2 } from 'lucide-react';

interface StatusSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  isLoading?: boolean;
}

export function StatusSwitch({ checked, onChange, isLoading }: StatusSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={isLoading}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
        checked ? 'bg-black' : 'bg-gray-200'
      }`}
    >
      <span className="sr-only">Toggle status</span>
      <span
        aria-hidden="true"
        className={`pointer-events-none inline-flex h-4 w-4 transform items-center justify-center rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          checked ? 'translate-x-4' : 'translate-x-0'
        }`}
      >
        {isLoading && <Loader2 className={`h-3 w-3 animate-spin ${checked ? 'text-black' : 'text-gray-500'}`} />}
      </span>
    </button>
  );
}
