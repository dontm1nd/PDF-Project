import { Form } from "@remix-run/react";
import { ActionFunctionArgs, redirect } from "@remix-run/node";

export default function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-animated">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-700">Login</h2>
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
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  // Hier kannst du die Authentifizierung prüfen (z.B. mit einer Datenbank)
  if (email === "test@example.com" && password === "passwort123") {
    return redirect("/dashboard"); // Nach dem Login weiterleiten
  }

  return { error: "Ungültige Zugangsdaten" };
}