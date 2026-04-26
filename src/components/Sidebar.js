'use client';

import { useState } from "react";
import { LayoutDashboard, Table, BarChart3, PlusCircle } from "lucide-react";

export default function Sidebar({ onMenu }) {
  const [active, setActive] = useState("dashboard");

  const menus = [
    { name: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "table", label: "Data Mahasiswa", icon: <Table size={18} /> },
    { name: "chart", label: "Statistik", icon: <BarChart3 size={18} /> },
    { name: "input", label: "Input Setoran", icon: <PlusCircle size={18} /> },
  ];

  return (
    <div className="w-64 min-h-screen bg-white border-r border-gray-200 p-6">

      <h1 className="text-xl font-bold mb-10 text-gray-800">
        Hafalqu
      </h1>

      <div className="space-y-2">
        {menus.map((menu, i) => {
          const isActive = active === menu.name;

          return (
            <button
              key={i}
              onClick={() => {
                setActive(menu.name);
                onMenu(menu.name);
              }}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm transition-all
                ${isActive
                  ? "bg-teal-50 text-teal-600 font-medium"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"}
              `}
            >
              {menu.icon}
              <span>{menu.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}