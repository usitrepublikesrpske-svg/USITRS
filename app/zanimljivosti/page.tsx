"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Trees, Leaf, Bird, Globe, FlaskConical, BookOpen, Search } from "lucide-react"

const hardcodedFacts = [
  {
    id: 1,
    title: "Најстарије дрво на свијету",
    fact: "Најстарије познато дрво на свијету је бор Метузалем (Pinus longaeva) у Калифорнији, стар преко 4.850 година. Тачна локација се чува у тајности како би се дрво заштитило од вандализма.",
    source: "National Park Service",
    category: "drvo",
    categoryLabel: "Дрвеће",
    icon: "trees",
  },
  {
    id: 2,
    title: "Шуме производе кисеоник",
    fact: 'Једно велико дрво може произвести довољно кисеоника за 4 особе дневно. Амазонска прашума производи око 20% свјетског кисеоника, због чега се назива "плућа Земље".',
    source: "World Wildlife Fund",
    category: "ekologija",
    categoryLabel: "Екологија",
    icon: "leaf",
  },
  {
    id: 3,
    title: "Дрвеће комуницира",
    fact: 'Дрвеће комуницира међусобно преко подземне мреже гљива познате као "Wood Wide Web". Преко ове мреже дијеле храњиве твари и упозоравају сусједна стабла на нападе штеточина.',
    source: "Nature Journal",
    category: "nauka",
    categoryLabel: "Наука",
    icon: "flask",
  },
  {
    id: 4,
    title: "Шумске животиње",
    fact: "Око 80% копненог биодиверзитета живи у шумама. Тропске прашуме, иако покривају само 6% Земљине површине, дом су више од половине свих биљних и животињских врста на планети.",
    source: "UN Environment Programme",
    category: "zivotinje",
    categoryLabel: "Животиње",
    icon: "bird",
  },
  {
    id: 5,
    title: "Историја шумарства",
    fact: "Прва шумарска школа основана је 1811. године у Тарандту, Њемачка. Шумарство као наука развило се из потребе за одрживим коришћењем шумских ресурса током индустријске револуције.",
    source: "FAO",
    category: "istorija",
    categoryLabel: "Историја",
    icon: "book",
  },
  {
    id: 6,
    title: "Шуме и климатске промјене",
    fact: "Шуме апсорбују око 2,6 милијарди тона угљичног диоксида годишње, што је приближно 30% људских емисија CO2. Очување шума је кључно у борби против климатских промјена.",
    source: "IPCC",
    category: "ekologija",
    categoryLabel: "Екологија",
    icon: "globe",
  },
]

const iconMap: Record<string, any> = {
  trees: Trees,
  leaf: Leaf,
  bird: Bird,
  globe: Globe,
  flask: FlaskConical,
  book: BookOpen,
}

const categories = [
  { value: "all", label: "Све категорије" },
  { value: "drvo", label: "Дрвеће" },
  { value: "zivotinje", label: "Животиње" },
  { value: "ekologija", label: "Екологија" },
  { value: "istorija", label: "Историја" },
  { value: "nauka", label: "Наука" },
]

export default function ZanimljivostiPage() {
  const [allFacts, setAllFacts] = useState(hardcodedFacts)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    try {
      const stored = localStorage.getItem("customFunFacts")
      if (stored) {
        const parsed = JSON.parse(stored)
        const combined = [...parsed, ...hardcodedFacts]
        const uniqueFacts = Array.from(new Map(combined.map((item) => [item.id, item])).values())
        setAllFacts(uniqueFacts)
      }
    } catch (error) {
      console.error("Грешка при учитавању занимљивости:", error)
    }
  }, [])

  const filteredFacts = allFacts.filter((fact) => {
    const matchesCategory = selectedCategory === "all" || fact.category === selectedCategory
    const matchesSearch =
      fact.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fact.fact.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Breadcrumbs */}
      <section className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-600 hover:text-green-700">
              Поčetна
            </Link>
            <span className="text-gray-400">→</span>
            <span className="text-green-700 font-semibold">Занимљивости</span>
          </div>
        </div>
      </section>

      {/* Page Header */}
      <section className="bg-white py-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold text-green-900 mb-3">Занимљивости о шумама</h1>
          <p className="text-lg text-gray-600">Откријте фасцинантне чињенице о шумама, дрвећу и шумарству</p>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-green-50 border-b border-gray-200 py-6">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-4 md:items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Претражи занимљивости..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-800 text-sm focus:outline-none focus:border-green-700 focus:ring-1 focus:ring-green-700"
              />
            </div>

            <div className="flex items-center gap-3">
              <label className="text-sm font-semibold text-green-700">Категорија:</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-800 text-sm focus:outline-none focus:border-green-700 focus:ring-1 focus:ring-green-700"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Facts Grid */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-6">
          {filteredFacts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFacts.map((fact) => {
                const IconComponent = iconMap[fact.icon] || Trees
                return (
                  <article
                    key={fact.id}
                    className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-6 h-6 text-green-700" />
                      </div>
                      <div>
                        <span className="inline-block px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold mb-2">
                          {fact.categoryLabel}
                        </span>
                        <h2 className="text-lg font-bold text-gray-900">{fact.title}</h2>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm leading-relaxed mb-4">{fact.fact}</p>

                    {fact.source && <p className="text-xs text-gray-400">Извор: {fact.source}</p>}
                  </article>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Нема пронађених занимљивости за одабране критеријуме.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
