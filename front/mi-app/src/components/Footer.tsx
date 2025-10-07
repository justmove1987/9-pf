
export default function Footer() {
  return (
    <footer className="bg-[#087c35] text-white py-10 mt-10">
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-2xl font-serif mb-3">Contacte</h3>
            <p>📍 Carrer de l’Art, 25 — Barcelona</p>
            <p>📞 +34 612 345 678</p>
            <p>✉️ info@editorial.cat</p>
          </div>

        
        </div>

        <p className="text-center text-sm mt-8 text-white/80">
          © {new Date().getFullYear()} Editorial Independent. Tots els drets reservats.
        </p>
      </footer>
  );
}
