import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const salt = bcrypt.genSaltSync();
  // im the backend, im making the fx, if you want to sign in you must provide email and pw
  const { email, password } = req.body;

  // attempt make user
  let user;

  // might fail if email exist but dont want process to error out if they do have email arleady.
  try {
    user = await prisma.user.create({
      data: {
        email,
        password: bcrypt.hashSync(password, salt),
      },
    });
  } catch (e) {
    res.status(401);
    // so on front end can always check .error to get error msg
    res.json({
      error: "User already exists",
    });
  }
  // assume user was created, make token now
  // token = jwt.sign -> 1) payload, what object you want to hash 2) secret = this is how i know my server created this thing, technically can in env variable, somewhere in store it.. in prod probably 3?) options
  const token = jwt.sign(
    {
      email: user.email,
      id: user.id,
      time: Date.now(),
    },
    "hello",
    { expiresIn: "8h" }
  );

  // last, set this jwt in a cookie. if you set in cookie while in request, when you send response back, itll be in that persons browser
  // env var later, or at least constant file
  res.setHeader(
    "Set-Cookie",
    cookie.serialize("TRAX_ACCESS_TOKEN", token, {
      httpOnly: true,
      maxAge: 8 * 60 * 60,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    })
  );

  return res.json(user);
};
