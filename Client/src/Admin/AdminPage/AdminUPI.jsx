// src/pages/Admin/AdminUpi.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { QrCode, Upload, X, CheckCircle2, AlertCircle, Save, Loader2 } from 'lucide-react';
import { fetchUpi, updateUpi, resetUpiState } from '../../redux/slice/adminUpiSlice';

const AdminUpi = () => {
    const dispatch = useDispatch();
    const { upi, loading, success, error } = useSelector((state) => state.upi);

    const [upiId, setUpiId] = useState('');
    const [payeeName, setPayeeName] = useState('');
    const [qrFile, setQrFile] = useState(null);
    const [qrPreview, setQrPreview] = useState(null);
    const [formError, setFormError] = useState(null);

    const qrInputRef = useRef(null);

    useEffect(() => {
        dispatch(fetchUpi());
    }, [dispatch]);

    // Populate the form once the current UPI details arrive
    useEffect(() => {
        if (upi) {
            setUpiId(upi.upiId || '');
            setPayeeName(upi.payeeName || upi.name || '');
            setQrPreview(upi.qrCode || upi.qrImage || null);
        }
    }, [upi]);

    // Auto-clear the success/error banner after a few seconds
    useEffect(() => {
        if (success || error) {
            const timer = setTimeout(() => dispatch(resetUpiState()), 4000);
            return () => clearTimeout(timer);
        }
    }, [success, error, dispatch]);

    const handleQrChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            setFormError('Please upload a valid image file (JPEG, PNG, WEBP)');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setFormError('QR image should be less than 5MB');
            return;
        }

        setFormError(null);
        setQrFile(file);

        const reader = new FileReader();
        reader.onloadend = () => setQrPreview(reader.result);
        reader.readAsDataURL(file);
    };

    const removeQr = () => {
        setQrFile(null);
        setQrPreview(upi?.qrCode || upi?.qrImage || null);
        if (qrInputRef.current) qrInputRef.current.value = '';
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!upiId.trim()) {
            setFormError('UPI ID is required');
            return;
        }

        setFormError(null);

        const formData = new FormData();
        formData.append('upiId', upiId.trim());
        if (payeeName.trim()) formData.append('payeeName', payeeName.trim());
        if (qrFile) formData.append('qrCode', qrFile);

        dispatch(updateUpi(formData));
    };

    return (
        <div className="p-6 max-w-3xl mx-auto">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800">UPI Settings</h1>
                <p className="text-gray-500 text-sm mt-1">
                    Manage the UPI ID and QR code shown to users for payments
                </p>
            </div>

            {/* Success / Error banners */}
            {success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4 flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                    <p className="text-green-800 text-sm font-medium">UPI details updated successfully</p>
                </div>
            )}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
                    <p className="text-red-800 text-sm font-medium">
                        {typeof error === 'string' ? error : 'Failed to update UPI details'}
                    </p>
                </div>
            )}
            {formError && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                    <p className="text-amber-800 text-sm font-medium">{formError}</p>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                {/* Card header */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4 flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-xl">
                        <QrCode className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-white">UPI Payment Details</h2>
                        <p className="text-xs text-indigo-100">This is what users will see at checkout</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {loading && !upi ? (
                        <div className="flex justify-center items-center h-40">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
                        </div>
                    ) : (
                        <>
                            {/* UPI ID */}
                            <div>
                                <label className="text-sm font-medium text-gray-700 block mb-1">
                                    UPI ID <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={upiId}
                                    onChange={(e) => setUpiId(e.target.value)}
                                    placeholder="e.g. yourname@upi"
                                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
                                />
                            </div>

                            {/* Payee Name */}
                            <div>
                                <label className="text-sm font-medium text-gray-700 block mb-1">
                                    Payee Name <span className="text-gray-400">(optional)</span>
                                </label>
                                <input
                                    type="text"
                                    value={payeeName}
                                    onChange={(e) => setPayeeName(e.target.value)}
                                    placeholder="e.g. Own Pocket Pvt. Ltd."
                                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
                                />
                            </div>

                            {/* QR Code Upload */}
                            <div>
                                <label className="text-sm font-medium text-gray-700 block mb-1">
                                    QR Code <span className="text-gray-400">(optional)</span>
                                </label>

                                <div className="flex items-center gap-4">
                                    {qrPreview ? (
                                        <div className="relative w-28 h-28 rounded-xl overflow-hidden border-2 border-gray-200">
                                            <img src={qrPreview} alt="UPI QR preview" className="w-full h-full object-cover" />
                                            {qrFile && (
                                                <button
                                                    type="button"
                                                    onClick={removeQr}
                                                    className="absolute top-1 right-1 bg-white/90 hover:bg-white rounded-full p-1 shadow"
                                                >
                                                    <X size={14} className="text-red-500" />
                                                </button>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="w-28 h-28 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-300">
                                            <QrCode size={36} />
                                        </div>
                                    )}

                                    <button
                                        type="button"
                                        onClick={() => qrInputRef.current?.click()}
                                        className="flex items-center gap-2 border-2 border-gray-200 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:border-indigo-500 hover:text-indigo-600 transition-colors"
                                    >
                                        <Upload size={16} />
                                        {qrPreview ? 'Replace QR Code' : 'Upload QR Code'}
                                    </button>
                                    <input
                                        ref={qrInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleQrChange}
                                        className="hidden"
                                    />
                                </div>
                            </div>

                            {/* Submit */}
                            <div className="pt-2 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save size={18} />
                                            Save UPI Details
                                        </>
                                    )}
                                </button>
                            </div>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
};

export default AdminUpi;