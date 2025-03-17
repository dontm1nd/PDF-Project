import { Outlet } from "@remix-run/react";
import { redirect } from "@remix-run/node";
import { getUserFromSession } from "app/utils/session";

export async function loader({ request }: { request: Request }) {
  const user = await getUserFromSession(request);
  if (!user) throw redirect("/login"); // Falls kein User da ist → zur Loginpage umleiten
  return { user };
}

export default function AuthLayout() {
  return <Outlet />; // Zeigt die geschützten Seiten an, wenn der User eingeloggt ist
}
