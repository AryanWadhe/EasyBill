import ApiError from "../libs/ApiError.js";
import ApiResponse from "../libs/ApiResponse.js";
import { generatePDF } from "../libs/pdfgenerator.js";
import { sendMail } from "../libs/sendMail.js";
import Invoice from "../models/invoice.model.js";
import { Parser } from "json2csv";
// sendMail();
export const createInvoice = async (req, res) => {
  try {
    console.log("try");
    const data = req.body;
    const business = res.locals.business;
    data.items.forEach((item) => {
      item.total = item.quantity * item.price;
    });
    data.subtotal = data.items.reduce((acc, item) => acc + item.total, 0);
    data.tax = data.subtotal * 0.08;
    data.totalAmount = data.subtotal + data.tax;
    data.business = business._id;

    let invoice = await Invoice.create({
      customer: {
        name: data.name,
        phone: data.phone,
        email: data.email,
        address: {
          street: data.street,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
        },
      },
      items: data.items,
      dueDate: data.dueDate,
      subtotal: data.subtotal,
      tax: data.tax,
      totalAmount: data.totalAmount,
      status: data.status,
      business: res.locals.business._id,
    });
    invoice.business = res.locals.business;
    const pdf = await generatePDF(invoice);
  //  console.log("adarsh")
  // sendMail();
    await sendMail({
      email: data.email,
      subject: "Invoice for " + data.name,
      message: "Please find the invoice attached.",
      content: pdf,
    });
    console.log("Email sent successfully");
    return res.header("Content-Type", "application/pdf").send(pdf);
  } catch (error) {
    console.log(error);
    res.status(500).json(new ApiError("Internal Server Error"));
  }
 
};

export const getInvoice = async (req, res) => {
  try {
    const id = req.params.id;
    const invoice = await Invoice.findById(id).populate("business");
    if (!invoice) {
      return res.status(400).json(new ApiError("Invoice not found"));
    }
    res.status(200).json(new ApiResponse("Fetched successfully", invoice));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(error.message || "Internal Server Error"));
  }
};

export const getInvoices = async (req, res) => {
  try {
    
    const business = res.locals.business;
    const invoices = await Invoice.find({ business: business._id });
    res.status(200).json(new ApiResponse("Fetched successfully", invoices));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(error.message || "Internal Server Error"));
  }
};

export const invoiceToCSV = async (req, res) => {
  try {
    const invoices = await Invoice.find({
      business: res.locals.business._id,
    }).populate("business");
    const invoiceData = invoices.map((invoice) => ({
      invoiceId: invoice._id,
      businessId: invoice.business?._id,
      businessName: invoice.business?.name, // assuming the Business model has a name field
      customerName: invoice.customer.name,
      customerPhone: invoice.customer.phone,
      customerStreet: invoice.customer.address.street,
      customerCity: invoice.customer.address.city,
      customerState: invoice.customer.address.state,
      customerZipCode: invoice.customer.address.zipCode,
      items: invoice.items
        .map(
          (item) => `${item.description} (x${item.quantity} @ $${item.price})`
        )
        .join("; "), // Consolidating items into one field
      dateIssued: invoice.dateIssued.toISOString().split("T")[0],
      dueDate: invoice.dueDate.toISOString().split("T")[0],
      subtotal: invoice.subtotal,
      tax: invoice.tax || 0,
      totalAmount: invoice.totalAmount,
      status: invoice.status,
    }));

    // Define CSV fields
    const fields = [
      "invoiceId",
      "businessId",
      "businessName",
      "customerName",
      "customerPhone",
      "customerStreet",
      "customerCity",
      "customerState",
      "customerZipCode",
      "items",
      "dateIssued",
      "dueDate",
      "subtotal",
      "tax",
      "totalAmount",
      "status",
    ];

    // Convert JSON to CSV
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(invoiceData);

    // Set response headers to prompt file download
    res.header("Content-Type", "text/csv");
    res.attachment("invoices.csv");

    // Send CSV as a response
    res.send(csv);
  } catch (error) {
    console.error("Error fetching invoices or generating CSV:", error);
    res.status(500).send("Server Error");
  }
};
