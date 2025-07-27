import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  layout('./layouts/layout.tsx', [
    route("accounts", "./routes/accounts/index.tsx"),
    route("payments", "./routes/payments/index.tsx")
  ])
] satisfies RouteConfig;
