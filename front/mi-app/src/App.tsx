import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/useAuth";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Admin from "./pages/Admin";
import Dashboard from "./pages/Dashboard";
import LoginForm from "./components/LoginForm";
import Register from "./pages/Register";
import Header from "./components/Header";
import UserPanel from "./pages/UserPanel";
import EditorPost from "./pages/EditorPost";
import Footer from "./components/Footer";

type PrivateProps = { children: React.ReactNode; requiredRole?: string };

const PrivateRoute = ({ children, requiredRole }: PrivateProps) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (requiredRole && user.role !== requiredRole) return <Navigate to="/" />;
  return <>{children}</>;
};

export default function App() {
  return (
    <BrowserRouter>
      {/* Contenedor flex para que el footer quede pegado al fondo */}
      <div className="flex flex-col min-h-screen">
        <Header />

        {/* main crece para ocupar el espacio entre header y footer */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/editorPost"
              element={
                <PrivateRoute>
                  <EditorPost />
                </PrivateRoute>
              }
            />

            <Route
              path="/user"
              element={
                <PrivateRoute>
                  <UserPanel />
                </PrivateRoute>
              }
            />

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
                  <Dashboard />
                </PrivateRoute>
              }
            />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}
