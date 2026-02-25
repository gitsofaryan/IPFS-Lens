import { create } from 'zustand';

// --- Types ---
export interface NodeData {
  id: string;
  lat: number;
  lng: number;
  name: string;
  storage: string;
  status: 'active' | 'syncing' | 'warning';
  dataType: string;
  dataInfo: string;
}

export interface EdgeData {
  source: string;
  target: string;
  type: string;
  value: number;
}

export interface GatewayMetric {
  time: string;
  cached: number;
  uncached: number;
}

// --- Initial Static Mock Data ---
const initialNodes: NodeData[] = [
  { id: '1', lat: 37.7749, lng: -122.4194, name: 'us-west-1', storage: '24.5 TB', status: 'active', dataType: 'Application Data', dataInfo: 'Encrypted AI Agent Memory, User Profiles' },
  { id: '2', lat: 40.7128, lng: -74.0060, name: 'us-east-1', storage: '88.1 TB', status: 'active', dataType: 'Media Assets', dataInfo: 'Video streaming cache, High-res images' },
  { id: '3', lat: 51.5074, lng: -0.1278, name: 'eu-west-1', storage: '45.2 TB', status: 'active', dataType: 'Financial Logs', dataInfo: 'DeFi transaction histories, Smart contract states' },
  { id: '4', lat: 35.6895, lng: 139.6917, name: 'ap-northeast', storage: '112.4 TB', status: 'syncing', dataType: 'Scientific Data', dataInfo: 'Genomic datasets, Weather models' },
  { id: '5', lat: -33.8688, lng: 151.2093, name: 'ap-southeast', storage: '12.8 TB', status: 'active', dataType: 'IoT Telemetry', dataInfo: 'Sensor networks, Vehicle logs' },
  { id: '6', lat: 1.3521, lng: 103.8198, name: 'ap-south', storage: '64.0 TB', status: 'active', dataType: 'Web Archives', dataInfo: 'IPNS resolved websites, DNSLinks' },
];

const initialEdges: EdgeData[] = [
  { source: '1', target: '2', type: 'transfer', value: 1.5 },
  { source: '2', target: '3', type: 'transfer', value: 2.0 },
  { source: '3', target: '4', type: 'sync', value: 1.0 },
  { source: '4', target: '5', type: 'transfer', value: 0.5 },
  { source: '6', target: '4', type: 'transfer', value: 1.2 },
  { source: '1', target: '6', type: 'sync', value: 0.8 },
];

const initialGateway: GatewayMetric[] = [
  { time: '10:00', cached: 45, uncached: 310 },
  { time: '10:05', cached: 50, uncached: 350 },
  { time: '10:10', cached: 42, uncached: 280 },
  { time: '10:15', cached: 48, uncached: 420 },
  { time: '10:20', cached: 55, uncached: 390 },
  { time: '10:25', cached: 40, uncached: 310 },
  { time: '10:30', cached: 60, uncached: 290 },
];

// --- Zustand Store ---
interface MonitorState {
  nodes: NodeData[];
  edges: EdgeData[];
  gatewayMetrics: GatewayMetric[];
  globalCacheHitRate: number;
  totalNetworkCapacity: number;
  
  // Actions
  simulateLiveTick: () => void;
  startSimulation: () => void;
  stopSimulation: () => void;
}

let simulationInterval: any = null;

export const useMonitorStore = create<MonitorState>((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,
  gatewayMetrics: initialGateway,
  globalCacheHitRate: 84.2,
  totalNetworkCapacity: 505.0,

  simulateLiveTick: () => {
    set((state) => {
      // 1. Randomly fluctuate storage on one node
      const randomNodeIndex = Math.floor(Math.random() * state.nodes.length);
      const newNodes = [...state.nodes];
      const targetNode = newNodes[randomNodeIndex];
      
      const currentStorageTB = parseFloat(targetNode.storage.split(' ')[0]);
      // Fluctuate by -0.5 to +1.0 TB
      const delta = (Math.random() * 1.5) - 0.5;
      const newStorage = Math.max(0, currentStorageTB + delta);
      
      newNodes[randomNodeIndex] = {
        ...targetNode,
        storage: `${newStorage.toFixed(1)} TB`,
        status: Math.random() > 0.9 ? 'syncing' : 'active' // Occasionally put into sync mode
      };

      // 2. Generate a new Gateway Metric tick
      const lastMetric = state.gatewayMetrics[state.gatewayMetrics.length - 1];
      const lastTimeStr = lastMetric.time;
      const [hours, minutes] = lastTimeStr.split(':').map(Number);
      
      let newMins = minutes + 5;
      let newHours = hours;
      if (newMins >= 60) {
        newMins = 0;
        newHours = (hours + 1) % 24;
      }
      
      const newTime = `${newHours.toString().padStart(2, '0')}:${newMins.toString().padStart(2, '0')}`;
      
      const newMetric: GatewayMetric = {
        time: newTime,
        cached: Math.floor(Math.random() * 30) + 35, // 35-65ms
        uncached: Math.floor(Math.random() * 200) + 250, // 250-450ms
      };
      
      // Keep last 10 points
      const newGatewayMetrics = [...state.gatewayMetrics.slice(1), newMetric];

      // 3. Fluctuate global metrics
      const newHitRate = Math.min(99.9, Math.max(60.0, state.globalCacheHitRate + ((Math.random() * 2) - 1)));
      const newTotalCap = state.totalNetworkCapacity + (delta > 0 ? delta : 0); // Only goes up on average

      // 4. Randomize active edges (simulate data bursts)
      const newEdges = initialEdges.map(edge => ({
        ...edge,
        value: Math.random() > 0.3 ? (Math.random() * 3 + 0.5) : 0 // 30% chance edge is idle
      })).filter(e => e.value > 0);

      return {
        nodes: newNodes,
        gatewayMetrics: newGatewayMetrics,
        globalCacheHitRate: Number(newHitRate.toFixed(1)),
        totalNetworkCapacity: Number(newTotalCap.toFixed(1)),
        edges: newEdges
      };
    });
  },

  startSimulation: () => {
    if (simulationInterval) return;
    simulationInterval = setInterval(() => {
      get().simulateLiveTick();
    }, 3000); // Tick every 3 seconds for visual effect
  },

  stopSimulation: () => {
    if (simulationInterval) {
      clearInterval(simulationInterval);
      simulationInterval = null;
    }
  }
}));
