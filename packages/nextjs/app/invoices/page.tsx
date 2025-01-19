"use client";
import React, { useState } from 'react';
import { useAccount } from "@starknet-react/core";
import { Contract } from "starknet";
import { useRouter } from 'next/navigation';
import abi from "../Abis/paymanAbi.json"; 
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const InvoicePage = () => {
  const router = useRouter();
  const { account } = useAccount();
  const [descriptionInput, setDescriptionInput] = useState('');
  const [amountInput, setAmountInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const contractAddress = "0x037c8cf7eb75d09f8ac7659010b7cba4fa3a4655ce4b4069df64f79f2c58f594"; 
  const contract = account ? new Contract(abi, contractAddress, account) : null;

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account || !contract) {
      setError("No account or contract available.");
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const descriptionHex = Buffer.from(descriptionInput, "utf8").toString("hex");
      const amount = BigInt(amountInput);

   
      const result = await contract.invoke("createInvoice", [descriptionHex, amount.toString()]);
      
    
      setDescriptionInput('');
      setAmountInput('');
      
      toast.success('Invoice created successfully!', {
        onClose: () => {
          router.push('/displayInvoices');
        }
      });

      // Optional: If you want to redirect immediately without waiting for toast
      // setTimeout(() => {
      //   router.push('/displayInvoices');
      // }, 1500);

      // Optionally log the result
      console.log('Invoice created:', result);
    } catch (err) {
      setError(`Error creating invoice: ${err}`);
      toast.error(`Error creating invoice: ${err}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleCreateInvoice} className="mt-20 max-w-xl mx-auto shadow-lg p-5 border-[0.5px] border-gray-200 rounded-sm">
        <p className="mt-1 text-xl capitalize font-semibold text-gray-900">Create New Invoice</p>

        <div className="mt-5">
          <div className="flex items-center rounded-md bg-white pl-3 outline outline-1 -outline-offset-1 outline-gray-300 focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-blue-600">
            <input
              id="description"
              name="description"
              type="text"
              placeholder="Enter Description"
              value={descriptionInput}
              onChange={(e) => setDescriptionInput(e.target.value)}
              className="block min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6"
              required
            />
          </div>
        </div>

        <div className="mt-5">
          <div className="flex items-center rounded-md bg-white pl-3 outline outline-1 -outline-offset-1 outline-gray-300 focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-blue-600">
            <input
              id="amount"
              name="amount"
              type="number"
              placeholder="Enter Amount"
              value={amountInput}
              onChange={(e) => setAmountInput(e.target.value)}
              className="block min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6"
              required
            />
          </div>
        </div>

        {error && <p className="mt-3 text-red-500">{error}</p>}

        <button
          type="submit"
          className={`mt-5 bg-gradient-to-tr from-blue-600 to-blue-400 text-white px-4 py-2 rounded-md ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? 'Creating...' : 'Create New'}
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default InvoicePage;