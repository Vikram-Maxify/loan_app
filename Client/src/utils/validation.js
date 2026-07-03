export const onlyLetters = (value) => value.replace(/[^A-Za-z ]/g, "").replace(/\s+/g, " ");
export const onlyDigits = (value, maxLength) => value.replace(/\D/g, "").slice(0, maxLength);
export const trimSpaces = (value) => value.trim().replace(/\s+/g, " ");
export const uppercaseAlnum = (value, maxLength) =>
    value.replace(/[^A-Za-z0-9]/g, "").toUpperCase().slice(0, maxLength);

const repeatedDigits = /^(\d)\1+$/;
const fakePhones = new Set(["1234567890", "1111111111", "0000000000", "9999999999"]);
const blockedEmailDomains = new Set(["test.com", "example.com", "invalid.com"]);

export function validateName(value, label = "Name") {
    const clean = trimSpaces(value);
    if (!clean) return `${label} is required`;
    if (!/^[A-Za-z ]+$/.test(clean)) return `${label} can contain only alphabets and spaces`;
    if (clean.length < 2) return `${label} must be at least 2 characters`;
    if (clean.length > 60) return `${label} must be 60 characters or less`;
    return "";
}

export function validatePhone(value, label = "Mobile number") {
    const clean = onlyDigits(value, 10);
    if (!clean) return `${label} is required`;
    if (!/^[6-9]\d{9}$/.test(clean)) return `${label} must be 10 digits and start with 6, 7, 8, or 9`;
    if (fakePhones.has(clean) || repeatedDigits.test(clean)) return `${label} looks invalid`;
    return "";
}

export function validateEmail(value) {
    const clean = value.trim().toLowerCase();
    if (!clean) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(clean)) return "Enter a valid email address";
    const domain = clean.split("@")[1];
    if (!domain || blockedEmailDomains.has(domain) || !domain.includes(".")) {
        return "Enter a valid email domain";
    }
    return "";
}

export function validatePAN(value) {
    const clean = uppercaseAlnum(value, 10);
    if (!clean) return "PAN number is required";
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(clean)) return "PAN must be in ABCDE1234F format";
    return "";
}

export function validateAadhaar(value) {
    const clean = onlyDigits(value, 12);
    if (!clean) return "Aadhaar number is required";
    if (!/^\d{12}$/.test(clean)) return "Aadhaar must be exactly 12 digits";
    if (/^0{12}$/.test(clean) || repeatedDigits.test(clean)) return "Aadhaar number looks invalid";
    return "";
}

export function validatePincode(value) {
    const clean = onlyDigits(value, 6);
    if (!clean) return "Pincode is required";
    if (!/^[1-9]\d{5}$/.test(clean)) return "Pincode must be 6 digits";
    return "";
}

export function validateDOB(value) {
    if (!value) return "Date of birth is required";
    const dob = new Date(value);
    if (Number.isNaN(dob.getTime())) return "Enter a valid date of birth";
    if (dob > new Date()) return "Date of birth cannot be in the future";
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) age -= 1;
    if (age < 18) return "Applicant must be at least 18 years old";
    return "";
}

export function validateAmount(value, { min = 1000, max = 10000000, label = "Amount" } = {}) {
    const clean = onlyDigits(String(value || ""), 12);
    if (!clean) return `${label} is required`;
    const amount = Number(clean);
    if (amount < min || amount > max) return `${label} must be between ${min} and ${max}`;
    return "";
}

export function validateIncome(value) {
    return validateAmount(value, { min: 1, max: 100000000, label: "Income" });
}

export function validateOTP(value, length = 6) {
    const clean = onlyDigits(value, length);
    if (!clean) return "OTP is required";
    if (clean.length !== length) return `OTP must be exactly ${length} digits`;
    return "";
}

export function validateBankAccount(value) {
    const clean = onlyDigits(value, 18);
    if (!clean) return "Account number is required";
    if (!/^\d{9,18}$/.test(clean)) return "Account number must be 9 to 18 digits";
    if (repeatedDigits.test(clean)) return "Account number looks invalid";
    return "";
}

export function validateIFSC(value) {
    const clean = uppercaseAlnum(value, 11);
    if (!clean) return "IFSC code is required";
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(clean)) return "IFSC must be in SBIN0001234 format";
    return "";
}
