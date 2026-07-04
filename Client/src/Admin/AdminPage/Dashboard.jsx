// src/pages/Admin/AdminDashboard.jsx
import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Users,
    FileText,
    CalendarClock,
    Briefcase,
    ArrowUpRight,
    Landmark,
    UserCheck,
} from 'lucide-react';
import { getAllApplications } from '../../redux/slice/adminApplicationSlice';
import { getAllUsers } from '../../redux/slice/adminSlice';

const AdminDashboard = () => {
    const dispatch = useDispatch();

    const { applications = [], loading: applicationsLoading } = useSelector(
        (state) => state.adminApplication
    );
    const { users = [], loading: usersLoading } = useSelector(
        (state) => state.adminUser || {}
    );

    useEffect(() => {
        dispatch(getAllApplications());
        dispatch(getAllUsers());
    }, [dispatch]);

    const stats = useMemo(() => {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const applicationsThisMonth = applications.filter((app) => {
            const created = app.createdAt ? new Date(app.createdAt) : null;
            return created && created >= startOfMonth;
        }).length;

        const selfEmployedCount = applications.filter(
            (app) => app.whatDoYouDo?.toLowerCase() === 'self employed'
        ).length;

        const salariedCount = applications.filter(
            (app) => app.whatDoYouDo?.toLowerCase() !== 'self employed' && app.whatDoYouDo
        ).length;

        // Group by loan purpose for the breakdown panel
        const purposeCounts = applications.reduce((acc, app) => {
            const key = app.purpose || 'Not Specified';
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        }, {});

        const purposeBreakdown = Object.entries(purposeCounts)
            .map(([purpose, count]) => ({
                purpose,
                count,
                percent: applications.length ? Math.round((count / applications.length) * 100) : 0,
            }))
            .sort((a, b) => b.count - a.count);

        const recentApplications = [...applications]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5);

        return {
            applicationsThisMonth,
            selfEmployedCount,
            salariedCount,
            purposeBreakdown,
            recentApplications,
        };
    }, [applications]);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    };

    const purposeBarColors = [
        'bg-indigo-500',
        'bg-purple-500',
        'bg-cyan-500',
        'bg-amber-500',
        'bg-pink-500',
        'bg-emerald-500',
    ];

    const StatCard = ({ label, value, icon: Icon, gradient, loading }) => (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500">{label}</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">
                    {loading ? (
                        <span className="inline-block w-12 h-7 bg-gray-200 rounded animate-pulse" />
                    ) : (
                        value
                    )}
                </p>
            </div>
            <div className={`bg-gradient-to-r ${gradient} p-3 rounded-xl shrink-0`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                <p className="text-gray-500 text-sm mt-1">Overview of users and loan applications</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard
                    label="Total Users"
                    value={users.length}
                    icon={Users}
                    gradient="from-blue-500 to-indigo-600"
                    loading={usersLoading}
                />
                <StatCard
                    label="Total Applications"
                    value={applications.length}
                    icon={FileText}
                    gradient="from-indigo-500 to-purple-600"
                    loading={applicationsLoading}
                />
                <StatCard
                    label="Applications This Month"
                    value={stats.applicationsThisMonth}
                    icon={CalendarClock}
                    gradient="from-purple-500 to-pink-600"
                    loading={applicationsLoading}
                />
                <StatCard
                    label="Self-Employed Applicants"
                    value={stats.selfEmployedCount}
                    icon={Briefcase}
                    gradient="from-amber-500 to-orange-600"
                    loading={applicationsLoading}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Loan Purpose Breakdown */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm lg:col-span-1">
                    <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
                        <Landmark className="w-5 h-5 text-indigo-600" />
                        <h3 className="text-lg font-semibold text-gray-800">Loan Purpose Breakdown</h3>
                    </div>
                    <div className="p-6 space-y-4">
                        {applicationsLoading ? (
                            <div className="space-y-3">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="h-4 bg-gray-100 rounded animate-pulse" />
                                ))}
                            </div>
                        ) : stats.purposeBreakdown.length === 0 ? (
                            <p className="text-sm text-gray-400">No applications yet</p>
                        ) : (
                            stats.purposeBreakdown.map((item, index) => (
                                <div key={item.purpose}>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-sm font-medium text-gray-700">{item.purpose}</span>
                                        <span className="text-sm text-gray-500">
                                            {item.count} <span className="text-gray-400">({item.percent}%)</span>
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full ${purposeBarColors[index % purposeBarColors.length]}`}
                                            style={{ width: `${item.percent}%` }}
                                        />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Recent Applications */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm lg:col-span-2">
                    <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <UserCheck className="w-5 h-5 text-indigo-600" />
                            <h3 className="text-lg font-semibold text-gray-800">Recent Applications</h3>
                        </div>
                        <a
                            href="/admin/applications"
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                        >
                            View all
                            <ArrowUpRight className="w-4 h-4" />
                        </a>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {applicationsLoading ? (
                                    [1, 2, 3].map((i) => (
                                        <tr key={i}>
                                            <td colSpan={4} className="px-6 py-4">
                                                <div className="h-4 bg-gray-100 rounded animate-pulse" />
                                            </td>
                                        </tr>
                                    ))
                                ) : stats.recentApplications.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-400">
                                            No applications yet
                                        </td>
                                    </tr>
                                ) : (
                                    stats.recentApplications.map((app) => (
                                        <tr key={app._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{app.fullName || 'N/A'}</div>
                                                <div className="text-sm text-gray-500">{app.email || app.mobileNumber || 'N/A'}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
                                                    {app.purpose || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {app.whatDoYouDo || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(app.createdAt)}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;