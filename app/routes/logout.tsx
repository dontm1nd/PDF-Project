import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import { logoutUser } from "~/utils/session";

// Falls jemand /logout im Browser aufruft, sofort weiterleiten
export const loader: LoaderFunction = async () => {
  return redirect("/login");
};

// Verarbeitet POST-Logout-Anfragen (Logout-Button)
export const action: ActionFunction = async ({ request }) => {
  return logoutUser(request); // Beendet die Session
};

