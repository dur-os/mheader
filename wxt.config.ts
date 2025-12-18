import { defineConfig } from 'wxt';
import tailwindcss from "@tailwindcss/vite";

// See https://wxt.dev/api/config.html
export default defineConfig({
  outDir: "dist",
  modules: ['@wxt-dev/module-react', '@wxt-dev/auto-icons'],
  autoIcons: {
    baseIconPath: 'assets/icon.svg',
    developmentIndicator: false
  },
  vite: () => ({
    plugins: [tailwindcss()],
  }),
  manifest: {
    permissions: ['storage', 'declarativeNetRequest', "declarativeNetRequestWithHostAccess"],
    host_permissions: [
      "<all_urls>"
    ],
    key: "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA5dVl3IfyWYKnRRJeXgNYkLrYODlxWNZOsTlpPcoB+1DMEIfRKa1odR7IObp4+kedIPtpYQ4dVrm22akWG/6y9he50ei8TcQLx8BkQ9upM0dPrMYR38k3Z8caJaSkL+azjSE6FDRmxxTvOKkxV9M/8/OlulucufD1CQXCSMQ2erCw65lI7Vea5+ulJ0RwuV6CKFVrv6ImpWyenK7XtfyUz7xZJhNjeFLckYDZftcA1swjHFXtoF690b/LsyaTTL7Z5c5CQ0rloZV6s3JpGo+ucYpJFsj/EJBdcylcDDPoA9WI7S7r8Crzl7mCHcn4iSl3tP6f7pSbPlF0mq3hDG23dQIDAQAB"
  },
});
