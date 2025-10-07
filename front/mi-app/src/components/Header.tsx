import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import logo from "../assets/fondo2.png";
import { Menu, X } from "lucide-react"; // 👈 iconos hamburguesa

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMenuOpen(false);
  };

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <header className="text-white shadow-md bg-[#087c35] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* LOGO */}
          <div
            className="flex-shrink-0 cursor-pointer flex items-center"
            onClick={() => navigate("/")}
          >
            <img src={logo} alt="Editorial logo" className="h-10 w-auto" />
          </div>

          {/* BOTÓN HAMBURGUESA (solo móvil) */}
          <button
            onClick={toggleMenu}
            className="sm:hidden focus:outline-none text-white"
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>

          {/* NAV LINKS (desktop) */}
          <nav className="hidden sm:flex space-x-6 items-center">
            <button
              onClick={() => navigate("/")}
              className="hover:text-blue-300"
            >
              Inici
            </button>
            <Link to="/projects" className="hover:text-blue-300">
              Projectes
            </Link>
            {user && (
              <>
                <Link to="/user" className="hover:text-blue-300">
                  Usuari
                </Link>

                {(user.role === "editor" || user.role === "admin") && (
                  <Link to="/editorPost" className="hover:text-blue-300">
                    Editor de projectes
                  </Link>
                )}

                {user.role === "admin" && (
                  <Link to="/admin" className="hover:text-blue-300">
                    Administrador
                  </Link>
                )}
              </>
            )}
          </nav>

          {/* LOGIN / LOGOUT desktop */}
          <div className="hidden sm:flex items-center space-x-4">
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

      {/* --- MENÚ MÓVIL --- */}
      {menuOpen && (
        <div className="sm:hidden bg-[#087c35] text-white px-6 py-4 space-y-3 shadow-md">
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

          {user ? (
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 hover:bg-red-600 px-3 py-2 rounded"
            >
              Tancar sessió
            </button>
          ) : (
            <Link
              to="/login"
              className="block bg-blue-500 hover:bg-blue-600 px-3 py-2 rounded text-center"
              onClick={() => setMenuOpen(false)}
            >
              Iniciar sessió
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
