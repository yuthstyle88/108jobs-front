import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

const portfolioItems = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&q=80&w=600",
    title: "Digital Marketing Campaign",
    category: "Google Ads",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?auto=format&fit=crop&q=80&w=600",
    title: "Web Design Project",
    category: "UX/UI Design",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&q=80&w=600",
    title: "Mobile App Development",
    category: "App Development",
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1458668383970-8ddd3927deed?auto=format&fit=crop&q=80&w=600",
    title: "Product Packaging Design",
    category: "Graphic Design",
  },
  {
    id: 5,
    image:
      "https://images.unsplash.com/photo-1482881497185-d4a9ddbe4151?auto=format&fit=crop&q=80&w=600",
    title: "Brand Identity Development",
    category: "Branding",
  },
  {
    id: 6,
    image: "/lovable-uploads/67ad5db5-2d4c-46ea-821f-a3e9d9789481.png",
    title: "Corporate Website Redesign",
    category: "Web Development",
  },
  {
    id: 7,
    image:
      "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&q=80&w=600",
    title: "E-commerce Platform",
    category: "Web Development",
  },
  {
    id: 8,
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=600",
    title: "Social Media Campaign",
    category: "Digital Marketing",
  },
];

const OurWorks = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const items = entry.target.querySelectorAll(".portfolio-item");
            items.forEach((item, index) => {
              // Add the class immediately, not just when intersecting
              item.classList.add("animate-fade-in");
            });

            // Also make sure the heading and other elements are visible
            const animatedElements =
              entry.target.querySelectorAll(".animate-on-scroll");
            animatedElements.forEach((el) => {
              el.classList.add("animate-fade-in");
              el.classList.remove("opacity-0");
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);

      // Make sure that section title is visible from the start
      const titleElements =
        sectionRef.current.querySelectorAll(".animate-on-scroll");
      titleElements.forEach((el) => {
        el.classList.add("animate-fade-in");
        el.classList.remove("opacity-0");
      });
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-20 bg-gradient-to-b from-white to-gray-50"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div className="mb-6 md:mb-0">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 animate-on-scroll animate-fade-in">
              Our Latest Works
            </h2>
            <p className="text-gray-600 max-w-2xl animate-on-scroll animate-fade-in">
              Explore our portfolio of successful projects and creative
              solutions that have helped our clients achieve their business
              goals.
            </p>
          </div>

          <Link
            href="/works"
            className="flex items-center gap-2 text-fastwork-blue font-medium group transition-all duration-300 animate-on-scroll animate-fade-in self-start md:self-auto"
          >
            View All Projects
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {portfolioItems.map((item, index) => (
            <div
              key={item.id}
              className="portfolio-item relative overflow-hidden rounded-xl shadow-sm hover:shadow-xl bg-white animate-fade-in"
            >
              <Link href="/works" className="block h-full">
                <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                  />
                </div>
                <div className="p-5">
                  <span className="text-xs font-medium text-fastwork-blue inline-block mb-2 bg-blue-50 px-3 py-1 rounded-full">
                    {item.category}
                  </span>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
                    {item.title}
                  </h3>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-sm text-gray-500">View Project</span>
                    <ArrowRight className="h-4 w-4 text-fastwork-blue opacity-0 transform translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <Link
            href="/works"
            className="bg-white border-2 border-fastwork-blue text-fastwork-blue hover:bg-fastwork-blue hover:text-white py-3 px-8 rounded-md font-medium transition-all duration-300 animate-fade-in"
          >
            ดูผลงานทั้งหมด
          </Link>
        </div>
      </div>
    </section>
  );
};

export default OurWorks;
