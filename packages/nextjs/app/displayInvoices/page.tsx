"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "@starknet-react/core";
import { Contract, RpcProvider } from "starknet";
import abi from "../Abis/paymanAbi.json";

const feltToString = (felt: string | bigint) => {
  if (!felt) return "";
  try {
    const hex = BigInt(felt).toString(16).padStart(64, "0");
    return Buffer.from(hex, "hex").toString("utf8").replace(/\0/g, "");
  } catch {
    return "";
  }
};

interface Invoice {
  invoiceId: number;
  description: string;
  amount: string;
  isPaid: boolean;
  isCancelled: boolean;
}

const DisplayInvoicesPage = () => {
  const { account } = useAccount();
  const router = useRouter();
  const [userInvoices, setUserInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const rpcNodeUrl = "https://starknet-sepolia.g.alchemy.com/starknet/version/rpc/v0_7/y9ouA2N4KnJfXf0cIFBYCAo1DYJLAKQ7";
  const contractAddress = "0x037c8cf7eb75d09f8ac7659010b7cba4fa3a4655ce4b4069df64f79f2c58f594";

  const hexToBigInt = (hex: string) => {
    try {
      if (!hex || hex === "0x") return BigInt(0); 
      return BigInt(hex);
    } catch {
      return BigInt(0);
    }
  };

  const fetchInvoices = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!account) {
        throw new Error("No account connected.");
      }

      const provider = new RpcProvider({ nodeUrl: rpcNodeUrl });
      const contract = new Contract(abi, contractAddress, provider);

      console.log("Fetching invoices for account:", account.address);

      const result = await contract.call("getInvoiceForUser", [account.address]);
      console.log("Raw result from contract:", result);

      if (Array.isArray(result)) {
        const processedInvoices = result.map((invoice: any) => ({
          invoiceId: Number(invoice.invoiceId), 
          description: feltToString(invoice.description), 
          amount: hexToBigInt(invoice.amount).toString(),
          isPaid: Boolean(invoice.isPaid), 
          isCancelled: Boolean(invoice.isCancelled), 
        }));

        setUserInvoices(processedInvoices);
      } else {
        throw new Error("Unexpected result format from the contract.");
      }
    } catch (err) {
      if (err instanceof Error) {
        console.error("Error fetching invoices:", err.message);
      } else {
        console.error("Unknown error fetching invoices:", err);
        setError("Unknown error occurred while fetching invoices.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (account) {
      fetchInvoices();
    }
  }, [account]);

  const handleViewInvoice = (invoice: Invoice) => {
    // Encode invoice data as URL parameters
    const invoiceData = {
      id: invoice.invoiceId,
      description: invoice.description,
      amount: invoice.amount,
      status: invoice.isPaid ? 'Paid' : invoice.isCancelled ? 'Cancelled' : 'Pending'
    };
    
    // Encode the data as URL parameters
    const params = new URLSearchParams({
      data: JSON.stringify(invoiceData)
    }).toString();
    
    router.push(`/qr-code?${params}`);
  };

  return (
    <div className="mt-12 bg-white p-6 rounded-lg shadow-lg md:mx-4 lg:mx-4">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Recent Invoices</h2>

      {error && <p className="text-red-500">{error}</p>}

      {loading ? (
        <p className="text-gray-500">Loading invoices...</p>
      ) : userInvoices.length > 0 ? (
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-blue-600 to-blue-500">
              <th className="w-[100px] text-left py-2 px-4 font-medium">Invoice</th>
              <th className="text-left py-2 px-4 font-medium">Payment Status</th>
              <th className="text-left py-2 px-4 font-medium">Item</th>
              <th className="text-right py-2 px-4 font-medium">Amount</th>
              <th className="text-right py-2 px-4 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {userInvoices.map((invoice, index) => (
              <tr key={index} className="border-b text-gray-700">
                <td className="py-2 px-4 font-medium">
                  {invoice.invoiceId ? `INV${String(invoice.invoiceId).padStart(2, "0")}` : "N/A"}
                </td>
                <td className="py-2 px-4">
                  {invoice.isCancelled ? (
                    <span className="text-red-500">Cancelled</span>
                  ) : invoice.isPaid ? (
                    <span className="text-emerald-500">Paid</span>
                  ) : (
                    <span className="text-blue-500">Pending</span>
                  )}
                </td>
                <td className="py-2 px-4">{invoice.description || "N/A"}</td>
                <td className="py-2 px-4 text-right">{invoice.amount ? `${invoice.amount} WEI` : "0 WEI"}</td>
                <td className="py-2 px-4 text-right">
                  <button
                    onClick={() => handleViewInvoice(invoice)}
                    className="text-blue-600 underline"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500">No invoices found.</p>
      )}
    </div>
  );
};

export default DisplayInvoicesPage;
