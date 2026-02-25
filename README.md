# IPFS Lens

IPFS Lens is a premium, modern monitoring dashboard that visualizes the global IPFS (InterPlanetary File System) network. Built with Next.js, and React Three Fiber.

## Features

- **Interactive 3D Network Map**: A highly-detailed, spinning 3D globe visualizing active IPFS nodes globally, showing their status, storage capacity, and animated data transfers.
- **Node Storage Metrics**: A dashboard tracking network-wide storage contributions, top active peers, and capacity utilization.
- **Gateway Performance Monitor**: Live-simulated tracking of IPFS Gateway latency, cache hit rates, and content-type response profiles.

## Tech Stack

- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **3D Visualization**: `react-globe.gl`, `three`, `@react-three/fiber`
- **2D Charts**: `recharts`
- **State Management**: `zustand` (Live simulation data store)
- **Icons**: `lucide-react`

## Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
