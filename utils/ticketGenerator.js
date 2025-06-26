const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

exports.generateTicket = async (visitor) => {
  const doc = new PDFDocument();
  const filePath = path.join(__dirname, `../tickets/ticket_${visitor.id}.pdf`);
  const stream = fs.createWriteStream(filePath);

  doc.pipe(stream);
  doc.fontSize(20).text('🎫 Exhibition City Ticket', { align: 'center' });
  doc.moveDown();
  doc.fontSize(14).text(`Name: ${visitor.name}`);
  doc.fontSize(14).text(`Email: ${visitor.email}`);
  doc.fontSize(14).text(`User ID: ${visitor.id}`);
  doc.moveDown();
  doc.fontSize(12).text(`Date Issued: ${new Date().toLocaleString()}`);
  doc.end();
};
