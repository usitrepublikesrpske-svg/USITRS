"use client"

import type React from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { newsItems, getNewsBySlug } from "@/lib/news-data"
import { useState } from "react"

const newsArticles: Record<
  string,
  {
    title: string
    date: string
    author: string
    image: string
    content: React.ReactNode
    comments: number
    views: number
    prev?: { title: string; slug: string }
    next?: { title: string; slug: string }
    gallery?: string[]
  }
> = {
  "news-1": {
    title: "Stručni seminar o održivom upravljanju šumama",
    date: "15. Novembar 2025.",
    author: "Dr. Marko Petrović, predsednik udruženja",
    image: "/forestry-seminar-professionals.jpg",
    comments: 12,
    views: 45,
    next: { title: "Novi projekat pošumljavanja u južnom regionu", slug: "news-2" },
    content: (
      <div className="space-y-6">
        <p>
          Uspješno organizovan trodnevni seminar na temu savremenih metoda održivog šumskog gazdovanja u organizaciji
          našeg udruženja predstavlja značajan korak ka podizanju profesionalnih standarda u oblasti šumarstva. Seminar
          je okupio preko 50 stručnjaka iz regiona, pokazujući snažno interesovanje za kontinuiranu edukaciju i
          usavršavanje.
        </p>

        <h2 className="text-2xl font-bold text-emerald-700">Program i sadržaj seminara</h2>
        <p>
          Prvi dan seminara bio je posvećen teorijskim osnovama održivog upravljanja šumama. Učesnici su imali priliku
          da se upoznaju sa najnovijim metodama procene zdravstvenog stanja šume, tehnikama inventarizacije i
          planiranjem šumskih radova.
        </p>

        <p>
          Centralna tema drugog dana bila je implementacija novih tehnologija u šumarstvu. Predstavnici vodećih
          kompanija predstavili su najnovije dronske tehnologije, sisteme za daljinsko detektovanje i GIS alate koji
          značajno unapređuju efikasnost šumskog gazdovanja.
        </p>

        <blockquote className="border-l-4 border-emerald-700 pl-6 py-4 italic text-gray-600">
          "Održivo šumarstvo nije samo trend, već nužnost za očuvanje našeg ekosistema za buduće generacije. Ovaj
          seminar nas je podstakao da razmišljamo o našim postupcima kroz dugoročnu perspektivu."
          <footer className="not-italic font-semibold text-gray-800 mt-2">
            - Ing. Ana Stojanović, učesnik seminara
          </footer>
        </blockquote>

        <h2 className="text-2xl font-bold text-emerald-700">Praktične radionice</h2>
        <p>
          Treći dan seminara bio je posvećen praktičnim radionicama u šumi. Učesnici su primenili teorijska znanja na
          realnim primerima, radeći na proceni volumena stabala, planiranju seča i postavljanju obeležja za buduće
          radove.
        </p>

        <p>
          Poseban naglasak je stavljen na ekološke aspekte rada u šumi - zaštitu vodenih tokova, očuvanje staništa
          divljih životinja i minimiziranje uticaja šumskih radova na prirodnu sredinu.
        </p>
      </div>
    ),
  },
  "news-2": {
    title: "Novi projekat pošumljavanja u južnom regionu",
    date: "10. Novembar 2025.",
    author: "Dipl. ing. Marija Nikolić, vođa projekta",
    image: "/forest-reforestation-planting.jpg",
    comments: 8,
    views: 67,
    prev: { title: "Stručni seminar o održivom upravljanju šumama", slug: "news-1" },
    next: { title: "Studija o biodiverzitetu u starim šumama", slug: "news-3" },
    content: (
      <div className="space-y-6">
        <p>
          Pokrenut ambiciozan projekat pošumljavanja koji obuhvata površinu od 500 hektara u južnom regionu predstavlja
          značajan doprinos obnovi degradiranih šumskih područja i jačanju lokalnih ekosistema.
        </p>

        <h2 className="text-2xl font-bold text-emerald-700">Opseg i lokacija projekta</h2>
        <p>
          Projekat se odvija na području Opštine Ivanica, pretežno na brdovitim terenima sa nagibom od 15-35 stepeni.
          Izbor lokacije nije slučajan - analiza pokazuje da ova područja imaju strateški značaj za sprečavanje erozije
          tla.
        </p>

        <h2 className="text-2xl font-bold text-emerald-700">Ekonomski i ekološki benefiti</h2>
        <p>
          Projekat će generisati oko 35 novih radnih mesta u lokalnoj zajednici. Sa ekološke strane, očekuje se
          poboljšanje kvaliteta vode u lokalnim potocima za 25% u narednih pet godina.
        </p>
      </div>
    ),
    gallery: ["/gallery-image-1.jpg", "/gallery-image-2.jpg", "/gallery-image-3.jpg"],
  },
  "news-3": {
    title: "Studija o biodiverzitetu u starim šumama",
    date: "5. Novembar 2025.",
    author: "Istraživački tim",
    image: "/old-growth-forest-nature-biodiversity.jpg",
    comments: 15,
    views: 89,
    prev: { title: "Novi projekat pošumljavanja u južnom regionu", slug: "news-2" },
    content: (
      <div className="space-y-6">
        <p>
          Objavljeni rezultati trogodišnje studije o diverzitetu vrsta u autohtonim šumskim ekosistemima donosit nove
          uvide o važnosti očuvanja starih šuma za globalnu biodiverzitet.
        </p>

        <h2 className="text-2xl font-bold text-emerald-700">Značajni nalazi</h2>
        <p>
          Istraživanje je pokazalo da stare šume sadrže 40% više vrsta nego mlađe šume, uključujući brojne retke i
          ugrožene vrste. Rezultati su javno dostupni i dostavljeni međunarodnim organizmima za zaštitu prirode.
        </p>
      </div>
    ),
  },
}

