import type { isTypedArray } from "util/types";

export interface User {
  id: string;
  username: string;
  firstName: string;
  fullName: string;
  avatarUrl: string | null;
  isTeacher: boolean;
}