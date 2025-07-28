import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  layout('layout.tsx', [
    index("./routes/index.tsx"),
    route("accounts", "./routes/accounts/index.tsx"),
    route("accounts/:accountId", "./routes/accounts/account.tsx"),
    route("payments", "./routes/payments.tsx")
  ])
] satisfies RouteConfig;
