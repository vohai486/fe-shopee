// import Cookies from "cookies";
// import httpProxy from "http-proxy";
// import type { NextApiRequest, NextApiResponse } from "next";
// type Data = {
//   message: string;
// };
// const proxy = httpProxy.createProxyServer();
// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// export default function handler(
//   req: NextApiRequest,
//   res: NextApiResponse<Data>
// ) {
//   console.log(req.body);
//   console.log(JSON.parse(req.body));

//   if (req.method !== "POST") {
//     return res.status(404).json({
//       message: "method not supported",
//     });
//   }
//   return new Promise<void>((resolve) => {
//     // don't send cookies to API Server
//     req.headers.cookie = "";
//     proxy.once("proxyRes", (proxyRes, req, res) => {
//       let body = "";
//       proxyRes.on("data", function (chuck) {
//         body += chuck;
//         console.log("chuck", chuck);
//       });
//       proxyRes.on("end", function () {
//         console.log(1);
//         try {
//           console.log(2);
//           const isSuccess =
//             proxyRes.statusCode &&
//             proxyRes.statusCode >= 200 &&
//             proxyRes.statusCode < 300;
//           console.log(proxyRes.statusCode);

//           if (!isSuccess) {
//             (res as NextApiResponse)
//               .status(proxyRes.statusCode || 500)
//               .json(JSON.parse(body));

//             return resolve();
//           }
//           console.log("body", body);
//           console.log(JSON.parse(body));
//           const {
//             metadata: {
//               tokens: { accessToken, refreshToken },
//               user,
//             },
//           } = JSON.parse(body);
//           console.log("access", { accessToken, refreshToken });
//           // convert token to cookies
//           const cookies = new Cookies(req, res, {
//             secure: process.env.NODE_ENV === "production",
//           });
//           console.log(cookies);
//           cookies.set("access_token", accessToken, {
//             httpOnly: true,
//             sameSite: "lax",
//             expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2days
//           });
//           cookies.set("refresh_token", refreshToken, {
//             httpOnly: true,
//             sameSite: "lax",
//             expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7days
//           });

//           (res as NextApiResponse).status(200).json({
//             message: "successfully",
//             metadata: user,
//           });
//         } catch (error) {
//           (res as NextApiResponse).status(500).json({
//             message: "something went wrong",
//           });
//         }
//       });
//     });

//     proxy.web(req, res, {
//       target: `${process.env.API_URL}/v1`,
//       changeOrigin: true,
//       // autoRewrite: false,
//       selfHandleResponse: true, // tự handler response trả về từ server
//     });

//     // res.status(200).json({ name: "PATH - Match all here" });
//   });
// }
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import httpProxy from "http-proxy";
import type { NextApiRequest, NextApiResponse } from "next";
type Data = {
  message: string;
};
const proxy = httpProxy.createProxyServer({});
export const config = {
  api: {
    bodyParser: false,
  },
};
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "POST") {
    return res.status(404).json({
      message: "method not supported",
    });
  }
  return new Promise<void>((resolve) => {
    console.log("login");
    // don't send cookies to API Server
    req.headers.cookie = "";

    //  khi có response trả về nó chạy vào hàm này
    proxy.once("proxyRes", (proxyRes, req, res) => {
      let body = "";
      proxyRes.on("data", function (chuck) {
        body += chuck;
        console.log("chuck", chuck);
      });
      console.log("body", body);
      proxyRes.on("end", function () {
        try {
          const isSuccess =
            proxyRes.statusCode &&
            proxyRes.statusCode >= 200 &&
            proxyRes.statusCode < 300;

          if (!isSuccess) {
            (res as NextApiResponse)
              .status(proxyRes.statusCode || 500)
              .json(body);
            return resolve();
          }
          console.log("body", body);
          console.log(JSON.parse(body));

          // convert token to cookies
          // const cookies = new Cookies(req, res, {
          //   secure: process.env.NODE_ENV === "production",
          // });
          // cookies.set("access_token", accessToken, {
          //   httpOnly: true,
          //   sameSite: "lax",
          //   expires: new Date(expiredAt),
          // });

          // - API server ko có API logout. nó chỉ cung cấp JWT, rồi bên client tự lưu mà dùng, khi ko cần nữa thì xoá token đi là được.
          // - NextJS server của mình mới là ông thần dựng nên cookies,
          // mà cookies với httpOnly chỉ được can thiệp từ phía server,
          //   nên chỉ có server mới xoá được cookie đó. Thành ra BẮT BUỘC phải có hàm logout() để gọi lên nhờ xoá cookies đi nhen Hà.

          // (res as NextApiResponse).status(200).json({
          //   message: "login successfully",
          // });
          (res as NextApiResponse).status(200).json({
            message: "successfully",
          });
        } catch (error) {
          (res as NextApiResponse).status(500).json({
            message: "something went wrong",
          });
        }
      });
    });

    proxy.web(req, res, {
      target: `${process.env.API_URL}/v1`,
      changeOrigin: true,
      selfHandleResponse: true, // tự handler response trả về từ server
    });

    // res.status(200).json({ name: "PATH - Match all here" });
  });
}
