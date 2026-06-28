export interface ProfileAboutResponse {
  superpoder: string;
  cumpleanos: string;
  animal: string;
  talento: string;
}

export interface ProfileTutorResponse {
  nombre: string;
  email: string;
  telefono: string;
}

export interface ProfileBadgeResponse {
  id: number;
  name: string;
}

export interface ProfileActivityResponse {
  itemname: string;
  grade: string;
  grademax: string;
  dategraded: number;
}

export interface ProfileResponse {
  about: ProfileAboutResponse;
  family: ProfileTutorResponse[];
  badge_count: number;
  recent_badges: ProfileBadgeResponse[];
  recent_activity: ProfileActivityResponse[];
  student_count: number;
}
