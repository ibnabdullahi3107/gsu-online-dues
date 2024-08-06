// utils/generateSecurePaymentReference.js
const { v4: uuidv4 } = require("uuid");

/**
 * Generates a secure, unique payment reference.
 *
 * @returns {Promise<string>} - A promise that resolves to the UUID v4 payment reference.
 */
const generateSecurePaymentReference = async () => {
  return new Promise((resolve) => {
    const uuid = uuidv4();
    resolve(uuid);
  });
};

module.exports = generateSecurePaymentReference;
