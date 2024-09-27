import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { manifestForPlugIn } from "./manifest";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/turing-station",
  plugins: [react(), VitePWA(manifestForPlugIn)],
});
