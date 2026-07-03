import React, { useEffect } from 'react';
import {
    Search, Filter, CheckCircle, XCircle, Clock,
    UserCircle, Phone, Calendar
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers } from '../../redux/slice/adminSlice';

const UsersPage = () => {
    const dispatch = useDispatch();
    const { users, loading, error } = useSelector((state) => state.admin);

    useEffect(() => {
        dispatch(getAllUsers());
    }, [dispatch]);

    // Calculate verification progress
    const getVerificationProgress = (steps) => {
        const totalSteps = Object.keys(steps).length;
        const completedSteps = Object.values(steps).filter(value => value === true).length;
        return {
            completed: completedSteps,
            total: totalSteps,
            percentage: Math.round((completedSteps / totalSteps) * 100)
        };
    };

    // Get status badge color
    const getStatusBadge = (status) => {
        const statusConfig = {
            verified: { color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle },
            active: { color: 'bg-blue-100 text-blue-700', icon: CheckCircle },
            pending: { color: 'bg-yellow-100 text-yellow-700', icon: Clock },
            inactive: { color: 'bg-red-100 text-red-700', icon: XCircle },
            new: { color: 'bg-gray-100 text-gray-700', icon: Clock },
        };
        return statusConfig[status] || statusConfig.new;
    };

    // Get step icon and color
    const getStepStatus = (completed) => {
        return completed
            ? { icon: CheckCircle, color: 'text-emerald-500' }
            : { icon: XCircle, color: 'text-gray-300' };
    };

    // Step labels
    const stepLabels = {
        emailVerified: 'Email',
        phoneVerified: 'Phone',
        identityVerified: 'Identity',
        addressVerified: 'Address',
        kycVerified: 'KYC'
    };

    return (
        <div className="p-4 lg:p-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Users Management</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage and verify user accounts</p>
                </div>
                <div className="flex items-center gap-3 mt-3 sm:mt-0">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                        <Filter className="w-4 h-4" />
                        Filter
                    </button>
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                        Add User
                    </button>
                </div>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search users by name or email..."
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                </div>
            </div>

            {/* Users Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                {loading && (
                    <div className="col-span-full bg-white rounded-xl border border-gray-200 p-6 text-sm text-gray-500">
                        Loading users...
                    </div>
                )}

                {error && (
                    <div className="col-span-full bg-red-50 rounded-xl border border-red-200 p-6 text-sm text-red-600">
                        {error}
                    </div>
                )}

                {!loading && !error && users.map((user) => {
                    const userView = {
                        ...user,
                        id: user._id,
                        name: user.fullName || user.mobile || 'Unnamed User',
                        phone: user.mobile ? `+91 ${user.mobile}` : 'Not provided',
                        joinedDate: user.createdAt,
                        status: user.isVerified ? 'verified' : 'pending',
                        verificationSteps: {
                            emailVerified: Boolean(user.email),
                            phoneVerified: Boolean(user.mobile && user.isVerified),
                            identityVerified: false,
                            addressVerified: false,
                            kycVerified: false,
                        },
                    };
                    const progress = getVerificationProgress(userView.verificationSteps);
                    const statusBadge = getStatusBadge(userView.status);
                    const StatusIcon = statusBadge.icon;

                    return (
                        <div key={userView.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow p-5">
                            {/* User Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-full flex items-center justify-center">
                                        <UserCircle className="w-8 h-8 text-indigo-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800">{userView.name}</h3>
                                        <p className="text-sm text-gray-500">{user.email || 'No email provided'}</p>
                                    </div>
                                </div>
                                <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusBadge.color}`}>
                                    <StatusIcon className="w-3.5 h-3.5" />
                                    {userView.status.charAt(0).toUpperCase() + userView.status.slice(1)}
                                </span>
                            </div>

                            {/* User Details */}
                            <div className="space-y-2 text-sm mb-4">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Phone className="w-4 h-4 text-gray-400" />
                                    <span>{userView.phone}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Calendar className="w-4 h-4 text-gray-400" />
                                    <span>Joined: {new Date(userView.joinedDate).toLocaleDateString('en-IN', {
                                        day: '2-digit',
                                        month: 'short',
                                        year: 'numeric'
                                    })}</span>
                                </div>
                            </div>

                            {/* Verification Progress */}
                            <div className="border-t border-gray-100 pt-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-700">Verification Progress</span>
                                    <span className="text-sm font-semibold text-indigo-600">
                                        {progress.completed}/{progress.total} Steps
                                    </span>
                                </div>

                                {/* Progress Bar */}
                                <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                                    <div
                                        className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                                        style={{ width: `${progress.percentage}%` }}
                                    />
                                </div>

                                {/* Verification Steps */}
                                <div className="grid grid-cols-5 gap-1 mt-3">
                                    {Object.entries(userView.verificationSteps).map(([step, completed]) => {
                                        const { icon: Icon, color } = getStepStatus(completed);
                                        return (
                                            <div key={step} className="flex flex-col items-center">
                                                <div className="relative group">
                                                    <Icon className={`w-5 h-5 ${color} transition-colors`} />
                                                    <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                                                        {stepLabels[step]}
                                                    </div>
                                                </div>
                                                <span className="text-[10px] text-gray-500 mt-0.5 truncate max-w-full">
                                                    {stepLabels[step]}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Progress Summary */}
                                <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                                    <span>Completed: {progress.completed}</span>
                                    <span>Remaining: {progress.total - progress.completed}</span>
                                    <span className={`font-medium ${progress.percentage === 100 ? 'text-emerald-600' :
                                            progress.percentage >= 60 ? 'text-blue-600' :
                                                'text-gray-500'
                                        }`}>
                                        {progress.percentage}%
                                    </span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
                                <button className="flex-1 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors">
                                    View Profile
                                </button>
                                <button className="flex-1 px-3 py-1.5 bg-gray-50 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
                                    Verify
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Empty State (if no users) */}
            {users.length === 0 && (
                <div className="text-center py-12">
                    <UserCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-600">No users found</h3>
                    <p className="text-sm text-gray-400">Start adding users to your platform</p>
                </div>
            )}

            {/* Pagination */}
            <div className="mt-6 flex items-center justify-between">
                <p className="text-sm text-gray-500">Showing 1-{users.length} of {users.length} users</p>
                <div className="flex gap-2">
                    <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50" disabled>
                        Previous
                    </button>
                    <button className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition-colors">
                        1
                    </button>
                    <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UsersPage;
