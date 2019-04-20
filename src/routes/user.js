import user from "../controllers/user";

export default app => {
  app.route("/user/register").post(user.register);

  app.route("/user/login").post(user.login);

  return app;
};
