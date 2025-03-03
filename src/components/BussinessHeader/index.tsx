import Link from "next/link";
const BussinessHeader = () => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white z-50 shadow-sm animate-fade-in">
      <div className="container mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">

          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#0078FF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform duration-300 hover:scale-105"
          >
            <path d="M21.2 8.4c.5.38.8.97.8 1.6 0 1.1-.9 2-2 2H10a2 2 0 1 1 0-4h10c1.1 0 2 .9 2 2" />
            <path d="M14 8v5.5a2.5 2.5 0 0 1-5 0V8" />
            <path d="M9 8v5.5a2.5 2.5 0 0 1-5 0V4" />
          </svg>
          <span className="text-fastwork-blue font-semibold text-lg">
            fastwork
          </span>
          <span className="text-gray-600 text-xs mt-1.5">for business</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="/services"
            className="text-gray-700 hover:text-fastwork-blue transition-colors duration-300"
          >
            บริการ
          </Link>
          <Link
            href="/work"
            className="text-gray-700 hover:text-fastwork-blue transition-colors duration-300"
          >
            ผลงาน
          </Link>
          <Link
            href="/about"
            className="text-gray-700 hover:text-fastwork-blue transition-colors duration-300"
          >
            เกี่ยวกับเรา
          </Link>
          <Link
            href="/contact"
            className="bg-fastwork-blue text-white px-4 py-2 rounded-md hover:bg-fastwork-deep-blue transition-colors duration-300"
          >
            ติดต่อเรา
          </Link>
        </nav>

        <button className="md:hidden text-gray-700 focus:outline-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default BussinessHeader;
