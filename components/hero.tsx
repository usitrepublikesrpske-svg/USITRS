import Link from "next/link"

export function Hero() {
  return (
    <section className="bg-gradient-to-r from-emerald-700 to-emerald-600 text-white py-24 md:py-32 text-center">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">Заједно за одрживо шумарство</h1>
        <p className="text-lg md:text-xl mb-10 opacity-95 leading-relaxed">
          Удружење посвећено развоју шумарства и заштити шумских ресурса
        </p>
        <Link
          href="/news"
          className="inline-block bg-white text-emerald-700 font-semibold px-8 py-3 rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
        >
          Сазнај више
        </Link>
      </div>
    </section>
  )
}
