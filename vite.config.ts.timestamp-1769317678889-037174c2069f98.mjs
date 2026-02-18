// vite.config.ts
import { defineConfig } from "file:///D:/Ai%20application/hall-harmony-dash/node_modules/vite/dist/node/index.js";
import react from "file:///D:/Ai%20application/hall-harmony-dash/node_modules/@vitejs/plugin-react-swc/index.js";
import path from "path";
import { componentTagger } from "file:///D:/Ai%20application/hall-harmony-dash/node_modules/lovable-tagger/dist/index.js";
var __vite_injected_original_dirname = "D:\\Ai application\\hall-harmony-dash";
var vite_config_default = defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 5173
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxBaSBhcHBsaWNhdGlvblxcXFxoYWxsLWhhcm1vbnktZGFzaFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcQWkgYXBwbGljYXRpb25cXFxcaGFsbC1oYXJtb255LWRhc2hcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L0FpJTIwYXBwbGljYXRpb24vaGFsbC1oYXJtb255LWRhc2gvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xyXG5pbXBvcnQgcmVhY3QgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXJlYWN0LXN3Y1wiO1xyXG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xyXG5pbXBvcnQgeyBjb21wb25lbnRUYWdnZXIgfSBmcm9tIFwibG92YWJsZS10YWdnZXJcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH0pID0+ICh7XHJcbiAgc2VydmVyOiB7XHJcbiAgICBob3N0OiBcIjo6XCIsXHJcbiAgICBwb3J0OiA1MTczLFxyXG4gIH0sXHJcbiAgcGx1Z2luczogW3JlYWN0KCksIG1vZGUgPT09IFwiZGV2ZWxvcG1lbnRcIiAmJiBjb21wb25lbnRUYWdnZXIoKV0uZmlsdGVyKEJvb2xlYW4pLFxyXG4gIHJlc29sdmU6IHtcclxuICAgIGFsaWFzOiB7XHJcbiAgICAgIFwiQFwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vc3JjXCIpLFxyXG4gICAgfSxcclxuICB9LFxyXG59KSk7XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBbVMsU0FBUyxvQkFBb0I7QUFDaFUsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sVUFBVTtBQUNqQixTQUFTLHVCQUF1QjtBQUhoQyxJQUFNLG1DQUFtQztBQUt6QyxJQUFPLHNCQUFRLGFBQWEsQ0FBQyxFQUFFLEtBQUssT0FBTztBQUFBLEVBQ3pDLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxFQUNSO0FBQUEsRUFDQSxTQUFTLENBQUMsTUFBTSxHQUFHLFNBQVMsaUJBQWlCLGdCQUFnQixDQUFDLEVBQUUsT0FBTyxPQUFPO0FBQUEsRUFDOUUsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxLQUFLLFFBQVEsa0NBQVcsT0FBTztBQUFBLElBQ3RDO0FBQUEsRUFDRjtBQUNGLEVBQUU7IiwKICAibmFtZXMiOiBbXQp9Cg==
