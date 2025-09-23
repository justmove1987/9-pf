import { useAuth } from "../context/useAuth";

export default function LoginForm() {
  const { setUser } = useAuth();

  const handleLogin = () => {
    // Simulate a login
    const user = { id: "1", name: "John Doe" };
    setUser(user);
  };

  return (
    <div>
      <h2>Login Form</h2>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}