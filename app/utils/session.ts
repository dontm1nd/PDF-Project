import { createCookieSessionStorage, redirect } from "@remix-run/node";
import { prisma } from "~/utils/db.server";

// Session-Storage einrichten
// Diese Funktion erstellt eine Cookie-Session-Storage, die für die Authentifizierung verwendet wird
// Sie speichert die Sitzung im Cookie und gibt sie zurück. Die Sitzung wird für 7 Tage gespeichert
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
// Diese Funktion wird aufgerufen, um den eingeloggten Nutzer aus der Session abzurufen
// Sie gibt den Nutzer zurück, wenn er eingeloggt ist, Ansonsten null
export async function getUserFromSession(request: Request) {
  const session = await sessionStorage.getSession(request.headers.get("Cookie"));
  const user = session.get("user");
  return user ? user : null;
}

//Nutzer einloggen (Session setzen)
// Diese Funktion wird aufgerufen, wenn der Nutzer sich anmeldet
// Sie überprüft die Anmeldedaten und gibt den Nutzer zurück, wenn die Anmeldedaten korrekt sind, Ansonsten gibt sie null zurück
export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (user && user.password === password) {
    return user;
  }

  return null;
}

//Nutzer in Session speichern
// Diese Funktion wird aufgerufen, wenn der Nutzer sich erfolgreich anmeldet 
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
// Diese Funktion wird aufgerufen, wenn der Nutzer sich abmeldet
// Sie löscht die Sitzung und leitet den Nutzer zur Anmeldeseite weiter
export async function logoutUser(request: Request) {
  const session = await sessionStorage.getSession(request.headers.get("Cookie"));
  return redirect("/login", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}