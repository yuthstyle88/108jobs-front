"use client";
import { useEffect, useRef } from "react";
import BussinessHeader from "@/components/BussinessHeader";
import ServiceCard from "@/components/ServiceCard";
import VideoPromo from "@/components/VideoPromo";
import ServiceGrid from "@/components/ServiceGrid";
import StatsAndClients from "@/components/StatsAndClients";
import ClientTestimonials from "@/components/ClientTestimonials";
import OurWorks from "@/components/OurWorks";
import ContactForm from "@/components/ContractForm";
import Link from "next/link";
import Image from "next/image"; 
import { BusinessImage } from "@/constants/images";

const Index = () => {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in");
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll(".animate-on-scroll");
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <BussinessHeader />

      {/* Hero Section */}
      <section className="pt-24 pb-12 md:pt-32 md:pb-16 bg-gradient-to-br from-fastwork-blue to-fastwork-light-blue overflow-hidden relative">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
            <div ref={heroRef} className="hero-text text-white max-w-xl z-10">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 animate-fade-in">
                fastwork for business
              </h1>
              <p className="text-lg md:text-xl mb-8 opacity-90 animate-fade-in">
                ผู้ช่วยจัดหาฟรีแลนซ์สำหรับกลุ่มธุรกิจ
              </p>
              <Link
                href="/contact"
                className="inline-block bg-white text-fastwork-blue py-3 px-8 rounded-md font-medium transition-all duration-300 hover:shadow-lg hover:bg-gray-50 animate-fade-in"
              >
                ปรึกษาเรา
              </Link>
            </div>

            <div className="hero-image relative w-full md:w-1/2 animate-fade-in">
              <div className="relative z-20">
                <Image
                  src={BusinessImage.business1}
                  alt="Fastwork for Business"
                  className="w-full object-cover rounded-lg shadow-lg animate-float"
                  width={600}
                  height={400}
                />

                <div
                  className="absolute -top-14 right-10 animate-float"
                  style={{ animationDelay: "1s" }}
                >
                  <ServiceCard
                    title="Online Marketing"
                    image={BusinessImage.business2}
                    className="w-24 h-20 md:w-48 md:h-36"
                    delay={300}
                  />
                </div>

                <div
                  className="absolute -bottom-10 -left-5 animate-float"
                  style={{ animationDelay: "1.5s" }}
                >
                  <ServiceCard
                    title="Design & Graphic"
                    image={BusinessImage.business3}
                    className="w-24 h-20 md:w-48 md:h-36"
                    delay={400}
                  />
                </div>

                <div
                  className="absolute -right-10 bottom-24 animate-float"
                  style={{ animationDelay: "2s" }}
                >
                  <ServiceCard
                    title="Photoshoot & Video Production"
                    image={BusinessImage.business4}
                    className="w-24 h-20 md:w-48 md:h-36"
                    delay={500}
                  />
                </div>

                <div
                  className="absolute -bottom-24 right-12 animate-float"
                  style={{ animationDelay: "2.5s" }}
                >
                  <ServiceCard
                    title="Motion Graphic"
                    image={BusinessImage.business5}
                    className="w-24 h-20 md:w-48 md:h-36"
                    delay={600}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute top-12 right-12 opacity-20">
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
          >
            <path d="M12 2v20M2 12h20" />
          </svg>
        </div>
        <div className="absolute bottom-36 left-12 opacity-20 rotate-45">
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
          >
            <path d="M12 2v20M2 12h20" />
          </svg>
        </div>
      </section>
      <VideoPromo />
      <ServiceGrid />
      <StatsAndClients />
      <ClientTestimonials />
      <OurWorks />
      <ContactForm />
    </div>
  );
};

export default Index;
