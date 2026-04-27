# Guest Book UI

Angular 17 single-page application for the Guestbook, served via Nginx with API reverse proxy.

## Tech Stack

- Angular 17 (Standalone Components)
- TypeScript 5.4
- RxJS 7.8
- Nginx (production serving)
- Material Icons
- Inter Font (Google Fonts)

## Project Structure

```
guest-book-ui/
├── src/
│   ├── app/
│   │   ├── app.component.ts                          # Root component (layout, dark mode, orchestration)
│   │   ├── components/
│   │   │   ├── entry-form/entry-form.component.ts     # New entry form with mood picker
│   │   │   ├── entry-list/entry-list.component.ts     # Entry cards with like, edit, pin, pagination
│   │   │   ├── search-bar/search-bar.component.ts     # Debounced search input
│   │   │   ├── stats-bar/stats-bar.component.ts       # Stats dashboard (total, today, likes)
│   │   │   └── toast/toast.component.ts               # Toast notifications
│   │   ├── models/
│   │   │   └── guest-entry.model.ts                   # TypeScript interfaces
│   │   └── services/
│   │       ├── guest-entry.service.ts                 # HTTP service for API calls
│   │       └── toast.service.ts                       # Toast notification service
│   ├── environments/
│   │   ├── environment.ts                             # Dev config (localhost:8080)
│   │   └── environment.prod.ts                        # Prod config (relative /api)
│   ├── index.html
│   ├── main.ts
│   └── styles.css                                     # Global styles + dark mode
├── angular.json
├── tsconfig.json
├── tsconfig.app.json
├── package.json
├── Dockerfile
├── nginx.conf
└── .dockerignore
```

## Features

| Feature | Description |
|---------|-------------|
| 📝 Create Entry | Name, email (optional), message, mood emoji picker |
| ✏️ Inline Edit | Edit name, email, message, mood directly in the card |
| ❤️ Like | Heart button with animated counter |
| 📌 Pin/Unpin | Pin entries to the top of the list |
| 🗑️ Delete | Remove entries with confirmation |
| 🔍 Search | Debounced search (300ms) by name or message |
| 📊 Stats Bar | Glassmorphism cards showing total messages, today's count, total likes |
| 📄 Pagination | Page navigation with prev/next controls |
| 🌙 Dark Mode | Toggle between light and dark themes |
| 🔔 Toast Notifications | Auto-dismissing success/error/info toasts |
| 🎨 Glassmorphism UI | Frosted glass cards with backdrop blur |
| ✨ Animations | Fade-in entries, floating header icon, heart beat on like |
| 📱 Responsive | Mobile-friendly layout |

## Components

### AppComponent
Root component that orchestrates all child components. Manages state for entries, stats, pagination, search, and dark mode.

### EntryFormComponent
Form with:
- Name input (required, max 100 chars)
- Email input (optional, validated)
- Message textarea (required, max 500 chars, live character counter)
- Mood emoji selector: 😊 😍 🎉 👋 🔥 🤔 😎 💡

### EntryListComponent
Displays entries as cards with:
- Gradient avatar based on username
- Mood badge
- Like button with count and heart animation
- Inline edit mode with save/cancel
- Pin/unpin toggle
- Delete button
- Pagination controls

### SearchBarComponent
- Debounced input (300ms delay via RxJS)
- Clear button
- Emits search query to parent

### StatsBarComponent
Three glassmorphism stat cards:
- 👥 Total Messages
- 📅 Today's Messages
- ❤️ Total Likes

### ToastComponent
- Auto-dismissing notifications (3 seconds)
- Three types: success (green), error (red), info (blue)
- Click to dismiss
- Slide-in animation

## API Integration

All API calls go through `GuestEntryService`:

| Method | Service Call | API Endpoint |
|--------|-------------|--------------|
| List | `getAll(page, size, search?)` | `GET /api/entries` |
| Stats | `getStats()` | `GET /api/entries/stats` |
| Create | `create(entry)` | `POST /api/entries` |
| Update | `update(id, entry)` | `PUT /api/entries/{id}` |
| Like | `like(id)` | `PATCH /api/entries/{id}/like` |
| Pin | `pin(id)` | `PATCH /api/entries/{id}/pin` |
| Delete | `delete(id)` | `DELETE /api/entries/{id}` |

## Environment Configuration

| File | `apiUrl` | Usage |
|------|----------|-------|
| `environment.ts` | `http://localhost:8080/api` | Local development |
| `environment.prod.ts` | `/api` | Production (nginx proxies to API) |

## Run Locally

### Prerequisites
- Node.js 20+
- npm 10+

```bash
# Install dependencies
npm install

# Start dev server
npm start
```

App will be available at http://localhost:4200

> Requires the API running at http://localhost:8080

## Docker

```bash
# Build image
docker build -t guestbook-ui .

# Run container
docker run -d --name guestbook-ui -p 4200:80 guestbook-ui
```

The Dockerfile uses a multi-stage build:
1. **Build stage** — `node:20-alpine` builds the Angular production bundle
2. **Serve stage** — `nginx:alpine` serves static files (~30MB image)

## Nginx Configuration

The `nginx.conf` handles:
- **SPA routing** — All routes fall back to `index.html` via `try_files`
- **API proxy** — `/api/*` requests are proxied to the API service

```
location /api/ → http://api:8080/api/          (Docker Compose)
location /api/ → http://guestbook-api.guestbook-api.svc.cluster.local:8080/api/  (Kubernetes)
```

> In Kubernetes, the nginx config is overridden via a ConfigMap (`k8s/ui/configmap.yaml`) to use the cross-namespace FQDN.

## Kubernetes Deployment

Deployed in the `guestbook-ui` namespace with an internet-facing NLB.

```bash
kubectl apply -f ../k8s/ui/
```

### K8s Resources
- **Deployment** — 2 replicas
- **Service** — LoadBalancer (NLB, internet-facing)
- **HPA** — Auto-scales 2–4 pods at 70% CPU
- **ConfigMap** — nginx.conf with cross-namespace API proxy
- **NetworkPolicy** — Allows external ingress on port 80

## Design System

| Token | Value |
|-------|-------|
| Primary | `#667eea` |
| Primary Dark | `#5a67d8` |
| Danger | `#e53e3e` |
| Font | Inter (300–800) |
| Border Radius | 16px (cards), 10px (inputs), 14px (avatars) |
| Card Style | Glassmorphism (`backdrop-filter: blur(12px)`) |
| Dark Background | `#1a1a2e → #16213e → #0f3460` |
