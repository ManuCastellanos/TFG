import AuthStorage from "@/modules/login/infrastructure/AuthStorage";
import { useUserCourses } from "./useUserCourses";

export default function Dashboard() {
  const session = AuthStorage.get();

  const userId = session?.userId ?? null;
  const token = session?.token ?? null;

  const { courses, categoryNameById, loading, error } = useUserCourses(userId, token);

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      <div className="mt-6">
        {loading && <p className="text-slate-600">Cargando cursos...</p>}
        {error && <p className="text-red-600">Error: {error}</p>}

        {!loading && !error && (
          <ul className="mt-4 space-y-2">
            {courses.map((c) => (
              <li key={c.id} className="rounded-lg bg-white p-4 shadow-sm">
                <div className="font-medium">{c.fullname}</div>
                <div className="text-sm text-slate-600">{categoryNameById[c.categoryId ?? ""] ?? c.categoryId}</div>
                {c.imageUrl && (
                  <img
                    className="mt-3 h-32 w-full rounded-md object-cover"
                    src={c.imageUrl}
                    alt={c.fullname}
                  />
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}