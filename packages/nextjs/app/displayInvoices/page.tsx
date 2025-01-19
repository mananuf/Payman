
// "use client";
// import React, { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { useAccount } from "@starknet-react/core";
// import { Contract } from "starknet";
// import abi from "../Abis/paymanAbi.json";

// // Convert felt value to a string
// const feltToString = (felt: string) => {
//   if (!felt) return "";
//   try {
//     const hex = felt.replace(/^0x/, ""); // Remove 0x prefix
//     return Buffer.from(hex, "hex").toString("utf8").replace(/\0/g, ""); // Convert hex to UTF-8
//   } catch {
//     return ""; // Return empty string if conversion fails
//   }
// };

// // Convert hex to BigInt with proper checks
// const hexToBigInt = (hex: string) => {
//   try {
//     return BigInt(hex || "0x0"); // Default to 0x0 if invalid
//   } catch {
//     return BigInt(0); // Fallback to 0
//   }
// };

// const DisplayInvoicesPage = () => {
//   const { account } = useAccount();
//   const router = useRouter();
//   const [userInvoices, setUserInvoices] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   const contractAddress = "0x037c8cf7eb75d09f8ac7659010b7cba4fa3a4655ce4b4069df64f79f2c58f594";
//   const contract = account ? new Contract(abi, contractAddress, account) : null;

//   useEffect(() => {
//     const fetchInvoices = async () => {
//       setLoading(true); 
//       try {
//         if (!account || !contract) {
//           setLoading(false);
//           console.error("No account or contract initialized.");
//           return;
//         }

//         const userAddress = account.address; 
//         console.log("Fetching invoices for address:", userAddress);

//         const result = await contract.call("getInvoiceForUser",[userAddress]);

//         console.log("Raw result from contract:", result);

//         if (!result || !Array.isArray(result)) {
//           console.error("Unexpected result format from contract call:", result);
//           setUserInvoices([]);
//           return;
//         }

//         // Parse invoices from the contract result
//         const invoices = result.map((invoice: any) => {
//           if (!Array.isArray(invoice)) {
//             console.error("Unexpected invoice format:", invoice);
//             return null;
//           }

//           return {
//             invoiceId: hexToBigInt(invoice[0]?.value || "0x0").toString(),
//             creator: invoice[1]?.value || "Unknown",
//             description: feltToString(invoice[3]?.value || ""),
//             // amount: hexToBigInt(invoice[4]?.value || "0x0").toString(),
//             isPaid: Boolean(Number(invoice[5]?.value)), // Convert to Boolean
//             isCancelled: Boolean(Number(invoice[6]?.value)), // Convert to Boolean
//           };
//         }).filter(Boolean); // Remove null entries

//         setUserInvoices(invoices); // Update state
//       } catch (error) {
//         console.error("Error fetching invoices:", error);
//       } finally {
//         setLoading(false); 
//       }
//     };

//     fetchInvoices();
//   }, [account, contract]);

//   const handleViewInvoice = (invoice: any) => {
//     router.push(`/view-invoice?invoiceId=${invoice.invoiceId}`);
//   };

