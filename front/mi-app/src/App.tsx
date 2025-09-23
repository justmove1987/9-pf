import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/useAuth";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Admin from "./pages/Admin";
import Dashboard from "./pages/Dashboard";  // ✅ nuevo import
import LoginForm from "./components/LoginForm";

type PrivateProps = { children: React.ReactNode; requiredRole?: string };

const PrivateRoute = ({ children, requiredRole }: PrivateProps) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (requiredRole && user.role !== requiredRole)
    return <Navigate to="/" />; // o página de “no autorizado”
  return <>{children}</>;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/login" element={<LoginForm />} />

        {/* 🔒 Rutas protegidas */}
        <Route
          path="/admin"
          element={
            <PrivateRoute requiredRole="admin">
              <Admin />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />   {/* ✅ nueva página para gestión de proyectos */}
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
