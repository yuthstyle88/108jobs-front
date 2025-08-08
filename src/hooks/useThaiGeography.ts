// Lightweight hooks to load Thai geography datasets from public/thai-geo/*
// Keep it UI-agnostic so you can place selects anywhere.

import { useEffect, useMemo, useState } from "react";

type Province = { code: string | number; name_th?: string; name_en?: string; province_code?: string | number };
type District = { code: string | number; name_th?: string; name_en?: string; province_code?: string | number };
type Subdistrict = { code: string | number; name_th?: string; name_en?: string; district_code?: string | number; zip_code?: string | number };

export type Option = { value: string; label: string };
const norm = (v: unknown) => String(v);
const labelTH = (x: { name_th?: string; name_en?: string }) => x.name_th ?? x.name_en ?? "";

async function getJSON<T>(path: string): Promise<T> {
    const res = await fetch(path, { cache: "force-cache" });
    if (!res.ok) throw new Error(`Failed to load ${path}`);
    return res.json();
}

// Load provinces once
export function useProvinces() {
    const [data, setData] = useState<Province[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<unknown>(null);

    useEffect(() => {
        let alive = true;
        setLoading(true);
        getJSON<Province[]>("/thai-geo/provinces.json")
            .then((p) => alive && setData(p))
            .catch((e) => alive && setError(e))
            .finally(() => alive && setLoading(false));
        return () => { alive = false; };
    }, []);

    const options: Option[] = useMemo(
        () => data.map(p => ({ value: norm(p.province_code ?? p.code), label: labelTH(p) })),
        [data]
    );

    return { options, loading, error, raw: data };
}

// Load districts for a given provinceCode
export function useDistricts(provinceCode?: string) {
    const [data, setData] = useState<District[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<unknown>(null);

    useEffect(() => {
        let alive = true;
        setData([]);
        if (!provinceCode) return;
        setLoading(true);
        getJSON<District[]>("/thai-geo/districts.json")
            .then((all) => {
                if (!alive) return;
                const filtered = all.filter(d => norm(d.province_code ?? String(d.code).slice(0, 2)) === norm(provinceCode));
                setData(filtered);
            })
            .catch((e) => alive && setError(e))
            .finally(() => alive && setLoading(false));
        return () => { alive = false; };
    }, [provinceCode]);

    const options: Option[] = useMemo(
        () => data.map(d => ({ value: norm(d.code), label: labelTH(d) })),
        [data]
    );

    return { options, loading, error, raw: data };
}

// Load subdistricts for a given districtCode
export function useSubdistricts(districtCode?: string) {
    const [data, setData] = useState<Subdistrict[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<unknown>(null);

    useEffect(() => {
        let alive = true;
        setData([]);
        if (!districtCode) return;
        setLoading(true);
        getJSON<Subdistrict[]>("/thai-geo/subdistricts.json")
            .then((all) => {
                if (!alive) return;
                const filtered = all.filter(s => norm(s.district_code ?? String(s.code).slice(0, 4)) === norm(districtCode));
                setData(filtered);
            })
            .catch((e) => alive && setError(e))
            .finally(() => alive && setLoading(false));
        return () => { alive = false; };
    }, [districtCode]);

    const options: Option[] = useMemo(
        () => data.map(s => ({ value: norm(s.code), label: labelTH(s) })),
        [data]
    );

    return { options, loading, error, raw: data };
}