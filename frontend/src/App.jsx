
import { useEffect } from "react";
import AppRoutes from "./Routes/AppRoutes";
import ChatBot from "./components/ChatBot";

function App() {
  useEffect(() => {
    const applyTheme = () => {
      const darkMode =
        localStorage.getItem("techrevive_dark_mode") === "true";

      document.documentElement.classList.toggle("dark", darkMode);
      document.body.classList.toggle("dark-mode", darkMode);
    };

    applyTheme();

    const handleStorageChange = () => {
      applyTheme();
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <>
      <AppRoutes />
      <ChatBot />
    </>
  );
}

export default App;