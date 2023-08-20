// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import httpProxy from "http-proxy";
import Cookies from "cookies";
const proxy = httpProxy.createProxyServer({});
export const config = {
  api: {
    bodyParser: false,
  },
};

const API_URL = `${process.env.API_URL}/v1`;
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method !== "POST") {
    return res.status(404).json({
      message: "method not supported",
    });
  }
  return new Promise<void>((resolve) => {
    // req.url = (req.url as string).replace(/^\/api/, "");
    req.headers.cookie = "";

    proxy.once("proxyRes", (proxyRes, req, res) => {
      // Read the API's response body from
      // the stream:
      let body = "";
      proxyRes.on("data", function (chunk) {
        body += chunk;
      });

      proxyRes.on("end", () => {
        try {
          // Extract the authToken from API's response:
          const isSuccess =
            proxyRes.statusCode &&
            proxyRes.statusCode >= 200 &&
            proxyRes.statusCode < 300;
          if (!isSuccess) {
            (res as NextApiResponse)
              .status(proxyRes.statusCode || 500)
              .json(JSON.parse(body));
            return resolve();
          }

          const {
            metadata: {
              tokens: { accessToken, refreshToken },
              user,
            },
          } = JSON.parse(body);
          // convert token to cookies
          const cookies = new Cookies(req, res, {
            secure: process.env.NODE_ENV === "production",
          });
          cookies.set("access_token", accessToken, {
            httpOnly: true,
            sameSite: "lax",
            expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2days
          });
          cookies.set("refresh_token", refreshToken, {
            httpOnly: true,
            sameSite: "lax",
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7days
          });

          (res as NextApiResponse).status(200).json({
            message: "successfully",
            metadata: user,
          });
          return resolve();
        } catch (err) {
          (res as NextApiResponse).status(500).json({
            message: "something went wrong",
          });
        }
      });
    });
    // convert cookies to header Authorization
    proxy.web(req, res, {
      target: API_URL,
      // autoRewrite: false,
      changeOrigin: true,
      selfHandleResponse: true, // trả về response từ server cho client luôn proxy kh xử lý
    });
    // res.status(200).json({ name: "PATH - Match all here" });
    //  khi có response trả về nó sẽ báo hàm handler
    // proxy.once("proxyRes", () => {
    //   resolve();
    // });
  });
}
