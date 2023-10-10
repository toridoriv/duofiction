import { EndpointView } from "@common";
import { z } from "@deps";
import { removeSessionCookie } from "./login.services.ts";

export default EndpointView.init({
  method: "post",
  path: "/logout",
  view: "",
  context: z.null().default(null),
  payload: {
    body: z.object({
      redirectTo: z.string().min(1),
    }),
  },
}).registerHandler(function main(req, res) {
  const { redirectTo } = req.body;
  res.locals.isLoggedIn = false;

  if (!req.sessionCookie) {
    return res.redirect(redirectTo);
  }

  removeSessionCookie(req.sessionCookie.email);

  return res.clearCookie(req.sessionCookie.name).redirect(redirectTo);
});
