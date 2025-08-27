import { registerOTel } from "@vercel/otel";

const name = process.env.APPSIGNAL_NAME;
const environment = process.env.APPSIGNAL_ENVIRONMENT;
const pushApiKey = process.env.APPSIGNAL_PUSH_API_KEY;

export function register() {
  registerOTel({
    serviceName: name,
    attributes: {
      "appsignal.config.name": name,
      "appsignal.config.environment": environment,
      "appsignal.config.revision": "1",
      "appsignal.config.language_integration": "nodejs",
      "appsignal.config.push_api_key": pushApiKey,
      "host.name": "vercel",
    },
  });
}
