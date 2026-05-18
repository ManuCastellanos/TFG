import type { UseFormRegister, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import type { CreateQuizFormValues } from '../../types/create-quiz.types';

const PRESETS: { label: string; value: CreateQuizFormValues['timeLimitPreset'] }[] = [
  { label: '15 min', value: '15' },
  { label: '30 min', value: '30' },
  { label: '45 min', value: '45' },
  { label: '1 hora', value: '60' },
  { label: '1,5 h', value: '90' },
  { label: 'Personalizado', value: 'custom' },
];

type Props = {
  register: UseFormRegister<CreateQuizFormValues>;
  watch: UseFormWatch<CreateQuizFormValues>;
  setValue: UseFormSetValue<CreateQuizFormValues>;
};

export function TimingSection({ register, watch, setValue }: Props) {
  const timeLimitEnabled = watch('timeLimitEnabled');
  const timeLimitPreset = watch('timeLimitPreset');

  return (
    <div className="rounded-3xl p-5 border-2 border-(--border) bg-white flex flex-col gap-4">
      <h2 className="text-xl font-semibold text-(--fg)">Tiempo</h2>

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          {...register('timeLimitEnabled')}
          className="size-4 accent-[#274E38] cursor-pointer"
        />
        <span className="text-sm font-medium text-(--fg)">Activar límite de tiempo</span>
      </label>

      {timeLimitEnabled && (
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((preset) => (
              <button
                key={preset.value}
                type="button"
                onClick={() => setValue('timeLimitPreset', preset.value)}
                className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-colors ${
                  timeLimitPreset === preset.value
                    ? 'bg-(--color-pr) text-white'
                    : 'bg-(--surface) border border-(--border) text-(--fg) hover:border-(--fg-muted)'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {timeLimitPreset === 'custom' && (
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={300}
                {...register('timeLimitCustomMinutes', { valueAsNumber: true, min: 1 })}
                className="w-24 rounded-xl border border-(--border) bg-(--surface) text-(--fg) px-3 py-2 text-sm outline-none focus:border-(--color-pr) focus:ring-2 focus:ring-(--color-ring)"
              />
              <span className="text-sm text-(--fg-muted)">minutos</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
