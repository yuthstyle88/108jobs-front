import { NextResponse } from "next/server";

interface Params {
  params: {
    lang: string;
    file: string;
  };
}

export async function GET(request: Request, { params }: Params) {
  const { lang, file } = params;

  if (!lang || !file) {
    return NextResponse.json(
      { error: "Language and file parameters are required." },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `https://fastwork.ibrowe.com/api/v3/lang/${lang}/${file}_${lang}.json`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch translation data");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch data.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
