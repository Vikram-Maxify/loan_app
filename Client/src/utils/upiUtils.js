export const UPI_APPS = {
    GOOGLE_PAY: {
        name: 'Google Pay',
        package: 'com.google.android.apps.nfc.pay',
        scheme: 'gpay://upi/pay',
        color: '#4285F4',
        short: 'GPay',
    },
    PHONEPE: {
        name: 'PhonePe',
        package: 'com.phonepe.app',
        scheme: 'phonepe://pay',
        color: '#5F259F',
        short: 'Pe',
    },
    PAYTM: {
        name: 'Paytm',
        package: 'net.one97.paytm',
        scheme: 'paytm://upi/pay',
        color: '#00BAF2',
        short: 'Paytm',
    },
    BHIM: {
        name: 'BHIM',
        package: 'in.org.npci.upiapp',
        scheme: 'bhim://upi/pay',
        color: '#F47B20',
        short: 'BHIM',
    },
    GENERIC_UPI: {
        name: 'Generic UPI',
        package: '',
        scheme: 'upi://pay',
        color: '#2A4BDE',
        short: 'UPI',
    },
};

export const UPI_ID_PATTERN = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z][a-zA-Z0-9.\-_]{2,64}$/;

export const generateOrderId = () => {
    const random = Math.floor(100000 + Math.random() * 900000);
    return `ORD-${Date.now()}-${random}`;
};

export const isValidUpiId = (upiId = '') => UPI_ID_PATTERN.test(upiId.trim());

export const normalizeAmount = (amount) => {
    const parsed = Number(amount);
    if (!Number.isFinite(parsed)) return '';
    return parsed.toFixed(2);
};

export const buildUpiPaymentUrl = ({
    upiId,
    merchantName,
    amount,
    orderId,
    scheme = 'upi://pay',
}) => {
    const params = new URLSearchParams({
        pa: upiId,
        pn: merchantName || 'Merchant',
        am: normalizeAmount(amount),
        tn: orderId,
        cu: 'INR',
    });

    return `${scheme}?${params.toString()}`;
};

export const buildAndroidIntentUrl = ({ appKey, upiUrl }) => {
    const app = UPI_APPS[appKey];
    if (!app?.package || appKey === 'GENERIC_UPI') return upiUrl;

    const intentPath = upiUrl.replace(/^upi:\/\//, '');
    const fallback = encodeURIComponent(upiUrl);
    return `intent://${intentPath}#Intent;scheme=upi;package=${app.package};S.browser_fallback_url=${fallback};end`;
};

export const generateUPIIntent = (appKey, upiId, amount, merchantName = 'OwnPocket Pvt Ltd', orderId = generateOrderId()) => {
    const app = UPI_APPS[appKey] || UPI_APPS.GENERIC_UPI;
    const genericUrl = buildUpiPaymentUrl({
        upiId,
        merchantName,
        amount,
        orderId,
    });

    if (appKey === 'GENERIC_UPI') return genericUrl;

    const appUrl = buildUpiPaymentUrl({
        upiId,
        merchantName,
        amount,
        orderId,
        scheme: app.scheme,
    });

    return appUrl || genericUrl;
};

export const getDeviceType = () => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (userAgent.includes('android')) return 'android';
    if (userAgent.includes('iphone') || userAgent.includes('ipad')) return 'ios';
    return 'desktop';
};

export const openUPIApp = ({ appKey, upiId, amount, merchantName, orderId }) => {
    const app = UPI_APPS[appKey] || UPI_APPS.GENERIC_UPI;
    const genericUrl = buildUpiPaymentUrl({ upiId, merchantName, amount, orderId });
    const appUrl = generateUPIIntent(appKey, upiId, amount, merchantName, orderId);
    const device = getDeviceType();

    try {
        if (device === 'android' && appKey !== 'GENERIC_UPI') {
            window.location.href = buildAndroidIntentUrl({ appKey, upiUrl: genericUrl });
        } else {
            window.location.href = appKey === 'GENERIC_UPI' ? genericUrl : appUrl;
        }

        window.setTimeout(() => {
            if (document.visibilityState === 'visible' && appKey !== 'GENERIC_UPI') {
                window.location.href = genericUrl;
            }
        }, 1200);

        return true;
    } catch (error) {
        console.error('Error opening UPI app:', error);
        window.location.href = genericUrl;
        return false;
    }
};
