import { LoaderFunctionArgs, redirect } from "@remix-run/node";

export function loader({ request }: LoaderFunctionArgs) {
  return redirect("/login");
}

export default function Index() {
  return null; // Diese Seite wird nie gerendert, weil sie sofort weiterleitet
}



