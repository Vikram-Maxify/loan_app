// AdminLayout.jsx
import React, { useState } from 'react';
import {
    Menu, X, LayoutDashboard, Users, FileText, Settings, LogOut,
    UserCog, ChevronDown, Bell, Search, UserCircle
} from 'lucide-react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { adminLogout } from '../../redux/slice/adminSlice';

const AdminLayout = () => {
    const dispatch = useDispatch();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    // Nav items with correct paths and dedicated icons
    const navItems = [
        { name: 'Dashboard', icon: LayoutDashboard, to: '/admin/dashboard' },
        { name: 'Users', icon: Users, to: '/admin/users' },
        { name: 'Applications', icon: FileText, to: '/admin/applications' },
        { name: 'UPI Settings', icon: Settings, to: '/admin/upi-settings' },
        { name: 'Profile', icon: UserCog, to: '/admin/profile' },
        { name: 'Amount Setting', icon: Settings, to: '/admin/amount-setting' },
    ];

    // Check if a nav item is active
    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* ========== MOBILE BACKDROP ========== */}
            {sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 bg-black/40 z-40 lg:hidden"
                    aria-hidden="true"
                />
            )}

            {/* ========== SIDEBAR ========== */}
            {/*
                Scroll behaviour:
                - Mobile: fixed to the viewport (inset-y-0), independent from page scroll.
                - Desktop (lg+): sticky + h-screen so the sidebar stays pinned in the
                  viewport while the page scrolls. Only the <nav> inside scrolls
                  (overflow-y-auto), and only when it doesn't fit — so scrolling the
                  page never moves the sidebar, and the sidebar's own scroll never
                  moves the page.
            */}
            <aside
                className={`
                    fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200
                    transform transition-transform duration-300 ease-in-out
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                    lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen lg:inset-auto
                    flex flex-col shadow-xl lg:shadow-none
                `}
            >
                {/* Sidebar header */}
                <div className="h-16 flex items-center gap-2.5 px-6 border-b border-gray-200 shrink-0">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-1.5 rounded-lg">
                        <LayoutDashboard className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold text-gray-800">Admin<span className="font-light text-indigo-600">Kit</span></span>
                </div>

                {/* Navigation — this is the only scrollable part of the sidebar */}
                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const active = isActive(item.to);
                        return (
                            <Link
                                key={item.name}
                                to={item.to}
                                className={`
                                    group relative flex items-center gap-3 px-3 py-2.5 rounded-lg
                                    transition-colors
                                    ${active
                                        ? 'bg-indigo-50 text-indigo-700'
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                    }
                                `}
                                onClick={() => setSidebarOpen(false)}
                            >
                                {active && (
                                    <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-gradient-to-b from-indigo-500 to-purple-600" />
                                )}
                                <item.icon className={`w-5 h-5 shrink-0 ${active ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                                <span className="font-medium text-sm">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Sidebar footer */}
                <div className="p-3 border-t border-gray-200 shrink-0">
                    <button
                        type="button"
                        onClick={() => dispatch(adminLogout())}
                        className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium text-sm">Logout</span>
                    </button>
                </div>
            </aside>

            {/* ========== MAIN CONTENT ========== */}
            {/* No overflow set here on purpose — the window scrolls the page,
                while the sticky sidebar above stays put. */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* ========== TOPBAR ========== */}
                <header className="h-16 bg-white border-b border-gray-200 sticky top-0 z-30 flex items-center px-4 lg:px-6">
                    {/* Mobile menu toggle */}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="lg:hidden p-2 -ml-2 rounded-md hover:bg-gray-100 shrink-0"
                        aria-label="Toggle sidebar"
                    >
                        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>

                    {/* Search bar */}
                    <div className="flex-1 flex items-center justify-end lg:justify-between min-w-0">
                        <div className="hidden md:flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg w-full max-w-xs">
                            <Search className="w-4 h-4 text-gray-500 shrink-0" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="bg-transparent outline-none text-sm w-full min-w-0"
                            />
                        </div>

                        {/* Right side: notifications + profile */}
                        <div className="flex items-center gap-1 sm:gap-3">
                            <button className="md:hidden p-2 rounded-full hover:bg-gray-100" aria-label="Search">
                                <Search className="w-5 h-5 text-gray-600" />
                            </button>

                            <button className="p-2 rounded-full hover:bg-gray-100 relative" aria-label="Notifications">
                                <Bell className="w-5 h-5 text-gray-600" />
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                            </button>

                            <div className="flex items-center gap-2 pl-1 sm:pl-3 sm:border-l border-gray-200">
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
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;