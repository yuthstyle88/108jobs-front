import { headers } from "next/headers";

export async function GET() {
  const incomingHeaders = await headers(); // อ่าน headers
  const headersObj = Object.fromEntries(incomingHeaders.entries());

  // เพิ่ม Full URL จาก host และ headers
  const host = headersObj["host"]; // ดึง Host จาก Headers
  const protocol = headersObj["x-forwarded-proto"] || "http"; // ตรวจหา Protocol
  const fullUrl = `${protocol}://${host}`; // ตัวอย่าง: http://localhost:3000

  return new Response(
    JSON.stringify({ headers: headersObj, fullUrl }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}