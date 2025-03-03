"use client";
import React, { useState, useEffect, forwardRef } from "react";
import ContactForm from "@/components/ContractForm";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";
import BussinessHeader from "@/components/BussinessHeader";

// Tabs components defined inline
const Tabs = TabsPrimitive.Root;

const TabsList = forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      className
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

const PriceListPage = () => {
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
              <a
                href="#"
                className="block w-full py-2 px-4 rounded-lg bg-fastwork-blue text-white"
              >
                Graphic Design Price List
              </a>
            </div>
            <div className="bg-white rounded-lg shadow-md w-60 md:w-72 p-1">
              <a
                href="/bussiness/package-details"
                className="block w-full py-2 px-4 rounded-lg bg-white text-gray-700"
              >
                Social Content Credit Package
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Price List Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <Tabs defaultValue="online" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger
                value="online"
                className="data-[state=active]:bg-fastwork-blue data-[state=active]:text-white"
              >
                Online
              </TabsTrigger>
              <TabsTrigger
                value="offline"
                className="data-[state=active]:bg-fastwork-blue data-[state=active]:text-white"
              >
                Offline
              </TabsTrigger>
              <TabsTrigger
                value="branding"
                className="data-[state=active]:bg-fastwork-blue data-[state=active]:text-white"
              >
                Branding
              </TabsTrigger>
            </TabsList>

            {/* Online Content Tab */}
            <TabsContent
              value="online"
              className="border rounded-lg overflow-x-auto"
            >
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                      Type of content / Material
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      รายละเอียด
                    </th>
                    <th className="px-6 py-3 bg-blue-100 text-center text-xs font-medium text-blue-700 uppercase tracking-wider">
                      New design
                      <div className="text-xxs font-normal mt-1">
                        ราคา / ชิ้น
                      </div>
                    </th>
                    <th className="px-6 py-3 bg-blue-50 text-center text-xs font-medium text-blue-700 uppercase tracking-wider">
                      ตามรูปแบบอ้างอิง
                      <div className="text-xxs font-normal mt-1">
                        ราคา / ชิ้น
                      </div>
                    </th>
                    <th className="px-6 py-3 bg-gray-100 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                      แก้ไข/ปรับปรุง 1 ครั้ง
                      <div className="text-xxs font-normal mt-1">
                        ราคา / ชิ้น
                      </div>
                    </th>
                    <th className="px-6 py-3 bg-gray-100 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                      แก้ไข/ปรับปรุง รายใหญ่
                      <div className="text-xxs font-normal mt-1">
                        ราคา / ชิ้น
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {/* Add table rows data here */}
                </tbody>
              </table>
            </TabsContent>

            {/* Offline Content Tab */}
            <TabsContent
              value="offline"
              className="border rounded-lg overflow-x-auto"
            >
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                      Type of content / Material
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      รายละเอียด
                    </th>
                    <th className="px-6 py-3 bg-blue-100 text-center text-xs font-medium text-blue-700 uppercase tracking-wider">
                      New design
                      <div className="text-xxs font-normal mt-1">
                        ราคา / ชิ้น
                      </div>
                    </th>
                    <th className="px-6 py-3 bg-blue-50 text-center text-xs font-medium text-blue-700 uppercase tracking-wider">
                      ตามรูปแบบอ้างอิง
                      <div className="text-xxs font-normal mt-1">
                        ราคา / ชิ้น
                      </div>
                    </th>
                    <th className="px-6 py-3 bg-gray-100 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                      แก้ไข/ปรับปรุง 1 ครั้ง
                      <div className="text-xxs font-normal mt-1">
                        ราคา / ชิ้น
                      </div>
                    </th>
                    <th className="px-6 py-3 bg-gray-100 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                      แก้ไข/ปรับปรุง รายใหญ่
                      <div className="text-xxs font-normal mt-1">
                        ราคา / ชิ้น
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {/* Add table rows data here */}
                </tbody>
              </table>
            </TabsContent>

            {/* Branding Tab */}
            <TabsContent
              value="branding"
              className="border rounded-lg overflow-x-auto"
            >
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                      Type of content / Material
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      รายละเอียด
                    </th>
                    <th className="px-6 py-3 bg-blue-100 text-center text-xs font-medium text-blue-700 uppercase tracking-wider">
                      New design
                      <div className="text-xxs font-normal mt-1">
                        ราคา / ชิ้น
                      </div>
                    </th>
                    <th className="px-6 py-3 bg-blue-50 text-center text-xs font-medium text-blue-700 uppercase tracking-wider">
                      ตามรูปแบบอ้างอิง
                      <div className="text-xxs font-normal mt-1">
                        ราคา / ชิ้น
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {/* Add table rows data here */}
                </tbody>
              </table>
            </TabsContent>
          </Tabs>

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>
              *ราคาที่ระบุไว้เป็นราคาเริ่มต้น
              ราคาอาจมีการเปลี่ยนแปลงขึ้นอยู่กับรายละเอียดของงาน
            </p>
            <p className="mt-2">
              **ราคาอาจมีการเปลี่ยนแปลงตามความเหมาะสมของงาน
            </p>
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
              <p className="text-sm">Copyright © 2024 Fastwork for Business.</p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
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
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
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
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PriceListPage;
