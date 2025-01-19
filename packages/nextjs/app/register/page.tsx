"use client";
import React, { useState, useRef } from "react";
import { useAccount } from "@starknet-react/core";
import { Contract} from "starknet";
import { useRouter } from "next/navigation";


import abi from "../Abis/paymanAbi.json"; 
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const stringToFelt252 = (str: any) => {
  if (!str) throw new Error("Invalid string input for felt conversion.");
  return "0x" + Buffer.from(str, "utf8").toString("hex");
};

const RegisterPage = () => {
  const router = useRouter();
  const { account } = useAccount();
  const [username, setUsername] = useState("");
  const inputRef = useRef<HTMLInputElement>(null); 

  const contractAddress = "0x037c8cf7eb75d09f8ac7659010b7cba4fa3a4655ce4b4069df64f79f2c58f594";
  const contract = account
    ? new Contract(abi, contractAddress, account) 
    : null;

  const handleRegister = async () => {
    if (!account) {
      toast.error("Please connect your wallet.");
      return;
    }

    if (!username.trim()) {
      toast.error("Please enter a valid username.");
      return;
    }

    try {
      const feltUsername = stringToFelt252(username.trim()); 

      if (!contract) {
        throw new Error("Contract is not initialized. Connect your wallet.");
      }

      const tx = await contract.registerUsername(feltUsername);
      console.log("Transaction submitted:", tx);

      const receipt = await account.waitForTransaction(tx.transaction_hash);
      console.log("Transaction confirmed:", receipt);
      
      localStorage.setItem('paymanUsername', username.trim());
      
      toast.success("Username registered successfully!");
      
      // Redirect to dashboard after successful registration
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500); 

    } catch (error) {
      console.error("Error while interacting with the contract:", error);
      toast.error("Failed to register the username. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <ToastContainer />
      <div className="w-96 bg-white shadow-md rounded-lg p-6">
        <h1 className="text-lg font-semibold text-gray-800 mb-2">Create Username</h1>
        <p className="text-sm text-gray-600 mb-4">
          This will create a unique username that identifies your wallet address for ease of transaction.
        </p>
        <div>
          <input
            ref={inputRef} 
            type="text"
            placeholder="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4"
          />
        </div>
        <button
          onClick={handleRegister}
          disabled={!username.trim()}
          className={`w-full py-2 px-4 text-white font-semibold rounded-lg ${
            username.trim()
              ? "bg-blue-500 hover:bg-blue-600"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default RegisterPage;
