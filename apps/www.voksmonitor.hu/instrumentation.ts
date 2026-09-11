import { registerOTel } from "@vercel/otel";

const name = process.env.APPSIGNAL_NAME;
const environment = process.env.APPSIGNAL_ENVIRONMENT;
const pushApiKey = process.env.APPSIGNAL_PUSH_API_KEY;
const revision = process.env.VERCEL_GIT_COMMIT_SHA && process.env.VERCEL_GIT_COMMIT_SHA.trim() !== "" ? process.env.VERCEL_GIT_COMMIT_SHA : "development";

export function register() {
  if (name && environment && pushApiKey) {
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
}
