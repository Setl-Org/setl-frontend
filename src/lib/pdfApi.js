import axios from "axios";

const pdfApi = axios.create({
  baseURL: import.meta.env.VITE_PDF_SERVICE_BASE_URL || "http://localhost:5000",
});

export default pdfApi;
