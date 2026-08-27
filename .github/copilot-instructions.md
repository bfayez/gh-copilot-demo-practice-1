# Copilot instructions

## Repository overview

This repository is a GitHub Copilot demo code base, inspired by the
[Azure Container Apps: Dapr Albums Sample](https://github.com/Azure-Samples/containerapps-dapralbums).

It contains two services plus infrastructure and legacy assets:

| Path | Description |
| --- | --- |
| `albums-api/` | .NET 8 Web API (`RootNamespace` `albums_api`) serving an in-memory list of albums. Runs on `http://localhost:3000`, Swagger at `/swagger`. |
| `album-viewer/` | Vue 3 + TypeScript SPA built with Vite. Runs on `http://localhost:3001` and calls the API. |
| `iac/bicep/`, `iac/terraform/` | Infrastructure as code for deploying the solution to Azure. |
| `legacy/albums.cbl` | COBOL sample used for legacy-code demos. |
| `.github/prompts/` | Reusable prompt files for demo scenarios. |
| `.github/workflows/build-and-push.yaml` | Builds and publishes container images for both services. |

## Build, run and test

### Album API (`albums-api`)

```bash
cd albums-api
dotnet restore
dotnet build
dotnet run
```

### Album Viewer (`album-viewer`)

```bash
cd album-viewer
npm install
npm run dev          # dev server on port 3001 (proxies /albums to the API)
npm run type-check   # vue-tsc --noEmit
npm run build        # vue-tsc && vite build
npm test             # vitest
```

Both services can also be started together from the VS Code debug panel using the
**"All services"** configuration in `.vscode/launch.json`.

## Conventions

### .NET API

- Target framework is `net8.0` with `Nullable` and `ImplicitUsings` enabled.
- Models live in `albums-api/Models/`, controllers in `albums-api/Controllers/`.
- Models are C# `record` types (see `Album`); prefer records for simple data shapes.
- Controllers derive from `ControllerBase`, are annotated with `[ApiController]` and an
  explicit `[Route(...)]`, and return `IActionResult` (for example `Ok(...)`).
- Data is served from static in-memory helpers; there is no database.

### Vue viewer

- Vue 3 single-file components using `<script setup lang="ts">`.
- Types are explicit: props are declared through a local `interface Props` passed to
  `defineProps`, and shared shapes live in `src/types/` and are imported with `import type`.
- HTTP calls use `axios`; the API host can be overridden with the `VITE_ALBUM_API_HOST`
  environment variable, and Vite proxies `/albums` to `http://localhost:3000` in dev.
- Use the `@` alias for imports from `src` where it improves readability.
- Component styles are scoped inside the SFC; there is no shared CSS framework.

### General

- Keep changes small and focused; follow the existing style of the file you edit.
- Add or update tests (`vitest` for the viewer) when changing behaviour.
- Run `npm run type-check` (viewer) and `dotnet build` (API) before submitting changes.
- Do not commit secrets; configuration belongs in `appsettings*.json`, `launchSettings.json`
  or environment variables.
