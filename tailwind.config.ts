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
      },
      boxShadow: {
        panel: "0 0 1.5rem 0 rgba(25,72,142,.15)",
        megaMenu:'0 1px 1px hsl(333deg 0% 50% / 15%), 0 2px 2px hsl(333deg 0% 50% / 15%), 0 4px 4px hsl(333deg 0% 50% / 15%), 0 8px 8px hsl(333deg 0% 50% / 15%), 0 16px 16px hsl(333deg 0% 50% / 15%), 0 32px 32px hsl(333deg 0% 50% / 15%), 0 64px 64px hsl(333deg 0% 50% / 15%)',
        categoryMenu: '0 4px 12px 0 rgba(43, 43, 43, .1)',
        subMenu: '0 0 1.5rem 0 rgba(25, 72, 142, .15)',
      },
    },
  },
  plugins: [],
};
export default config;
