/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                'heading': ['Unbounded', 'sans-serif'],
                'body': ['Manrope', 'sans-serif'],
                'mono': ['JetBrains Mono', 'monospace'],
            },
            colors: {
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                chart: {
                    1: "hsl(var(--chart-1))",
                    2: "hsl(var(--chart-2))",
                    3: "hsl(var(--chart-3))",
                    4: "hsl(var(--chart-4))",
                    5: "hsl(var(--chart-5))",
                },
                gold: {
                    DEFAULT: "#D4AF37",
                    50: "#F9F5E8",
                    100: "#F3EBD1",
                    200: "#E7D7A3",
                    300: "#DBC375",
                    400: "#CFAF47",
                    500: "#D4AF37",
                    600: "#AA8A2E",
                    700: "#806622",
                    800: "#554316",
                    900: "#2B210B",
                },
                cyan: {
                    DEFAULT: "#00F0FF",
                    50: "#E6FEFF",
                    100: "#CCFEFF",
                    200: "#99FCFF",
                    300: "#66FBFF",
                    400: "#33F9FF",
                    500: "#00F0FF",
                    600: "#00C0CC",
                    700: "#009099",
                    800: "#006066",
                    900: "#003033",
                },
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
                "pulse-glow": {
                    "0%, 100%": { boxShadow: "0 0 20px rgba(212, 175, 55, 0.3)" },
                    "50%": { boxShadow: "0 0 40px rgba(212, 175, 55, 0.6)" },
                },
                "slide-up": {
                    from: { opacity: "0", transform: "translateY(20px)" },
                    to: { opacity: "1", transform: "translateY(0)" },
                },
                "fade-in": {
                    from: { opacity: "0" },
                    to: { opacity: "1" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                "pulse-glow": "pulse-glow 2s ease-in-out infinite",
                "slide-up": "slide-up 0.5s ease-out forwards",
                "fade-in": "fade-in 0.3s ease-out forwards",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
};
