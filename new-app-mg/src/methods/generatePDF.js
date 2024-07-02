import jsPDF from 'jspdf';
import 'jspdf-autotable';
import numberToWords from './numberToWords';
import formatDate from './formatDate';

const generateInvoice = (logo, customerName, date, products, warranty, IMEI1, IMEI2, watermarkLogo) => {
    const doc = new jsPDF();

    doc.setFont('helvetica');
    // Add watermark
    doc.setFontSize(50);
    doc.addImage(watermarkLogo, 'PNG', 35, 10, 140, 140, '', 'FAST', 0.5); // Adjust opacity here (0.5 means 50% opacity)

    // Add header with logo, address, and double border
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(18);
    doc.addImage(logo, 'PNG', 165, 7, 30, 30);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('MOBILE GALAXY', 14, 15);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text('\nNear BASF Kana Bala Surathkal Mangalore\nPhone no.: 8747088870\nEmail: nauseemgalaxy@gmail.com', 14, 15);

    // Darker purple color Line
    doc.setLineWidth(0.5);
    doc.setDrawColor(153, 102, 255);
    doc.line(14, 35, 195, 35);
    doc.setLineWidth(1.5);
    doc.line(14, 37, 195, 37);

    // Add "Invoice" text in purple color
    doc.setFontSize(18);
    doc.setTextColor(100, 50, 180); // Purple color
    doc.setFont('helvetica', 'bold');
    doc.text('Tax Invoice', 90, 45);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');

    // Add customer details
    doc.setFontSize(12);
    doc.text(`Bill To:`, 14, 50);
    doc.setFont('helvetica', 'bold');
    doc.text(`${customerName}`, 14, 55);
    doc.setFont('helvetica', 'normal');
    const invoiceNumber = localStorage.getItem('invoiceNumber')
    doc.text(`Invoice No. ${invoiceNumber}`, 160, 50);
    doc.text(`Date: ${formatDate(date)}`, 160, 55);

    // Add product details in a table
    const tableData = products.map((product, index) => [index + 1, product.product, `Rs. ${(1 * product.cost).toLocaleString('en-IN')}`, 1, `Rs. ${(1 * product.cost).toLocaleString('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}`]);

    doc.autoTable({
        startY: 60,
        head: [['#', 'Item Name', 'Price/Unit', 'Quantity', 'Amount']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [153, 102, 255] }, // Darker purple color for the header
        bodyStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0] }, // Light gray color for the body with darker black text
        styles: { fontStyle: 'bold', fontSize: 12 } // Apply bold font style and increased font size to all cells
    });    

    // Add totals
    const totalAmount = products.reduce((total, product) => total + (1 * product.cost), 0);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`Total: Rs. ${totalAmount.toLocaleString('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}`, 140, doc.autoTable.previous.finalY + 10);
    doc.setFont('helvetica', 'normal');

    //Description
    doc.setFontSize(12);
    doc.text('Description', 14, doc.autoTable.previous.finalY + 10);
    if (warranty) {
        doc.text(`The warranty for this product is ${warranty} months`, 14, doc.autoTable.previous.finalY + 15);
    } else {
        doc.text(`${IMEI1 ? `IMEI ${IMEI1}` : ''}`, 14, doc.autoTable.previous.finalY + 15);
        doc.text(`${IMEI2 ? `IMEI ${IMEI2}` : ''}`, 14, doc.autoTable.previous.finalY + 20);
    }

    // Add amount in words
    doc.text('Invoice Amount In Words', 14, doc.autoTable.previous.finalY + (!warranty && (IMEI1 && IMEI2) ? 30 : 27));
    // Calculate the maximum width available for the text
    const maxWidth = 180; // Adjust based on your layout and font size

    // Convert the amount to words
    const amountInWords = numberToWords(totalAmount);

    // Split the text to fit within the maximum width
    const textLines = doc.splitTextToSize(amountInWords, maxWidth);

    // Initial y position for the text
    let y = doc.autoTable.previous.finalY + (!warranty && (IMEI1 && IMEI2) ? 35 : 32);

    // Loop through each line and draw it on the document
    textLines.forEach(line => {
        doc.text(line, 14, y);
        y += 6; // Adjust the line spacing as needed
    });

    // Add terms and conditions
    doc.text(`Terms And Conditions\nThank you for doing business with us.`, 14, y + 5);

    // Signature
    doc.setFont('helvetica', 'bold');
    doc.text(`Mobile Galaxy`, 150, y + 5);

    return doc;
};

export default generateInvoice;

