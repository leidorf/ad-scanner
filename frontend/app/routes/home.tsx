import type { Route } from "./+types/home";
import Dashboard from "./dashboard";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "AD Scanner Dashboard" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return <Dashboard />;
}
