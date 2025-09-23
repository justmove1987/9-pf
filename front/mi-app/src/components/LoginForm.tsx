import { useAuth } from "../context/useAuth";

export default function LoginForm() {
  const { user, setUser } = useAuth();
  console.log("Usuario antes de setUser:", user);
  const handleLogin = () => {
    const fakeUser = { id: "1", name: "John Doe" };
    setUser(fakeUser);
  };

  return (
    <button
      className="bg-blue-600 text-white p-2 rounded"
      onClick={handleLogin}
    >
      Iniciar sesión
    </button>
  );
}
