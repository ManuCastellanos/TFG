import type IUserRepository from "@/modules/user/domain/IUserRepository";
import type { User } from "@/modules/user/domain/User";
import type { UserResponse } from "@/modules/user/infrastructure/UserResponse";
import type IMoodleClient from "@/shared/clients/IMoodleClient";

export default class UserRepository implements IUserRepository {
  constructor(private readonly moodleClient: IMoodleClient) {}

  async getCurrentUser(token: string): Promise<User> {
    const response = await this.moodleClient.call<UserResponse>(
      token,"core_webservice_get_site_info",{},
    );

    return {
      id: String(response.userid),
      fullName: response.fullname,
      username: response.username,
      avatarUrl: response.userpictureurl ?? null,
    };
  }
}