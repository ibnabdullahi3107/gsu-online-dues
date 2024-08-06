require("dotenv").config();
const axios = require("axios");

const FLUTTERWAVE_SECRET_KEY = process.env.FLUTTERWAVE_SECRET_KEY;

const flutterwaveApi = axios.create({
  baseURL: "https://api.flutterwave.com/v3",
  headers: {
    Authorization: `Bearer ${FLUTTERWAVE_SECRET_KEY}`,
    "Content-Type": "application/json",
  },
});

const createSubaccount = async (subaccountData) => {
  try {
    const response = await flutterwaveApi.post("/subaccounts", subaccountData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response ? error.response.data.message : error.message
    );
  }
};

const initializePayment = async (paymentData) => {
  try {
    const response = await flutterwaveApi.post("/payments", paymentData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response ? error.response.data.message : error.message
    );
  }
};

const verifyTransaction = async (transactionId) => {
  try {
    const response = await flutterwaveApi.get(
      `/transactions/${transactionId}/verify`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response ? error.response.data.message : error.message
    );
  }
};

const getSubaccountTransactions = async (subaccountId) => {
  try {
    console.log(`Fetching transactions for subaccount ID: ${subaccountId}`);
    const response = await flutterwaveApi.get(
      `/transactions?subaccount_id=${subaccountId}`
    );
    console.log("Subaccount Transactions Response:", response.data);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response ? error.response.data.message : error.message
    );
  }
};

module.exports = {
  createSubaccount,
  initializePayment,
  verifyTransaction,
  getSubaccountTransactions,
};
