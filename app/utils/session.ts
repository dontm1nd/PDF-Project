import { createCookieSessionStorage, redirect } from "@remix-run/node";
import { db } from "~/utils/db.server";
import bcrypt from "bcryptjs";

// Session-Storage einrichten
const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "auth_session", // Name des Cookies
    secure: process.env.NODE_ENV === "production", // In Production nur über HTTPS
    secrets: ["super-secret-key"], // 🔒 Ersetze durch eine sichere Schlüssel
    sameSite: "lax",
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 Tage gültig
  },
});

// ✅ Nutzer aus Session abrufen
export async function getUserFromSession(request: Request) {
  const session = await sessionStorage.getSession(request.headers.get("Cookie"));
  const user = session.get("user");
  return user ? user : null;
}

// ✅ Nutzer einloggen (Session setzen)
export async function loginUser(email: string, password: string) {
  const user = await db.user.findUnique({ where: { email } });
  if (!user) return null;

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return null;

  return { id: user.id, name: user.name, email: user.email };
}

// ✅ Nutzer registrieren
export async function registerUser(email: string, password: string, name: string) {
  const hashedPassword = await bcrypt.hash(password, 10);
  return db.user.create({
    data: { email, password: hashedPassword, name },
  });
}

// ✅ Nutzer in Session speichern
export async function createUserSession(user: any, redirectTo: string) {
  const session = await sessionStorage.getSession();
  session.set("user", user);

  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session),
    },
  });
}

// ✅ Nutzer ausloggen
export async function logoutUser(request: Request) {
  const session = await sessionStorage.getSession(request.headers.get("Cookie"));
  return redirect("/login", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}