// front/mi-app/src/components/Spinner.tsx
export default function Spinner({ size = "md", color = "text-green-600" }: { size?: "sm" | "md" | "lg"; color?: string }) {
  const sizes = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-4",
    lg: "h-12 w-12 border-4",
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className={`${sizes[size]} ${color} border-t-transparent rounded-full animate-spin`}
        role="status"
      />
    </div>
  );
}
