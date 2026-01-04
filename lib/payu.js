import crypto from 'crypto';

/**
 * Generates PayU SHA-512 Hash
 * Sequence: key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||SALT
 */
export const generatePayUHash = ({
    key,
    txnid,
    amount,
    productinfo,
    firstname,
    email,
    salt
}) => {
    // Correct Formula: key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5|udf6|udf7|udf8|udf9|udf10|SALT
    // We need 11 pipes between email and salt to represent 10 empty UDFs.
    const hashString = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|||||||||||${salt}`;
    return crypto.createHash('sha512').update(hashString).digest('hex');
};

/**
 * Verifies PayU Response Hash
 * Sequence: SALT|status||||||udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key
 */
export const verifyPayUHash = ({
    key,
    salt,
    status,
    txnid,
    amount,
    productinfo,
    firstname,
    email,
    responseHash
}) => {
    const hashString = `${salt}|${status}|||||||||||${email}|${firstname}|${productinfo}|${amount}|${txnid}|${key}`;
    const calculatedHash = crypto.createHash('sha512').update(hashString).digest('hex');
    return calculatedHash === responseHash;
};
