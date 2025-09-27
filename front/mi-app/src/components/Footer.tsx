import logo from "../assets/fondo.png";

export default function Footer() {
  return (
    <footer className="bg-[#f3eaea] text-center py-6 border-t border-[#d3bdbd]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Logo */}
        <div className="flex justify-center mb-2">
          <img
            src={logo}
            alt="Logo Edicions Clariana"
            className="h-10 w-auto"
          />
        </div>

        {/* Copyright */}
        <p className="text-sm text-[#087c35]">
          © {new Date().getFullYear()} Edicions Clariana SL
        </p>
      </div>
    </footer>
  );
}
