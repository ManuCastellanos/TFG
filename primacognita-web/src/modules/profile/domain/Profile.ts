export interface ProfileAbout {
  superpoder: string;
  cumpleanos: string;
  animal: string;
  talento: string;
}

export interface ProfileTutor {
  nombre: string;
  email: string;
  telefono: string;
}

export interface ProfileBadge {
  id: number;
  name: string;
}

export interface ProfileActivity {
  itemname: string;
  grade: string;
  grademax: string;
  dategraded: number;
}

export interface Profile {
  about: ProfileAbout;
  family: ProfileTutor[];
  badgeCount: number;
  recentBadges: ProfileBadge[];
  recentActivity: ProfileActivity[];
  studentCount: number;
}

export interface UpdateProfileParams {
  superpoder: string;
  cumpleanos: string;
  animal: string;
  talento: string;
  tutor1_nombre: string;
  tutor1_email: string;
  tutor1_telefono: string;
  tutor2_nombre: string;
  tutor2_email: string;
  tutor2_telefono: string;
}

export interface UpdateAccountParams {
  firstname: string;
  lastname: string;
  pictureFile?: File;
  userId: string;
}

export interface ChangePasswordParams {
  currentpassword: string;
  newpassword: string;
}