interface NewsArticlePageProps {
  params: Promise<{ slug: string }>
}

export default async function NewsArticlePage({ params }: NewsArticlePageProps) {
  const { slug } = await params
  const article = getNewsBySlug(slug)

  if (!article) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Чланак није пронађен</h1>
          <Link href="/news" className="text-green-800 hover:underline">
            ← Назад на вијести
          </Link>
        </div>
      </main>
    )
  }

  const currentIndex = newsItems.findIndex((item) => item.slug === slug)
  const prevArticle = currentIndex < newsItems.length - 1 ? newsItems[currentIndex + 1] : null
  const nextArticle = currentIndex > 0 ? newsItems[currentIndex - 1] : null

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Breadcrumbs */}
      <section className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center gap-2 text-sm flex-wrap">
            <Link href="/" className="text-gray-600 hover:text-green-800">
              Почетна
            </Link>
            <span className="text-gray-400">→</span>
            <Link href="/news" className="text-gray-600 hover:text-green-800">
              Вијести
            </Link>
            <span className="text-gray-400">→</span>
            <span className="text-green-800 font-semibold">{article.title}</span>
          </div>
        </div>
      </section>

      {/* Hero Image */}
      <section className="relative w-full h-96 bg-gray-200 overflow-hidden">
        <Image
          src={article.image || "/placeholder.svg"}
          alt={article.title}
          fill
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-8">
          <div className="text-white">
            <p className="text-sm mb-2">{article.date}</p>
            <span className="inline-block px-3 py-1 bg-green-800 text-white rounded text-xs font-semibold">
              {article.categoryLabel}
            </span>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <article className="py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-xl p-8 shadow-md">
            <h1 className="text-4xl font-bold text-green-800 mb-6">{article.title}</h1>

            <div className="flex gap-4 mb-8 pb-8 border-b border-gray-200 text-sm text-gray-600">
              <span>{article.date}</span>
              <span>{article.comments} коментара</span>
              <span>{article.views} прегледа</span>
            </div>

            <div className="prose prose-lg max-w-none text-gray-700">{article.content}</div>

            {/* Gallery */}
            {article.gallery && article.gallery.length > 0 && (
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h2 className="text-2xl font-bold text-green-800 mb-6">Галерија</h2>
                <GalleryGrid images={article.gallery} />
              </div>
            )}

            {/* Navigation */}
            <div className="flex gap-4 mt-12 pt-8 border-t border-gray-200 flex-col md:flex-row">
              {prevArticle ? (
                <Link
                  href={`/news/${prevArticle.slug}`}
                  className="flex items-center gap-2 px-6 py-3 bg-green-800 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Претходна вијест
                </Link>
              ) : (
                <div></div>
              )}

              {nextArticle ? (
                <Link
                  href={`/news/${nextArticle.slug}`}
                  className="flex items-center gap-2 px-6 py-3 bg-green-800 text-white rounded-lg hover:bg-green-700 transition-colors md:ml-auto"
                >
                  Слиједећа вијест
                  <ChevronRight className="w-4 h-4" />
                </Link>
              ) : (
                <div></div>
              )}
            </div>
          </div>
        </div>
      </article>
    </main>
  )
}

function GalleryGrid({ images }: { images: string[] }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(image)}
            className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
          >
            <Image
              src={image || "/placeholder.svg"}
              alt={`Галерија слика ${index + 1}`}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300"
            onClick={() => setSelectedImage(null)}
          >
            ×
          </button>
          <div className="relative w-full max-w-5xl aspect-video">
            <Image src={selectedImage || "/placeholder.svg"} alt="Увећана слика" fill className="object-contain" />
          </div>
        </div>
      )}
    </>
  )
}
