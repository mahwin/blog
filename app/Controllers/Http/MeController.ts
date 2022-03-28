import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Post from "App/Models/Post";
import User from "App/Models/User";

export default class MeController {
  async getProfile({ auth }: HttpContextContract) {
    return auth.user;
  }
  async updateProfile({ auth, request, response }: HttpContextContract) {
    //name 변경 가능
    //avartar 변경 가능
    //displayName 변경 가능

    const displayName = request.input("displayName").trim();
    const name = request.input("name");
    const avatar = request.input("avatar");

    const params = {
      displayName,
      name,
      avatar,
    };

    //변경이 가능한 이름인지 확인 필요
    if (displayName && displayName !== auth.user?.displayName) {
      const exist = await User.findBy("displayName", displayName);
      console.log(exist);
      if (exist) {
        response.status(409);
        return { message: `${displayName}은 사용중인 이름입니다.` };
      }
    }

    auth.user?.merge(params);
    await auth.user?.save();
    return auth.user;
  }
  async leave({ auth }) {
    await auth.user?.delete();
    return "계정이 삭제 되었습니다.";
  }

  async getPosts({ auth, request }) {
    const { page, perPage } = request.qs();
    return await Post.query()
      .orderBy("publish_at", "desc")
      .where("userId", auth.user?.id)
      .paginate(page || 1, perPage || 12);
  }
  async getPost({ auth, params }) {
    const { slug } = params;
    return await Post.query()
      .where("user_id", auth.user?.id)
      .where("slug", slug)
      .firstOrFail();
  }
}
