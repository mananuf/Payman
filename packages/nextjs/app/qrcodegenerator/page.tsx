// First, create a types.d.ts file in your project:
declare global {
  interface Window {
    QRCode: {
      new (
        element: HTMLElement,
        options: {
          text: string;
          width?: number;
          height?: number;
          colorDark?: string;
          colorLight?: string;
          correctLevel?: any;
        }
      ): any;
      CorrectLevel: {
        L: number;
        M: number;
        Q: number;
        H: number;
      };
    };
  }
}

// QRCodeGenerator.tsx
"use client"
import React, { useState, useEffect } from 'react';

const QRCodeGenerator: React.FC = () => {
  const [text, setText] = useState('https://example.com');

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const generateQRCode = () => {
    const qrContainer = document.getElementById('qrcode');
    if (qrContainer && window.QRCode) {
      qrContainer.innerHTML = '';
      
      new window.QRCode(qrContainer, {
        text: text,
        width: 200,
        height: 200,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: window.QRCode.CorrectLevel.H
      });
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6">
        <div className="border-b pb-4">
          <h2 className="text-2xl font-semibold text-gray-800">QR Code Generator</h2>
        </div>

        {/* Content */}
        <div className="mt-6 space-y-4">
          <div className="space-y-2">
            {/* Input Field */}
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text or URL"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 ease-in-out text-gray-800 placeholder-gray-400"
            />
            <button
              onClick={generateQRCode}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 ease-in-out transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Generate QR Code
            </button>
          </div>

          <div
            id="qrcode"
            className="flex justify-center items-center bg-gray-50 p-6 rounded-lg min-h-[200px]"
          />
        </div>
      </div>
    </div>
  );
};

export default QRCodeGenerator;