//   return (
//     <div className="mt-12 bg-white p-6 rounded-lg shadow-lg">
//       <h2 className="text-xl font-semibold mb-4 text-gray-700">Recent Invoices</h2>
//       {loading ? (
//         <p className="text-gray-500">Loading invoices...</p>
//       ) : userInvoices.length > 0 ? (
//         <table className="min-w-full border-collapse">
//           <caption className="text-gray-700 text-sm mb-4">
//             A list of your recent invoices.
//           </caption>
//           <thead>
//             <tr className="bg-gradient-to-r from-blue-600 to-blue-500">
//               <th className="w-[100px] text-left py-2 px-4 font-medium">Invoice</th>
//               <th className="text-left py-2 px-4 font-medium">Payment Status</th>
//               <th className="text-left py-2 px-4 font-medium">Item</th>
//               <th className="text-right py-2 px-4 font-medium">Amount</th>
//               <th className="text-right py-2 px-4 font-medium">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {userInvoices.map((invoice, index) => (
//               <tr key={index} className="border-b text-gray-700">
//                 <td className="py-2 px-4 font-medium">
//                   {invoice.invoiceId
//                     ? `INV${invoice.invoiceId.padStart(2, "0")}`
//                     : "N/A"}
//                 </td>
//                 <td className="py-2 px-4">
//                   {invoice.isCancelled ? (
//                     <div className="mt-1 flex items-center gap-x-1.5">
//                       <div className="flex-none rounded-full bg-red-500/20 p-1">
//                         <div className="size-1.5 rounded-full bg-red-500" />
//                       </div>
//                       <p className="text-xs/5 text-red-500">Cancelled Payment</p>
//                     </div>
//                   ) : invoice.isPaid ? (
//                     <div className="mt-1 flex items-center gap-x-1.5">
//                       <div className="flex-none rounded-full bg-emerald-500/20 p-1">
//                         <div className="size-1.5 rounded-full bg-emerald-500" />
//                       </div>
//                       <p className="text-xs/5 text-emerald-500">Paid</p>
//                     </div>
//                   ) : (
//                     <div className="mt-1 flex items-center gap-x-1.5">
//                       <div className="flex-none rounded-full bg-blue-500/20 p-1">
//                         <div className="size-1.5 rounded-full bg-blue-500" />
//                       </div>
//                       <p className="text-xs/5 text-blue-500">Pending</p>
//                     </div>
//                   )}
//                 </td>
//                 <td className="py-2 px-4">{invoice.description || "N/A"}</td>
//                 <td className="py-2 px-4 text-right">
//                   {invoice.amount ? `${invoice.amount} WEI` : "0 WEI"}
//                 </td>
//                 <td className="py-2 px-4 text-right">
//                   <svg
//                     onClick={() => handleViewInvoice(invoice)}
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     strokeWidth="1.5"
//                     stroke="currentColor"
//                     className="w-6 h-6 text-blue-600 inline-flex justify-end cursor-pointer"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
//                     />
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
//                     />
//                   </svg>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       ) : (
//         <p className="text-gray-500">No invoices found.</p>
//       )}
//     </div>
//   );
// };

// export default DisplayInvoicesPage;

"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "@starknet-react/core";
import { Contract, RpcProvider } from "starknet";
import abi from "../Abis/paymanAbi.json";

// Utility Functions
const feltToString = (felt: string) => {
  if (!felt) return "";
  try {
    const hex = felt.replace(/^0x/, "");
    return Buffer.from(hex, "hex").toString("utf8").replace(/\0/g, "");
  } catch {
    return "";
  }
};

const hexToBigInt = (hex: string) => {
  try {
    return BigInt(hex || "0x0");
  } catch {
    return BigInt(0);
  }
};

// Define types for invoice data
interface Invoice {
  invoiceId: string;
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

  const rpcNodeUrl = "https://your-rpc-node-url.com";
  const contractAddress =
    "0x037c8cf7eb75d09f8ac7659010b7cba4fa3a4655ce4b4069df64f79f2c58f594";

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

      // Make the contract call
      const result = await contract.call("getInvoiceForUser", [account.address]);
      console.log("Raw result from contract:", result);

      // Ensure result is in an array format before mapping
      if (Array.isArray(result)) {
        const processedInvoices = result.map((invoice: any) => ({
          invoiceId: feltToString(invoice[0]),
          description: feltToString(invoice[1]),
          amount: hexToBigInt(invoice[2]).toString(),
          isPaid: invoice[3] === 1,
          isCancelled: invoice[4] === 1,
        }));

        setUserInvoices(processedInvoices);
      } else {
        throw new Error("Unexpected result format from the contract.");
      }
    } catch (err) {
      if (err instanceof Error) {
        console.error("Error fetching invoices:", err.message);
        setError(`Error fetching invoices: ${err.message}`);
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
    router.push(`/view-invoice?invoiceId=${invoice.invoiceId}`);
  };

  return (
    <div className="mt-12 bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Recent Invoices</h2>

      {/* Error message display */}
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
                  {invoice.invoiceId
                    ? `INV${invoice.invoiceId.padStart(2, "0")}`
                    : "N/A"}
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
                <td className="py-2 px-4 text-right">
                  {invoice.amount ? `${invoice.amount} WEI` : "0 WEI"}
                </td>
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
