import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import logo from "../assets/fondo2.png"; // ✅ importem la imatge

export default function Header() {
  const { user, logout } = useAuth(); // 👈 usem logout del context
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="text-white shadow-md" style={{ backgroundColor: "#087c35" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* LOGO */}
          <div className="flex-shrink-0 cursor-pointer" onClick={() => navigate("/")}>
            <img
              src={logo}
              alt="Editorial logo"
              className="h-10 w-auto"
            />
          </div>

          {/* LINKS */}
          <nav className="flex space-x-6">
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

          {/* LOGIN / LOGOUT + salutació */}
          <div className="flex items-center space-x-4">
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
    </header>
  );
}
