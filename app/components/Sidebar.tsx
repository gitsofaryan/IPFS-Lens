'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Globe, HardDrive, Activity } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const navItems = [
    { name: 'Network Map', href: '/', icon: Globe },
    { name: 'Storage Monitor', href: '/storage', icon: HardDrive },
    { name: 'Gateway Performance', href: '/gateway', icon: Activity },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="flex h-screen w-64 flex-col bg-[var(--sidebar)] border-r border-[var(--border)] px-4 py-6 shadow-sm z-10">
            <div className="flex items-center gap-3 mb-10 px-2">
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                    <Globe className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-[var(--foreground)] tracking-tight">IPFS Lens</span>
            </div>

            <nav className="flex flex-col gap-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                                isActive
                                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                                    : 'text-[var(--sidebar-foreground)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--foreground)]'
                            )}
                        >
                            <item.icon className="h-5 w-5" />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto px-2 pb-4">
                <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-4 border border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Network Status</p>
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                        </span>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">All Systems Operational</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
