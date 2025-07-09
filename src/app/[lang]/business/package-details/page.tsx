"use client";
import React, { useState, useEffect } from "react";
import ContactForm from "@/components/ContractForm";
import { CheckCircle } from "lucide-react";
import BussinessHeader from "@/components/BussinessHeader";
import Link from "next/link";

const PackageDetailsPage = () => {
  // Package data
  const packages = [
    {
      name: "Starter",
      price: "55,000",
      days: 30,
      credits: 20,
      images: "2 ภาพ ~credit",
      color: "blue",
    },
    {
      name: "Compact",
      price: "75,000",
      days: 30,
      credits: 30,
      images: "2 ภาพ ~credit",
      color: "blue",
    },
    {
      name: "Regular",
      price: "90,000",
      days: 45,
      credits: 40,
      images: "2 ภาพ ~credit",
      color: "blue",
    },
  ];

  // Benefits data
  const benefits = {
    left: [
      {
        title: "ขอบเขตงาน",
        items: [
          "Creative content idea",
          "Graphic design + layout composite",
          "Content copywriting",
          "Facebook ads, ad design, advertising / Ad policy",
          "เทคนิคการสร้างสรรค์คอนเทนต์",
          "วัดผลประเมินผล (1000 บาท/เดือน)",
        ],
      },
    ],
    right: [
      {
        title: "การแบ่งเครดิต",
        items: [
          { text: "การผลิต (Production 5 mins)", credits: 1 },
          { text: "อินโฟกราฟิค", credits: 2 },
          { text: "GIF animation", credits: 2 },
        ],
      },
    ],
  };

  const [isMounted, setIsMounted] = useState(false);

  // Set state to true after the component has mounted
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Render nothing on the server, to avoid hydration errors
  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <BussinessHeader />

      {/* Hero Section */}
      <section className="pt-24 pb-10 md:pt-32 md:pb-12 bg-blue-50 relative">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-black">
            ราคาแพ็คเกจและบริการต่างๆ
          </h1>
          <div className="flex justify-center gap-2 mt-8">
            <div className="bg-white rounded-lg shadow-md w-60 md:w-72 p-1">
              <Link
                href="/bussiness/price-list"
                className="block w-full py-2 px-4 rounded-lg bg-white text-gray-700"
              >
                Graphic Design Price List
              </Link>
            </div>
            <div className="bg-white rounded-lg shadow-md w-60 md:w-72 p-1">
              <Link
                href="#"
                className="block w-full py-2 px-4 rounded-lg bg-fastwork-blue text-white"
              >
                Social Content Credit Package
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {packages.map((pkg, index) => (
              <div
                key={index}
                className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col"
              >
                <div className="p-6 text-center">
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    {pkg.name}
                  </h3>
                  <div className="text-3xl font-bold my-4">{pkg.price}</div>
                  <div className="space-y-2 mb-6">
                    <p className="text-gray-600">{pkg.days} days</p>
                    <p className="text-gray-600">{pkg.credits} credits Quota</p>
                    <p className="text-gray-600">{pkg.images}</p>
                  </div>
                  <button className="w-full bg-fastwork-blue hover:bg-fastwork-deep-blue text-white font-medium py-2 rounded transition-colors">
                    CHOOSE PLAN
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Benefits Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mt-16 text-black">
            {/* Left Column */}
            <div className="bg-gray-50 rounded-lg p-6 ">
              {benefits.left.map((section, idx) => (
                <div key={idx}>
                  <h3 className="font-medium mb-4">{section.title}</h3>
                  <ul className="space-y-2">
                    {section.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-fastwork-blue flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Right Column */}
            <div className="bg-gray-50 rounded-lg p-6">
              {benefits.right.map((section, idx) => (
                <div key={idx}>
                  <h3 className="font-medium mb-4">{section.title}</h3>
                  <ul className="space-y-2">
                    {section.items.map((item, i) => (
                      <li key={i} className="flex items-center justify-between">
                        <span>{item.text}</span>
                        <span className="bg-gray-200 px-2 py-1 rounded text-sm">
                          {item.credits} เครดิต
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="max-w-5xl mx-auto mt-12 text-center flex justify-center space-x-6">
            <Link href="#" className="text-fastwork-blue hover:underline">
              รายละเอียดเงื่อนไขการใช้บริการ (T&C)
            </Link>
            <Link href="#" className="text-fastwork-blue hover:underline">
              ขอรายละเอียดเพิ่มเติมเกี่ยวการใช้งานเครดิต
            </Link>
            <Link href="#" className="text-fastwork-blue hover:underline">
              นโยบายการยกเลิกและขอเงินคืนเมื่อซื้อแพ็กเกจ
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-2xl font-bold mb-12 text-center text-black">
            เรื่องที่อยากให้เราช่วย
          </h2>
          <ContactForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm">Copyright © 2024 Fastjob for Business.</p>
            </div>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PackageDetailsPage;
