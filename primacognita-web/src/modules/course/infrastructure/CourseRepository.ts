import type ICourseRepository from "@/modules/course/domain/ICourseRepository";
import type { Course } from "@/modules/course/domain/Course";
import type { CourseResponse } from "@/modules/course/infrastructure/CourseResponse";
import MoodleClient from "@/shared/clients/MoodleClient";


export default class MoodleCoursesRepository implements ICourseRepository {
  private readonly moodleClient: MoodleClient;

  constructor(moodleClient: MoodleClient = new MoodleClient()) {
    this.moodleClient = moodleClient;
  }

  async getUserCourses(userId: string, token: string): Promise<Course[]> {
    const response = await this.moodleClient.call<CourseResponse[]>(
      token,
      "core_enrol_get_users_courses",
      {
        userid: userId,
        returnusercount: "0",
      }
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
}