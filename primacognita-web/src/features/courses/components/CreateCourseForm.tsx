import { useEffect, useRef, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input/Input';
import { Alert } from '@/components/ui/alert/Alert';
import { Button } from '@/components/ui/button/Button';
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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
    setPreviewUrl(file ? URL.createObjectURL(file) : null);
  };

  const handleRemoveImage = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setImageFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

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
      {error && <Alert variant="error">{error}</Alert>}

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
              <CategoryDropdown categories={categories} loading={loadingCategories} onChange={field.onChange} />
            )}
          />
          <FieldError message={errors.categoryId?.message} />
        </div>

        <Input {...register('summary')} placeholder="Descripción" />
        <Input type="date" {...register('startdate')} placeholder="Fecha de inicio" />
        <Input type="date" {...register('enddate')} placeholder="Fecha de fin" />
        <Input {...register('idnumber')} placeholder="Número de identificación" />

        <div className="space-y-3">
          <p className="text-sm font-medium">Imagen del curso</p>
          <div className="flex items-center gap-3">
            <input
              id="course-image-input"
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageChange}
            />
            <label
              htmlFor="course-image-input"
              className="cursor-pointer inline-flex items-center px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Seleccionar imagen
            </label>
            {imageFile && (
              <button
                type="button"
                onClick={handleRemoveImage}
                className="inline-flex items-center justify-center size-8 text-red-500 hover:text-red-700 rounded-full hover:bg-red-50 transition-colors"
              >
                ✕
              </button>
            )}
          </div>
          {previewUrl && (
            <div className="inline-block">
              <img src={previewUrl} alt="Preview" className="w-48 h-32 object-cover rounded-lg border" />
              <p className="mt-1 text-xs text-zinc-500 truncate max-w-48">{imageFile?.name}</p>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <Button variant="outline" size="md" type="button" onClick={onCancel}>
            Cancelar
          </Button>
          <Button size="md" type="submit" disabled={isLoading}>
            {isLoading ? 'Creando...' : 'Crear'}
          </Button>
        </div>
      </form>
    </>
  );
};
