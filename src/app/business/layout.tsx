import { generateLocalizedMetadata } from "@/lib/metadata";
import { LayoutProps } from "@/types/layout";

export async function generateMetadata() {
  return generateLocalizedMetadata("business"); 
}

export default function BusinessLayout({ children }: LayoutProps) {
  return (
    <>
        {children}
    </>
  );
}
