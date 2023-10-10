import { EndpointView } from "@common";
import { Status, z } from "@deps";
import { createSessionCookie, isAuthorized } from "./login.services.ts";

export default EndpointView.init({
  method: "post",
  path: "/login",
  view: "",
  context: z.null().default(null),
  payload: {
    body: z.object({
      email: z.string().email(),
      password: z.string().min(1),
      redirectTo: z.string().min(1),
    }),
  },
}).registerHandler(function main(req, res) {
  const { redirectTo, email, password } = req.body;

  if (req.sessionCookie && !req.sessionCookie.isExpired()) {
    return res.redirect(redirectTo);
  }

  if (!isAuthorized(res.app.locals.config, email, password)) {
    return this.renderNotOk(
      Status.Unauthorized,
      res,
      `User ${email} is not authorized.`,
    );
  }

  const sessionCookie = createSessionCookie(email, res.app.locals.config);

  res.cookie(sessionCookie.name, sessionCookie.value, {
    expires: sessionCookie.expires,
    domain: sessionCookie.domain,
    secure: sessionCookie.secure,
  });

  res.locals.isLoggedIn = true;

  return res.redirect(redirectTo);
});
