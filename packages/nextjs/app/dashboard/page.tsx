import React from "react";
import Image from "next/image";
import Logo from "../../public/img/payman-logo.png";
import Link from "next/link";

const DashboardPage = () => {
  return (
    <div className="h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-100 border-r border-gray-200">
        <div className="p-4">
          <Image src={Logo} alt="Logo" className="h-10 w-auto mx-auto mb-4" />
        </div>
        <nav className="space-y-4 p-4">
          <Link href="/dashboard" className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-100">
            Dashboard
          </Link>
          <Link href="/invoices" className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-100">
            Invoices
          </Link>
          <Link href="/settings" className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-100">
            Settings
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        {/* Top Navbar */}
        <nav className="bg-gray-100 border-b border-gray-200 p-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-lg font-semibold">Dashboard</h1>
            </div>
            <div>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                User Menu
              </button>
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <main className="p-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-2">Welcome!</h2>
            <p className="text-gray-600">This is the main content area.</p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
