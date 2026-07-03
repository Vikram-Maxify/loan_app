import React, { useState } from 'react';
import {
    Menu, X, LayoutDashboard, Users, Settings, LogOut,
    ChevronDown, Bell, Search, UserCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Dummy nav items
    const navItems = [
        { name: 'Dashboard', icon: LayoutDashboard, to: '#' },
        { name: 'Users', icon: Users, to: '#' },
        { name: 'Settings', icon: Settings, to: '#' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* ========== SIDEBAR ========== */}
            <aside
                className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:inset-auto
          flex flex-col
        `}
            >
                {/* Sidebar header */}
                <div className="h-16 flex items-center px-6 border-b border-gray-200">
                    <span className="text-xl font-bold text-indigo-600">Admin</span>
                    <span className="text-xl font-light text-gray-700">Kit</span>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    ))}
                </nav>

                {/* Sidebar footer */}
                <div className="p-4 border-t border-gray-200">
                    <button className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors">
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* ========== MAIN CONTENT ========== */}
            <div className="flex-1 flex flex-col min-h-screen">
                {/* ========== TOPBAR ========== */}
                <header className="h-16 bg-white border-b border-gray-200 sticky top-0 z-40 flex items-center px-4 lg:px-6">
                    {/* Mobile menu toggle */}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="lg:hidden p-2 -ml-2 rounded-md hover:bg-gray-100"
                    >
                        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>

                    {/* Search bar */}
                    <div className="flex-1 flex items-center justify-end lg:justify-between">
                        <div className="hidden lg:flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg w-72">
                            <Search className="w-4 h-4 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="bg-transparent outline-none text-sm w-full"
                            />
                        </div>

                        {/* Right side: notifications + profile */}
                        <div className="flex items-center gap-3">
                            <button className="p-2 rounded-full hover:bg-gray-100 relative">
                                <Bell className="w-5 h-5 text-gray-600" />
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                            </button>

                            <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
                                <div className="flex items-center gap-2 cursor-pointer">
                                    <UserCircle className="w-8 h-8 text-gray-400" />
                                    <span className="hidden sm:inline text-sm font-medium text-gray-700">Admin</span>
                                    <ChevronDown className="w-4 h-4 text-gray-500 hidden sm:inline" />
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* ========== PAGE CONTENT ========== */}
                <main className="flex-1 p-4 lg:p-6">
                    {/* Dashboard cards grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
                        {['Total Users', 'Revenue', 'Orders', 'Visitors'].map((title, i) => (
                            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                                <p className="text-sm text-gray-500 font-medium">{title}</p>
                                <p className="text-2xl font-bold text-gray-800 mt-1">
                                    {i === 0 ? '12,345' : i === 1 ? '$54,321' : i === 2 ? '789' : '10.2k'}
                                </p>
                                <div className="mt-3 text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full inline-block">
                                    +{i + 2}% from last month
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Placeholder chart / table area */}
                    <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 h-64 flex items-center justify-center text-gray-400">
                            <span className="text-sm">📊 Chart placeholder</span>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 h-64 flex items-center justify-center text-gray-400">
                            <span className="text-sm">📋 Recent activity</span>
                        </div>
                    </div>

                    {/* Additional content row */}
                    <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Welcome back, Admin</h3>
                        <p className="text-gray-700 mt-1">This is your dashboard layout with sidebar and topbar.</p>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;