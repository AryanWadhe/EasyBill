export const getInvoice = async (req, res) => {
//   try {
//     const id = req.params.id;
//     const invoice = await Invoice.findById(id).populate("business");
//     if (!invoice) {
//       return res.status(400).json(new ApiError("Invoice not found"));
//     }
//     res.status(200).json(new ApiResponse("Fetched successfully", invoice));
//   } catch (error) {
//     return res
//       .status(500)
//       .json(new ApiError(error.message || "Internal Server Error"));
//   }
// };