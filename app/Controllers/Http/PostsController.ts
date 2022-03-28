import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Post from "App/Models/Post";
import User from "App/Models/User";
import { DateTime } from "luxon";
import uid from "tiny-uid";

function createSlug(subject) {
  let slug = subject.trim().replace(/\s/gi, "-");
  if (slug.length > 27) slug = slug.substr(0, 28);
  slug = encodeURIComponent(slug);
  slug += `-${uid()}`;
  return slug;
}

export default class PostsController {
  async list({ request }: HttpContextContract) {
    //1. displayName이 없는 전체 목록 요청
    //2. displayName을 기준으로 필터링
    const { displayName, page, perPage } = request.qs();
    let query = Post.query()
      .preload("user")
      .where("publish_at", "<=", DateTime.now().toISO())
      .orderBy("publish_at", "desc");

    if (displayName) {
      const user = await User.findByOrFail("display_name", displayName);
      query = query.where("user_id", user.id);
    }
    const posts = await query.paginate(page || 1, perPage || 12);
    return posts;
  }

  async create({ auth, request }: HttpContextContract) {
    const subject = request.input("subject");
    const content = request.input("content");
    const userId = auth.user?.id;
    // slug는 서버단에서 자동 생성 -> request input 없을 것이란 의미!!
    // public at에 대해서 어떤게 시간을 받을 것이냐는 규칙이 필요함
    // ex 2021-07-10 11:12:13 이런식일수도 있고
    // '2022-03-27T05:25:29.231Z' utc 0 기준으로 시간이 들어올 수도 있고
    // 1648358784752 new Date().getTime()하면 초 단위로 나옴!
    //ios string으로 받는 다고 가정하고 계산해보자!!

    const publishAt = request.input("publishAt", DateTime.now().toISO());
    //trim()으로 공백 제거

    //encodeURIComponent하면 한 글자가 총 9자리 문자가 됨 255가 글자수 였으니까 255/9하면 28.33임

    //TODO - 중복 슬러그 발생하지 않도록 처리가 필요합니다!
    const slug = createSlug(subject);

    const post = await Post.create({
      userId,
      subject,
      content,
      slug,
      publishAt,
    });

    return post;
  }
  async read({ params, response }: HttpContextContract) {
    const { slug } = params;
    const post = await Post.query()
      .preload("user")
      .where("publish_at", "<=", DateTime.now().toISO())
      .where("slug", slug)
      .firstOrFail();
    return post;
  }

  async update({ bouncer, request, params }: HttpContextContract) {
    const { slug } = params;
    const post = await Post.findOrFail(slug);

    //await bouncer.authorize("editPost", post);
    await bouncer.with("PostPolicy").authorize("update", post);

    const subject = request.input("subject");
    const content = request.input("content");
    const publishAt = request.input("publishAt");

    if (subject) {
      if (post.subject !== subject) {
        post.slug = createSlug(subject);
      }
      post.subject = subject;
    }
    if (content) post.content = content;
    if (publishAt) post.publishAt = publishAt;

    return await post.save();
  }
  async delete({ bouncer, params }) {
    const { slug } = params;
    const post = await Post.findByOrFail("slug", slug);
    //await bouncer.authorize("deletePost", post);
    await bouncer.with("PostPolicy").authorize("delete", post);
    await post.delete();
    return "삭제 되었습니다.";
  }
}
