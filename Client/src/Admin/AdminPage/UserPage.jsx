import React, { useEffect, useRef } from 'react';
import {
    Search, Filter, UserCircle, Phone, Calendar, Mail
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers } from '../../redux/slice/adminSlice';

const UsersPage = () => {
    const dispatch = useDispatch();
    const { users, loading, error, isLoaded } = useSelector((state) => state.admin);
    const initialFetchDone = useRef(false);

    useEffect(() => {
        if (!isLoaded && !loading && !initialFetchDone.current) {
            initialFetchDone.current = true;
            dispatch(getAllUsers());
        }
    }, [dispatch, loading, isLoaded]);

    const handleRefresh = () => {
        initialFetchDone.current = false;
        dispatch(getAllUsers());
    };

    return (
        <div className="p-4 lg:p-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Users Management</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage user accounts</p>
                </div>
                <div className="flex items-center gap-3 mt-3 sm:mt-0">
                    <button 
                        onClick={handleRefresh}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        {loading ? 'Loading...' : 'Refresh'}
                    </button>
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

            {/* Users Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {loading && (
                    <div className="p-6 text-sm text-gray-500">
                        <div className="flex items-center justify-center gap-3">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
                            Loading users...
                        </div>
                    </div>
                )}

                {error && (
                    <div className="p-6 text-sm text-red-600 bg-red-50">
                        <div className="flex items-center justify-between">
                            <span>{error}</span>
                            <button 
                                onClick={handleRefresh}
                                className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors text-xs font-medium"
                            >
                                Retry
                            </button>
                        </div>
                    </div>
                )}

                {!loading && !error && users && users.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        User
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Phone
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Joined Date
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {users.map((user) => (
                                    <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-full flex items-center justify-center flex-shrink-0">
                                                    <UserCircle className="w-6 h-6 text-indigo-600" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {user.fullName || user.mobile || 'Unnamed User'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <Mail className="w-4 h-4 text-gray-400" />
                                                <span className="text-sm text-gray-600">
                                                    {user.email || 'Not provided'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <Phone className="w-4 h-4 text-gray-400" />
                                                <span className="text-sm text-gray-600">
                                                    {user.mobile ? `+91 ${user.mobile}` : 'Not provided'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-gray-400" />
                                                <span className="text-sm text-gray-600">
                                                    {new Date(user.createdAt).toLocaleDateString('en-IN', {
                                                        day: '2-digit',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && (!users || users.length === 0) && (
                    <div className="text-center py-12">
                        <UserCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-600">No users found</h3>
                        <p className="text-sm text-gray-400">Start adding users to your platform</p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {users && users.length > 0 && (
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
            )}
        </div>
    );
};

export default UsersPage;