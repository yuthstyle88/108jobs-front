import React from "react";
import Link from "next/link";
import { Search } from "lucide-react";
interface ServiceItemProps {
  title: string;
  image: string;
  delay?: number;
}
const ServiceItem: React.FC<ServiceItemProps> = ({
  title,
  image,
  delay = 0,
}) => {
  return (
    <div
      className="service-item bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg animate-on-scroll"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="relative h-60 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>
      <div className="flex justify-between items-center p-4">
        <h3 className="text-fastwork-blue font-medium">{title}</h3>
        <Link href="/services" className="text-fastwork-blue">
          <Search size={20} className="transition-transform hover:scale-110" />
        </Link>
      </div>
    </div>
  );
};
const ServiceGrid: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12 animate-on-scroll">
          <h2 className="text-3xl font-bold mb-3 text-gray-800">
            บริการของเรา
          </h2>
          <p className="text-gray-600">
            ครอบคลุมทุกความต้องการด้านธุรกิจ มากกว่า 90 บริการ
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <ServiceItem
            title="Design & Graphic"
            image="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600"
            delay={100}
          />
          <ServiceItem
            title="Online Marketing"
            image="https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&q=80&w=600"
            delay={200}
          />
          <ServiceItem
            title="Photoshoot & Video Production"
            image="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=600"
            delay={300}
          />
          <ServiceItem
            title="Operation & Consultant"
            image="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=600"
            delay={400}
          />
          <ServiceItem
            title="Writing & Translation"
            image="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=600"
            delay={500}
          />
          <ServiceItem
            title="Web & Programming"
            image="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=600"
            delay={600}
          />
        </div>

        <div className="flex justify-center">
          <Link
            href="/services"
            className="border border-gray-300 text-gray-700 py-3 px-12 rounded-md font-medium transition-all duration-300 hover:bg-gray-100"
          >
            บริการเรา
          </Link>
        </div>
      </div>
    </section>
  );
};
export default ServiceGrid;
