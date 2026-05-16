import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Alert } from '@/components/ui/alert/Alert';
import { Page } from '@/components/ui/page/Page';
import { useCourses } from '../hooks/useCourses';
import { useCourseFilters } from '../hooks/useCourseFilters';
import CoursesToolbar from '../components/CoursesToolbar';
import CoursesGrid from '../components/CoursesGrid';
import { CreateCourseModal } from '../components/CreateCourseModal';

export default function CoursesPage() {
  const navigate = useNavigate();
  const { courses, loading, error, isTeacher } = useCourses();
  const { filter, search, setFilter, setSearch, filteredCourses, pendingCount } = useCourseFilters(courses);
  const [showModal, setShowModal] = useState(false);

  return (
    <Page>
      <CoursesToolbar
        coursesCount={courses.length}
        pendingCount={pendingCount}
        filter={filter}
        search={search}
        isTeacher={isTeacher}
        onFilterChange={setFilter}
        onSearchChange={setSearch}
        onCreateCourse={() => setShowModal(true)}
      />

      {error && <Alert variant="error">{error}</Alert>}

      <CoursesGrid
        loading={loading}
        courses={filteredCourses}
        isTeacher={isTeacher}
        onCourseClick={(id) => navigate({ to: '/courses/$id', params: { id } })}
        onCreateCourse={() => setShowModal(true)}
      />

      {showModal && (
        <CreateCourseModal onClose={() => setShowModal(false)} onCreated={() => setShowModal(false)} />
      )}
    </Page>
  );
}
