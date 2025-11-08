# React App — Mini Tax Accountant (Azure SWA / AZ-204 Learning)

This repository contains a small React single-page application used as a mini project for a tax accountant. It's intentionally simple and intended to teach deploying apps to Azure Static Web Apps (SWA) using GitHub Actions as part of learning for AZ-204 topics.

Key points:
- Learning focus: deploying static front-ends to Azure Static Web Apps with GitHub Actions (useful for AZ-204 exam/practice).
- App purpose: small UI for a tax accountant to upload documents, view a dashboard, and manage users/roles.
- Simple role model: Admin, Accountant, Viewer.

## Features (high level)
- Dashboard with summary metrics
- Upload page to submit tax documents (frontend only; may call an API in `api/` when present)
- Admin pages to manage users and roles
- Simple routing with React Router

## User roles
- Admin — full access, user/role management
- Accountant — access to dashboard, uploads and client data
- Viewer — read-only access to reports and summaries

This project is a minimal UI prototype and may include placeholder/mock data. Adapt it to connect to real backends or APIs as needed.

## Prerequisites
- Node.js >= 18 and npm >= 9 (matches the project `engines` in `package.json`)
- Git and a GitHub account (for GitHub Actions deployment)
- An Azure subscription with permissions to create resources (Static Web App)

## Quick start — run locally

1. Install dependencies

```bash
cd react-app
npm install
```

2. Start the dev server

```bash
npm start
```

