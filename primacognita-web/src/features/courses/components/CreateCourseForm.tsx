import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Input } from '@/components/input/Input';
import { Banner } from '@/components/banner/Banner';
import { Button } from '@/components/button/Button';
import { CategoryDropdown } from './CategoryDropdown';
import { dateStringToUnix } from '../utils/course.utils';
import type { CourseCategory } from '@/modules/course/domain/CourseCategory';
import type { CreateCourseInput } from '@/modules/course/domain/CreateCourseInput';

const FieldError = ({ message }: { message?: string }) =>
  message ? <p className="text-sm text-red-500">{message}</p> : null;

type FormValues = {
  fullname: string;
  shortname: string;
  categoryId: string;
  summary: string;
  visible: '0' | '1';
  startdate: string;
  enddate: string;
  idnumber: string;
};

type Props = {
  onSubmit: (input: CreateCourseInput, imageFile?: File) => void;
  onCancel: () => void;
  isLoading: boolean;
  error: string | null;
  categories: CourseCategory[];
  loadingCategories: boolean;
};

export const CreateCourseForm = ({ onSubmit, onCancel, isLoading, error, categories, loadingCategories }: Props) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({ defaultValues: { visible: '1' } });

  const [imageFile, setImageFile] = useState<File | null>(null);

  const submit = ({ fullname, shortname, categoryId, summary, visible, startdate, enddate, idnumber }: FormValues) => {
    const input: CreateCourseInput = {
      fullname,
      shortname,
      categoryId,
      summary: summary || null,
      visible: Number(visible) as 0 | 1,
      ...(startdate && { startdate: dateStringToUnix(startdate) }),
      ...(enddate && { enddate: dateStringToUnix(enddate) }),
      ...(idnumber && { idnumber: Number(idnumber) }),
    };
    onSubmit(input, imageFile ?? undefined);
  };

  return (
    <>
      {error && <Banner variant="error">{error}</Banner>}

      <form onSubmit={handleSubmit(submit)} className="mt-6 space-y-4">
        <div className="space-y-1">
          <Input
            {...register('fullname', { required: 'El nombre completo es obligatorio' })}
            placeholder="Nombre completo"
          />
          <FieldError message={errors.fullname?.message} />
        </div>

        <div className="space-y-1">
          <Input
            {...register('shortname', { required: 'El nombre corto es obligatorio' })}
            placeholder="Nombre corto"
          />
          <FieldError message={errors.shortname?.message} />
        </div>

        <div className="space-y-1">
          <Controller
            name="categoryId"
            control={control}
            rules={{ required: 'La categoría es obligatoria' }}
            render={({ field }) => (
              <CategoryDropdown
                categories={categories}
                loading={loadingCategories}
                onChange={field.onChange}
              />
            )}
          />
          <FieldError message={errors.categoryId?.message} />
        </div>

        <Input {...register('summary')} placeholder="Descripción" />
        <Input type="date" {...register('startdate')} placeholder="Fecha de inicio" />
        <Input type="date" {...register('enddate')} placeholder="Fecha de fin" />
        <Input {...register('idnumber')} placeholder="Número de identificación" />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
        />

        <div className="flex gap-3">
          <Button type="button" onClick={onCancel}>Cancelar</Button>
          <Button type="submit" disabled={isLoading}>{isLoading ? 'Creando...' : 'Crear'}</Button>
        </div>
      </form>
    </>
  );
};
