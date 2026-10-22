import { NextResponse } from "next/server";
import { randomBytes, scryptSync } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE, createSessionToken } from "@/lib/session";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    const name = String(body.name || "").trim();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Введите корректный email" }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: "Пароль должен быть не короче 6 символов" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Пользователь с таким email уже есть" }, { status: 409 });
    }

    const salt = randomBytes(16).toString("hex");
    const hash = scryptSync(password, salt, 64).toString("hex");

    const user = await prisma.user.create({
      data: { email, passwordHash: `${salt}:${hash}`, name: name || null },
    });

    const token = await createSessionToken(user.id);
    const response = NextResponse.json({ ok: true });
    response.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      secure: process.env.NODE_ENV === "production",
    });
    return response;
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
