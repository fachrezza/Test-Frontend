import {
  useLoaderData,
  useSearchParams,
} from "react-router-dom";

type Province = {
  id: number;
  name: string;
};

type Regency = {
  id: number;
  name: string;
  province_id: number;
};

type District = {
  id: number;
  name: string;
  regency_id: number;
};

type LoaderData = {
  provinces: Province[];
  regencies: Regency[];
  districts: District[];
};

export async function loader(): Promise<LoaderData> {
  const res = await fetch("/data/indonesia_regions.json");
  const data = await res.json();
  return data;
}

// Komponen ini merangkum seluruh kebutuhan dalam satu halaman.
export default function FilterPage() {
  const { provinces, regencies, districts } =
    useLoaderData() as LoaderData;

  const [searchParams, setSearchParams] = useSearchParams();

  const provinceId = Number(searchParams.get("province")) || 0;
  const regencyId = Number(searchParams.get("regency")) || 0;
  const districtId = Number(searchParams.get("district")) || 0;

  const filteredRegencies = regencies.filter(
    (r) => r.province_id === provinceId
  );

  const filteredDistricts = districts.filter(
    (d) => d.regency_id === regencyId
  );

  const selectedProvince = provinces.find(p => p.id === provinceId);
  const selectedRegency = regencies.find(r => r.id === regencyId);
  const selectedDistrict = districts.find(d => d.id === districtId);

  function handleChange(
    e: React.ChangeEvent<HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    const params = new URLSearchParams(searchParams);

    if (!value) {
      params.delete(name);
    } else {
      params.set(name, value);
    }

    if (name === "province") {
      params.delete("regency");
      params.delete("district");
    }

    if (name === "regency") {
      params.delete("district");
    }

    setSearchParams(params);
  }

  function handleReset() {
    setSearchParams({});
  }

    return (
    <div className="h-screen flex bg-[#f3f4f6]">
        {/* SIDEBAR */}
        <aside className="w-80 bg-white border-r px-8 py-8 flex flex-col">
        <h1 className="text-lg font-semibold mb-12">
            Frontend Assessment
        </h1>

        <div>
            <p className="text-xs tracking-widest text-gray-400 mb-8">
            FILTER WILAYAH
            </p>

            {/* PROVINSI */}
            <div className="mb-6">
            <label className="text-xs font-semibold text-gray-500 block mb-2">
                PROVINSI
            </label>
            <select
                name="province"
                value={provinceId || ""}
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3 text-sm"
            >
                <option value="">Pilih Provinsi</option>
                {provinces.map((p) => (
                <option key={p.id} value={p.id}>
                    {p.name}
                </option>
                ))}
            </select>
            </div>

            {/* KOTA */}
            <div className="mb-6">
            <label className="text-xs font-semibold text-gray-500 block mb-2">
                KOTA/KABUPATEN
            </label>
            <select
                name="regency"
                value={regencyId || ""}
                onChange={handleChange}
                disabled={!provinceId}
                className="w-full border rounded-xl px-4 py-3 text-sm"
            >
                <option value="">Pilih Kota/Kabupaten</option>
                {filteredRegencies.map((r) => (
                <option key={r.id} value={r.id}>
                    {r.name}
                </option>
                ))}
            </select>
            </div>

            {/* KECAMATAN */}
            <div className="mb-10">
            <label className="text-xs font-semibold text-gray-500 block mb-2">
                KECAMATAN
            </label>
            <select
                name="district"
                value={districtId || ""}
                onChange={handleChange}
                disabled={!regencyId}
                className="w-full border rounded-xl px-4 py-3 text-sm"
            >
                <option value="">Pilih Kecamatan</option>
                {filteredDistricts.map((d) => (
                <option key={d.id} value={d.id}>
                    {d.name}
                </option>
                ))}
            </select>
            </div>
        </div>

        {/* RESET DI BAWAH */}
        <button
            onClick={handleReset}
            className="mt-auto w-full border-2 border-blue-600 text-blue-600 py-3 rounded-xl font-semibold hover:bg-blue-50 transition"
        >
            RESET
        </button>
        </aside>

        {/* CONTENT */}
        <main className="flex-1 flex items-center justify-center relative">
        <div className="text-center">
            {selectedProvince && (
            <>
                <p className="text-xs tracking-[0.3em] text-blue-400 mb-4">
                PROVINSI
                </p>
                <h1 className="text-6xl font-bold text-gray-900 mb-10">
                {selectedProvince.name}
                </h1>
            </>
            )}

            {selectedRegency && (
            <>
                <div className="text-gray-300 text-2xl mb-10">↓</div>
                <p className="text-xs tracking-[0.3em] text-blue-400 mb-4">
                KOTA / KABUPATEN
                </p>
                <h2 className="text-4xl font-bold text-gray-800 mb-10">
                {selectedRegency.name}
                </h2>
            </>
            )}

            {selectedDistrict && (
            <>
                <div className="text-gray-300 text-2xl mb-10">↓</div>
                <p className="text-xs tracking-[0.3em] text-blue-400 mb-4">
                KECAMATAN
                </p>
                <h3 className="text-3xl font-semibold text-gray-800">
                {selectedDistrict.name}
                </h3>
            </>
            )}

            {!selectedProvince && (
            <h1 className="text-gray-400 text-2xl">
                Silakan pilih wilayah
            </h1>
            )}
        </div>
        </main>
    </div>
    );
}