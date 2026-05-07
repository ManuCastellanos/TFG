import { useSession } from "@/shared/hooks/useSession";
import { useCurrentUser } from "@/shared/hooks/useCurrentUser";
import { useUserCourses } from "@/shared/hooks/useUserCourses";

export const useDashboard = () => {
  const { userId, token } = useSession();
  const { user } = useCurrentUser();
  const { courses } = useUserCourses(userId, token);

  return {
    user,
    courses,
  };
};