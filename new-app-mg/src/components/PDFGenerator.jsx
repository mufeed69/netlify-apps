import React, { useState, useRef, useEffect } from 'react';
import 'jspdf-autotable';
import ProductItem from './ProductItem'; // Adjust the import path as necessary
import InputField from './InputField';
import generateInvoice from '../methods/generatePDF';
import generateInvoiceCanvas from '../methods/generateCanvas';

const logo = '/images/logo.jpeg';
const watermarkLogo = '/images/watermark-logo.png';

function PDFGenerator() {
  const [customerName, setCustomerName] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [products, setProducts] = useState([{ product: '', cost: '' }]);
  const [warranty, setWarranty] = useState('');
  const [IMEI1, setIMEI1] = useState('');
  const [IMEI2, setIMEI2] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState(() => {
    // Get the invoice number from localStorage, or set it to 1099 if it doesn't exist
    const storedInvoiceNumber = localStorage.getItem('invoiceNumber');
    return storedInvoiceNumber !== null ? Number(storedInvoiceNumber) : 1099;
  });

  const canvasRef = useRef(null);

  const handleProductChange = (index, value) => {
    const updatedProducts = [...products];
    updatedProducts[index].product = value
    setProducts(updatedProducts);
  };

  const handleCostChange = (index, value) => {
    const updatedProducts = [...products];
    updatedProducts[index].cost = value
    setProducts(updatedProducts);
  };

  const handleClear = () => {
    setCustomerName('');
    setInvoiceDate(new Date().toISOString().split('T')[0]);
    setWarranty('')
    setProducts([{ product: '', cost: '' }]);
    setIMEI1('')
    setIMEI2('')
  };

  const generatePDF = () => {
    generateInvoiceCanvas(logo, customerName, invoiceDate, products, warranty, IMEI1, IMEI2, watermarkLogo, canvasRef.current)
  };

  const downloadPDF = () => {
    const doc = generateInvoice(logo, customerName, invoiceDate, products, warranty, IMEI1, IMEI2, watermarkLogo);
    const invoiceNumber = localStorage.getItem('invoiceNumber')
    localStorage.setItem('invoiceNumber', Number(invoiceNumber) + 1);
    setInvoiceNumber(prevState => prevState + 1)

    // Save the PDF
    doc.save(`Mobile Galaxy - ${invoiceNumber}.pdf`);
  };

  useEffect(() => {
    // Set the invoice number in localStorage if it doesn't exist
    if (localStorage.getItem('invoiceNumber') === null) {
      localStorage.setItem('invoiceNumber', 1099);
    }
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-blue-500 mb-2">Invoice Generator </h1>
      <h1 className="text-xl font-bold mb-3">Invoice No. {invoiceNumber} </h1>
      <div className="w-full max-w-md space-y-4">
        <InputField
          type="text"
          placeholder="Customer Name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />
        <InputField
          type="date"
          value={invoiceDate}
          onChange={(e) => setInvoiceDate(e.target.value)}
          placeholder="Invoice Date"
        />

        <div className='flex gap-2 items-center'>
          Warranty of
          <InputField
            type="number"
            placeholder="-"
            value={warranty}
            onChange={(e) => setWarranty(e.target.value)}
            className='!w-[100px]'
          />
          months
        </div>
        <InputField
          type="number"
          placeholder="IMEI 1"
          value={IMEI1}
          onChange={(e) => setIMEI1(e.target.value)}
        />
        <InputField
          type="number"
          placeholder="IMEI 2"
          value={IMEI2}
          onChange={(e) => setIMEI2(e.target.value)}
        />

        {products.map((product, index) => (
          <ProductItem
            key={index}
            index={index}
            product={product.product}
            cost={product.cost}
            handleProductChange={handleProductChange}
            handleCostChange={handleCostChange}
          />
        ))}

        <div className="flex space-x-4">
          <button
            onClick={handleClear}
            className="px-4 py-2 bg-red-500 text-white text-lg font-medium rounded-md shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          >
            Clear All
          </button>
          <button
            onClick={generatePDF}
            className="px-4 py-2 bg-blue-500 text-white text-lg font-medium rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Preview PDF
          </button>
          <button
            onClick={downloadPDF}
            className="px-4 py-2 bg-green-500 text-white text-lg font-medium rounded-md shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
          >
            Download PDF
          </button>
        </div>
        <div className="mt-6 w-full max-w-md">
          <canvas ref={canvasRef} className="border border-gray-300 rounded-md" />
        </div>
      </div>
    </div>
  );
}

export default PDFGenerator;
