import type { Config } from 'tailwindcss'
import { fontFamily } from 'tailwindcss/defaultTheme'


const config: Config = {
darkMode: ["class"],
content: [
  "./src/app/**/*.{ts,tsx}",
  "./src/components/**/*.{ts,tsx}",
  "./src/styles/**/*.{ts,tsx}",
  "./src/lib/**/*.{ts,tsx}"
],
theme: {
extend: {
colors: {
border: "hsl(var(--border))",
input: "hsl(var(--input))",
ring: "hsl(var(--ring))",
background: "hsl(var(--background))",
foreground: "hsl(var(--foreground))",
primary: {
DEFAULT: "#0B5B4D", // SupaTrade corporate-ish green (adjust later to brand guide)
foreground: "#ffffff",
},
secondary: {
DEFAULT: "#F2F5F7",
foreground: "#0B5B4D",
},
},
fontFamily: {
sans: ["Inter", ...fontFamily.sans],
},
},
},
plugins: [],
}
export default config