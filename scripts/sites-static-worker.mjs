const withIndexFallback = (request) => {
  const url = new URL(request.url);
  if (url.pathname.endsWith("/")) url.pathname += "index.html";
  else if (!url.pathname.split("/").pop()?.includes(".")) url.pathname += "/index.html";
  return new Request(url, request);
};

const worker = {
  async fetch(request, env) {
    let response = await env.ASSETS.fetch(request);
    if (response.status === 404) response = await env.ASSETS.fetch(withIndexFallback(request));
    return response;
  },
};

export default worker;
