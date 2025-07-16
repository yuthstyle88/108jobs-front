type Empty = NonNullable<unknown>;

type QueryMapping<PropsT, FallbacksT extends Empty> = {
  [K in keyof PropsT]-?: (
    input: string | undefined,
    fallback: K extends keyof FallbacksT ? FallbacksT[K] : undefined,
  ) => PropsT[K];
};
export default function getQueryParams<
  PropsT extends Record<string, any>,
  FallbacksT extends Partial<PropsT> = Empty
>(
  processors: QueryMapping<PropsT, FallbacksT>,
  source?: string,
  fallbacks: FallbacksT = {} as FallbacksT,
): PropsT {
  const searchParams = new URLSearchParams(source);
  const ret = {} as PropsT;

  for (const key of Object.keys(processors) as (keyof typeof processors)[]) {
    const processor = processors[key];
    const raw = searchParams.get(key as string) ?? undefined;

    // fallback ต้องกำหนด fallback[key] อย่างระมัดระวัง
    const fallback = (fallbacks?.[key] ?? undefined) as PropsT[typeof key];

    // processor return type ต้องตรงกับ PropsT[key]
    ret[key] = processor(raw, fallback);
  }

  return ret;
}