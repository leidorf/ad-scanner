import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  // dashboard/home path
  index("routes/home.tsx"),

  // user detail & list path
  route("users", "routes/users/list.tsx"),
  route("users/:dn", "routes/users/detail.tsx"),

  // computer detail & list path
  route("computers", "routes/computers/list.tsx"),
  route("computers/:dn", "routes/computers/detail.tsx"),

  // group detail & list path
  route("groups", "routes/groups/list.tsx"),
  route("groups/:dn", "routes/groups/detail.tsx"),
] satisfies RouteConfig;
