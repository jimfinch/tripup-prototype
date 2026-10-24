import type { Config } from "tailwindcss";

// Tokens mirror the Figma file (Designs page variables and text styles).
// Colours resolve to CSS variables in app/globals.css so opacity modifiers
// (e.g. text-gunmetal/50) work.
const rgb = (name: string) => `rgb(var(--color-${name}) / <alpha-value>)`;

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      screens: {
        // Viewport wider than the device: show the phone frame.
        framed: "431px",
        // Enough room for the demo panel beside the frame.
        panel: "1100px",
      },
      colors: {
        // Brand/*
        violet: rgb("violet"), // Brand/Electric Violet
        gunmetal: rgb("gunmetal"), // Brand/Gunmetal
        lilac: rgb("lilac"), // Brand/Lilac
        lime: rgb("lime"), // Brand/Primary – "needs your action"
        teal: rgb("teal"), // Brand/Secondary
        "off-white": rgb("off-white"), // Brand/Off white
        white: rgb("white"), // Brand/White
        // Not a Figma variable; used as the avatar ring on the hi-fi screens.
        "avatar-ring": rgb("avatar-ring"),
        // Secondary text on light surfaces. Figma uses gunmetal/50; raised to
        // /65 for contrast (designer decision, CLAUDE.md §9).
        "ink-muted": "rgb(var(--color-gunmetal) / 0.65)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        // iOS chrome (status bar uses SF Pro in Figma).
        system: [
          "-apple-system",
          "BlinkMacSystemFont",
          "system-ui",
          "sans-serif",
        ],
      },
      fontSize: {
        // Figma text styles: [size, { lineHeight, letterSpacing, fontWeight }]
        display: ["40px", { lineHeight: "44px", fontWeight: "600" }],
        "title-l": [
          "32px",
          { lineHeight: "36px", letterSpacing: "-0.6px", fontWeight: "600" },
        ],
        "title-m": [
          "22px",
          { lineHeight: "28px", letterSpacing: "-0.3px", fontWeight: "600" },
        ],
        "title-s": [
          "18px",
          { lineHeight: "24px", letterSpacing: "-0.2px", fontWeight: "600" },
        ],
        headline: ["16px", { lineHeight: "22px", fontWeight: "600" }],
        body: ["16px", { lineHeight: "24px", fontWeight: "500" }],
        label: ["14px", { lineHeight: "20px", fontWeight: "600" }],
        "body-s": ["14px", { lineHeight: "20px", fontWeight: "500" }],
        caption: ["12px", { lineHeight: "16px", fontWeight: "500" }],
        "caption-strong": ["12px", { lineHeight: "16px", fontWeight: "600" }],
        micro: ["10px", { lineHeight: "12px", fontWeight: "600" }],
        // iOS status bar clock (SF Pro Bold in Figma).
        "status-time": ["18px", { lineHeight: "22px", fontWeight: "700" }],
      },
      spacing: {
        // Off-scale values used by the hi-fi (default scale covers the rest).
        4.5: "18px",
        "device-w": "430px",
        "device-h": "932px",
        "status-bar": "var(--status-bar-h)",
        "sheet-top": "82px",
        "toast-bottom": "132px",
        "tab-bar-bottom": "var(--tab-bar-bottom)",
        // Device chrome (status bar, home indicator, tab buttons).
        1.25: "5px",
        5.5: "22px",
        7.5: "30px",
        13: "52px",
        27: "108px",
        15: "60px",
        18: "72px",
        knob: "39px",
        "status-slot": "86px",
        island: "122px",
        indicator: "153px",
        "indicator-h": "5.5px",
      },
      borderRadius: {
        xs: "2px",
        sm: "8px",
        md: "12px",
        sheet: "24px",
        island: "32px",
        device: "56px",
        indicator: "10px",
        pill: "100px",
      },
      boxShadow: {
        avatar: "0 0 4px 0 rgb(0 0 0 / 0.15)",
        nav: "0 0 12px 0 rgb(var(--color-gunmetal) / 0.15)",
        "tab-bar": "0 0 12px 0 rgb(var(--color-gunmetal) / 0.1)",
        sheet: "0 0 16px 0 rgb(0 0 0 / 0.15)",
        toast: "0 8px 24px 0 rgb(0 0 0 / 0.18)",
        device:
          "0 0 0 10px rgb(var(--color-gunmetal)), 0 24px 64px 0 rgb(var(--color-gunmetal) / 0.25)",
      },
      scale: {
        press: "0.97",
      },
      backdropBlur: {
        glass: "6px",
      },
      backgroundImage: {
        "home-top":
          "linear-gradient(to bottom, rgb(var(--color-violet)) 0%, rgb(var(--color-violet) / 0) 100%)",
        "home-bottom":
          "linear-gradient(to bottom, rgb(var(--color-violet) / 0) 0%, rgb(var(--color-violet) / 0.5) 100%)",
        "map-fade":
          "linear-gradient(to bottom, rgb(var(--color-white) / 0.75) 0%, rgb(var(--color-white) / 0) 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
