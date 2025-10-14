import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useTheme } from "../hooks/useTheme"; // 🌓 Hook del tema
import logo from "../assets/fondo2.png";
import { Menu, X, Moon, Sun } from "lucide-react"; // 👈 icones

export default function Header() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMenuOpen(false);
  };

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <header className="text-white shadow-md bg-[#087c35] dark:bg-gray-900 sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* LOGO */}
          <div
            className="flex-shrink-0 cursor-pointer flex items-center"
            onClick={() => navigate("/")}
          >
            <img src={logo} alt="Editorial logo" className="h-10 w-auto" />
          </div>

          {/* BOTÓ HAMBURGUESA (mòbil) */}
          <button
            onClick={toggleMenu}
            className="sm:hidden focus:outline-none text-white"
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>

          {/* NAV LINKS (desktop) */}
          <nav className="hidden sm:flex space-x-6 items-center">
            <button onClick={() => navigate("/")} className="hover:text-blue-300">
              Inici
            </button>
            <Link to="/projects" className="hover:text-blue-300">
              Projectes
            </Link>
            {user && (
              <>
                

                {(user.role === "editor" || user.role === "admin") && (
                  <Link to="/editorPost" className="hover:text-blue-300">
                    Editor de projectes
                  </Link>
                )}

                <Link to="/user" className="hover:text-blue-300">
                  Usuari
                </Link>

                {user.role === "admin" && (
                  <Link to="/admin" className="hover:text-blue-300">
                    Administrador
                  </Link>
                )}
              </>
            )}
          </nav>

          {/* LOGIN / LOGOUT + THEME TOGGLE (desktop) */}
          <div className="hidden sm:flex items-center space-x-4">
            {/* 🌗 Botó canvi de tema */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
              aria-label="Canvia el mode de color"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {user && (
              <span className="text-sm">
                Hola,&nbsp;<span className="font-semibold">{user.name}</span>
              </span>
            )}
            {user ? (
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
              >
                Tancar sessió
              </button>
            ) : (
              <Link
                to="/login"
                className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded"
              >
                Iniciar sessió
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* --- MENÚ MÒBIL --- */}
      {menuOpen && (
        <div className="sm:hidden bg-[#087c35] dark:bg-gray-900 text-white px-6 py-4 space-y-3 shadow-md transition-colors duration-300">
          <Link
            to="/"
            className="block hover:text-blue-300"
            onClick={() => setMenuOpen(false)}
          >
            Inici
          </Link>
          <Link
            to="/projects"
            className="block hover:text-blue-300"
            onClick={() => setMenuOpen(false)}
          >
            Projectes
          </Link>

          {user && (
            <>
              <Link
                to="/user"
                className="block hover:text-blue-300"
                onClick={() => setMenuOpen(false)}
              >
                Usuari
              </Link>

              {(user.role === "editor" || user.role === "admin") && (
                <Link
                  to="/editorPost"
                  className="block hover:text-blue-300"
                  onClick={() => setMenuOpen(false)}
                >
                  Editor de projectes
                </Link>
              )}

              {user.role === "admin" && (
                <Link
                  to="/admin"
                  className="block hover:text-blue-300"
                  onClick={() => setMenuOpen(false)}
                >
                  Administrador
                </Link>
              )}
            </>
          )}

          <hr className="border-white/30 my-2" />

          {/* 🌙 Toggle + Sessió (mòbil) */}
          <div className="flex items-center justify-between">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {user ? (
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-3 py-2 rounded"
              >
                Tancar sessió
              </button>
            ) : (
              <Link
                to="/login"
                className="bg-blue-500 hover:bg-blue-600 px-3 py-2 rounded text-center"
                onClick={() => setMenuOpen(false)}
              >
                Iniciar sessió
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
