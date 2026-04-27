'use client';

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import useSWR from "swr";
import { ArrowLeft } from "lucide-react";

const fetcher = async (url) => {
  const token = localStorage.getItem("token");

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const json = await res.json();

  if (!res.ok) throw new Error(json.message || "Gagal fetch data");

  return json.data;
};


const normalize = (str) =>
  (str || "").toLowerCase().replace(/[^a-z]/g, "");

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

  const [loadingItem, setLoadingItem] = useState({
    hapus: null,
  });

  const { data, mutate, isLoading } = useSWR(
    nim
      ? `https://api.tif.uin-suska.ac.id/setoran-dev/v1/mahasiswa/setoran/${nim}`
      : null,
    fetcher,
    { refreshInterval: 3000 } 
  );

  const detailSetoran = data?.setoran?.detail || [];

  const sudahSetor = [
    ...new Set(
      detailSetoran.map((r) =>
        normalize(r.surah || r.nama_surah)
      )
    )
  ];

  const handleHapus = async (surah) => {
    setLoadingItem((p) => ({ ...p, hapus: surah.nama }));

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `https://api.tif.uin-suska.ac.id/setoran-dev/v1/mahasiswa/setoran/${nim}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data_setoran: [
              {
                nama_komponen_setoran: surah.nama,
              },
            ],
          }),
        }
      );

      const result = await res.json();

      if (!res.ok) throw new Error(result.message || "Gagal hapus");

      await mutate(); 
    } catch (err) {
      alert(err.message);
    } finally {
      setLoadingItem((p) => ({ ...p, hapus: null }));
    }
  };

  console.log("DETAIL SETORAN RAW:", detailSetoran);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading...
      </div>
    );
  }

  const progress =
    data?.info?.info_setoran?.persentase_progres_setor ??
    data?.setoran?.info_dasar?.persentase_progres_setor ??
    0;

  return (
    <div className="min-h-screen bg-[#f6f8fb] p-6 space-y-6 text-gray-800">


      <button
        onClick={() => router.push("/dashboard")}
        className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg shadow-sm hover:bg-gray-100"
      >
        <ArrowLeft size={16} />
        Kembali
      </button>

      <div className="bg-white p-6 rounded-xl border shadow-sm">
        <h1 className="text-2xl font-bold">
          {data?.info?.nama || "-"}
        </h1>
        <p className="text-gray-500">{nim}</p>

        <h2 className="text-3xl font-bold text-teal-600 mt-2">
          {progress}%
        </h2>
      </div>

      {/* CHECKLIST */}
      <div className="bg-white p-6 rounded-xl border shadow-sm">
        <h2 className="font-semibold mb-4">
          List Hafalan
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">

          {surahList.map((s, i) => {
            const done = sudahSetor.includes(normalize(s.nama));

            return (
              <div
                key={i}
                className={`p-3 rounded-lg border text-sm transition
                  ${done
                    ? "bg-teal-100 text-teal-700"
                    : "bg-gray-100 text-gray-500"
                  }`}
              >
                <div className="font-medium">{s.nama}</div>

                {/* HAPUS BUTTON */}
                {done && (
                  <button
                    onClick={() => handleHapus(s)}
                    disabled={loadingItem.hapus === s.nama}
                    className="mt-2 px-2 py-1 text-xs bg-red-500 text-white rounded"
                  >
                    {loadingItem.hapus === s.nama ? "Menghapus..." : "Hapus"}
                  </button>
                )}
              </div>
            );
          })}

        </div>
      </div>
    </div>
  );
}