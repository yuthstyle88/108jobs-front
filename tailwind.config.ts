import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        third: "var(--third)",
        text_primary: "var(--text-primary)",
        text_secondary: "var(--text-secondary)",
        border_primary: "var(--border-primary)",
        fastwork: {
          blue: "#0078FF",
          "deep-blue": "#0062CC",
          "light-blue": "#0F9DFF",
          "bright-blue": "#10A3FF",
        },
        verification: {
          blue: "#0078FF",
          background: "#f0f4fd",
        },
      },
      boxShadow: {
        panel: "0 0 1.5rem 0 rgba(25,72,142,.15)",
        megaMenu:
          "0 1px 1px hsl(333deg 0% 50% / 15%), 0 2px 2px hsl(333deg 0% 50% / 15%), 0 4px 4px hsl(333deg 0% 50% / 15%), 0 8px 8px hsl(333deg 0% 50% / 15%), 0 16px 16px hsl(333deg 0% 50% / 15%), 0 32px 32px hsl(333deg 0% 50% / 15%), 0 64px 64px hsl(333deg 0% 50% / 15%)",
        categoryMenu: "0 4px 12px 0 rgba(43, 43, 43, .1)",
        subMenu: "0 0 1.5rem 0 rgba(25, 72, 142, .15)",
        toggle: "0 0 7px rgba(0, 0, 0, .5)",
        jobCard:
          "0 1px 1px hsl(333deg 0% 50% /7.5%),0 2px 2px hsl(333deg 0% 50% /7.5%),0 4px 4px hsl(333deg 0% 50% /7.5%),0 8px 8px hsl(333deg 0% 50% /7.5%),0 16px 16px hsl(333deg 0% 50% /7.5%)",
        filterSection: "0 4px 12px 0 rgba(43, 43, 43, .1)",
        inputShadow: "box-shadow: 0 0 0 .175em hsl(5 85% 94%)",
      },
      borderWidth: {
        1: "1px",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "scale-up": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.6s ease-out",
        float: "float 6s ease-in-out infinite",
        "scale-up": "scale-up 0.5s ease-out",
        "spin-fast": "spin 600ms linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
