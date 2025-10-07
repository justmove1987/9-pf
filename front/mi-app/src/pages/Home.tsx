import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const handleNavigate = (category: string) => {
    navigate(`/projects?category=${category}`);
  };

  return (
    <div className="font-sans text-gray-800 dark:text-gray-100 transition-colors duration-300">
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

        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
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
        <h2 className="text-3xl font-serif mb-6 dark:text-white">Qui som</h2>
        <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-300 font-light">
          Som una editorial independent especialitzada en projectes visuals i
          literaris que combinen el paper, el món digital i l’expressió
          artística. Treballem amb autors, dissenyadors i creadors per donar veu
          a històries úniques, cuidant cada detall del procés editorial.
        </p>
      </section>

      {/* --- SECCIÓ INTERMÈDIA --- */}
      <section className="bg-white dark:bg-gray-900 py-20 transition-colors duration-300">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 px-6 items-center">
          {/* TEXT 1 */}
          <div>
            <h3 className="text-sm font-semibold text-green-700 dark:text-green-400 mb-2">
              01 · Clariana
            </h3>
            <h2 className="text-3xl font-serif text-gray-800 dark:text-white mb-4">
              Edicions Clariana
            </h2>
            <p className="text-lg font-medium text-green-800 dark:text-green-300 mb-3">
              Especialitzats en la creació de continguts periodístics i de
              comunicació, tant en suport paper com digital.
            </p>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm mb-4">
              Elaborem des d’articles i entrevistes fins a reportatges i llibres
              temàtics, passant per la coordinació de revistes, la comunicació
              corporativa i la divulgació cultural.
            </p>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Primer escoltem i contrastem, després escrivim i comuniquem.
            </p>
          </div>

          {/* IMATGE 1 */}
          <div>
            <img
              src="src/assets/edi1.jpg"
              alt="Equip editorial Clariana"
              className="w-full h-auto rounded-lg shadow-md object-cover"
            />
          </div>
        </div>

        {/* BLOC 2 */}
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 px-6 mt-20 items-center">
          {/* IMATGE 2 */}
          <div className="order-1 md:order-2">
            <img
              src="src/assets/edi2.jpg"
              alt="Producció editorial"
              className="w-full h-auto rounded-lg shadow-md object-cover"
            />
          </div>

          {/* TEXT 2 */}
          <div className="order-2 md:order-1">
            <h3 className="text-sm font-semibold text-green-700 dark:text-green-400 mb-2">
              02 · Continguts
            </h3>
            <h2 className="text-3xl font-serif text-gray-800 dark:text-white mb-4">
              La nostra feina
            </h2>
            <p className="text-lg font-medium text-green-800 dark:text-green-300 mb-3">
              Englobem la totalitat de la producció editorial.
            </p>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm mb-4">
              Elaborem continguts per a tota mena de suports, des del minut zero
              fins al resultat final. En paper, redactem, dissenyem i maquetem;
              en digital, creem formats visuals per a la seva publicació
              immediata.
            </p>
          </div>
        </div>
      </section>

      {/* --- SECCIONS --- */}
      <section className="bg-gray-50 dark:bg-gray-950 py-16 transition-colors duration-300">
        <div className="max-w-6xl mx-auto grid gap-10 md:grid-cols-3 px-6">
          {/* Digital */}
          <div
            onClick={() => handleNavigate("Digital")}
            className="flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition cursor-pointer"
          >
            <img
              src="src/assets/digital.jpg"
              alt="Secció Digital"
              className="h-96 w-full object-cover"
            />
            <div className="p-6">
              <h3 className="text-2xl font-serif mb-3 dark:text-white">
                Digital
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                Projectes interactius i audiovisuals que combinen tecnologia i
                narrativa, adaptats als nous formats digitals.
              </p>
            </div>
          </div>

          {/* Paper */}
          <div
            onClick={() => handleNavigate("Paper")}
            className="flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition cursor-pointer"
          >
            <img
              src="src/assets/paper.jpg"
              alt="Secció Paper"
              className="h-96 w-full object-cover"
            />
            <div className="p-6">
              <h3 className="text-2xl font-serif mb-3 dark:text-white">
                Paper
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                Publicacions impreses, llibres i revistes dissenyades amb cura
                tipogràfica i qualitat artesanal.
              </p>
            </div>
          </div>

          {/* Editorial */}
          <div
            onClick={() => handleNavigate("Editorial")}
            className="flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition cursor-pointer"
          >
            <img
              src="src/assets/editorial.jpg"
              alt="Secció Editorial"
              className="h-96 w-full object-cover"
            />
            <div className="p-6">
              <h3 className="text-2xl font-serif mb-3 dark:text-white">
                Editorial
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                Coordinem tot el procés creatiu: des de la idea fins a l’edició
                final, amb una mirada contemporània i crítica.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
