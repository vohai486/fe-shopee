import type { NextApiRequest, NextApiResponse } from "next";
import Cookies from "cookies";

export const config = {
  api: {
    bodyParser: false,
  },
};
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method !== "POST") {
    return res.status(404).json({
      message: "method not supported",
    });
  }
  const cookies = new Cookies(req, res, {
    secure: process.env.NODE_ENV === "production",
  });
  cookies.set("access_token");
  cookies.set("refresh_token");
  res.status(200).json({
    message: "logout successfully",
  });
}
