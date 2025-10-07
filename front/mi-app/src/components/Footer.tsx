export default function Footer() {
  return (
    <footer className="bg-[#087c35] dark:bg-gray-900 text-white transition-colors duration-300 mt-10">
      <div className="max-w-5xl mx-auto px-6 py-10 grid md:grid-cols-2 gap-8">
        {/* 📞 Contacte */}
        <div>
          <h3 className="text-2xl font-serif mb-3">Contacte</h3>
          <ul className="space-y-1 text-white/90">
            <li>📍 Carrer de l’Art, 25 — Barcelona</li>
            <li>📞 +34 612 345 678</li>
            <li>✉️ info@editorial.cat</li>
          </ul>
        </div>

        {/* 🌐 Enllaços (opcionals) */}
        <div>
          <h3 className="text-2xl font-serif mb-3">Enllaços útils</h3>
          <ul className="space-y-1 text-white/90">
            <li>
              <a href="/projects" className="hover:underline hover:text-white">
                Projectes
              </a>
            </li>
            <li>
              <a href="/about" className="hover:underline hover:text-white">
                Sobre nosaltres
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:underline hover:text-white">
                Contacte
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* ⚖️ Línia inferior */}
      <div className="border-t border-white/20 mt-4">
        <p className="text-center text-sm py-4 text-white/80">
          © {new Date().getFullYear()} Editorial Independent. Tots els drets reservats.
        </p>
      </div>
    </footer>
  );
}
