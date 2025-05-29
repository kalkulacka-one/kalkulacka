export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname.startsWith("/.well-known/matrix")) {
      let response = await env.ASSETS.fetch(request);
      response = new Response(response.body, response);
      response.headers.set("Content-Type", "application/json");
      return response;
    }

    url.hostname = `www.${url.hostname}`;
    return Response.redirect(url.toString(), 301);
  },
};
