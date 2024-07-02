import formatDate from "./formatDate";
import numberToWords from "./numberToWords";

const generateInvoiceCanvas = (logo, customerName, date, products, warranty, IMEI1, IMEI2, watermarkLogo, canvas) => {
    const ctx = canvas.getContext('2d');

    // Calculate required height
    let contentHeight = 200; // Initial content height for header and customer details
    const tableRowHeight = 50; // Height for each row in the table
    contentHeight += tableRowHeight * products.length; // Adding height for each product row
    contentHeight += 200; // Additional space for total and amount in words

    // Set canvas dimensions
    canvas.width = 300;
    canvas.height = contentHeight;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Add watermark
    const watermarkImg = new Image();
    watermarkImg.src = watermarkLogo;
    watermarkImg.onload = () => {
        ctx.globalAlpha = 0.1;
        ctx.drawImage(watermarkImg, 75, 100, 150, 150); // Adjust position and size
        ctx.globalAlpha = 1.0;

        // Add header with logo, address, and double border
        const logoImg = new Image();
        logoImg.src = logo;
        logoImg.onload = () => {
            ctx.drawImage(logoImg, 225, 5, 50, 50); // Adjust position and size

            ctx.font = `bold 12px Helvetica`;
            ctx.fillText('MOBILE GALAXY', 10, 20);
            ctx.font = `normal 10px Helvetica`;
            ctx.fillText('Near BASF Kana Bala Surathkal Mangalore', 10, 35);
            ctx.fillText('Phone no.: 8747088870', 10, 45);
            ctx.fillText('Email: nauseemgalaxy@gmail.com', 10, 55);

            // Draw double border
            ctx.strokeStyle = 'rgb(153, 102, 255)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(10, 62);
            ctx.lineTo(285, 62);
            ctx.stroke();
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(10, 65);
            ctx.lineTo(285, 65);
            ctx.stroke();

            // Add "Invoice" text in purple color
            ctx.font = `bold 18px Helvetica`;
            ctx.fillStyle = 'rgb(153, 102, 255)';
            ctx.fillText('Invoice', 110, 85);
            ctx.fillStyle = 'rgb(0, 0, 0)';

            // Add customer details
            ctx.font = `normal 12px Helvetica`;
            ctx.fillText('Bill To:', 10, 90);
            ctx.font = `bold 12px Helvetica`;
            ctx.fillText(customerName, 10, 105);
            ctx.font = `normal 12px Helvetica`;
            const invoiceNumber = localStorage.getItem('invoiceNumber');
            ctx.fillText(`Invoice No. ${invoiceNumber}`, 200, 90);
            ctx.fillText(`Date: ${formatDate(date)}`, 200, 105);

            // Add product details in a table
            ctx.font = `normal 12px Helvetica`;
            ctx.fillText('#', 10, 130);
            ctx.fillText('Item Name', 20, 130);
            ctx.fillText('Price/Unit', 90, 130);
            ctx.fillText('Quantity', 155, 130);
            ctx.fillText('Amount', 210, 130);

            let startY = 145;
            products.forEach((product, index) => {
                ctx.fillText((index + 1).toString(), 10, startY);

                // Adjust for long product names based on width
                const productName = product.product;
                const maxLineWidth = 60; // Adjust based on your layout and font size
                let textY = startY;

                let line = '';
                for (let i = 0; i < productName.length; i++) {
                    const testLine = line + productName[i];
                    const testWidth = ctx.measureText(testLine).width;
                    if (testWidth > maxLineWidth && i > 0) {
                        ctx.fillText(line.trim(), 20, textY); // Render previous line
                        line = productName[i]; // Start new line with current character
                        textY += 15; // Adjust line height based on your font size
                    } else {
                        line = testLine;
                    }
                }

                ctx.fillText(line.trim(), 20, textY); // Render last line if any
                textY += 15; // Adjust line height based on your font size


                ctx.fillText(`Rs. ${product.cost}`, 90, startY);
                ctx.fillText(1, 170, startY);
                ctx.fillText(`Rs. ${(1 * product.cost).toFixed(2)}`, 210, startY);
                startY = textY; // Move to the next row
            });

            // Add totals
            const totalAmount = products.reduce((total, product) => total + (1 * product.cost), 0).toFixed(2);
            ctx.font = `bold 10px Helvetica`;
            ctx.fillText(`Total: Rs. ${totalAmount}`, 200, startY + 20);

            // Description
            ctx.font = `normal 12px Helvetica`;
            ctx.fillText('Description', 10, startY + 20);
            ctx.font = `normal 12px Helvetica`;
            if (warranty) {
                ctx.fillText(`The warranty for this product is ${warranty} months`, 10, startY + 35);
            } else {
                if (IMEI1) ctx.fillText(`IMEI ${IMEI1}`, 10, startY + 35);
                if (IMEI2) ctx.fillText(`IMEI ${IMEI2}`, 10, startY + 50);
            }

            // Add amount in words
            ctx.font = `normal 12px Helvetica`;
            ctx.fillText('Invoice Amount In Words', 10, startY + 70);
            // Define the maximum width available for the text
            const maxWidth = 280; // Adjust based on your layout

            // Get the text to render in multiple lines
            const amountInWords = numberToWords(totalAmount);

            // Split the text into lines that fit within the maximum width
            function splitTextIntoLines(text, maxWidth) {
                const words = text.split(' ');
                const lines = [];
                let currentLine = '';

                words.forEach(word => {
                    const testLine = currentLine.length === 0 ? word : `${currentLine} ${word}`;
                    const testWidth = ctx.measureText(testLine).width;
                    if (testWidth > maxWidth) {
                        lines.push(currentLine);
                        currentLine = word;
                    } else {
                        currentLine = testLine;
                    }
                });

                if (currentLine.length > 0) {
                    lines.push(currentLine);
                }

                return lines;
            }

            // Split text into lines
            const textLines = splitTextIntoLines(amountInWords, maxWidth);

            // Render each line on the canvas
            ctx.font = `normal 12px Helvetica`;
            let y = startY + 85; // Initial y position
            textLines.forEach(line => {
                ctx.fillText(line, 10, y);
                y += 15; // Adjust line height as needed
            });

            // Add terms and conditions
            ctx.font = `normal 12px Helvetica`;
            ctx.fillText('Terms And Conditions', 10, y + 10);
            ctx.font = `normal 12px Helvetica`;
            ctx.fillText('Thank you for doing business with us.', 10, y + 25);

            // Signature
            ctx.font = `bold 12px Helvetica`;
            ctx.fillText('Mobile Galaxy', 200, y + 40);
        };
    };
};

export default generateInvoiceCanvas;
