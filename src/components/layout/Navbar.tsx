"use client";

import React from "react";
import Image from "next/image";
import SearchDialog from "@/components/SearchDialog";
import { SearchIcon } from "lucide-react";

const Navbar = () => {
  return (
    <div className="flex justify-between items-center p-4 border-b border-slate-800">
      <div className="flex items-center gap-x-6">
        <div className="flex items-center gap-x-1">
          <Image
            src={"/logo.png"}
            alt="Picture of NC mascot"
            width={45}
            height={45}
          />
          <p className="text-lg font-semibold">NextCoin</p>
        </div>
        <div className="flex items-center gap-x-3">
          {["Cryptocurrencies", "NFT", "Exchanges", "Learn"].map((item) => (
            <button key={item} className="hover:text-blue-600 cursor-pointer">
              {item}
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-x-3">
        <SearchDialog
          trigger={
            <button className="w-52 bg-slate-800 hover:bg-slate-700 flex items-center gap-x-2 px-4 py-1 rounded-md">
              <SearchIcon className="w-4 h-4" />
              <p className="text-sm text-gray-300">Search</p>
            </button>
          }
        />
        <button className="bg-blue-600 px-4 py-1 rounded-lg cursor-pointer active:scale-95">
          <p className="text-sm">Login</p>
        </button>
      </div>
    </div>
  );
};

export default Navbar;
