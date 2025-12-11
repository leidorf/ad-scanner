import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("users", "routes/users/list.tsx"),
  route("users/:dn", "routes/users/detail.tsx"),

  route("computers", "routes/computers/list.tsx"),
  route("computers/:dn", "routes/computers/detail.tsx"),

  route("groups", "routes/groups/list.tsx"),
  route("groups/:dn", "routes/groups/detail.tsx"),
] satisfies RouteConfig;
