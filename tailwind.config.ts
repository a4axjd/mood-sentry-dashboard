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
                cyber: {
                    yellow: "#FCEE0A",
                    blue: "#00F0FF",
                    black: "#0D0D0D",
                    dark: "#1A1A1A",
                    gray: "#2D2D2D",
                }
            },
            fontFamily: {
                mono: ['monospace'], // Placeholder, will update if specific font needed
            }
        },
    },
    plugins: [],
};
export default config;
