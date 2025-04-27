import { createCookieSessionStorage, redirect } from "@remix-run/node";
import { prisma } from "~/utils/db.server";

//Umgebungsvariablen aus .env holen
const sessionSecret = process.env.SESSION_SECRET;
const nodeEnv = process.env.NODE_ENV;
const cookieSecureEnv = process.env.COOKIE_SECURE;

if (!sessionSecret) {
  throw new Error("SESSION_SECRET is not set");
}

if (!cookieSecureEnv) {
  throw new Error("COOKIE_SECURE is not set");
}

// Bestimmen ob Cookie Secure
const isProduction = nodeEnv === "production";
const cookieSecure = isProduction ? cookieSecureEnv === "true" : false;

// Log
console.log("[SESSION CONFIG]");
console.log(`NODE_ENV: ${nodeEnv}`);
console.log(`COOKIE_SECURE (aus .env): ${cookieSecureEnv}`);
console.log(`=> Cookie wird 'secure' gesetzt: ${cookieSecure}`);

// Session-Storage einrichten
// Diese Funktion erstellt eine Cookie-Session-Storage, die für die Authentifizierung verwendet wird
// Sie speichert die Sitzung im Cookie und gibt sie zurück. Die Sitzung wird für 7 Tage gespeichert
const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "auth_session", // Name des Cookies
    secure: cookieSecure,
    secrets: [sessionSecret],
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