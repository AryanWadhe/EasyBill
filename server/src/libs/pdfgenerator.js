import PDFDocument from "pdfkit-table";
import QRCode from "qrcode";

export async function generatePDF(invoice) {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 30, size: "A4" });
      const buffers = [];
      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // PDF generation starts here
      doc.fontSize(32).text("Invoice", { align: "center" });

      doc.moveDown();
      doc.fontSize(18);
      doc
        .text("From: ", { align: "left", continued: true })
        .text("To:", { align: "right" });

      doc.moveDown(0.2);
      doc.fontSize(12);
      doc
        .text(invoice.business.name, { align: "left", continued: true })
        .text(invoice.customer.name, { align: "right" });
      doc
        .text(invoice.business.address.street, { align: "left", continued: true })
        .text(invoice.customer.address.street, { align: "right" });

      doc
        .text(
          `${invoice.business.address.city} ${invoice.business.address.state} ${invoice.business.address.zipCode}`,
          { align: "left", continued: true }
        )
        .text(
          `${invoice.customer.address.city} ${invoice.customer.address.state} ${invoice.customer.address.zipCode}`,
          { align: "right" }
        );
      doc
        .text(`Phone: ${invoice.business.phoneNumber}`, { align: "left", continued: true })
        .text(`Phone: ${invoice.customer.phone}`, { align: "right" });

      doc.text(`Email: ${invoice.business.email}`, { align: "left" });
      doc.text(`Tax ID: ${invoice.business.taxId}`, { align: "left" });

      doc.moveDown(1.5);
      doc.text(`Issued: ${invoice.dateIssued.toDateString()}`, { continued: true });
      doc.text(`Due: ${invoice.dueDate.toDateString()}`, { align: "right" });

      // Table for items
      const tableData = {
        headers: [
          { label: "Description", headerColor: "blue" },
          { label: "Quantity", headerColor: "blue", align: "right" },
          { label: "Price", headerColor: "blue", align: "right" },
          { label: "Total", headerColor: "blue", align: "right" },
        ],
        rows: invoice.items.map((item) => [item.description, item.quantity, item.price, item.total]),
      };

      doc.moveDown(2);
      doc.table(tableData, {
        width: doc.page.width - 60.28,
        columnsSize: [235, 100, 100, 100],
        padding: 5,
        prepareHeader: () => doc.font("Helvetica-Bold").fontSize(14),
        prepareRow: (row, i) => doc.font("Helvetica").fontSize(10),
      });

      // Totals
      doc.text(`SubTotal: ${invoice.subtotal.toFixed(2)}`, { align: "right" });
      doc.text(`Tax: ${invoice.tax.toFixed(2)}`, { align: "right" });
      doc.moveDown(1.5);
      doc.fontSize(14).text(`Total: ${invoice.totalAmount.toFixed(2)}`, { align: "right" });

      // QR Code
      const url = process.env.FRONTEND_URL+"/invoice/"+invoice._id;
      const qrCodeDataUrl = await QRCode.toDataURL(url);
      const base64Data = qrCodeDataUrl.split(",")[1];
      const qrCodeBuffer = Buffer.from(base64Data, "base64");
      doc.text("Scan for E-Bill", 455, 695);
      doc.image(qrCodeBuffer, 465, 710, { fit: [100, 100], align: "center", valign: "center" });

      const upiPaymentUrl = "8237622003@axl"; // Assuming invoice.upiUrl contains the UPI link
const upiQRCodeDataUrl = await QRCode.toDataURL(upiPaymentUrl);
const upiBase64Data = upiQRCodeDataUrl.split(",")[1];
const upiQRCodeBuffer = Buffer.from(upiBase64Data, "base64");
doc.text("UPI Payment", 50, 695);
doc.image(upiQRCodeBuffer, 50, 710, { fit: [100, 100], align: "center", valign: "center" });

      // End the document
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}
