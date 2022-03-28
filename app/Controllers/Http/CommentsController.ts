import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Comment from "App/Models/Comment";
import Post from "App/Models/Post";

export default class CommentsController {
  async list({ params }: HttpContextContract) {
    const { slug } = params;
    const post = await Post.findByOrFail("slug", slug);
    return await Comment.query()
      .preload("user")
      .preload("comments")
      .orderBy("created_at", "asc")
      .where("post_id", post.id)
      .whereNull("parent_id")
      .exec();
  }
  async create({ auth, params, request }: HttpContextContract) {
    const { slug } = params;
    const content = request.input("content");
    const parentId = request.input("parentId");
    const post = await Post.findByOrFail("slug", slug);

    console.log(post);
    return await Comment.create({
      userId: auth.user?.id,
      postId: post.id,
      content,
      parentId,
    });
  }
  async update({ bouncer, request, params }: HttpContextContract) {
    const { id } = params;
    const comment = await Comment.findOrFail(id);
    await bouncer.with("CommentPolicy").authorize("update", comment);
    const content = request.input("content");
    comment.content = content;
    await comment.save();
    return comment;
  }
  async delete({ bouncer, params }: HttpContextContract) {
    const { id } = params;
    const comment = await Comment.findOrFail(id);
    await bouncer.with("CommentPolicy").authorize("delete", comment);
    await comment.delete();
    return "댓글 삭제 완료!";
  }
}
