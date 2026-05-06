import { useNavigate } from '@tanstack/react-router';
import { Page } from '@/components/page/Page';
import { Card } from '@/components/card/Card';
import { Text } from '@/components/text/Text';
import { useCreateCourse } from '../hooks/useCreateCourse';
import { useAllCategories } from '../hooks/useCourseCategories';
import { CreateCourseForm } from '../components/CreateCourseForm';
import type { CreateCourseInput } from '@/modules/course/domain/CreateCourseInput';

export default function CreateCoursePage() {
  const navigate = useNavigate();
  const { submit, loading, error } = useCreateCourse();
  const { categories, loading: loadingCategories } = useAllCategories();

  const handleSubmit = async (input: CreateCourseInput, imageFile?: File) => {
    await submit(input, imageFile);
    navigate({ to: '/courses' });
  };

  return (
    <Page>
      <Card className="w-full max-w-lg">
        <Text className="mb-6 text-2xl font-bold">Crear Curso</Text>
        <CreateCourseForm
          onSubmit={handleSubmit}
          onCancel={() => navigate({ to: '/courses' })}
          isLoading={loading}
          error={error}
          categories={categories}
          loadingCategories={loadingCategories}
        />
      </Card>
    </Page>
  );
}
