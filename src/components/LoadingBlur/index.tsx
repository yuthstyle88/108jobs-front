import React from "react";

type Props = {
    text: string;
};
const LoadingBlur = ({text}: Props) => {
    return (
        <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-white/70 z-[9999]">
            <div className="flex flex-col items-center gap-1">
                <svg
                    width="90px"
                    height="74px"
                    viewBox="0 0 200 200"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <g
                        id="Page-1"
                        stroke="none"
                        strokeWidth="1"
                        fill="none"
                        fillRule="evenodd"
                    >
                        <path
                            fill="#042b4a"
                            stroke="#042b4a"
                            strokeWidth="15"
                            transformOrigin="center"
                            d="m148 84.7 13.8-8-10-17.3-13.8 8a50 50 0 0 0-27.4-15.9v-16h-20v16A50 50 0 0 0 63 67.4l-13.8-8-10 17.3 13.8 8a50 50 0 0 0 0 31.7l-13.8 8 10 17.3 13.8-8a50 50 0 0 0 27.5 15.9v16h20v-16a50 50 0 0 0 27.4-15.9l13.8 8 10-17.3-13.8-8a50 50 0 0 0 0-31.7Zm-47.5 50.8a35 35 0 1 1 0-70 35 35 0 0 1 0 70Z"
                            fillRule="nonzero"
                        >
                            <animateTransform
                                type="rotate"
                                attributeName="transform"
                                calcMode="spline"
                                dur="2"
                                values="0;120"
                                keyTimes="0;1"
                                keySplines="0 0 1 1"
                                repeatCount="indefinite"
                            ></animateTransform>
                        </path>
                    </g>
                </svg>
                <p className="text-[19px] font-normal font-sans" style={{ color: "#042b4a" }}>{text}</p>
            </div>
        </div>
    );
};

export default LoadingBlur;