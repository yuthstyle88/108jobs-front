import Image from "next/image";
import Link from "next/link";
import React from "react";

const VideoPromo = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16">
          {/* Left side - Images */}
          <div className="relative w-full md:w-auto max-w-lg">
            {/* Background image (grayscale) */}
            <div className="absolute -left-10 top-0 w-full h-full -z-10">
              <Image
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600"
                alt="Background"
                width={500}
                height={500}
                className="w-full h-full object-cover grayscale opacity-40"
              />
            </div>

            {/* Main video */}
            <div className="relative bg-black rounded-md overflow-hidden shadow-xl">
              <div className="aspect-video relative">
                <Image
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600"
                  alt="Person speaking with microphone"
                  className="w-full h-full object-cover"
                  width={500}
                  height={500}
                />

                {/* Video Controls Overlay */}
                <div className="absolute inset-0 flex flex-col justify-between">
                  {/* Top - Duration */}
                  <div className="p-2">
                    <span className="text-white text-xs bg-black/50 px-2 py-1 rounded">
                      1:00
                    </span>
                  </div>

                  {/* Bottom - Controls */}
                  <div className="p-2 bg-gradient-to-t from-black/70 to-transparent">
                    <div className="flex items-center justify-between text-white">
                      <div className="flex items-center gap-3">
                        <button className="hover:text-gray-300">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="white"
                          >
                            <polygon points="5 3 19 12 5 21 5 3" />
                          </svg>
                        </button>
                        <span className="text-xs">0:00 / 1:09</span>
                      </div>

                      <div className="flex items-center gap-4">
                        <button className="hover:text-gray-300">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M11 5L6 9H2v6h4l5 4V5z" />
                            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                          </svg>
                        </button>
                        <button className="hover:text-gray-300">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M15 3h6v6" />
                            <path d="M10 14L21 3" />
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          </svg>
                        </button>
                        <button className="hover:text-gray-300">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <circle cx="12" cy="12" r="1" />
                            <circle cx="19" cy="12" r="1" />
                            <circle cx="5" cy="12" r="1" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full bg-white/30 h-1 mt-2 rounded-full overflow-hidden">
                      <div className="bg-white h-full w-[16%]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Content */}
          <div className="text-center md:text-left max-w-xs">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">ทำไมต้อง</h2>

            <div className="mb-8">
              <div className="flex justify-center md:justify-start">
                <div className="relative">
                  {/* Fastwork logo */}
                  <div className="flex items-center">
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 40 40"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-fastwork-blue"
                    >
                      <path
                        d="M19.9999 13.3333C22.7666 13.3333 25.1166 15.15 25.8166 17.7167L32.4999 14.8833C30.6499 8.93333 25.7499 4.66667 19.9999 4.66667C12.6333 4.66667 6.49992 9.36667 4.49992 16L11.1833 18.8167C12.0166 15.6167 15.6999 13.3333 19.9999 13.3333Z"
                        fill="#0078FF"
                      />
                      <path
                        d="M32.9167 23.75C33.2667 22.4 33.45 21 33.45 19.5667L26.9167 22.3833C26.9833 22.8333 27 23.2833 27 23.75C27 27.8167 23.8167 31.1667 19.75 31.3333V38C27.3833 37.8333 33.3333 31.5 33.3333 23.75H32.9167Z"
                        fill="#0078FF"
                      />
                      <path
                        d="M10.4167 23.75C10.4167 19.5 13.75 16.1667 17.9167 16.1667V9.5C10.4167 9.5 4.16675 15.75 4.16675 23.25C4.16675 31.0833 10.8334 37.5 18.6667 37.5V30.8333C14.0834 30.8333 10.4167 27.75 10.4167 23.75Z"
                        fill="#0078FF"
                      />
                    </svg>
                    <div className="ml-2">
                      <div className="text-fastwork-blue text-2xl font-bold">
                        fastwork
                      </div>
                      <div className="text-gray-600 text-sm">for business</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Link
              href="/contact"
              className="inline-block bg-white border-2 border-fastwork-blue text-fastwork-blue py-2 px-8 rounded-md font-medium transition-all duration-300 hover:bg-fastwork-blue hover:text-white"
            >
              ปรึกษาเรา
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
export default VideoPromo;
