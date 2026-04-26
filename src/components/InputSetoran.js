'use client';

import { useState } from "react";
import { simpanSetoran } from "@/lib/api";
import { ChevronDown } from "lucide-react";

const surahList = [
  { nama: "Ad-Dhuha", ayat: 11 },
  { nama: "Al-Insyirah", ayat: 8 },
  { nama: "At-Tin", ayat: 8 },
  { nama: "Al-Alaq", ayat: 19 },
  { nama: "Al-Qadr", ayat: 5 },
  { nama: "Al-Bayyinah", ayat: 8 },
  { nama: "Az-Zalzalah", ayat: 8 },
  { nama: "Al-Adiyat", ayat: 11 },
  { nama: "Al-Qariah", ayat: 11 },
  { nama: "At-Takatsur", ayat: 8 },
  { nama: "Al-Asr", ayat: 3 },
  { nama: "Al-Humazah", ayat: 9 },
  { nama: "Al-Fil", ayat: 5 },
  { nama: "Quraisy", ayat: 4 },
  { nama: "Al-Maun", ayat: 7 },
  { nama: "Al-Kautsar", ayat: 3 },
  { nama: "Al-Kafirun", ayat: 6 },
  { nama: "An-Nasr", ayat: 3 },
  { nama: "Al-Lahab", ayat: 5 },
  { nama: "Al-Ikhlas", ayat: 4 },
  { nama: "Al-Falaq", ayat: 5 },
  { nama: "An-Nas", ayat: 6 },
];

export default function InputSetoran({ data, onSuccess }) {
  const [selected, setSelected] = useState(""); // NIM
  const [surah, setSurah] = useState("");
  const [ayat, setAyat] = useState("");
  const [loading, setLoading] = useState(false);
  const [openMhs, setOpenMhs] = useState(false);
  const [openSurah, setOpenSurah] = useState(false);

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!selected) return alert("Pilih mahasiswa dulu 😐");
  if (!surah) return alert("Pilih surah dulu 😐");

  setLoading(true);

  try {
    // 🔥 PAKSA STRING
    const nimFix = String(selected).trim();

    const payload = {
      surah: surah,
      ayat: ayat ? String(ayat) : ""
    };

    console.log("TYPE NIM:", typeof nimFix);
    console.log("NIM:", nimFix);
    console.log("PAYLOAD:", payload);

    await simpanSetoran(nimFix, payload);

    alert("Setoran berhasil 🔥");

    setSelected("");
    setSurah("");
    setAyat("");

    onSuccess();
  } catch (err) {
    console.log("ERROR FULL:", err);

    if (err.response) {
      console.log("STATUS:", err.response.status);
      console.log("DATA:", err.response.data);
    }

    alert("Masih gagal 😵");
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

        {/* PILIH MAHASISWA */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setOpenMhs(!openMhs);
              setOpenSurah(false);
            }}
            className="w-full flex justify-between items-center p-3 rounded-lg border border-gray-300 bg-white"
          >
            <span className={`${!selected && "text-gray-400"}`}>
              {selected
                ? data.find((m) => m.nim === selected)?.nama
                : "Pilih Mahasiswa"}
            </span>

            <ChevronDown
              size={18}
              className={openMhs ? "rotate-180" : ""}
            />
          </button>

          {openMhs && (
            <div className="absolute z-20 mt-2 w-full bg-white border rounded-lg max-h-48 overflow-y-auto">
              {data.map((mhs, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setSelected(String(mhs.nim)); // 🔥 PASTI STRING
                    setOpenMhs(false);
                  }}
                  className="px-4 py-2 hover:bg-teal-50 cursor-pointer"
                >
                  {mhs.nama} ({mhs.nim})
                </div>
              ))}
            </div>
          )}
        </div>

        {/* PILIH SURAH */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setOpenSurah(!openSurah);
              setOpenMhs(false);
            }}
            className="w-full flex justify-between items-center p-3 rounded-lg border border-gray-300 bg-white"
          >
            <span className={`${!surah && "text-gray-400"}`}>
              {surah || "Pilih Surah"}
            </span>

            <ChevronDown
              size={18}
              className={openSurah ? "rotate-180" : ""}
            />
          </button>

          {openSurah && (
            <div className="absolute z-20 mt-2 w-full bg-white border rounded-lg max-h-48 overflow-y-auto">
              {surahList.map((s, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setSurah(s.nama);
                    setOpenSurah(false);
                  }}
                  className="px-4 py-2 hover:bg-teal-50 cursor-pointer"
                >
                  {s.nama} ({s.ayat} ayat)
                </div>
              ))}
            </div>
          )}
        </div>

        {/* AYAT */}
        <input
          type="text"
          placeholder="Ayat (contoh: 1-5)"
          value={ayat}
          onChange={(e) => setAyat(e.target.value)}
          className="w-full p-3 rounded-lg border border-gray-300"
        />

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg bg-teal-500 text-white"
        >
          {loading ? "Menyimpan..." : "Simpan Setoran"}
        </button>

      </form>
    </div>
  );
}