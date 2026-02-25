'use client';

import { HardDrive, Server, Zap, Database } from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

import { useMonitorStore } from '../lib/store';

function KPICard({ title, value, subtext, icon: Icon, color }: any) {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between h-36 border-l-4" style={{ borderLeftColor: color }}>
            <div className="flex justify-between items-start">
                <h3 className="text-slate-500 font-medium text-sm">{title}</h3>
                <div className={`p-2 rounded-lg bg-opacity-10`} style={{ backgroundColor: `${color}15`, color: color }}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>
            <div>
                <p className="text-3xl font-bold text-slate-800 tracking-tight">{value}</p>
                <p className="text-sm text-slate-500 mt-1">{subtext}</p>
            </div>
        </div>
    );
}

export default function StorageMonitor() {
    const { nodes, totalNetworkCapacity, startSimulation, stopSimulation } = useMonitorStore();

    // Auto-start simulation when viewing the page
    require('react').useEffect(() => {
        startSimulation();
        return () => stopSimulation();
    }, [startSimulation, stopSimulation]);

    // Derive metrics from live nodes
    const activeNodes = nodes.filter(n => n.status === 'active').length + 12400; // Add baseline

    // Derive mock capacity data for the chart from live nodes
    const capacityData = nodes.map(n => {
        const storageNum = parseFloat(n.storage.split(' ')[0]);
        return {
            name: n.name,
            capacity: storageNum * 1.5, // Fake total capacity based on current
            used: storageNum
        };
    });

    const usedStorage = nodes.reduce((acc, curr) => acc + parseFloat(curr.storage.split(' ')[0]), 0) + 200;

    return (
        <div className="flex flex-col h-full bg-[#f8fafc] p-8 overflow-y-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-black tracking-tight text-slate-900">Node Storage Metrics</h1>
                <p className="text-slate-500 mt-2 font-medium">Monitor active IPFS nodes and network-wide storage contributions.</p>
            </header>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <KPICard title="Total Network Capacity" value={`${totalNetworkCapacity} TB`} subtext="+24.5 TB this week" icon={Database} color="#3b82f6" />
                <KPICard title="Used Storage" value={`${usedStorage.toFixed(1)} TB`} subtext={`${((usedStorage / totalNetworkCapacity) * 100).toFixed(1)}% capacity utilized`} icon={HardDrive} color="#10b981" />
                <KPICard title="Active Nodes" value={activeNodes.toLocaleString()} subtext="143 joined recently" icon={Server} color="#8b5cf6" />
                <KPICard title="Avg Replication Rate" value="4.2x" subtext="Files have 4+ copies" icon={Zap} color="#f59e0b" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Chart */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div className="mb-6">
                        <h2 className="text-lg font-bold text-slate-800">Regional Capacity Utilization</h2>
                        <p className="text-sm text-slate-500 font-medium">Total available vs used storage across primary datacenters (TB).</p>
                    </div>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={capacityData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="capacity" name="Total Capacity (TB)" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="used" name="Used Storage (TB)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* List of Top Nodes */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col">
                    <div className="mb-6">
                        <h2 className="text-lg font-bold text-slate-800">Top Storage Contributors</h2>
                        <p className="text-sm text-slate-500 font-medium">Highest capacity peers in the DHT.</p>
                    </div>

                    <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2">
                        {nodes.map((node) => (
                            <div key={node.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="font-mono text-sm font-bold text-blue-600 truncate max-w-[140px] group-hover:text-blue-700">{node.id.padStart(16, '12D3KooW')}</div>
                                    <div className="text-xs font-bold text-slate-700 bg-white px-2 py-1 rounded-md shadow-sm border border-slate-200">{node.storage}</div>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-slate-500 font-medium">{node.name}</span>
                                    <div className="flex items-center gap-1.5">
                                        <div className={`w-1.5 h-1.5 rounded-full ${node.status === 'active' ? 'bg-emerald-500' : node.status === 'warning' ? 'bg-rose-500' : 'bg-amber-500'}`} />
                                        <span className="text-slate-600 font-medium capitalize">{node.status}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
