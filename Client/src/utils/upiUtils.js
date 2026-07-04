// UPI Intent URLs for different apps
export const UPI_APPS = {
    GOOGLE_PAY: {
        name: 'Google Pay',
        package: 'com.google.android.apps.nfc.pay',
        scheme: 'gpay',
        intent: 'gpay://upi/pay',
    },
    PHONEPE: {
        name: 'PhonePe',
        package: 'com.phonepe.app',
        scheme: 'phonepe',
        intent: 'phonepe://pay',
    },
    PAYTM: {
        name: 'Paytm',
        package: 'net.one97.paytm',
        scheme: 'paytm',
        intent: 'paytm://upi/pay',
    },
};

// Generate UPI Intent URL
export const generateUPIIntent = (app, upiId, amount, merchantName = 'OwnPocket Pvt Ltd') => {
    const upiData = {
        pa: upiId || 'yourloan@upi',
        pn: merchantName,
        am: amount,
        cu: 'INR',
        tn: `Loan Processing Fee - ${Date.now()}`,
    };

    const upiString = `upi://pay?pa=${upiData.pa}&pn=${encodeURIComponent(upiData.pn)}&am=${upiData.am}&cu=${upiData.cu}&tn=${encodeURIComponent(upiData.tn)}`;

    // Return app-specific intent URL
    switch (app) {
        case 'GOOGLE_PAY':
            return `gpay://upi/pay?pa=${upiData.pa}&pn=${encodeURIComponent(upiData.pn)}&am=${upiData.am}&cu=${upiData.cu}`;
        case 'PHONEPE':
            return `phonepe://pay?pa=${upiData.pa}&pn=${encodeURIComponent(upiData.pn)}&am=${upiData.am}&cu=${upiData.cu}`;
        case 'PAYTM':
            return `paytm://upi/pay?pa=${upiData.pa}&pn=${encodeURIComponent(upiData.pn)}&am=${upiData.am}&cu=${upiData.cu}`;
        default:
            return upiString;
    }
};

// Check if app is installed
export const isAppInstalled = (packageName) => {
    // For Android
    if (window.navigator.userAgent.toLowerCase().includes('android')) {
        // Try to open app using intent
        return true; // Let the system handle it
    }
    return false;
};

// Open UPI App
export const openUPIApp = (appKey, upiId, amount) => {
    const app = UPI_APPS[appKey];
    if (!app) return false;

    const intentUrl = generateUPIIntent(appKey, upiId, amount);

    // Try to open the app
    try {
        // For Android
        if (window.navigator.userAgent.toLowerCase().includes('android')) {
            window.location.href = intentUrl;
            return true;
        }
        // For iOS
        else if (window.navigator.userAgent.toLowerCase().includes('iphone') ||
            window.navigator.userAgent.toLowerCase().includes('ipad')) {
            // iOS UPI schemes
            const iosSchemes = {
                GOOGLE_PAY: 'gpay://',
                PHONEPE: 'phonepe://',
                PAYTM: 'paytm://',
            };
            window.location.href = iosSchemes[appKey];
            return true;
        }
        // For Web/Desktop - show UPI ID to copy
        else {
            return false;
        }
    } catch (error) {
        console.error('Error opening UPI app:', error);
        return false;
    }
};