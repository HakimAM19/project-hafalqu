'use client';

import { useState } from "react";
import { simpanSetoran } from "@/lib/api";
import { ChevronDown } from "lucide-react";

const surahList = [
  { nama: "Ad-Dhuha", ayat: 11, id: "SURAH_93" },
  { nama: "Al-Insyirah", ayat: 8, id: "SURAH_94" },
  { nama: "At-Tin", ayat: 8, id: "SURAH_95" },
  { nama: "Al-Alaq", ayat: 19, id: "SURAH_96" },
  { nama: "Al-Qadr", ayat: 5, id: "SURAH_97" },
  { nama: "Al-Bayyinah", ayat: 8, id: "SURAH_98" },
  { nama: "Az-Zalzalah", ayat: 8, id: "SURAH_99" },
  { nama: "Al-Adiyat", ayat: 11, id: "SURAH_100" },
  { nama: "Al-Qariah", ayat: 11, id: "SURAH_101" },
  { nama: "At-Takatsur", ayat: 8, id: "SURAH_102" },
  { nama: "Al-Asr", ayat: 3, id: "SURAH_103" },
  { nama: "Al-Humazah", ayat: 9, id: "SURAH_104" },
  { nama: "Al-Fil", ayat: 5, id: "SURAH_105" },
  { nama: "Quraisy", ayat: 4, id: "SURAH_106" },
  { nama: "Al-Maun", ayat: 7, id: "SURAH_107" },
  { nama: "Al-Kautsar", ayat: 3, id: "SURAH_108" },
  { nama: "Al-Kafirun", ayat: 6, id: "SURAH_109" },
  { nama: "An-Nasr", ayat: 3, id: "SURAH_110" },
  { nama: "Al-Lahab", ayat: 5, id: "SURAH_111" },
  { nama: "Al-Ikhlas", ayat: 4, id: "SURAH_112" },
  { nama: "Al-Falaq", ayat: 5, id: "SURAH_113" },
  { nama: "An-Nas", ayat: 6, id: "SURAH_114" },
];

export default function InputSetoran({ data, onSuccess }) {
  const [selected, setSelected] = useState(""); 
  const [surah, setSurah] = useState(null);
  const [ayat, setAyat] = useState("");
  const [loading, setLoading] = useState(false);
  const [openMhs, setOpenMhs] = useState(false);
  const [openSurah, setOpenSurah] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selected) return alert("Pilih mahasiswa dulu");
    if (!surah) return alert("Pilih surah dulu");

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const today = new Date().toISOString().split("T")[0];

      const payload = {
        data_setoran: [
          {
            id_komponen_setoran: surah.id,
            nama_komponen_setoran: surah.nama
          }
        ],
        tgl_setoran: today
      };

console.log("TOKEN:", token);
console.log("SELECTED:", selected);
console.log("PAYLOAD:", payload);

      const response = await fetch(
  `https://api.tif.uin-suska.ac.id/setoran-dev/v1/mahasiswa/setoran/${selected}`,
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token?.trim()}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  }
);
      const result = await response.json();

      if (!response.ok || !result.response) {
        throw new Error(result.message || "Gagal simpan setoran");
      }

      alert("Setoran berhasil 🔥");

      setSelected("");
      setSurah(null);
      setAyat("");

      onSuccess?.();
    } catch (err) {
      console.log("ERROR:", err);
      alert(err.message || "Masih gagal 😵");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">

      <h2 className="text-lg font-semibold mb-4 text-gray-800">
        Input Setoran
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* MAHASISWA */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setOpenMhs(!openMhs);
              setOpenSurah(false);
            }}
            className="w-full flex justify-between items-center p-3 border rounded-lg"
          >
            <span>
              {selected
                ? data.find((m) => m.nim === selected)?.nama
                : "Pilih Mahasiswa"}
            </span>
            <ChevronDown size={18} />
          </button>

          {openMhs && (
            <div className="absolute w-full bg-white border mt-2 rounded-lg max-h-48 overflow-y-auto z-10">
              {data.map((mhs) => (
                <div
                  key={mhs.nim}
                  onClick={() => {
                    setSelected(mhs.nim);
                    setOpenMhs(false);
                  }}
                  className="p-2 hover:bg-teal-50 cursor-pointer"
                >
                  {mhs.nama} ({mhs.nim})
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SURAH */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setOpenSurah(!openSurah);
              setOpenMhs(false);
            }}
            className="w-full flex justify-between items-center p-3 border rounded-lg"
          >
            <span>{surah ? surah.nama : "Pilih Surah"}</span>
            <ChevronDown size={18} />
          </button>

          {openSurah && (
            <div className="absolute w-full bg-white border mt-2 rounded-lg max-h-48 overflow-y-auto z-10">
              {surahList.map((s) => (
                <div
                  key={s.id}
                  onClick={() => {
                    setSurah(s);
                    setOpenSurah(false);
                  }}
                  className="p-2 hover:bg-teal-50 cursor-pointer"
                >
                  {s.nama}
                </div>
              ))}
            </div>
          )}
        </div>


        {/* BUTTON */}
        <button
          disabled={loading}
          className="w-full py-3 bg-teal-500 text-white rounded-lg"
        >
          {loading ? "Menyimpan..." : "Simpan Setoran"}
        </button>

      </form>
    </div>
  );
}