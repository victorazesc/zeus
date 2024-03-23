import type { Config } from "tailwindcss"
const convertToRGB = (variableName: string) => `rgba(var(${variableName}))`;

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          0: "rgb(255, 255, 255)",
          10: convertToRGB("--color-primary-10"),
          20: convertToRGB("--color-primary-20"),
          30: convertToRGB("--color-primary-30"),
          40: convertToRGB("--color-primary-40"),
          50: convertToRGB("--color-primary-50"),
          60: convertToRGB("--color-primary-60"),
          70: convertToRGB("--color-primary-70"),
          80: convertToRGB("--color-primary-80"),
          90: convertToRGB("--color-primary-90"),
          100: convertToRGB("--color-primary-100"),
          200: convertToRGB("--color-primary-200"),
          300: convertToRGB("--color-primary-300"),
          400: convertToRGB("--color-primary-400"),
          500: convertToRGB("--color-primary-500"),
          600: convertToRGB("--color-primary-600"),
          700: convertToRGB("--color-primary-700"),
          800: convertToRGB("--color-primary-800"),
          900: convertToRGB("--color-primary-900"),
          1000: "rgb(0, 0, 0)",
          DEFAULT: convertToRGB("--color-primary-100"),
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        custom: {
          primary: {
            0: "rgb(255, 255, 255)",
            10: convertToRGB("--color-primary-10"),
            20: convertToRGB("--color-primary-20"),
            30: convertToRGB("--color-primary-30"),
            40: convertToRGB("--color-primary-40"),
            50: convertToRGB("--color-primary-50"),
            60: convertToRGB("--color-primary-60"),
            70: convertToRGB("--color-primary-70"),
            80: convertToRGB("--color-primary-80"),
            90: convertToRGB("--color-primary-90"),
            100: convertToRGB("--color-primary-100"),
            200: convertToRGB("--color-primary-200"),
            300: convertToRGB("--color-primary-300"),
            400: convertToRGB("--color-primary-400"),
            500: convertToRGB("--color-primary-500"),
            600: convertToRGB("--color-primary-600"),
            700: convertToRGB("--color-primary-700"),
            800: convertToRGB("--color-primary-800"),
            900: convertToRGB("--color-primary-900"),
            1000: "rgb(0, 0, 0)",
            DEFAULT: convertToRGB("--color-primary-100"),
          },
          auth: {
            background: {
              100: convertToRGB("--color-auth-background-100"),
              200: convertToRGB("--color-auth-background-200"),
              300: convertToRGB("--color-auth-background-300"),
              400: convertToRGB("--color-auth-background-400"),
            },
            text: {
              100: convertToRGB("--color-auth-text-100"),
              200: convertToRGB("--color-auth-text-200"),
              300: convertToRGB("--color-auth-text-300"),
              400: convertToRGB("--color-auth-text-400"),
            },
            border: {
              100: convertToRGB("--color-auth-border-100"),
              200: convertToRGB("--color-auth-border-200"),
              300: convertToRGB("--color-auth-border-300"),
            },
          },
        }
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
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
      },
      typography: () => ({
        brand: {
          css: {
            "--tw-prose-body": convertToRGB("--color-text-100"),
            "--tw-prose-p": convertToRGB("--color-text-100"),
            "--tw-prose-headings": convertToRGB("--color-text-100"),
            "--tw-prose-lead": convertToRGB("--color-text-100"),
            "--tw-prose-links": convertToRGB("--color-primary-100"),
            "--tw-prose-bold": convertToRGB("--color-text-100"),
            "--tw-prose-counters": convertToRGB("--color-text-100"),
            "--tw-prose-bullets": convertToRGB("--color-text-100"),
            "--tw-prose-hr": convertToRGB("--color-text-100"),
            "--tw-prose-quotes": convertToRGB("--color-text-100"),
            "--tw-prose-quote-borders": convertToRGB("--color-border-200"),
            "--tw-prose-code": convertToRGB("--color-text-100"),
            "--tw-prose-pre-code": convertToRGB("--color-text-100"),
            "--tw-prose-pre-bg": convertToRGB("--color-background-100"),
            "--tw-prose-th-borders": convertToRGB("--color-border-200"),
            "--tw-prose-td-borders": convertToRGB("--color-border-200"),
          },
        },
      }),
      fontSize: {
        xs: "0.675rem",
        sm: "0.7875rem",
        base: "0.9rem",
        lg: "1.0125rem",
        xl: "1.125rem",
        "2xl": "1.35rem",
        "3xl": "1.6875rem",
        "4xl": "2.25rem",
        "5xl": "2.7rem",
        "6xl": "3.375rem",
        "7xl": "4.05rem",
        "8xl": "5.4rem",
        "9xl": "7.2rem",
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
      },
    },
    fontFamily: {
      custom: ["Inter", "sans-serif"],
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config