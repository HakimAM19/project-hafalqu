'use client';

import { Bell } from "lucide-react";

export default function Navbar({ dosen, onLogout, onSearch, warnings }) {
  return (
    <div className="w-full px-8 py-4 flex justify-between items-center bg-white border-b border-gray-200 shadow-sm">

      {/* LEFT */}
      <div className="flex items-center gap-4">

        <h2 className="text-lg font-semibold text-gray-800">
          Dashboard
        </h2>

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Cari mahasiswa..."
          onChange={(e) => onSearch(e.target.value)}
          className="px-4 py-2 w-64 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        />

      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">

        {/* NOTIF */}
        <div className="relative p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition">
          <Bell size={18} className="text-gray-600" />

          {warnings.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-teal-500 text-white text-xs px-2 py-0.5 rounded-full">
              {warnings.length}
            </span>
          )}
        </div>

        {/* USER */}
        <div className="text-right">
          <p className="text-sm font-semibold text-gray-800">
            {dosen.nama || "Dosen"}
          </p>
          <p className="text-xs text-gray-500">
            {dosen.email || "-"}
          </p>
        </div>

        {/* LOGOUT */}
        <button
          onClick={onLogout}
          className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm transition"
        >
          Logout
        </button>

      </div>
    </div>
  );
}