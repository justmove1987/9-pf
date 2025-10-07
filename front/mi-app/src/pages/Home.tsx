import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const handleNavigate = (category: string) => {
    navigate(`/projects?category=${category}`);
  };

  return (
    <div className="font-sans text-gray-800">
      {/* --- HERO --- */}
      <section className="relative w-full h-[70vh] overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="src/assets/editorial.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <motion.h1
            className="text-white text-4xl md:text-6xl font-serif tracking-wide text-center drop-shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Benvinguts a Edicions Clariana
          </motion.h1>
        </div>
      </section>

      {/* --- QUI SOM --- */}
      <section className="max-w-4xl mx-auto py-16 px-6 text-center">
        <h2 className="text-3xl font-serif mb-6">Qui som</h2>
        <p className="text-lg leading-relaxed text-gray-600 font-light">
          Som una editorial independent especialitzada en projectes visuals i literaris
          que combinen el paper, el món digital i l’expressió artística. Treballem amb
          autors, dissenyadors i creadors per donar veu a històries úniques, cuidant cada
          detall del procés editorial.
        </p>
      </section>

      {/* --- SECCIONS --- */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto grid gap-10 md:grid-cols-3 px-6">
          {/* Digital */}
          <div
            onClick={() => handleNavigate("Digital")}
            className="flex flex-col bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition cursor-pointer"
          >
            <img
              src="src/assets/digital.jpg"
              alt="Secció Digital"
              className="h-96 w-full object-cover"
            />
            <div className="p-6">
              <h3 className="text-2xl font-serif mb-3">Digital</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                Projectes interactius i audiovisuals que combinen tecnologia i narrativa,
                adaptats als nous formats digitals.
              </p>
            </div>
          </div>

          {/* Paper */}
          <div
            onClick={() => handleNavigate("Paper")}
            className="flex flex-col bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition cursor-pointer"
          >
            <img
              src="src/assets/paper.jpg"
              alt="Secció Paper"
              className="h-96 w-full object-cover"
            />
            <div className="p-6">
              <h3 className="text-2xl font-serif mb-3">Paper</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                Publicacions impreses, llibres i revistes dissenyades amb cura tipogràfica
                i qualitat artesanal.
              </p>
            </div>
          </div>

          {/* Editorial */}
          <div
            onClick={() => handleNavigate("Editorial")}
            className="flex flex-col bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition cursor-pointer"
          >
            <img
              src="src/assets/editorial.jpg"
              alt="Secció Editorial"
              className="h-96 w-full object-cover"
            />
            <div className="p-6">
              <h3 className="text-2xl font-serif mb-3">Editorial</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                Coordinem tot el procés creatiu: des de la idea fins a l’edició final,
                amb una mirada contemporània i crítica.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
