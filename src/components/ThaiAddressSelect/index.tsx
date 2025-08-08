"use client";
import { useEffect, useState } from "react";

type Province = { code: string | number; name_th?: string; name_en?: string };
type District = { code: string | number; name_th?: string; name_en?: string; province_code?: string | number };
type Subdistrict = { code: string | number; name_th?: string; name_en?: string; district_code?: string | number; zip_code?: string | number };

const norm = (v: any) => String(v);
const labelTH = (x: { name_th?: string; name_en?: string }) => x.name_th ?? x.name_en ?? "";

export type ThaiAddressValue = {
    provinceCode?: string;
    districtCode?: string;
    subdistrictCode?: string;
};

async function getJSON<T>(file: string) {
    const res = await fetch(`/thai-geo/${file}`, { cache: "force-cache" });
    if (!res.ok) throw new Error(`failed ${file}`);
    return (await res.json()) as T;
}

export function ThaiAddressSelect({
                                      value,
                                      onChange,
                                      disabled,
                                      defaultProvinceCode,
                                      labels,
                                      placeholders,
                                  }: {
    value?: ThaiAddressValue;
    onChange?: (v: ThaiAddressValue) => void;
    disabled?: boolean;
    defaultProvinceCode?: string;
    labels?: { province?: string; district?: string; subdistrict?: string };
    placeholders?: { province?: string; district?: string; subdistrict?: string };
}) {
    // 1) โหลดเฉพาะ "จังหวัด" ตอนแรก
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [loadingProv, setLoadingProv] = useState(true);

    const [districts, setDistricts] = useState<District[]>([]);
    const [loadingDist, setLoadingDist] = useState(false);

    const [subs, setSubs] = useState<Subdistrict[]>([]);
    const [loadingSub, setLoadingSub] = useState(false);

    const [provinceCode, setProvinceCode] = useState<string | undefined>(value?.provinceCode ?? defaultProvinceCode);
    const [districtCode, setDistrictCode] = useState<string | undefined>(value?.districtCode);
    const [subdistrictCode, setSubdistrictCode] = useState<string | undefined>(value?.subdistrictCode);

    // โหลดจังหวัดครั้งเดียว
    useEffect(() => {
        (async () => {
            setLoadingProv(true);
            try {
                const p = await getJSON<Province[]>("provinces.json");
                setProvinces(p);
            } finally {
                setLoadingProv(false);
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // เมื่อเลือกจังหวัด ⇒ ค่อยโหลด “อำเภอของจังหวัดนั้น” เท่านั้น
    useEffect(() => {
        // เคลียร์ชั้นล่าง
        setDistrictCode(undefined);
        setSubdistrictCode(undefined);
        setSubs([]);
        if (!provinceCode) {
            setDistricts([]);
            return;
        }
        (async () => {
            setLoadingDist(true);
            try {
                const all = await getJSON<District[]>("districts.json");
                const filtered = all.filter(
                    d => norm(d.province_code ?? String(d.code).slice(0, 2)) === norm(provinceCode)
                );
                setDistricts(filtered);
            } finally {
                setLoadingDist(false);
            }
        })();
    }, [provinceCode]);

    // เมื่อเลือกอำเภอ ⇒ ค่อยโหลด “ตำบลของอำเภอนั้น”
    useEffect(() => {
        setSubdistrictCode(undefined);
        if (!districtCode) {
            setSubs([]);
            return;
        }
        (async () => {
            setLoadingSub(true);
            try {
                const all = await getJSON<Subdistrict[]>("subdistricts.json");
                const filtered = all.filter(
                    s => norm(s.district_code ?? String(s.code).slice(0, 4)) === norm(districtCode)
                );
                setSubs(filtered);
            } finally {
                setLoadingSub(false);
            }
        })();
    }, [districtCode]);

    // แจ้งค่ากลับให้ parent (เช่น RHF)
    useEffect(() => {
        onChange?.({ provinceCode, districtCode, subdistrictCode });
    }, [provinceCode, districtCode, subdistrictCode, onChange]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col">
                {labels?.province && (
                    <label className="block text-sm text-text-primary font-semibold mb-2">
                        {labels.province}
                    </label>
                )}
                <select
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-third transition-all"
                    value={provinceCode ?? ""}
                    onChange={e => setProvinceCode(e.target.value || undefined)}
                    disabled={disabled || loadingProv}
                >
                    <option value="">
                        {loadingProv ? "กำลังโหลดจังหวัด..." : placeholders?.province ?? "— เลือกจังหวัด —"}
                    </option>
                    {provinces.map(p => {
                        const code = norm((p as any).province_code ?? p.code);
                        return (
                            <option key={code} value={code}>
                                {labelTH(p)}
                            </option>
                        );
                    })}
                </select>
            </div>

            <div className="flex flex-col">
                {labels?.district && (
                    <label className="block text-sm text-text-primary font-semibold mb-2">
                        {labels.district}
                    </label>
                )}
                <select
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-third transition-all"
                    value={districtCode ?? ""}
                    onChange={e => setDistrictCode(e.target.value || undefined)}
                    disabled={disabled || !provinceCode || loadingDist}
                >
                    <option value="">
                        {!provinceCode ? "เลือกจังหวัดก่อน" : loadingDist ? "กำลังโหลดอำเภอ..." : placeholders?.district ?? "— เลือกอำเภอ —"}
                    </option>
                    {districts.map(d => {
                        const code = norm(d.code);
                        return (
                            <option key={code} value={code}>
                                {labelTH(d)}
                            </option>
                        );
                    })}
                </select>
            </div>

            <div className="flex flex-col">
                {labels?.subdistrict && (
                    <label className="block text-sm text-text-primary font-semibold mb-2">
                        {labels.subdistrict}
                    </label>
                )}
                <select
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-third transition-all"
                    value={subdistrictCode ?? ""}
                    onChange={e => setSubdistrictCode(e.target.value || undefined)}
                    disabled={disabled || !districtCode || loadingSub}
                >
                    <option value="">
                        {!districtCode ? "เลือกอำเภอก่อน" : loadingSub ? "กำลังโหลดตำบล..." : placeholders?.subdistrict ?? "— เลือกตำบล —"}
                    </option>
                    {subs.map(s => {
                        const code = norm(s.code);
                        return (
                            <option key={code} value={code}>
                                {labelTH(s)}
                            </option>
                        );
                    })}
                </select>
            </div>
        </div>
    );
}