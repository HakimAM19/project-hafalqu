'use client';

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getDetailSetoran } from "@/lib/api";

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

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [loadingItem, setLoadingItem] = useState({
    validasi: null,
    hapus: null,
  });

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  useEffect(() => {
    if (!nim) return;
    fetchDetail();
  }, [nim]);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const res = await getDetailSetoran(nim);
      setData(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleValidasi = async (surah) => {
    setLoadingItem((p) => ({ ...p, validasi: surah.nama }));

    try {
      const res = await fetch(
        `https://api.tif.uin-suska.ac.id/setoran-dev/v1/mahasiswa/setoran/${nim}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data_setoran: [
              {
                id_komponen_setoran: surah.nama,
                nama_komponen_setoran: surah.nama,
              },
            ],
            tgl_setoran: new Date().toISOString().split("T")[0],
          }),
        }
      );

      const result = await res.json();
      console.log("VALIDASI:", result);

      if (!res.ok) throw new Error(result.message || "Gagal validasi");

      await fetchDetail();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoadingItem((p) => ({ ...p, validasi: null }));
    }
  };

  const handleHapus = async (surah) => {
    setLoadingItem((p) => ({ ...p, hapus: surah.nama }));

    try {
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
      console.log("HAPUS:", result);

      if (!res.ok) throw new Error(result.message || "Gagal hapus");

      await fetchDetail();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoadingItem((p) => ({ ...p, hapus: null }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading...
      </div>
    );
  }

  const detailSetoran = data?.setoran?.detail || [];

  const sudahSetor = [
    ...new Set(
      detailSetoran.map((r) =>
        normalize(r.surah || r.nama_surah)
      )
    )
  ];

  const progress =
    data?.info?.info_setoran?.persentase_progres_setor ??
    data?.setoran?.info_dasar?.persentase_progres_setor ??
    0;

  return (
    <div className="min-h-screen bg-[#f6f8fb] p-6 space-y-6 text-gray-800">

      {/* HEADER */}
      <div className="bg-white p-6 rounded-xl border shadow-sm">
        <h1 className="text-2xl font-bold">
          {data.info?.nama || "-"}
        </h1>
        <p className="text-gray-500">{nim}</p>

        <h2 className="text-3xl font-bold text-teal-600 mt-2">
          {progress}%
        </h2>
      </div>

      {/* CHECKLIST */}
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
                className={`p-3 rounded-lg border text-sm transition
                  ${done
                    ? "bg-teal-100 text-teal-700"
                    : "bg-gray-100 text-gray-500"
                  }`}
              >
                <div className="font-medium">{s.nama}</div>

                <div className="flex gap-2 mt-2">

                  {/* VALIDASI */}
                  {!done && (
                    <button
                      onClick={() => handleValidasi(s)}
                      disabled={loadingItem.validasi === s.nama}
                      className="px-2 py-1 text-xs bg-teal-500 text-white rounded"
                    >
                      {loadingItem.validasi === s.nama ? "..." : "Validasi"}
                    </button>
                  )}

                  {/* HAPUS */}
                  {done && (
                    <button
                      onClick={() => handleHapus(s)}
                      disabled={loadingItem.hapus === s.nama}
                      className="px-2 py-1 text-xs bg-red-500 text-white rounded"
                    >
                      {loadingItem.hapus === s.nama ? "..." : "Hapus"}
                    </button>
                  )}

                </div>
              </div>
            );
          })}

        </div>
      </div>
    </div>
  );
}