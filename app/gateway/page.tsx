'use client';

import { Activity, Clock, FileCheck, Layers } from 'lucide-react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
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

export default function GatewayMonitor() {
    const { gatewayMetrics, globalCacheHitRate, startSimulation, stopSimulation } = useMonitorStore();

    require('react').useEffect(() => {
        startSimulation();
        return () => stopSimulation();
    }, [startSimulation, stopSimulation]);

    const latestMetric = gatewayMetrics[gatewayMetrics.length - 1] || { cached: 0, uncached: 0 };

    // Simulate content types adjusting based on hit rate
    const liveContentTypes = [
        { type: 'application/json', requests: '1.2M', avgTime: `${Math.floor(latestMetric.cached * 2.5)}ms` },
        { type: 'image/jpeg', requests: '850K', avgTime: `${Math.floor(latestMetric.uncached * 0.8)}ms` },
        { type: 'text/html (IPNS)', requests: '420K', avgTime: `${latestMetric.uncached * 2 + 100}ms` },
        { type: 'video/mp4', requests: '110K', avgTime: `${latestMetric.uncached * 3 + 200}ms` },
    ];

    return (
        <div className="flex flex-col h-full bg-[#f8fafc] p-8 overflow-y-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-black tracking-tight text-slate-900">Gateway Performance</h1>
                <p className="text-slate-500 mt-2 font-medium">Analyze retrieval speeds, cache hits, and IPNS resolution times.</p>
            </header>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <KPICard title="Global Cache Hit Rate" value={`${globalCacheHitRate}%`} subtext="Live simulated traffic" icon={FileCheck} color="#10b981" />
                <KPICard title="Avg Cached Latency" value={`${latestMetric.cached} ms`} subtext="Target: < 50ms" icon={Clock} color="#3b82f6" />
                <KPICard title="Avg Uncached Latency" value={`${latestMetric.uncached} ms`} subtext="DHT routing overhead" icon={Activity} color="#f59e0b" />
                <KPICard title="Active Requests/sec" value={`${Math.floor(globalCacheHitRate * 50).toLocaleString()}`} subtext="Fluctuating with hit rate" icon={Layers} color="#8b5cf6" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Chart */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col">
                    <div className="mb-6 flex justify-between items-end">
                        <div>
                            <h2 className="text-lg font-bold text-slate-800">Retrieval Latency (ms)</h2>
                            <p className="text-sm text-slate-500 font-medium">Cached vs Uncached content resolution times over the last 30 minutes.</p>
                        </div>
                        <div className="flex items-center gap-4 text-sm font-medium">
                            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-[#3b82f6]" />Cached</div>
                            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-[#f59e0b]" />Uncached</div>
                        </div>
                    </div>

                    <div className="flex-1 w-full min-h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={gatewayMetrics} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
                                />
                                <Line type="monotone" dataKey="cached" name="Cached (ms)" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6' }} activeDot={{ r: 6 }} />
                                <Line type="monotone" dataKey="uncached" name="Uncached (ms)" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, fill: '#f59e0b' }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Content Type Breakdown */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col">
                    <div className="mb-6">
                        <h2 className="text-lg font-bold text-slate-800">Response Profiles</h2>
                        <p className="text-sm text-slate-500 font-medium">Analysis by requested Mime-type and resolution strategies.</p>
                    </div>

                    <div className="flex-1 flex flex-col gap-4 overflow-y-auto">
                        {liveContentTypes.map((ct) => (
                            <div key={ct.type} className="p-4 rounded-xl border border-slate-100 bg-slate-50">
                                <div className="flex justify-between items-center mb-2">
                                    <div className="font-mono text-sm font-bold text-slate-700">{ct.type}</div>
                                    <div className="text-xs font-bold text-slate-500 bg-white px-2 py-1 rounded-md shadow-sm border border-slate-200">{ct.requests} reqs</div>
                                </div>
                                <div className="flex justify-between items-baseline text-sm">
                                    <span className="text-slate-500 font-medium">Avg Latency</span>
                                    <span className={`font-bold ${parseInt(ct.avgTime) > 500 ? 'text-amber-500' : 'text-emerald-500'}`}>{ct.avgTime}</span>
                                </div>

                                {/* Visual Progress Bar for Latency relative to others */}
                                <div className="w-full bg-slate-200 rounded-full h-1.5 mt-3">
                                    <div
                                        className={`h-1.5 rounded-full ${parseInt(ct.avgTime) > 500 ? 'bg-amber-400' : 'bg-emerald-400'}`}
                                        style={{ width: `${Math.min((parseInt(ct.avgTime) / 1500) * 100, 100)}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
