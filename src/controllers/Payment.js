const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../errors");
const { Student, Department, Due, User } = require("../../models");
const generateSecurePaymentReference = require("../services/generateSecurePaymentReference");
const {
  initializePayment,
  verifyTransaction,
  getSubaccountTransactions,
} = require("../services/flutterwaveService");

require("dotenv").config();

const initializeDepartmentPayment = async (req, res, next) => {
  try {
    console.log("Initializing Department Payment...");

    const userId = req.user.id;
    console.log(`Authenticated user ID: ${userId}`);

    const student = await Student.findOne({
      where: { user_id: userId },
      include: {
        model: User,
        as: "user",
        attributes: ["email"],
      },
    });

    if (!student) {
      throw new NotFoundError(`No Student with user ID ${userId}`);
    }

    console.log(`Found student: ${JSON.stringify(student)}`);

    const due = await Due.findOne({
      where: {
        reference_id: student.department_id,
        due_type: "Department",
      },
      include: { model: Department, as: "department" },
    });

    if (!due) {
      throw new NotFoundError(
        `Due not found for department ${student.department_id}`
      );
    }

    console.log(`Found due: ${JSON.stringify(due)}`);

    const department = due.department;
    if (!department || !department.flutterwave_subaccount_id) {
      throw new NotFoundError(
        "Department or its Flutterwave subaccount details not found"
      );
    }

    console.log(`Found department: ${JSON.stringify(department)}`);

    const amount = due.amount;

    if (!student.user || !student.user.email) {
      throw new BadRequestError(`Student with user ID ${userId} has no email`);
    }

    const paymentReference = await generateSecurePaymentReference();

    console.log(`Generated Payment Reference: ${paymentReference}`);

    const paymentData = {
      tx_ref: paymentReference,
      amount: amount,
      currency: "NGN",
      redirect_url:
        "https://cec3-197-210-54-109.ngrok-free.app/api/v1/payments/verify-payment",
      customer: {
        email: student.user.email,
      },
      subaccounts: [
        {
          id: department.flutterwave_subaccount_id,
          transaction_split_ratio: "1", // Adjust the split ratio as needed
        },
      ],
      meta: {
        student_id: student.id,
        department: department.department_name,
        due_id: due.id,
      },
    };

    console.log(`Payment Data: ${JSON.stringify(paymentData)}`);

    const response = await initializePayment(paymentData);

    console.log(`Flutterwave Response: ${JSON.stringify(response)}`);

    const { link } = response.data; // Update this to match the actual API response structure

    res.status(StatusCodes.CREATED).json({ authorization_url: link });
  } catch (error) {
    console.error("Payment initialization error:", error);
    next(error);
  }
};

const verifyPayment = async (req, res, next) => {
  try {
    const { transaction_id, tx_ref, status } = req.query;

    if (!transaction_id || !tx_ref || !status) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Transaction ID, reference, and status are required",
      });
    }

    const verificationResponse = await verifyTransaction(transaction_id);

    // Log the response from Flutterwave for debugging
    console.log("Verification Response:", verificationResponse);

    if (
      verificationResponse.status !== "success" ||
      verificationResponse.data.status !== "successful"
    ) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Transaction verification failed",
      });
    }
    const subaccountInfo = JSON.parse(
      verificationResponse.data.meta.subaccount_split
    );

    // Get subaccount transactions
    const subaccountTransactions = await getSubaccountTransactions(
      subaccountInfo.subaccount
    );

    // Log the subaccount transactions for debugging
    console.log("Subaccount Transactions:", subaccountTransactions);

    // Process the verified transaction (e.g., update database, etc.)
    // Example: Verify if the amount is credited to the subaccount
    const isAmountCredited = subaccountTransactions.data.some(
      (transaction) =>
        transaction.amount === verificationResponse.data.amount &&
        transaction.status === "successful" &&
        transaction.tx_ref === verificationResponse.data.tx_ref
    );

    if (!isAmountCredited) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "The amount was not credited to the subaccount",
      });
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Payment verified successfully",
      data: verificationResponse,
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    next(error);
  }
};

module.exports = {
  initializeDepartmentPayment,
  verifyPayment,
};
