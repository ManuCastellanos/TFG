import type { UseFormRegister } from 'react-hook-form';
import type { CreateQuizFormValues } from '../../types/create-quiz.types';

type Props = {
  register: UseFormRegister<CreateQuizFormValues>;
};

export function BehaviourSection({ register }: Props) {
  return (
    <div className="rounded-3xl p-5 border-2 border-(--border) bg-white flex flex-col gap-4">
      <h2 className="text-xl font-semibold text-(--fg)">Configuración</h2>

      <div className="flex flex-col gap-3">
        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            {...register('shuffleQuestions')}
            className="size-4 accent-[#274E38] cursor-pointer mt-0.5 shrink-0"
          />
          <div>
            <p className="text-sm font-medium text-(--fg)">Mezclar preguntas</p>
            <p className="text-xs text-(--fg-muted)">
              Cada alumno verá las preguntas en un orden distinto.
            </p>
          </div>
        </label>

        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            {...register('shuffleAnswers')}
            className="size-4 accent-[#274E38] cursor-pointer mt-0.5 shrink-0"
          />
          <div>
            <p className="text-sm font-medium text-(--fg)">Mezclar respuestas</p>
            <p className="text-xs text-(--fg-muted)">
              Las opciones de cada pregunta se ordenan aleatoriamente.
            </p>
          </div>
        </label>

        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            {...register('showResultsImmediately')}
            className="size-4 accent-[#274E38] cursor-pointer mt-0.5 shrink-0"
          />
          <div>
            <p className="text-sm font-medium text-(--fg)">Mostrar respuestas al finalizar</p>
            <p className="text-xs text-(--fg-muted)">
              Los alumnos verán qué han acertado y fallado al terminar el cuestionario.
            </p>
          </div>
        </label>
      </div>
    </div>
  );
}
