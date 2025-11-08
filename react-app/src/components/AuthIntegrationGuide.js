import React from "react";
import { FileCode2, Info, KeySquare, LogIn } from "lucide-react";

const steps = [
  {
    title: "Create an Azure AD app registration",
    description:
      "In Azure Portal → Azure Active Directory → App registrations → New registration. Add your local and production redirect URIs.",
  },
  {
    title: "Configure MSAL",
    description:
      "Install @azure/msal-browser then update authConfig.js with your tenant ID, client ID, and redirect URL. Enable both Microsoft and Google social ID providers in Azure.",
  },
  {
    title: "Protect routes",
    description:
      "Wrap your app in MsalProvider and call instance.loginRedirect() or loginPopup() where needed. Exchange the ID token with your API for session creation.",
  },
];

const codeSample = `import { PublicClientApplication } from "@azure/msal-browser";

export const msalInstance = new PublicClientApplication({
  auth: {
    clientId: "<YOUR_CLIENT_ID>",
    authority: "https://login.microsoftonline.com/<TENANT_ID>",
    redirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
});

export const loginRequest = {
  scopes: ["User.Read"],
  prompt: "select_account",
};`;

export default function AuthIntegrationGuide() {
  return (
    <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-soft-xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-gradient text-white">
          <LogIn size={20} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Switch to Microsoft secure login</h3>
          <p className="text-sm text-slate-500">
            Use Azure AD + MSAL for passwordless trust. Google federation works once it is added as an external identity provider.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {steps.map((step) => (
          <article key={step.title} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
            <h4 className="text-sm font-semibold text-brand-primary flex items-center gap-2">
              <KeySquare size={16} /> {step.title}
            </h4>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">{step.description}</p>
          </article>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-900/95 p-4 text-slate-100">
        <div className="flex items-center gap-2 text-sm font-medium tracking-wide uppercase text-slate-300">
          <FileCode2 size={16} /> msal-setup.js
        </div>
        <pre className="mt-3 overflow-x-auto text-xs leading-relaxed">
          <code>{codeSample}</code>
        </pre>
      </div>

      <div className="mt-6 flex items-start gap-3 rounded-2xl border border-brand-accent/40 bg-orange-50 p-4 text-sm text-slate-700">
        <Info size={18} className="text-brand-primary" />
        <p>
          After authentication succeeds, call <code>msalInstance.getActiveAccount()</code> and pass the ID token to your Azure Function or .NET API.
          Store only short-lived session data in the browser and rely on MFA enforcement from Azure AD.
        </p>
      </div>
    </section>
  );
}
