import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";

export function middleware(req: NextRequest, ev: NextFetchEvent) {
  if (req.cookies["poll-token"]) return;

  const random = nanoid();

  const res = NextResponse.next();

  res.cookie("poll-token", random, { sameSite: "strict" });

  return res;
}
