import { generateLocalizedMetadata } from "@/lib/metadata";
import { LayoutProps } from "@/types/layout";

export async function generateMetadata() {
  return generateLocalizedMetadata("login");
}

export default function Login({ children }: LayoutProps) {
  return (
    <>
        {children}
    </>
  );
}
