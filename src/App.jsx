import "./App.css";
import MainRouter from "./components/routers/Router";
import axios from "axios";

// List of backend URLs (Render deployed backends)
const BACKENDS = [
  "https://report-card-backend-l3id.onrender.com",
  //"https://report-card-b-2025.onrender.com",
];

let currentIndex = 0;

// Get next backend in round-robin
const getNextBackend = () => {
  const url = BACKENDS[currentIndex];
  currentIndex = (currentIndex + 1) % BACKENDS.length;
  return url;
};

// Axios wrapper with fallback
export const axiosRequest = async (config) => {
  let lastError = null;

  for (let i = 0; i < BACKENDS.length; i++) {
    const baseURL = getNextBackend();
    try {
      const response = await axios({ ...config, baseURL });
      return response;
    } catch (error) {
      console.warn(`Backend failed: ${baseURL}, trying next...`, error.message);
      lastError = error;
    }
  }

  throw lastError || new Error("All backends failed");
};

// Optional: set axios default to first backend
axios.defaults.baseURL = BACKENDS[0];

function App() {
  return (
    <div className="App">
      <MainRouter />
    </div>
  );
}

export default App;