The app runs on the default React dev server (usually http://localhost:3000). This project includes a `proxy` setting in `package.json` to forward API requests to `http://localhost:7071/` if you run a local Functions/API host.

## Build

```bash
npm run build
```

This produces a production build in `build/` that can be served by a static host.

## Deploying to Azure Static Web Apps with GitHub Actions

This section outlines the typical flow to publish this app to Azure Static Web Apps using GitHub Actions. Azure provides a built-in GitHub Actions workflow that runs on push to a branch (commonly `main`).

1. Create an Azure Static Web App in the Azure portal. When you create it, choose GitHub as the source and the repository/branch to deploy.

2. Azure will add a GitHub Actions workflow to `.github/workflows/` in your repository (e.g. `azure-static-web-apps-<id>.yml`). That workflow will build and deploy your React app automatically.

3. If you have an API (Azure Functions) in the repo, make sure the workflow is configured with the correct `app_location` (usually `/react-app`), `api_location` (e.g. `/api`), and `output_location` (`build`). The default `react-scripts` build output is `build`.

Example workflow fields (these are configured by the portal when you create the SWA resource):

```yaml
app_location: "react-app"
api_location: "api" # if you have one, otherwise set to ""
output_location: "build"
```

4. Push to your configured branch. The GitHub Actions workflow will run and deploy the app.

Notes and tips:
- If your API is hosted separately (for example, an Azure Functions project under `api/` that uses `func host start` locally), ensure your local dev proxy matches and set environment variables in the workflow as needed.
- For private settings (connection strings, tokens), use GitHub repository Secrets and consume them in the workflow. Do not store secrets in the repo.

## Learning with AZ-204 in mind
- Focus on the end-to-end flow: local app → build → GitHub Actions → Azure Static Web Apps.
- Practice adding an Azure Function as an API backend and connecting it to the front end (HTTP triggers, authentication, CORS, environment variables).
- Try adding role-based access (SWA supports authentication providers) and protecting admin routes.

## Example: Add simple role checks (concept)
- The frontend can show/hide UI elements based on the user's role. Roles can be stored in a user profile returned from the API or derived from JWT claims if you enable authentication.

## Project layout (important files)
- `react-app/package.json` — scripts and dependencies
- `react-app/src/` — React source code and components
- `react-app/public/` — static assets
- (optional) `api/` — Azure Functions backend (if present)

## Next steps / improvements
- Add automated tests (unit / integration) and a CI job that runs them before deploy
- Implement authentication and role-based authorization with Azure Static Web Apps built-in auth or Azure AD B2C
- Wire up a persistent backend (Cosmos DB, SQL, or Blob Storage) and secure connection strings via Key Vault or GitHub Secrets

## License
This repository is provided for learning purposes. Use and adapt freely. No warranty.

---

If you want, I can also:
- add a short GitHub Actions example workflow or a template for the SWA deploy
- add sample environment variable names and a script to emulate a minimal API for local testing

Path: `react-app/README.md`
# Static Web App

This project was created to help represent a fundamental app written with React. The shopping theme is used throughout the app.

## Getting Started

1. Create a repository from this template repository <https://github.com/MicrosoftDocs/mslearn-staticwebapp/generate>

1. Enter the name of your new repository as _my-static-web-app_

1. Clone your new repository

   ```bash
   git clone https://github.com/your-github-organization/my-static-web-app
   cd my-static-web-app/react-app
   ```

1. Install the npm packages

   ```bash
   npm install
   ```

1. Run the app

   ```bash
   npm start
   ```

## Resources

### Azure Static Web Apps

- Learn how to [Publish an Angular, React, Svelte, or Vue JavaScript app and API with Azure Static Web Apps](https://docs.microsoft.com/learn/modules/publish-app-service-static-web-app-api?wt.mc_id=mslearn_staticwebapp-github-jopapa)
- [API support in Azure Static Web Apps](https://docs.microsoft.com/azure/static-web-apps/apis?wt.mc_id=mslearn_staticwebapp-github-jopapa)
- [Add an API to Azure Static Web Apps](https://docs.microsoft.com/azure/static-web-apps/add-api?wt.mc_id=mslearn_staticwebapp-github-jopapa)
- [Authentication and authorization](https://docs.microsoft.com/azure/static-web-apps/authentication-authorization?wt.mc_id=mslearn_staticwebapp-github-jopapa)
- [Routes](https://docs.microsoft.com/azure/static-web-apps/routes?wt.mc_id=mslearn_staticwebapp-github-jopapa)
- [Review pre-production environments](https://docs.microsoft.com/azure/static-web-apps/review-publish-pull-requests?wt.mc_id=mslearn_staticwebapp-github-jopapa)

### Azure Functions

- Learn how to [Refactor Node.js and Express APIs to Serverless APIs with Azure Functions](https://docs.microsoft.com/learn/modules/shift-nodejs-express-apis-serverless/?wt.mc_id=mslearn_staticwebapp-github-jopapa)
- Learn about the Azure Functions [local.settings.json](https://docs.microsoft.com/azure/azure-functions/functions-run-local#local-settings-file?wt.mc_id=mslearn_staticwebapp-github-jopapa) file
- Learn how to [Deploy to Azure Using Azure Functions](https://code.visualstudio.com/tutorials/functions-extension/getting-started?wt.mc_id=mslearn_staticwebapp-github-jopapa)
- Sign up for a [Free Trial of Azure](https://azure.microsoft.com/free/?wt.mc_id=mslearn_staticwebapp-github-jopapa)

### Visual Studio Code

- [Azure Free Trial](https://azure.microsoft.com/free/?wt.mc_id=mslearn_staticwebapp-github-jopapa)
- [VS Code](https://code.visualstudio.com?wt.mc_id=mslearn_staticwebapp-github-jopapa)
- [VS Code Extension for Node on Azure](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack&WT.mc_id=mslearn_staticwebapp-github-jopapa)
- Azure Functions [local.settings.json](https://docs.microsoft.com/azure/azure-functions/functions-run-local#local-settings-file?WT.mc_id=mslearn_staticwebapp-github-jopapa) file

### Debugging Resources

- [Debugging Angular in VS Code](https://code.visualstudio.com/docs/nodejs/angular-tutorial?wt.mc_id=mslearn_staticwebapp-github-jopapa)
- [Debugging React in VS Code](https://code.visualstudio.com/docs/nodejs/reactjs-tutorial?wt.mc_id=mslearn_staticwebapp-github-jopapa)
- [Debugging Vue in VS Code](https://code.visualstudio.com/docs/nodejs/vuejs-tutorial?wt.mc_id=mslearn_staticwebapp-github-jopapa)

## Authentication integration notes

### Current demo flow
- Landing screen lets you choose to sign in or create a lightweight account placeholder.
- Demo credentials: `admin/admin`, `superadmin/superadmin`, `user/user`.
- After credentials or registration details are entered, the MFA screen expects **all000000**.
- Successful MFA stores the session in local storage so you can navigate between the client and admin views.

### Wiring up Microsoft Entra ID (Azure AD) with MSAL
1. **Create an app registration** in Azure Portal → Azure Active Directory → App registrations. Add localhost and production redirect URIs.
2. **Configure MSAL** by installing `@azure/msal-browser`, then create an `msalInstance` with your tenant ID, client ID, and redirect URL. Enable Microsoft and Google ID providers if you want federated logins.
3. **Wrap the app** with `MsalProvider` and call `instance.loginRedirect()` or `instance.loginPopup()` from the login choice screen. Request the scopes you need (e.g. `User.Read`).
4. **Exchange the ID token** with your Azure/.NET backend after login and issue a secure session cookie. Keep sensitive tax data off the client and enforce MFA from Azure AD policies.

```js
import { PublicClientApplication } from "@azure/msal-browser";

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
};
```

Once MSAL is in place, replace the demo handlers in `LoginPage.js` with `instance.loginRedirect(loginRequest)` and use `msalInstance.getActiveAccount()` to hydrate the session.
