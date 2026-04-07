import React, { useEffect, useRef, useState, useId } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Page } from "@/components/page/Page";
import { Card } from "@/components/card/Card";
import { Banner } from "@/components/banner/Banner";
import { Button } from "@/components/button/Button";
import { Input } from "@/components/input/Input";
import { Text } from "@/components/text/Text";
import { useSession } from "@/shared/hooks/useSession";
import { useCreateCourse } from "./hooks/useCreateCourse";
import { useAllCategories } from "./hooks/useAllCategories";
import type { Course } from "@/modules/course/domain/Course";

export default function CreateCourse() {
  const navigate = useNavigate();
  const { token, userId } = useSession();

  const { createCourse, loading, error: createError } = useCreateCourse(token, userId);
  const { categories, loading: categoriesLoading } = useAllCategories(token);

  const [fullname, setFullname] = useState("");
  const [shortname, setShortname] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [categorySearch, setCategorySearch] = useState("");
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [visible, setVisible] = useState<0 | 1>(1);
  const [startdate, setStartdate] = useState("");
  const [enddate, setEnddate] = useState("");
  const [idnumber, setIdnumber] = useState("");
  const [summary, setSummary] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const categoryRef = useRef<HTMLDivElement>(null);
  const fileInputId = useId();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) {
        setCategoryDropdownOpen(false);
      }
    };
    if (categoryDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [categoryDropdownOpen]);

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(categorySearch.toLowerCase()),
  );

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!fullname.trim() || !shortname.trim() || !categoryId) {
      setFormError("Por favor completa todos los campos obligatorios.");
      return;
    }

    const course: Course = {
      id: "",
      fullname,
      shortname,
      categoryId,
      imageUrl: null,
      summary: summary.trim() || null,
      progress: null,
      completed: false,
      visible,
      ...(startdate ? { startdate: Math.floor(new Date(startdate).getTime() / 1000) } : {}),
      ...(enddate ? { enddate: Math.floor(new Date(enddate).getTime() / 1000) } : {}),
      ...(idnumber ? { idnumber: Number(idnumber) } : {}),
    };

    try {
      await createCourse(course, imageFile ?? undefined);
      navigate({ to: "/courses" });
    } catch {
      // error already set in useCreateCourse
    }
  };

  const displayedError = formError ?? createError;

  return (
    <Page>
      <Card variant="default" className="w-full max-w-lg">
        <Text className="mb-6 text-2xl font-bold text-(--fg)">Crear Curso</Text>

        {displayedError && <Banner variant="error">{displayedError}</Banner>}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Input
            type="text"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            placeholder="Nombre completo"
            required
          />

          <Input
            type="text"
            value={shortname}
            onChange={(e) => setShortname(e.target.value)}
            placeholder="Nombre corto"
            required
          />

          {/* Searchable category dropdown */}
          <div className="relative" ref={categoryRef}>
            <Input
              type="text"
              value={categorySearch}
              onChange={(e) => {
                setCategorySearch(e.target.value);
                setCategoryId(null);
                setCategoryDropdownOpen(true);
              }}
              onFocus={() => setCategoryDropdownOpen(true)}
              placeholder="Categoría"
              required
            />
            {categoryDropdownOpen && (
              <div className="absolute left-0 top-full z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-xl border border-(--border) bg-(--surface) shadow-(--shadow-md)">
                {categoriesLoading && (
                  <p className="px-4 py-2.5 text-sm text-(--muted)">Cargando...</p>
                )}
                {!categoriesLoading && filteredCategories.length === 0 && (
                  <p className="px-4 py-2.5 text-sm text-(--muted)">Sin resultados</p>
                )}
                {filteredCategories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    className="w-full px-4 py-2.5 text-left text-sm text-(--fg) transition-colors hover:bg-(--surface-muted)"
                    onClick={() => {
                      setCategoryId(cat.id);
                      setCategorySearch(cat.name);
                      setCategoryDropdownOpen(false);
                    }}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Visibility */}
          <div className="flex items-center gap-3">
            <input
              id="visible"
              type="checkbox"
              checked={visible === 1}
              onChange={(e) => setVisible(e.target.checked ? 1 : 0)}
              className="size-4 rounded border-(--border) accent-(--primary)"
            />
            <label htmlFor="visible" className="text-sm text-(--fg)">
              Visible
            </label>
          </div>

          <Input
            type="date"
            value={startdate}
            onChange={(e) => setStartdate(e.target.value)}
            placeholder="Fecha de inicio"
          />

          <Input
            type="date"
            value={enddate}
            onChange={(e) => setEnddate(e.target.value)}
            placeholder="Fecha de fin"
          />

          <Input
            type="number"
            value={idnumber}
            onChange={(e) => setIdnumber(e.target.value)}
            placeholder="Número ID"
          />

          <Input
            type="text"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Descripción"
          />

          <div className="space-y-2">
            <Text className="text-sm font-semibold">Imagen del curso (opcional)</Text>
            <div className="flex items-center gap-3">
              <input
                id={fileInputId}
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                className="hidden"
              />
              <label
                htmlFor={fileInputId}
                className="cursor-pointer rounded-xl border border-(--border) bg-(--surface) px-4 py-2 text-sm text-(--fg) transition-colors hover:bg-(--surface-muted)"
              >
                Seleccionar imagen
              </label>
              <Text className="text-sm text-(--muted) truncate">
                {imageFile ? imageFile.name : "Ningún archivo seleccionado"}
              </Text>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate({ to: "/courses" })}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creando..." : "Crear curso"}
            </Button>
          </div>
        </form>
      </Card>
    </Page>
  );
}
