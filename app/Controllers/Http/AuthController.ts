import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import User from "App/Models/User";

export default class AuthController {
  async SignUp({ request }: HttpContextContract) {
    //TODO : 데이터 유효성 검증
    const params = request.only(["email", "password", "displayName", "name"]);

    const user = User.create(params);
    return user;
  }

  async SignIn({ request, auth }: HttpContextContract) {
    //TODO : 데이터 유효성 검증
    const params = request.only(["email", "password"]);
    const token = await auth.use("api").attempt(params.email, params.password);
    const user = await User.findByOrFail("email", params.email);
    return { user, token };
  }
  async verifyToken() {
    return "Token 유효성 통과";
  }
  async verifyEmail({ request, response }: HttpContextContract) {
    const { email } = request.qs();
    const exist = await User.findBy("email", email);
    if (exist) {
      response.status(409);
      return { message: "존재하는 이메일 입니다." };
    }
    return "사용할 수 있는 이메일입니다.";
  }
  async verifyDisplayName({ request, response }: HttpContextContract) {
    const { displayName } = request.qs();
    const exist = await User.findBy("displayName", displayName);
    if (exist) {
      response.status(409);
      return { message: "이미 사용중인 display 이름입니다." };
    }
    return "사용할 수 있는 display 이름입니다.";
  }
}
