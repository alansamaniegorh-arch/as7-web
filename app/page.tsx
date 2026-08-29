export default function Home() {
  return (
    <main className="min-h-screen bg-[#071A3D] text-white">
      {/* Encabezado */}
      <header className="bg-blue-900 border-b-4 border-yellow-400">
        <div className="max-w-7xl mx-auto flex items-center justify-between p-5">
          <h1 className="text-4xl font-extrabold text-yellow-400">
            AS7
          </h1>

          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
            <span className="font-bold text-lg">EN VIVO</span>
          </div>
        </div>
      </header>

      {/* Video */}
      <section className="max-w-7xl mx-auto p-6">
        <h2 className="text-3xl font-bold mb-4">
          ⚽ Transmisión en Vivo
        </h2>

        <div className="overflow-hidden rounded-2xl border-4 border-yellow-400 shadow-2xl">
          <iframe
            src="https://183.bozztv.com/ssh101/ssh101/as7futbol/playlist.m3u8"
            width="100%"
            height="700"
            allowFullScreen
          ></iframe>
        </div>
      </section>

      {/* Información */}
      <section className="max-w-7xl mx-auto grid md:grid-cols-2 gap-6 px-6">

        <div className="bg-blue-900 rounded-xl p-6">
          <h3 className="text-2xl font-bold text-yellow-400 mb-3">
            📅 Próximos Partidos
          </h3>

          <p>Aquí aparecerán los próximos encuentros de AS7.</p>
        </div>

        <div className="bg-blue-900 rounded-xl p-6">
          <h3 className="text-2xl font-bold text-yellow-400 mb-3">
            💬 Chat en Vivo
          </h3>

          <p>Muy pronto...</p>
        </div>

      </section>

      {/* Patrocinadores */}
      <section className="max-w-7xl mx-auto p-6">
        <div className="bg-blue-900 rounded-xl p-6">
          <h3 className="text-2xl font-bold text-yellow-400 mb-3">
            🤝 Patrocinadores
          </h3>

          <p>Espacio para patrocinadores.</p>
        </div>
      </section>
    </main>
  );
}