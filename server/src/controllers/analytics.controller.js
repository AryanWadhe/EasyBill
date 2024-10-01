import ApiError from "../libs/ApiError.js";
import ApiResponse from "../libs/ApiResponse.js";
import Invoice from "../models/invoice.model.js";

export const getAnalytics = async (req, res) => {
  try {
    const business = res.locals.business;
    const invoices = await Invoice.find({ business: business._id });
    let totalRevenue = 0;
    let totalItemsSold = 0;
    let totalInvoices = 0;
    invoices.forEach((invoice) => {
      totalRevenue += invoice.totalAmount;
    });
    invoices.forEach((invoice) => {
      totalItemsSold += invoice.items.length;
    });
    totalInvoices = invoices.length;
    totalRevenue = totalRevenue.toFixed(2);
    return res.status(200).json(
      new ApiResponse("Analytics Fetched", {
        totalRevenue,
        totalItemsSold,
        totalInvoices,
      })
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json(new ApiError("Internal Server Error"));
  }
};
