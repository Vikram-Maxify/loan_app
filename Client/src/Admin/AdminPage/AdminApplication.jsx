// src/pages/Admin/AdminApplication.jsx
import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    getAllApplications,
    getApplicationById,
    getApplicationsByUserId,
    clearApplication,
    clearApplications,
    clearApplicationError,
} from '../../redux/slice/adminApplicationSlice';

const AdminApplication = () => {
    const dispatch = useDispatch();
    const { applications, application, loading, error } = useSelector(
        (state) => state.adminApplication
    );

    const [filterType, setFilterType] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (filterType === 'all') {
            dispatch(getAllApplications());
        } else {
            dispatch(getApplicationsByUserId());
        }

        return () => {
            dispatch(clearApplications());
            dispatch(clearApplication());
            dispatch(clearApplicationError());
        };
    }, [dispatch, filterType]);

    const handleViewApplication = (id) => {
        dispatch(getApplicationById(id));
    };

    const handleRefresh = () => {
        if (filterType === 'all') {
            dispatch(getAllApplications());
        } else {
            dispatch(getApplicationsByUserId());
        }
    };

    const handleCloseDetails = () => {
        dispatch(clearApplication());
    };

    // ✅ FIX: Deduplicate applications by _id
    const uniqueApplications = useMemo(() => {
        if (!applications) return [];
        
        // Create a Map with _id as key to ensure uniqueness
        const appMap = new Map();
        applications.forEach(app => {
            if (app?._id && !appMap.has(app._id)) {
                appMap.set(app._id, app);
            }
        });
        return Array.from(appMap.values());
    }, [applications]);

    const filteredApplications = uniqueApplications.filter((app) => {
        if (!searchTerm) return true;
        const searchLower = searchTerm.toLowerCase();
        return (
            app._id?.toLowerCase().includes(searchLower) ||
            app.applicationId?.toLowerCase().includes(searchLower) ||
            app.fullName?.toLowerCase().includes(searchLower) ||
            app.email?.toLowerCase().includes(searchLower) ||
            app.mobileNumber?.includes(searchTerm) ||
            app.aadhaarNumber?.includes(searchTerm) ||
            app.panNumber?.toLowerCase().includes(searchLower)
        );
    });

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatCurrency = (amount) => {
        if (amount === undefined || amount === null || amount === '') return 'N/A';
        return `₹${Number(amount).toLocaleString('en-IN')}`;
    };

    // Turns "yearsInBusiness" -> "Years In Business", "annualTurnover" -> "Annual Turnover"
    const humanizeKey = (key) =>
        key
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, (c) => c.toUpperCase())
            .trim();

    const getPurposeBadge = (purpose) => {
        const map = {
            'business loan': 'bg-purple-100 text-purple-800 border-purple-200',
            'personal loan': 'bg-blue-100 text-blue-800 border-blue-200',
            'home loan': 'bg-green-100 text-green-800 border-green-200',
            'education loan': 'bg-amber-100 text-amber-800 border-amber-200',
            'vehicle loan': 'bg-cyan-100 text-cyan-800 border-cyan-200',
        };
        return map[purpose?.toLowerCase()] || 'bg-indigo-100 text-indigo-800 border-indigo-200';
    };

    // Detail Item Component
    const DetailItem = ({ label, value, small = false }) => {
        if (value === undefined || value === null || value === '') return null;
        return (
            <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</p>
                <p className={`${small ? 'text-sm' : 'text-base'} font-medium text-gray-800 mt-1 break-words`}>
                    {String(value)}
                </p>
            </div>
        );
    };

    // Renders whatever shape employmentDetails happens to have (selfEmployed, salaried, etc.)
    // without assuming a fixed set of fields.
    const EmploymentSection = ({ employmentDetails }) => {
        if (!employmentDetails || Object.keys(employmentDetails).length === 0) return null;

        return (
            <>
                {Object.entries(employmentDetails).map(([category, fields]) => {
                    if (!fields || typeof fields !== 'object') return null;
                    const entries = Object.entries(fields).filter(
                        ([, v]) => v !== undefined && v !== null && v !== ''
                    );
                    if (entries.length === 0) return null;

                    return (
                        <div key={category} className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {entries.map(([fieldKey, fieldValue]) => {
                                const isAmountField = /turnover|income|ctc|salary|amount/i.test(fieldKey);
                                return (
                                    <DetailItem
                                        key={fieldKey}
                                        label={humanizeKey(fieldKey)}
                                        value={isAmountField ? formatCurrency(fieldValue) : fieldValue}
                                    />
                                );
                            })}
                        </div>
                    );
                })}
            </>
        );
    };

    // Section wrapper matching the existing card style
    const Section = ({ title, gradient, iconPath, iconViewBox = '0 0 24 24', children }) => (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className={`bg-gradient-to-r ${gradient} px-6 py-3 border-b border-gray-200`}>
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-600" viewBox={iconViewBox} fill="none" stroke="currentColor" strokeWidth="2">
                        {iconPath}
                    </svg>
                    {title}
                </h3>
            </div>
            {children}
        </div>
    );

    // Application Detail Modal Component
    const ApplicationDetailsModal = ({ application, onClose }) => {
        if (!application) return null;

        const {
            applicationId,
            fullName,
            mobileNumber,
            email,
            aadhaarNumber,
            panNumber,
            purpose,
            forPurposeOfLoan,
            whatDoYouDo,
            termsAccepted,
            createdAt,
            updatedAt,
            _id,
            relativesReferenceContact,
            employmentDetails,
            accountDetails,
            documents,
        } = application;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
                <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[95vh] overflow-y-auto shadow-2xl">
                    {/* Modal Header */}
                    <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
                        <div className="flex items-center gap-3">
                            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-2 rounded-xl">
                                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">Application Details</h2>
                                <p className="text-sm text-gray-500 font-mono">{applicationId || _id}</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <svg className="w-6 h-6 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Status Banner */}
                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <div className="flex items-center gap-4 flex-wrap">
                                    {purpose && (
                                        <span className={`px-4 py-2 inline-flex items-center gap-2 text-sm font-semibold rounded-full border-2 ${getPurposeBadge(purpose)}`}>
                                            <span className="w-2 h-2 rounded-full bg-current"></span>
                                            {purpose}
                                        </span>
                                    )}
                                    <span className="text-sm text-gray-600">
                                        Applied: {formatDate(createdAt)}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className={`text-sm font-medium px-3 py-1 rounded-full ${termsAccepted ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        Terms {termsAccepted ? 'Accepted' : 'Not Accepted'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Personal Information */}
                        <Section
                            title="Personal Information"
                            gradient="from-blue-50 to-indigo-50"
                            iconPath={
                                <>
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </>
                            }
                        >
                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <DetailItem label="Full Name" value={fullName} />
                                <DetailItem label="Email Address" value={email} />
                                <DetailItem label="Mobile Number" value={mobileNumber} />
                                <DetailItem label="Aadhaar Number" value={aadhaarNumber} />
                                <DetailItem label="PAN Number" value={panNumber} />
                                <DetailItem label="Occupation Type" value={whatDoYouDo} />
                            </div>
                        </Section>

                        {/* Loan Details */}
                        <Section
                            title="Loan Details"
                            gradient="from-purple-50 to-pink-50"
                            iconPath={
                                <>
                                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                                </>
                            }
                        >
                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <DetailItem label="Loan Purpose" value={purpose} />
                                <DetailItem label="Purpose Detail" value={forPurposeOfLoan} />
                                <DetailItem label="Applicant Type" value={whatDoYouDo} />
                            </div>
                        </Section>

                        {/* Employment Details - shape-agnostic (self-employed / salaried / etc.) */}
                        {employmentDetails && Object.keys(employmentDetails).length > 0 && (
                            <Section
                                title="Employment Details"
                                gradient="from-orange-50 to-red-50"
                                iconPath={
                                    <>
                                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                                    </>
                                }
                            >
                                <EmploymentSection employmentDetails={employmentDetails} />
                            </Section>
                        )}

                        {/* Reference Contact */}
                        {relativesReferenceContact && (
                            <Section
                                title="Reference Contact"
                                gradient="from-cyan-50 to-sky-50"
                                iconPath={
                                    <>
                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                        <circle cx="9" cy="7" r="4" />
                                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                    </>
                                }
                            >
                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <DetailItem label="Name" value={relativesReferenceContact.relativesName} />
                                    <DetailItem label="Relationship" value={relativesReferenceContact.relationship} />
                                    <DetailItem label="Mobile Number" value={relativesReferenceContact.mobileNumber} />
                                </div>
                            </Section>
                        )}

                        {/* Bank Account Details */}
                        {accountDetails && (
                            <Section
                                title="Bank Account Details"
                                gradient="from-amber-50 to-yellow-50"
                                iconPath={
                                    <>
                                        <rect x="2" y="6" width="20" height="12" rx="2" />
                                        <path d="M2 10h20" />
                                        <path d="M6 14h4" />
                                    </>
                                }
                            >
                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <DetailItem label="Account Holder Name" value={accountDetails.accountHolderName} />
                                    <DetailItem label="Bank Name" value={accountDetails.bankName} />
                                    <DetailItem label="Account Number" value={accountDetails.accountNumber} />
                                    <DetailItem label="IFSC Code" value={accountDetails.ifscCode} />
                                    <DetailItem label="Account Type" value={accountDetails.accountType} />
                                    {accountDetails.cancelledChequeOrPassbook && (
                                        <div>
                                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Cancelled Cheque / Passbook</p>
                                            <a
                                                href={accountDetails.cancelledChequeOrPassbook}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm font-medium text-indigo-600 hover:text-indigo-800 mt-1 inline-flex items-center gap-1"
                                            >
                                                View File
                                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                                    <polyline points="15 3 21 3 21 9" />
                                                    <line x1="10" y1="14" x2="21" y2="3" />
                                                </svg>
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </Section>
                        )}

                        {/* Documents Section (only if present) */}
                        {documents && Object.keys(documents).length > 0 && (
                            <Section
                                title="Uploaded Documents"
                                gradient="from-violet-50 to-fuchsia-50"
                                iconPath={
                                    <>
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                        <polyline points="14 2 14 8 20 8" />
                                    </>
                                }
                            >
                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {Object.entries(documents).map(([key, value]) => (
                                        <div key={key} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-xs text-gray-500 uppercase">{humanizeKey(key)}</p>
                                                    <p className="text-sm font-medium text-gray-800 truncate max-w-[150px]">{value}</p>
                                                </div>
                                                <a
                                                    href={value}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-indigo-600 hover:text-indigo-800"
                                                >
                                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                                        <polyline points="15 3 21 3 21 9" />
                                                        <line x1="10" y1="14" x2="21" y2="3" />
                                                    </svg>
                                                </a>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Section>
                        )}

                        {/* Metadata */}
                        <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase">Created At</p>
                                    <p className="text-sm font-medium text-gray-800">{formatDate(createdAt)}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase">Last Updated</p>
                                    <p className="text-sm font-medium text-gray-800">{formatDate(updatedAt)}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase">Application ID</p>
                                    <p className="text-sm font-mono font-medium text-gray-800">{applicationId || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase">Record ID</p>
                                    <p className="text-sm font-mono font-medium text-gray-800">{_id}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Applications</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage and track all loan applications</p>
                </div>
                <button
                    onClick={handleRefresh}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg flex items-center gap-2"
                    disabled={loading}
                >
                    <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M23 4v6h-6" />
                        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                    </svg>
                    {loading ? 'Loading...' : 'Refresh'}
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-md p-4 mb-6">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <label className="text-sm font-medium text-gray-700 block mb-1">Filter by</label>
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
                        >
                            <option value="all">All Applications</option>
                            <option value="user">My Applications</option>
                        </select>
                    </div>
                    <div className="flex-1">
                        <label className="text-sm font-medium text-gray-700 block mb-1">Search</label>
                        <input
                            type="text"
                            placeholder="Search by ID, name, email, mobile, Aadhaar, PAN..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
                        />
                    </div>
                    <div className="flex items-end">
                        <div className="text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-lg">
                            Total: <span className="font-bold">{filteredApplications.length}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 flex justify-between items-start">
                    <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-red-600 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        <div>
                            <p className="text-red-800 font-medium">Error</p>
                            <p className="text-red-600 text-sm">{typeof error === 'string' ? error : error.message}</p>
                        </div>
                    </div>
                    <button onClick={() => dispatch(clearApplicationError())} className="text-red-600 hover:text-red-800">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>
            )}

            {/* Table */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                {loading && uniqueApplications.length === 0 ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    </div>
                ) : filteredApplications.length === 0 ? (
                    <div className="text-center py-12">
                        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M20 13V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7" />
                            <path d="M16 2v4" />
                            <path d="M8 2v4" />
                            <path d="M22 19a2 2 0 1 1-4 0a2 2 0 0 1 4 0Z" />
                            <path d="M18 19h-3" />
                            <path d="M18 15v-3" />
                            <path d="M3 10h18" />
                        </svg>
                        <p className="text-gray-500 text-lg">No applications found</p>
                        <p className="text-gray-400 text-sm">
                            {searchTerm ? 'Try adjusting your search' : 'Applications will appear here'}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Application ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredApplications.map((app, index) => (
                                    <tr key={app._id || index} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">
                                            {app.applicationId || app._id?.slice(-8).toUpperCase() || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{app.fullName || 'N/A'}</div>
                                            <div className="text-sm text-gray-500">{app.email || app.mobileNumber || 'N/A'}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getPurposeBadge(app.purpose)}`}>
                                                {app.purpose || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {app.whatDoYouDo || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(app.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <button
                                                onClick={() => handleViewApplication(app._id)}
                                                className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-900 font-medium transition-colors"
                                            >
                                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                    <circle cx="12" cy="12" r="3" />
                                                </svg>
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal */}
            {application && (
                <ApplicationDetailsModal application={application?.data || application} onClose={handleCloseDetails} />
            )}
        </div>
    );
};

export default AdminApplication;