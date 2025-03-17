export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    url.hostname = `www.${url.hostname}`;
    return Response.redirect(url.toString(), 301);
  },
};
