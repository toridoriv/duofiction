import { useState } from "preact/hooks";
import { Handlers, RouteContext } from "$fresh/server.ts";

interface Data {
  subtitle: string;
}
export const handler: Handlers<unknown, Data> = {
  GET(req, ctx) {
    console.log(req);
    return ctx.render({ subtitle: "Home" }, {});
  },
};

export default function Home(_: Request, ctx: RouteContext) {
  // ctx.state.subtitle = "Home";
  return (
    <div class="px-4 py-8 mx-auto bg-[#86efac]">
      <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center">
        <h1 class="text-4xl font-bold">Welcome to Fresh</h1>
        <p class="my-4">
          Try updating this message in the
          <code class="mx-2">./routes/index.tsx</code> file, and refresh.
        </p>
      </div>
    </div>
  );
}
