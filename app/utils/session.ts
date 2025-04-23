import { createCookieSessionStorage, redirect } from "@remix-run/node";

// Session-Storage einrichten
const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "auth_session", // Name des Cookies
    secure: process.env.NODE_ENV === "production", // In Production nur über HTTPS
    secrets: ["super-secret-key"], //Ersetze durch eine sichere Schlüssel
    sameSite: "lax",
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 Tage gültig
  },
});

//Nutzer aus Session abrufen
export async function getUserFromSession(request: Request) {
  const session = await sessionStorage.getSession(request.headers.get("Cookie"));
  const user = session.get("user");
  return user ? user : null;
}

//Nutzer einloggen (Session setzen)
export async function loginUser(email: string, password: string) {
  //Ersetze dies mit einer echten User-Authentifizierung (DB oder API)
  if (email === "test@example.com" && password === "password123") {
    return { id: 1, name: "Max Mustermann", email }; // Beispiel-User
  }
  return null;
}

//Nutzer in Session speichern
export async function createUserSession(user: any, redirectTo: string) {
  const session = await sessionStorage.getSession();
  session.set("user", user);

  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session),
    },
  });
}

//Nutzer ausloggen
export async function logoutUser(request: Request) {
  const session = await sessionStorage.getSession(request.headers.get("Cookie"));
  return redirect("/login", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}