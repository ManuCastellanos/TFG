import type ICourseRepository from "@/modules/course/domain/ICourseRepository";
import type IMoodleClient from "@/shared/clients/IMoodleClient";
import type { Course } from "@/modules/course/domain/Course";
import type { CourseResponse } from "@/modules/course/infrastructure/CourseResponse";
import type { CourseCategory, CourseCategoryId } from "@/modules/course/domain/CourseCategory";
import type { CategoryResponse } from "@/modules/course/infrastructure/CategoryResponse";

export default class CoursesRepository implements ICourseRepository {
  constructor(private readonly moodleClient: IMoodleClient) { }
  
  async getUserCourses(userId: string, token: string): Promise<Course[]> {
    const response = await this.moodleClient.call<CourseResponse[]>(
      token,
      "core_enrol_get_users_courses",
      { userid: userId, returnusercount: "0" },
    );
    return response.map((c) => ({
      id: String(c.id),
      fullname: c.fullname,
      shortname: c.shortname,
      categoryId: c.category != null ? String(c.category) : null,
      imageUrl: c.courseimage ?? null,
      summary: c.summary ?? null,
    }));
  }

  async getCourseCategories(token: string, ids: CourseCategoryId[]): Promise<CourseCategory[]> {
    const cleanedIds = ids.filter((id) => id.trim().length > 0);
    const uniqueIds = Array.from(new Set(cleanedIds));

    if (uniqueIds.length === 0) {
      return [];
    }

    const response = await this.moodleClient.call<CategoryResponse[]>(
      token,
      "core_course_get_categories",
      {
        "criteria[0][key]": "ids",
        "criteria[0][value]": uniqueIds.join(","),
        addsubcategories: "0",
      },
    );

    return response.map((c) => ({ id: String(c.id), name: c.name }));
  }
}
