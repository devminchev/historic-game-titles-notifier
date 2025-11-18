# Historic Game Titles Notifier

Historic Game Titles Notifier is a small Contentful App Framework project that helps editors manage
platform-specific metadata for legacy game titles without leaving the Contentful web app. The app
runs inside Contentful UI locations, making it easy to configure which content types should trigger
historic title notifications and to extend fields or dialogs with custom logic tailored to your
publishing workflow.

## Tech stack

- **React 18** rendered with `react-dom` and bundled through `react-scripts`.
- **Contentful App Framework** packages (`@contentful/app-sdk`, `@contentful/react-apps-toolkit`) to
  talk to the host Contentful space.
- **Forma 36** Contentful design system components for layout and inputs.
- **TypeScript** for type safety during development.
- **Emotion** for lightweight, component-scoped styling.

See `package.json` for the full list of runtime and development dependencies as well as the scripts
used to run, build, test, and deploy the app.【F:package.json†L1-L57】

## High-level architecture

The app uses a single React entry point that chooses which location-specific component to render
based on the Contentful UI location where the app is loaded (App configuration screen, entry field,
or dialog). When developing outside of Contentful, the UI falls back to a localhost warning screen to
remind developers to embed the bundle back into Contentful.【F:src/index.tsx†L1-L44】

Each location exposes its own component:

- **Config screen** (`src/locations/ConfigScreen.tsx`) lets administrators configure the
  `targetContentTypes` installation parameter. The value is persisted by `sdk.app.onConfigure`,
  reloaded when the app boots, and validated with Forma 36 form controls.【F:src/locations/ConfigScreen.tsx†L28-L81】
- **Field extension** (`src/locations/Field.tsx`) is where editor-facing notifications and future
  logic for entry fields will live. Right now it displays a placeholder paragraph that has access to
  the entry and app identifiers via `FieldAppSDK`.【F:src/locations/Field.tsx†L1-L13】
- **Dialog** (`src/locations/Dialog.tsx`) follows the same pattern for dialog-driven workflows, and
  currently renders a placeholder paragraph sourced from `DialogAppSDK`.【F:src/locations/Dialog.tsx†L1-L10】
- **Localhost warning** (`src/components/LocalhostWarning.tsx`) is rendered only when the app is
  opened outside of Contentful during development to remind engineers how to embed it back into the
  Contentful web app.【F:src/components/LocalhostWarning.tsx†L1-L28】

## Getting started

1. **Install dependencies**
   ```bash
   yarn install
   ```
2. **Start the development server** – runs CRA on <http://localhost:3000> without automatically
   opening a browser window, mirroring how Contentful loads the iframe.
   ```bash
   yarn start
   ```
3. **Build for production** – generates the static bundle consumed by Contentful or GitHub Pages.
   ```bash
   yarn build
   ```
4. **Run tests** – executes Jest in a jsdom environment. There are currently no custom tests, but the
   command ensures the environment is healthy.
   ```bash
   yarn test
   ```

## Usage inside Contentful

1. Create or update an App Definition in your Contentful organization.
2. Upload the build output using the provided scripts:
   ```bash
   yarn create-app-definition   # one-time setup
   yarn upload                  # upload the latest ./build directory
   ```
3. Install the app into a space and select the locations you want to enhance (app configuration,
   entry field, dialog).
4. Open the **App Config** screen to set the `Target Content Types to Event Filter` value so the app
   knows which content types represent historic game titles.
5. Assign the field or dialog locations to the relevant content types and customize the React
   components to meet your notification needs.

## Deployment

The repo includes a `deploy` script that pushes the `build/` directory to GitHub Pages, matching the
URL referenced by the Contentful app. Run it after merging changes to main:
```bash
yarn build
yarn deploy
```
If you deploy via Contentful App Hosting instead, use `yarn upload` (or `yarn upload-ci` with the
required environment variables) to ship the bundle directly from CI.【F:package.json†L15-L23】

## Contributing

1. Fork the repository and create a topic branch.
2. Install dependencies and run `yarn start` to develop inside Contentful.
3. Keep changes small, include tests where possible, and follow the existing React/TypeScript style.
4. Run `yarn build` before opening a PR to ensure the production bundle compiles cleanly.
5. Describe both Contentful configuration changes and code updates in the PR so reviewers understand
   how to test the app inside a space.
