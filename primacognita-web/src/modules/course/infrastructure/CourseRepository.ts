import type ICourseRepository from "@/modules/course/domain/ICourseRepository";
import type IMoodleClient from "@/shared/clients/IMoodleClient";
import type { Course, CourseId } from "@/modules/course/domain/Course";
import type { CourseResponse, CreateCourseResponse } from "@/modules/course/infrastructure/CourseResponse";
import type { CourseCategory, CourseCategoryId } from "@/modules/course/domain/CourseCategory";
import type { CategoryResponse } from "@/modules/course/infrastructure/CategoryResponse";
import { env } from "@/shared/utils/env";

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
      progress: c.progress ?? null,
      completed: c.completed === 1,
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
  
  async createCourse(token: string, input: Course): Promise<CourseId> {
    const params: Record<string, string> = {
      "courses[0][fullname]": input.fullname,
      "courses[0][shortname]": input.shortname,
      "courses[0][categoryid]": input.categoryId ?? "1",
    };
    if (input.summary != null) params["courses[0][summary]"] = input.summary;
    if (input.visible != null) params["courses[0][visible]"] = String(input.visible);
    if (input.startdate != null) params["courses[0][startdate]"] = String(input.startdate);
    if (input.enddate != null) params["courses[0][enddate]"] = String(input.enddate);
    if (input.idnumber != null) params["courses[0][idnumber]"] = String(input.idnumber);

    const response = await this.moodleClient.call<CreateCourseResponse[]>(
      token,
      "core_course_create_courses",
      params,
    );
    return String(response[0].id);
  }

  async updateCourse(token: string, input: Course): Promise<void> {
    const params: Record<string, string> = {
      "courses[0][id]": input.id,
      "courses[0][fullname]": input.fullname,
      "courses[0][shortname]": input.shortname,
    };
    if (input.categoryId != null) params["courses[0][categoryid]"] = input.categoryId;
    if (input.summary != null) params["courses[0][summary]"] = input.summary;
    if (input.visible != null) params["courses[0][visible]"] = String(input.visible);
    if (input.startdate != null) params["courses[0][startdate]"] = String(input.startdate);
    if (input.enddate != null) params["courses[0][enddate]"] = String(input.enddate);
    if (input.idnumber != null) params["courses[0][idnumber]"] = String(input.idnumber);

    await this.moodleClient.call<null>(
      token,
      "core_course_update_courses",
      params,
    );
  }

  async uploadCourseImage(token: string, file: File): Promise<number> {
    const { itemid } = await this.moodleClient.call<{ itemid: number }>(
      token,
      "core_files_get_unused_draft_itemid",
      {},
    );

    const formData = new FormData();
    formData.append("token", token);
    formData.append("itemid", String(itemid));
    formData.append("file_1", file, file.name);

    const res = await fetch(`${env.baseUrl}/webservice/upload.php`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      throw new Error(`Upload failed: ${res.statusText}`);
    }

    return itemid;
  }

  async getAllCategories(token: string): Promise<CourseCategory[]> {
    const response = await this.moodleClient.call<CategoryResponse[]>(
      token,
      "core_course_get_categories",
      {},
    );
    return response.map((c) => ({ id: String(c.id), name: c.name }));
  }
  
}
