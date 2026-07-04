// Admin/AdminPage/AdminProfile.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminProfile = () => {
    const navigate = useNavigate();
    const [adminData] = useState({
        success: true,
        admin: {
            _id: "6a489a7c13b89f2c88c27264",
            mobile: "8283848586",
            email: "admin@gmail.com",
            fullName: "Super Admin",
            termsAccepted: false,
            isVerified: false,
            role: "admin",
            createdAt: "2026-07-04T05:30:36.135Z",
            updatedAt: "2026-07-04T05:30:36.135Z",
            __v: 0
        }
    });

    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        fullName: adminData.admin.fullName,
        email: adminData.admin.email,
        mobile: adminData.admin.mobile
    });

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = () => {
        // Here you would make an API call to update the admin data
        console.log('Updated Data:', editData);
        setIsEditing(false);
        // Show success message
    };

    const handleCancel = () => {
        setEditData({
            fullName: adminData.admin.fullName,
            email: adminData.admin.email,
            mobile: adminData.admin.mobile
        });
        setIsEditing(false);
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Admin Profile</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage your account settings and preferences</p>
                </div>
                <div className="flex gap-3">
                    {!isEditing ? (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                            Edit Profile
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={handleCancel}
                                className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-6 py-2.5 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-md hover:shadow-lg"
                            >
                                Save Changes
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Main Card */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Profile Header with Gradient */}
                <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-8 py-10">
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/50">
                            <span className="text-4xl font-bold text-white">
                                {adminData.admin.fullName.split(' ').map(n => n[0]).join('')}
                            </span>
                        </div>
                        <div className="text-white">
                            <h2 className="text-2xl font-bold">{adminData.admin.fullName}</h2>
                            <p className="text-white/80 flex items-center gap-2">
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                                {adminData.admin.role.charAt(0).toUpperCase() + adminData.admin.role.slice(1)}
                            </p>
                            <div className="flex gap-3 mt-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${adminData.admin.isVerified
                                        ? 'bg-green-400/30 text-green-100'
                                        : 'bg-yellow-400/30 text-yellow-100'
                                    }`}>
                                    {adminData.admin.isVerified ? '✓ Verified' : '⏳ Pending Verification'}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${adminData.admin.termsAccepted
                                        ? 'bg-green-400/30 text-green-100'
                                        : 'bg-red-400/30 text-red-100'
                                    }`}>
                                    {adminData.admin.termsAccepted ? '✓ Terms Accepted' : '✗ Terms Pending'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Details */}
                <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Left Column */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-3">
                                Personal Information
                            </h3>

                            {/* Full Name */}
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                        <circle cx="12" cy="7" r="4" />
                                    </svg>
                                    Full Name
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={editData.fullName}
                                        onChange={handleEditChange}
                                        className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none focus:shadow-[0_0_0_4px_rgba(79,70,229,0.1)] transition-all"
                                    />
                                ) : (
                                    <p className="text-gray-800 font-medium text-lg">{adminData.admin.fullName}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" />
                                        <path d="M22 6L12 13L2 6" />
                                    </svg>
                                    Email Address
                                </label>
                                {isEditing ? (
                                    <input
                                        type="email"
                                        name="email"
                                        value={editData.email}
                                        onChange={handleEditChange}
                                        className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none focus:shadow-[0_0_0_4px_rgba(79,70,229,0.1)] transition-all"
                                    />
                                ) : (
                                    <p className="text-gray-800 font-medium">{adminData.admin.email}</p>
                                )}
                            </div>

                            {/* Mobile */}
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                                        <line x1="12" y1="18" x2="12.01" y2="18" />
                                    </svg>
                                    Mobile Number
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="mobile"
                                        value={editData.mobile}
                                        onChange={handleEditChange}
                                        className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none focus:shadow-[0_0_0_4px_rgba(79,70,229,0.1)] transition-all"
                                    />
                                ) : (
                                    <p className="text-gray-800 font-medium">+91 {adminData.admin.mobile}</p>
                                )}
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-3">
                                Account Details
                            </h3>

                            {/* Role */}
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                    </svg>
                                    Role
                                </label>
                                <p className="text-gray-800 font-medium">
                                    <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                                        {adminData.admin.role.toUpperCase()}
                                    </span>
                                </p>
                            </div>

                            {/* Admin ID */}
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                        <line x1="3" y1="9" x2="21" y2="9" />
                                        <line x1="3" y1="15" x2="21" y2="15" />
                                        <line x1="9" y1="21" x2="9" y2="9" />
                                    </svg>
                                    Admin ID
                                </label>
                                <p className="text-gray-700 font-mono text-sm bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                                    {adminData.admin._id}
                                </p>
                            </div>

                            {/* Created At */}
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10" />
                                        <polyline points="12 6 12 12 16 14" />
                                    </svg>
                                    Account Created
                                </label>
                                <p className="text-gray-800 font-medium">{formatDate(adminData.admin.createdAt)}</p>
                            </div>

                            {/* Last Updated */}
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10" />
                                        <polyline points="12 6 12 12 8 14" />
                                    </svg>
                                    Last Updated
                                </label>
                                <p className="text-gray-800 font-medium">{formatDate(adminData.admin.updatedAt)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Status Cards */}
                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className={`p-4 rounded-xl border-2 ${adminData.admin.isVerified
                                ? 'border-green-200 bg-green-50'
                                : 'border-yellow-200 bg-yellow-50'
                            }`}>
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-full ${adminData.admin.isVerified ? 'bg-green-100' : 'bg-yellow-100'
                                    }`}>
                                    {adminData.admin.isVerified ? (
                                        <svg className="w-6 h-6 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                            <polyline points="22 4 12 14.01 9 11.01" />
                                        </svg>
                                    ) : (
                                        <svg className="w-6 h-6 text-yellow-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="12" cy="12" r="10" />
                                            <line x1="12" y1="8" x2="12" y2="12" />
                                            <line x1="12" y1="16" x2="12.01" y2="16" />
                                        </svg>
                                    )}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800">Verification Status</p>
                                    <p className={`text-sm ${adminData.admin.isVerified ? 'text-green-600' : 'text-yellow-600'
                                        }`}>
                                        {adminData.admin.isVerified ? 'Account Verified' : 'Pending Verification'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className={`p-4 rounded-xl border-2 ${adminData.admin.termsAccepted
                                ? 'border-green-200 bg-green-50'
                                : 'border-red-200 bg-red-50'
                            }`}>
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-full ${adminData.admin.termsAccepted ? 'bg-green-100' : 'bg-red-100'
                                    }`}>
                                    {adminData.admin.termsAccepted ? (
                                        <svg className="w-6 h-6 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                            <polyline points="22 4 12 14.01 9 11.01" />
                                        </svg>
                                    ) : (
                                        <svg className="w-6 h-6 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="12" cy="12" r="10" />
                                            <line x1="15" y1="9" x2="9" y2="15" />
                                            <line x1="9" y1="9" x2="15" y2="15" />
                                        </svg>
                                    )}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800">Terms & Conditions</p>
                                    <p className={`text-sm ${adminData.admin.termsAccepted ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                        {adminData.admin.termsAccepted ? 'Terms Accepted' : 'Terms Not Accepted'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* JSON Data Display */}
                    <div className="mt-8">
                        <details className="group">
                            <summary className="flex items-center gap-2 text-sm font-medium text-gray-600 cursor-pointer hover:text-indigo-600 transition-colors">
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="6 9 12 15 18 9" />
                                </svg>
                                View Raw JSON Data
                            </summary>
                            <div className="mt-3 p-4 bg-gray-900 rounded-xl overflow-x-auto">
                                <pre className="text-green-400 text-xs font-mono leading-relaxed">
                                    {JSON.stringify(adminData, null, 2)}
                                </pre>
                            </div>
                        </details>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminProfile;