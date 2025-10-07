export default function Spinner({
  size = "w-5 h-5",
  color = "border-white",
}: {
  size?: string;
  color?: string;
}) {
  return (
    <div
      className={`inline-block ${size} border-2 border-t-transparent ${color} rounded-full animate-spin`}
      role="status"
      aria-label="Carregant"
    />
  );
}
