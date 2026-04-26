'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { getPAMahasiswa } from "@/lib/api";
import InputSetoran from "@/components/InputSetoran";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function Dashboard() {
    const router = useRouter();

    const [data, setData] = useState([]);
    const [menu, setMenu] = useState("dashboard");
    const [filter, setFilter] = useState("all");
    const [search, setSearch] = useState("");
    const [dosen, setDosen] = useState({});

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) router.push("/");
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await getPAMahasiswa();
            const result =
                res?.data?.data?.info_mahasiswa_pa?.daftar_mahasiswa || [];

            setData(result);
            setDosen(res?.data?.data || {});
        } catch (err) {
            console.error(err);
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        router.push("/");
    };

    const filteredData = data
        .filter((mhs) =>
            mhs.nama.toLowerCase().includes(search.toLowerCase())
        )
        .filter((mhs) =>
            filter === "all" ? true : mhs.angkatan === filter
        );

    const angkatanList = [...new Set(data.map((m) => m.angkatan))];

    const exportExcel = () => {
        const formatted = filteredData.map((mhs) => ({
            Nama: mhs.nama,
            NIM: mhs.nim,
            Angkatan: mhs.angkatan,
            Progres: mhs.info_setoran?.persentase_progres_setor ?? 0,
        }));

        const ws = XLSX.utils.json_to_sheet(formatted);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Data");

        const excelBuffer = XLSX.write(wb, {
            bookType: "xlsx",
            type: "array",
        });

        const blob = new Blob([excelBuffer], {
            type: "application/octet-stream",
        });

        saveAs(blob, "data-mahasiswa.xlsx");
    };

    const getWarnings = () => {
        return filteredData.filter((mhs) => {
            const progress =
                mhs.info_setoran?.persentase_progres_setor ?? 0;
            return progress < 50;
        });
    };

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const value = payload[0].value || 0;

            return (
                <div className="bg-white border border-gray-200 px-3 py-2 rounded-lg text-sm shadow">
                    <p className="text-gray-500">Progres</p>
                    <p className="text-teal-600 font-semibold">{value}%</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="flex min-h-screen bg-[#f6f8fb] text-gray-800">

            <Sidebar onMenu={setMenu} />

            <div className="flex-1 flex flex-col">

                <Navbar
                    dosen={dosen}
                    onLogout={logout}
                    onSearch={setSearch}
                    warnings={getWarnings()}
                />

                <div className="p-6 space-y-6">

                    {/* FILTER */}
                    <div className="flex flex-wrap gap-3 items-center">
                        <select
                            onChange={(e) => setFilter(e.target.value)}
                            className="bg-white border border-gray-300 px-4 py-2 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        >
                            <option value="all">Semua Angkatan</option>
                            {angkatanList.map((a, i) => (
                                <option key={i} value={a}>
                                    Angkatan {a}
                                </option>
                            ))}
                        </select>

                        <button
                            onClick={exportExcel}
                            className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                        >
                            Export Excel
                        </button>
                    </div>

                    {/* DASHBOARD */}
                    {menu === "dashboard" && (
                        <div className="space-y-4">

                            <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm">
                                <p className="text-gray-500 text-sm">
                                    Total Mahasiswa
                                </p>
                                <h2 className="text-3xl font-bold text-gray-800 mt-1">
                                    {filteredData.length}
                                </h2>
                            </div>

                            <div className="bg-white border border-yellow-200 p-5 rounded-xl shadow-sm">
                                <h2 className="font-semibold text-yellow-600 mb-3">
                                    ⚠ Progres Rendah
                                </h2>

                                {getWarnings().length === 0 && (
                                    <p className="text-sm text-gray-500">
                                        Semua mahasiswa aman
                                    </p>
                                )}

                                {getWarnings().map((mhs, i) => (
                                    <p key={i} className="text-sm text-gray-700">
                                        {mhs.nama} ({mhs.nim}) —{" "}
                                        <span className="text-yellow-600 font-medium">
                                            {mhs.info_setoran?.persentase_progres_setor ?? 0}%
                                        </span>
                                    </p>
                                ))}
                            </div>

                        </div>
                    )}

                    {/* TABLE */}
                    {menu === "table" && (
                        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-100 text-gray-600">
                                    <tr>
                                        <th className="p-3 text-left">Nama</th>
                                        <th className="p-3 text-left">NIM</th>
                                        <th className="p-3 text-left">Angkatan</th>
                                        <th className="p-3 text-left">Progres</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData.map((mhs, i) => (
                                        <tr
                                            key={i}
                                            className="border-t border-gray-200 hover:bg-gray-50 transition"
                                        >
                                            <td className="p-3">
                                                <span
                                                    onClick={() => router.push(`/mahasiswa/${mhs.nim}`)}
                                                    className="cursor-pointer text-teal-600 hover:underline"
                                                >
                                                    {mhs.nama}
                                                </span>
                                            </td>
                                            <td className="p-3 text-gray-500">{mhs.nim}</td>
                                            <td className="p-3">{mhs.angkatan}</td>
                                            <td className="p-3 text-teal-600 font-medium">
                                                {mhs.info_setoran?.persentase_progres_setor ?? 0}%
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* CHART */}
                    {menu === "chart" && (
                        <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm">
                            <h2 className="mb-4 font-semibold text-gray-700">
                                Grafik Progres Hafalan
                            </h2>

                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={filteredData}>
                                    <XAxis dataKey="nama" hide />
                                    <YAxis stroke="#94a3b8" />
                                    <Tooltip content={<CustomTooltip />} />

                                    <Bar
                                        dataKey="info_setoran.persentase_progres_setor"
                                        radius={[6, 6, 0, 0]}
                                        fill="#14b8a6"
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}

                    {/* INPUT */}
                    {menu === "input" && (
                        <InputSetoran data={filteredData} onSuccess={fetchData} />
                    )}

                </div>
            </div>
        </div>
    );
}