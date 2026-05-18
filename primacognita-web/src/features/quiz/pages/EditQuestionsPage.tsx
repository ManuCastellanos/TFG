import { useNavigate, useParams } from '@tanstack/react-router';
import { Plus } from 'lucide-react';
import { Page } from '@/components/ui/page/Page';
import { Button } from '@/components/ui/button/Button';
import { useEditQuestions } from '../hooks/useEditQuestions';
import { QuestionSlotCard } from '../components/QuestionSlotCard';
import { AddQuestionPanel } from '../components/AddQuestionPanel';

export default function EditQuestionsPage() {
  const { courseId, quizId } = useParams({ strict: false }) as {
    courseId: string;
    quizId: string;
  };
  const navigate = useNavigate();
  const cmid = Number(quizId);

  const { questions, isLoading, showAddPanel, setShowAddPanel, addQuestion, isAdding, addError } =
    useEditQuestions(cmid);

  const goToQuiz = () =>
    void navigate({ to: '/courses/$courseId/quiz/$quizId', params: { courseId, quizId } });

  const goToCourse = () =>
    void navigate({ to: '/courses/$id', params: { id: courseId } });

  return (
    <Page title="Preguntas del cuestionario">
      <div className="max-w-2xl flex flex-col gap-4">

        {isLoading ? (
          <div className="rounded-3xl border-2 border-(--border) bg-white p-8 text-center text-(--fg-muted) text-sm">
            Cargando preguntas…
          </div>
        ) : questions.length === 0 && !showAddPanel ? (
          <div className="rounded-3xl border-2 border-(--border) bg-white p-8 flex flex-col items-center gap-2">
            <p className="text-sm font-medium text-(--fg)">El cuestionario no tiene preguntas todavía.</p>
            <p className="text-xs text-(--fg-muted)">Añade la primera pregunta para empezar.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {questions.map((q) => (
              <QuestionSlotCard key={q.slotId} question={q} />
            ))}
          </div>
        )}

        {showAddPanel ? (
          <AddQuestionPanel
            cmid={cmid}
            onAdd={addQuestion}
            onCancel={() => setShowAddPanel(false)}
            isLoading={isAdding}
            error={addError}
          />
        ) : (
          <button
            type="button"
            onClick={() => setShowAddPanel(true)}
            className="flex items-center justify-center gap-2 w-full border-2 border-dashed border-(--border) rounded-2xl py-3 text-sm text-(--fg-muted) hover:text-(--fg) hover:border-(--fg-muted) transition"
          >
            <Plus className="size-4" />
            Añadir pregunta
          </button>
        )}

        <div className="flex gap-3 justify-between pt-2">
          <Button variant="outline" size="md" type="button" onClick={goToCourse}>
            Volver al curso
          </Button>
          <Button variant="primary" size="md" type="button" onClick={goToQuiz}>
            Ir al cuestionario
          </Button>
        </div>
      </div>
    </Page>
  );
}
