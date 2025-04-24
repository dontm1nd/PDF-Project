import { Form, useActionData } from "@remix-run/react";
import { ActionFunctionArgs, LoaderFunction, redirect } from "@remix-run/node";
import { getUserFromSession, loginUser, createUserSession } from "~/utils/session";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUserFromSession(request);
  if (user) return redirect("/dashboard"); // Bereits eingeloggt? Weiterleiten
  return null;
};

// Test-User Daten
const TEST_USER = {
  email: "test@example.com",
  password: "passwort123",
  name: "TestNutzer",
};

export default function Login() {
  const actionData = useActionData<{ error?: string }>(); // Holt mögliche Fehlernachrichten!

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-animated">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-700">Login</h2>
        {actionData?.error && (
          <p className="text-red-500 text-center mt-2">{actionData.error}</p>
        )}
        <Form method="post" className="mt-6">
          <div>
            <label className="block text-gray-700">E-Mail</label>
            <input
              type="email"
              name="email"
              required
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mt-4">
            <label className="block text-gray-700">Passwort</label>
            <input
              type="password"
              name="password"
              required
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full mt-6 bg-gradient-to-r from-blue-500 to-purple-500 hover:bg-blue-600 text-white py-2 rounded-lg transition duration-200"
          >
            Einloggen
          </button>
        </Form>
        <p className="mt-4 text-sm text-center text-gray-600">
          Noch kein Konto? <a href="/register" className="text-blue-500">Registrieren</a>
        </p>
      </div>
    </div>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = new URLSearchParams(await request.text());
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string"|| typeof password !== "string"){
    return { error: "Ungültige Eingaben" };// Validierung der Eingaben
  }

  const user = await loginUser(email, password); // Prüft den Benutzer

  if (!user) {
    return { error: "Ungültige E-Mail oder Passwort" }; // Fehler bei der Anmeldung
  }

  // Benutzer speichern und zum Dashboard weiterleiten
  return createUserSession(user, "/dashboard");
  
}
