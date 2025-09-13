'use server'
import type {IsoData, RouteData} from '@/utils/types';
import type {GetSiteResponse} from 'lemmy-js-client';
import fetchIsoData from '@/lib/api/fetchIsoData';
import {IncomingHttpHeaders} from "http";
import {headers} from "next/headers";
import {testHost} from "@/utils/config";

const defaultIsoData: IsoData = {
  path: '/',
  routeData: {} as RouteData,
  siteRes: {} as unknown as GetSiteResponse,
  lemmyExternalHost: testHost,
  errorPageData: undefined,
};

export default async function isoDataInitializer(): Promise<IsoData | null> {
  const hdr = await headers();
  const url = hdr.get("x-url") || "/";
  const incomingHttpHeaders: IncomingHttpHeaders = Object.fromEntries(hdr.entries());
  try {
    return await fetchIsoData(url,
      incomingHttpHeaders);
  } catch (error) {
    console.error('Error fetching ISO data:',
      error);
    return defaultIsoData;
  }

}
