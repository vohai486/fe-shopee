// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import httpProxy from "http-proxy";
import Cookies from "cookies";
import { Headers } from "@/constants";
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
  return new Promise<void>((resolve) => {
    // const cookies = new Cookies(req, res);

    // const accessToken = cookies.get("access_token");
    // req.url = (req.url as string).replace(/^\/api/, "");

    // if (accessToken) {
    //   req.headers[Headers.AUTHORIZATION] = accessToken;
    // }
    // req.headers.cookie = "";

    // convert cookies to header Authorization
    proxy.web(req, res, {
      target: API_URL,
      // autoRewrite: false,
      changeOrigin: true,
      selfHandleResponse: false, // trả về response từ server cho client luôn proxy kh xử lý
    });
    // res.status(200).json({ name: "PATH - Match all here" });
    //  khi có response trả về nó sẽ báo hàm handler
    // proxy.once("proxyRes", () => {
    //   resolve();
    // });
  });
}
