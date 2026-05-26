import { useNavigate, useParams } from '@tanstack/react-router';
import { Plus, ArrowRight } from 'lucide-react';
import { Page } from '@/components/ui/page/Page';
import { useEditQuestions } from '../hooks/useEditQuestions';
import { QuestionCard } from '../components/QuestionCard';
import { AddQuestionPanel } from '../components/AddQuestionPanel';
import type { UpdateQuestionInput } from '@/modules/quiz/domain/QuizQuestionBank';

export default function EditQuestionsPage() {
  const { courseId, quizId } = useParams({ strict: false }) as {
    courseId: string;
    quizId: string;
  };
  const navigate = useNavigate();
  const cmid = Number(quizId);

  const {
    questions, isLoading,
    showAddPanel, setShowAddPanel,
    addQuestion, isAdding, addError,
    deleteQuestion, deletingSlotId,
    updateQuestion, isUpdating, updatingQuestionId,
  } = useEditQuestions(cmid);

  const goToQuiz = () =>
    void navigate({ to: '/courses/$courseId/quiz/$quizId', params: { courseId, quizId } });

  const goToCourse = () =>
    void navigate({ to: '/courses/$id', params: { id: courseId } });

  const handleUpdate = (input: UpdateQuestionInput) => {
    updateQuestion({ ...input, cmid });
  };

  return (
    <Page title="Preguntas del cuestionario">
      <div className="max-w-2xl mx-auto flex flex-col gap-4">

        {/* Header con contador */}
        {!isLoading && (
          <div className="flex items-center gap-3 mb-1">
            <div className="rounded-2xl bg-white border border-(--border) px-3 py-2 flex items-center gap-2 shrink-0">
              <span className="size-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-extrabold text-(--fg)">{questions.length}</span>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-(--fg-muted)">
                {questions.length === 1 ? 'pregunta' : 'preguntas'}
              </span>
            </div>
            <p className="text-xs font-bold text-(--fg-muted)">
              {questions.length === 0
                ? 'Sin preguntas todavía — añade la primera.'
                : `${questions.length} punto${questions.length !== 1 ? 's' : ''} en total`}
            </p>
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="rounded-3xl border-2 border-(--border) bg-white p-8 text-center text-(--fg-muted) text-sm">
            Cargando preguntas…
          </div>
        )}

        {/* Lista de tarjetas */}
        {!isLoading && questions.length > 0 && (
          <div className="flex flex-col gap-2">
            {questions.map((q, i) => (
              <QuestionCard
                key={q.slotId}
                question={q}
                index={i}
                onDelete={() => deleteQuestion(q.slotId)}
                isDeleting={deletingSlotId === q.slotId}
                onUpdate={handleUpdate}
                isUpdating={isUpdating && updatingQuestionId === q.questionId}
              />
            ))}
          </div>
        )}

        {/* Panel nueva pregunta o botón drop zone */}
        {showAddPanel ? (
          <AddQuestionPanel
            cmid={cmid}
            nextNumber={questions.length + 1}
            onAdd={addQuestion}
            onCancel={() => setShowAddPanel(false)}
            isLoading={isAdding}
            error={addError}
          />
        ) : (
          <button
            type="button"
            onClick={() => setShowAddPanel(true)}
            className="group flex items-center gap-4 w-full p-4 rounded-3xl border-2 border-dashed border-(--border) bg-white/40 hover:bg-white hover:border-emerald-300 transition text-left"
          >
            <span className="size-11 rounded-2xl bg-emerald-100 text-emerald-700 grid place-items-center text-xl shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition">
              <Plus className="size-5" />
            </span>
            <div className="flex-1">
              <div className="text-sm font-extrabold text-(--fg) leading-tight">
                Añadir pregunta nº {questions.length + 1}
              </div>
              <div className="text-[11px] text-(--fg-muted) font-bold">
                Elige el tipo de pregunta para empezar
              </div>
            </div>
          </button>
        )}

        {/* Footer */}
        <div className="sticky bottom-0 -mx-1 mt-2 px-4 py-3 rounded-2xl bg-white border-2 border-(--border) shadow-[0_-6px_16px_-12px_rgba(0,0,0,0.15)] flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-(--fg-muted)">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            Cambios guardados
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={goToCourse}
              className="px-4 py-2 rounded-2xl border border-(--border) bg-white text-sm font-bold text-(--fg-muted) hover:bg-(--tint-50) transition"
            >
              Volver al curso
            </button>
            <button
              type="button"
              onClick={goToQuiz}
              className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#274E38] text-white text-sm font-extrabold hover:brightness-110 transition"
            >
              Ir al cuestionario
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </Page>
  );
}
