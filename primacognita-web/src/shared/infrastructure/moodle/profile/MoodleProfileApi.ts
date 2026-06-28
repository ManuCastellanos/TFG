import type IMoodleProfileApi from './IMoodleProfileApi';
import type IMoodleClient from '@/shared/clients/IMoodleClient';
import type { Profile, UpdateProfileParams } from '@/modules/profile/domain/Profile';
import type { ProfileResponse } from '@/modules/profile/infrastructure/ProfileResponse';

export default class MoodleProfileApi implements IMoodleProfileApi {
  constructor(private readonly moodleClient: IMoodleClient) {}

  async getProfile(token: string): Promise<Profile> {
    const raw = await this.moodleClient.call<ProfileResponse>(
      token,
      'local_primacognita_get_user_profile',
      {},
    );
    return {
      about: {
        superpoder: raw.about.superpoder,
        cumpleanos: raw.about.cumpleanos,
        animal:     raw.about.animal,
        talento:    raw.about.talento,
      },
      family: raw.family.map((t) => ({
        nombre:   t.nombre,
        email:    t.email,
        telefono: t.telefono,
      })),
      badgeCount:     raw.badge_count,
      recentBadges:   raw.recent_badges.map((b) => ({ id: b.id, name: b.name })),
      recentActivity: raw.recent_activity.map((a) => ({
        itemname:   a.itemname,
        grade:      a.grade,
        grademax:   a.grademax,
        dategraded: a.dategraded,
      })),
      studentCount: raw.student_count,
    };
  }

  async updateProfile(token: string, params: UpdateProfileParams): Promise<void> {
    await this.moodleClient.call(token, 'local_primacognita_update_user_profile', {
      superpoder:      params.superpoder,
      cumpleanos:      params.cumpleanos,
      animal:          params.animal,
      talento:         params.talento,
      tutor1_nombre:   params.tutor1_nombre,
      tutor1_email:    params.tutor1_email,
      tutor1_telefono: params.tutor1_telefono,
      tutor2_nombre:   params.tutor2_nombre,
      tutor2_email:    params.tutor2_email,
      tutor2_telefono: params.tutor2_telefono,
    });
  }
}
