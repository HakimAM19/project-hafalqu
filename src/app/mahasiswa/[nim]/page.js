'use client';

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getDetailSetoran } from "@/lib/api";

// 🔥 NORMALIZE (buat checklist)
const normalize = (str) =>
  (str || "").toLowerCase().replace(/[^a-z]/g, "");

// 🔥 LIST SURAH (JUZ 30 + AL-FATIHAH)
const surahList = [
  { nama: "Al-Fatihah" },
  { nama: "An-Nas" },
  { nama: "Al-Falaq" },
  { nama: "Al-Ikhlas" },
  { nama: "Al-Lahab" },
  { nama: "An-Nasr" },
  { nama: "Al-Kafirun" },
  { nama: "Al-Kautsar" },
  { nama: "Al-Maun" },
  { nama: "Quraisy" },
  { nama: "Al-Fil" },
  { nama: "Al-Humazah" },
  { nama: "Al-Asr" },
  { nama: "At-Takatsur" },
  { nama: "Al-Qariah" },
  { nama: "Al-Adiyat" },
  { nama: "Az-Zalzalah" },
  { nama: "Al-Bayyinah" },
  { nama: "Al-Qadr" },
  { nama: "Al-Alaq" },
  { nama: "At-Tin" },
  { nama: "Al-Insyirah" },
  { nama: "Ad-Dhuha" }
];

export default function DetailMahasiswa() {
  const { nim } = useParams();
  const router = useRouter();

  const [data, setData] = useState(null);

  useEffect(() => {
    if (!nim) return;
    fetchDetail();
  }, [nim]);

  const fetchDetail = async () => {
    try {
      const res = await getDetailSetoran(nim);
      setData(res.data.data);

      // DEBUG (boleh hapus nanti)
      console.log("DETAIL DATA:", res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading...
      </div>
    );
  }

  // 🔥 AMBIL SETORAN DETAIL
  const detailSetoran = data?.setoran?.detail || [];

  // 🔥 LIST SURAH YANG SUDAH DISETOR (UNIQUE)
  const sudahSetor = [
    ...new Set(
      detailSetoran.map((r) =>
        normalize(r.surah || r.nama_surah)
      )
    )
  ];

  // 🔥 PROGRESS = IKUT DASHBOARD (INI YANG PALING PENTING)
  const progress =
    data?.info?.info_setoran?.persentase_progres_setor ??
    data?.setoran?.info_dasar?.persentase_progres_setor ??
    0;

  return (
    <div className="min-h-screen bg-[#f6f8fb] p-6 space-y-6 text-gray-800">

      {/* 🔙 BACK */}
      <button
        onClick={() => router.back()}
        className="px-4 py-2 rounded-lg bg-white border border-gray-200 
        text-gray-700 hover:bg-gray-100 transition shadow-sm text-sm"
      >
        ← Kembali
      </button>

      {/* 👤 HEADER */}
      <div className="bg-white p-6 rounded-xl border shadow-sm">
        <h1 className="text-2xl font-bold">
          {data.info?.nama || "-"}
        </h1>

        <p className="text-gray-500">{nim}</p>

        <div className="mt-4">
          <p className="text-sm text-gray-500">
            Progress Hafalan
          </p>

          <h2 className="text-3xl font-bold text-teal-600">
            {progress}%
          </h2>
        </div>
      </div>

      {/* 📚 CHECKLIST SURAH */}
      <div className="bg-white p-6 rounded-xl border shadow-sm">
        <h2 className="font-semibold mb-4">
          Checklist Hafalan (Juz 30)
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {surahList.map((s, i) => {
            const done = sudahSetor.includes(normalize(s.nama));

            return (
              <div
                key={i}
                className={`p-3 rounded-lg text-sm font-medium border transition
                  ${
                    done
                      ? "bg-teal-100 text-teal-700 border-teal-200"
                      : "bg-gray-100 text-gray-500 border-gray-200"
                  }
                `}
              >
                {s.nama}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}