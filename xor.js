/**
 * AKSHU XOR Encryption Module
 * Matches the Lua client-side XOR encryption exactly
 */

function xorEncryptDecrypt(data, baseKey) {
    if (!data || !baseKey) return null;

    let result = '';
    const keyLen = baseKey.length;

    for (let i = 0; i < data.length; i++) {
        const dataChar = data.charCodeAt(i);
        const keyChar = baseKey.charCodeAt(i % keyLen);
        result += String.fromCharCode(dataChar ^ keyChar);
    }

    return result;
}

function xorEncryptDecryptBuffer(data, baseKey) {
    if (!data || !baseKey) return null;

    let result = '';
    const keyLen = baseKey.length;

    for (let i = 0; i < data.length; i++) {
        const dataChar = data[i];
        const keyChar = baseKey.charCodeAt(i % keyLen);
        result += String.fromCharCode(dataChar ^ keyChar);
    }

    return result;
}

module.exports = {
    xorEncryptDecrypt,
    xorEncryptDecryptBuffer
};
