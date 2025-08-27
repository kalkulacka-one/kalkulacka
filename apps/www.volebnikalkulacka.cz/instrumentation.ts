import { registerOTel } from "@vercel/otel";

const name = process.env.APPSIGNAL_NAME;
const environment = process.env.APPSIGNAL_ENVIRONMENT;
const pushApiKey = process.env.APPSIGNAL_PUSH_API_KEY;
const revision = process.env.VERCEL_GIT_COMMIT_SHA;

export function register() {
  registerOTel({
    serviceName: name,
    attributes: {
      "appsignal.config.name": name,
      "appsignal.config.environment": environment,
      "appsignal.config.revision": revision,
      "appsignal.config.language_integration": "nodejs",
      "appsignal.config.push_api_key": pushApiKey,
      "host.name": "vercel",
    },
  });
}
