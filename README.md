# SFS Device Performance Monitor

A high-performance, real-time manufacturing device monitoring dashboard built with **Angular 16** (Standalone architecture) and **D3.js v7**.

## 🚀 Key Features & Architectural Highlights

### 1. Angular 16 Modern Standalone Architecture
- Zero `NgModule` boilerplate: Components, services, and directives use the modern Angular 16 Standalone standard (`standalone: true`).
- Clean separation of concerns:
  - `core/`: Singleton services (`RuntimeConfigService`, `DeviceApiService`, `DeviceSseService`), functional HTTP interceptors (`apiErrorInterceptor`), and notifications.
  - `shared/`: Generic, reusable presentational components and D3.js chart wrappers.
  - `features/dashboard/`: Smart container, presentational components, and a unidirectional `DashboardStore`.

### 2. D3.js High-Performance Charts
- **Time-Series Line Chart**: Visualizes historic Parts Per Minute (PPM) and total Parts Produced since the active device was selected.
- **Radial Progress Gauge**: Renders completion percentage of the current order (`productionState` vs `productionTarget`).
- **NgZone Optimization**: D3 charts run outside Angular change detection (`runOutsideAngular`) for 60fps rendering without triggering unnecessary CD cycles.
- **Responsive Layout**: Uses `ResizeObserver` to smoothly adapt SVG scales and dimensions to window and container resizing.

### 3. Server-Sent Events (SSE) & Connection Lifecycle Management
- Direct real-time streaming via `EventSource` (`/events/{deviceId}`).
- Clean `switchMap` / tear-down logic in `DashboardStore`: Switching devices automatically terminates the prior SSE connection to prevent memory leaks.
- Real-time detection of status transitions (`running` $\rightarrow$ `stopped` or `maintenance`) automatically creates incident records in the **Production Interrupts** log.

### 4. Dynamic Runtime Configuration
- Fulfils requirement: *"The configuration has to be updated during runtime automatically."*
- `RuntimeConfigService` polls `/config` periodically in the background, updating environment flags and resolving dynamic endpoint URLs without requiring browser reloads.

### 5. Resilient Error Handling & Core Service Fault Tolerance
- Functional `apiErrorInterceptor` with automatic retry strategies for transient network issues.
- Floating `ToastContainerComponent` surfaces user-friendly alert banners with auto-dismiss timers when the unstable backend produces HTTP errors.

---

## 🛠️ Development & Running Locally

### Prerequisites
- Node.js 18+ (tested on Node 20 / 24)
- npm 9+

### Quick Start
```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm start
# or
ng serve

# 3. Access the dashboard
# Open http://localhost:4200 in your browser
```

### Production Build
```bash
npm run build
```

---

## 📋 Git Commit Log
Clean, progressive Git history is maintained in the `.git` directory:
- `init_angular_16`: Initial scaffold of Angular 16 project
- `install_d3_dependencies`: Installation of `d3` and `@types/d3`
- `implement_enterprise_dashboard_and_d3_charts`: Full store, services, D3 charts, SSE integration, and error interceptors
