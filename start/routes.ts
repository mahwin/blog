/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from "@ioc:Adonis/Core/Route";

Route.get("/", async () => {
  return { hello: "world" };
});

Route.post("/auth/sign-up", "AuthController.SignUp");
Route.post("/auth/sign-in", "AuthController.SignIn");

Route.group(() => {
  Route.get("auth/verify-token", "AuthController.verifyToken");
  Route.get("auth/verify-email", "AuthController.verifyEmail");
  Route.get("auth/verify-display-name", "AuthController.verifyDisplayName");

  Route.get("/me", "MeController.getProfile"),
    Route.patch("/me", "MeController.updateProfile");
  Route.get("/me/posts", "MeController.getPosts");
  Route.get("/me/post/:slug", "MeController.getPost");
  Route.delete("/me", "MeController.leave");
  Route.post("/posts", "PostsController.create"),
    Route.patch("/posts/:slug", "PostsController.update"),
    Route.delete("/posts/:slug", "PostsController.delete");
}).middleware(["auth"]);

Route.get("/posts/:slug/comments", "CommentsController.list");
Route.post("/posts/:slug/comments", "CommentsController.create");
Route.patch("/posts/:slug/comments/:id", "CommentsController.update");
Route.delete("/posts/:slug/comments/:id", "CommentsController.delete");
Route.patch("/comments/:id", "CommentsController.update"); //shortcut
Route.delete("/comments/:id", "CommentsController.delete"); //shortcut

Route.get("/posts/:slug", "PostsController.read");
Route.get("/posts", "PostsController.list");
Route.get("/users/:displayName", "UsersController.list");
Route.get("/users/:displayName/:slug", "UsersController.read");
