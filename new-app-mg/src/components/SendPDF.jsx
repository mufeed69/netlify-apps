import React, { useState } from 'react';

function App() {
  const [message, setMessage] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const sendMessage = () => {
    if (message && phoneNumber) {
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    } else {
      alert('Please enter both message and phone number');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-green-500 mb-6">Send WhatsApp Message</h1>
      <div className="mb-4 w-full max-w-md">
        <label className="block text-lg font-medium text-gray-700 mb-2">
          Message:
          <input
            type="text"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </label>
      </div>
      <div className="mb-4 w-full max-w-md">
        <label className="block text-lg font-medium text-gray-700 mb-2">
          Phone Number:
          <input
            type="tel"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </label>
      </div>
      <button
        onClick={sendMessage}
        className="px-4 py-2 bg-green-500 text-white text-lg font-medium rounded-md shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
      >
        Send Message
      </button>
    </div>
  );
}

export default App;
