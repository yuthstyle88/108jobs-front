import PopularSubCat from "@/components/PopularSubcat";
import { generateLocalizedMetadata } from "@/lib/metadata";

export async function generateMetadata() {
  return generateLocalizedMetadata("catalog");
}

const Categories = () => {
  return (
    <main className="grid-container-desktop-banner w-full min-h-screen">
      <PopularSubCat />
    </main>
  );
};

export default Categories;
