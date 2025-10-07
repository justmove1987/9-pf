import { useState } from "react";
import { motion } from "framer-motion";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";

export default function AuthPage() {
  const [tab, setTab] = useState<"login" | "register">("login");

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    

      {/* --- CONTINGUT CENTRAL --- */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition">
          {/* Pestanyes superiors */}
          <div className="flex justify-center mb-6 border-b border-gray-300 dark:border-gray-700">
            <button
              onClick={() => setTab("login")}
              className={`px-4 py-2 text-sm font-semibold transition ${
                tab === "login"
                  ? "text-green-700 border-b-2 border-green-600 dark:text-green-400"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              Inicia sessió
            </button>
            <button
              onClick={() => setTab("register")}
              className={`px-4 py-2 text-sm font-semibold transition ${
                tab === "register"
                  ? "text-green-700 border-b-2 border-green-600 dark:text-green-400"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              Registra’t
            </button>
          </div>

          {/* Contingut amb animació */}
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {tab === "login" ? <LoginForm /> : <RegisterForm />}
          </motion.div>
        </div>
      </main>

    
    </div>
  );
}
