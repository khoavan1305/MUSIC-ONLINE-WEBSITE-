const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/artist/5400939/top?limit=1", // Thay thế '/api' bằng đường dẫn bạn muốn proxy
    createProxyMiddleware({
      target: "https://api.deezer.com", // Thay thế bằng URL mục tiêu của API của bạn
      changeOrigin: true,
    })
  );
};
