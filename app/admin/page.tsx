"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Copy, Check, Newspaper, Lightbulb, LogOut, Lock } from "lucide-react"

const newsCategories = [
  { value: "edukacija", label: "Едукација" },
  { value: "projekti", label: "Пројекти" },
  { value: "istrazivanje", label: "Истраживање" },
  { value: "dogadjaji", label: "Догађаји" },
  { value: "tehnologija", label: "Технологија" },
  { value: "zastita", label: "Заштита" },
]

const funFactCategories = [
  { value: "drvo", label: "Дрвеће" },
  { value: "zivotinje", label: "Животиње" },
  { value: "ekologija", label: "Екологија" },
  { value: "istorija", label: "Историја" },
  { value: "nauka", label: "Наука" },
]

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loginForm, setLoginForm] = useState({ username: "", password: "" })
  const [loginError, setLoginError] = useState("")

  const [activeTab, setActiveTab] = useState<"vijesti" | "zanimljivosti">("vijesti")

  const [newsForm, setNewsForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    date: new Date().toLocaleDateString("sr-Latn-RS", { day: "numeric", month: "long", year: "numeric" }) + ".",
    category: "edukacija",
    image: "/forestry-news.jpg",
    comments: 0,
    views: 0,
  })

  const [funFactForm, setFunFactForm] = useState({
    title: "",
    fact: "",
    source: "",
    category: "drvo",
    icon: "trees",
  })

  const [generatedCode, setGeneratedCode] = useState("")
  const [copied, setCopied] = useState(false)

  // OVO JE KLJUČNA ISPRAVKA: Koristimo useEffect za localStorage
  useEffect(() => {
    const loggedIn = localStorage.getItem("adminLoggedIn")
    if (loggedIn === "true") {
      setIsLoggedIn(true)
    }
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (loginForm.username === "admin" && loginForm.password === "admin123") {
      setIsLoggedIn(true)
      setLoginError("")
      localStorage.setItem("adminLoggedIn", "true")
    } else {
      setLoginError("Погрешно корисничко име или лозинка!")
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    localStorage.removeItem("adminLoggedIn")
    setLoginForm({ username: "", password: "" })
  }

  const handleNewsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNewsForm({
      ...newsForm,
      [name]: name === "comments" || name === "views" ? Number.parseInt(value) || 0 : value,
    })
  }

  const handleFunFactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFunFactForm({
      ...funFactForm,
      [name]: value,
    })
  }

  const generateNewsCode = () => {
    if (!newsForm.title.trim()) {
      alert("Наслов је обавезан!")
      return
    }

    if (!newsForm.excerpt.trim()) {
      alert("Кратак опис је обавезан!")
      return
    }

    const slug = newsForm.title
      .toLowerCase()
      .replace(/č/g, "c")
      .replace(/ć/g, "c")
      .replace(/š/g, "s")
      .replace(/ž/g, "z")
      .replace(/đ/g, "dj")
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "")
      .substring(0, 50)

    const categoryLabel = newsCategories.find((c) => c.value === newsForm.category)?.label || newsForm.category
    const escapeStr = (text: string) => text.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n")

    const contentParagraphs = newsForm.content
      .split("\n\n")
      .filter((p) => p.trim())
      .map((p) => `        <p>${escapeStr(p.trim())}</p>`)
      .join("\n")

    const code = `// =====================================================
// NOVA VIJEST - Kopiraj CIJELI ovaj blok
// =====================================================
// FAJL: lib/news-data.tsx
// LOKACIJA: Pronađi "// === DODAJ NOVE VIJESTI ISPOD OVOG KOMENTARA ===" 
//           i zalijepi ISPOD tog komentara
// =====================================================

  {
    id: ${Date.now()},
    title: "${escapeStr(newsForm.title)}",
    excerpt: "${escapeStr(newsForm.excerpt)}",
    date: "${newsForm.date}",
    category: "${newsForm.category}",
    categoryLabel: "${categoryLabel}",
    image: "${newsForm.image}",
    slug: "${slug}",
    comments: ${newsForm.comments},
    views: ${newsForm.views},
    content: (
      <div className="space-y-6">
${contentParagraphs || "        <p>Садржај вијести...</p>"}
      </div>
    ),
  },

// =====================================================
// KRAJ NOVE VIJESTI
// =====================================================`

    setGeneratedCode(code)
  }

  const generateFunFactCode = () => {
    if (!funFactForm.title.trim() || !funFactForm.fact.trim()) {
      alert("Наслов и занимљивост су обавезни!")
      return
    }

    const categoryLabel = funFactCategories.find((c) => c.value === funFactForm.category)?.label || funFactForm.category
    const escapeStr = (text: string) => text.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n")

    const code = `// =====================================================
// NOVA ZANIMLJIVOST - Kopiraj CIJELI ovaj blok
// =====================================================
// FAJL: app/zanimljivosti/page.tsx
// LOKACIJA: Pronađi "const funFacts = [" i zalijepi ODMAH NAKON [
// =====================================================

  {
    id: ${Date.now()},
    title: "${escapeStr(funFactForm.title)}",
    fact: "${escapeStr(funFactForm.fact)}",
    source: "${escapeStr(funFactForm.source)}",
    category: "${funFactForm.category}",
    categoryLabel: "${categoryLabel}",
    icon: "${funFactForm.icon}",
  },

// =====================================================
// KRAJ NOVE ZANIMLJIVOSTI
// =====================================================`

    setGeneratedCode(code)
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const resetForms = () => {
    setNewsForm({
      title: "",
      excerpt: "",
      content: "",
      date: new Date().toLocaleDateString("sr-Latn-RS", { day: "numeric", month: "long", year: "numeric" }) + ".",
      category: "edukacija",
      image: "/forestry-news.jpg",
      comments: 0,
      views: 0,
    })
    setFunFactForm({
      title: "",
      fact: "",
      source: "",
      category: "drvo",
      icon: "trees",
    })
    setGeneratedCode("")
  }

  if (!isLoggedIn) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center px-6">
        <div className="bg-white p-10 rounded-xl shadow-2xl max-w-md w-full">
          <div className="flex justify-center mb-6">
            <div className="bg-green-800 p-4 rounded-full">
              <Lock className="w-12 h-12 text-white" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-green-800 text-center mb-2">Админ Панел</h1>
          <p className="text-gray-600 text-center mb-8">Пријавите се за приступ</p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Корисничко име</label>
              <input
                type="text"
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-800 focus:ring-2 focus:ring-green-800"
                placeholder="Унесите корисничко име"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Лозинка</label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-800 focus:ring-2 focus:ring-green-800"
                placeholder="Унесите лозинку"
                required
              />
            </div>

            {loginError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-green-800 text-white font-semibold py-3 rounded-lg hover:bg-green-900 transition-colors"
            >
              Пријави се
            </button>
          </form>

          <p className="text-xs text-gray-500 text-center mt-6">Тестни приступ: admin / admin123</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-green-800 mb-2">Админ Панел</h1>
            <p className="text-gray-600">Додај нове вијести и занимљивости на website</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Одјави се
          </button>
        </div>

        <div className="flex gap-4 mb-8">
          <button
            onClick={() => {
              setActiveTab("vijesti")
              resetForms()
            }}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === "vijesti"
                ? "bg-green-800 text-white"
                : "bg-white text-green-800 border border-green-800 hover:bg-green-50"
            }`}
          >
            <Newspaper className="w-5 h-5" />
            Додај Вијест
          </button>
          <button
            onClick={() => {
              setActiveTab("zanimljivosti")
              resetForms()
            }}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === "zanimljivosti"
                ? "bg-green-800 text-white"
                : "bg-white text-green-800 border border-green-800 hover:bg-green-50"
            }`}
          >
            <Lightbulb className="w-5 h-5" />
            Додај Занимљивост
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-white p-8 rounded-lg shadow-md">
            {activeTab === "vijesti" ? (
              <form className="space-y-6">
                <h2 className="text-2xl font-bold text-green-800 mb-4">Нова Вијест</h2>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Наслов вијести *</label>
                  <input
                    type="text"
                    name="title"
                    value={newsForm.title}
                    onChange={handleNewsChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-800 focus:ring-1 focus:ring-green-800"
                    placeholder="Унесите наслов вијести"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Кратак опис * (приказује се у листи вијести)
                  </label>
                  <textarea
                    name="excerpt"
                    value={newsForm.excerpt}
                    onChange={handleNewsChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-800 focus:ring-1 focus:ring-green-800 resize-none"
                    placeholder="Унесите кратак опис (2-3 реченице)"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Комплетан текст (приказује се када се отвори вијест)
                  </label>
                  <textarea
                    name="content"
                    value={newsForm.content}
                    onChange={handleNewsChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-800 focus:ring-1 focus:ring-green-800 resize-none"
                    placeholder="Унесите комплетан текст вијести. Користите празне линије за раздвајање параграфа."
                    rows={8}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Савјет: Оставите празну линију између параграфа за боље форматирање
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Датум</label>
                    <input
                      type="text"
                      name="date"
                      value={newsForm.date}
                      onChange={handleNewsChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-800 focus:ring-1 focus:ring-green-800"
                      placeholder="нпр. 15. Новембар 2025."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Категорија</label>
                    <select
                      name="category"
                      value={newsForm.category}
                      onChange={handleNewsChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-800 focus:ring-1 focus:ring-green-800"
                    >
                      {newsCategories.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">URL слике</label>
                  <input
                    type="text"
                    name="image"
                    value={newsForm.image}
                    onChange={handleNewsChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-800 focus:ring-1 focus:ring-green-800"
                    placeholder="/images/moja-slika.jpg"
                  />
                  <p className="text-xs text-gray-500 mt-1">Ставите слику у public folder и унесите путању овдје</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Коментари</label>
                    <input
                      type="number"
                      name="comments"
                      value={newsForm.comments}
                      onChange={handleNewsChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-800 focus:ring-1 focus:ring-green-800"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Прегледи</label>
                    <input
                      type="number"
                      name="views"
                      value={newsForm.views}
                      onChange={handleNewsChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-800 focus:ring-1 focus:ring-green-800"
                      min="0"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={generateNewsCode}
                  className="w-full bg-green-800 text-white font-semibold py-3 rounded-lg hover:bg-green-900 transition-colors"
                >
                  Генериши код
                </button>
              </form>
            ) : (
              <form className="space-y-6">
                <h2 className="text-2xl font-bold text-green-800 mb-4">Нова Занимљивост</h2>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Наслов *</label>
                  <input
                    type="text"
                    name="title"
                    value={funFactForm.title}
                    onChange={handleFunFactChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-800 focus:ring-1 focus:ring-green-800"
                    placeholder="нпр. Најстарије дрво на свијету"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Занимљивост *</label>
                  <textarea
                    name="fact"
                    value={funFactForm.fact}
                    onChange={handleFunFactChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-800 focus:ring-1 focus:ring-green-800 resize-none"
                    placeholder="Унесите занимљиву чињеницу о шумарству..."
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Извор (опционо)</label>
                  <input
                    type="text"
                    name="source"
                    value={funFactForm.source}
                    onChange={handleFunFactChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-800 focus:ring-1 focus:ring-green-800"
                    placeholder="нпр. National Geographic"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Категорија</label>
                    <select
                      name="category"
                      value={funFactForm.category}
                      onChange={handleFunFactChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-800 focus:ring-1 focus:ring-green-800"
                    >
                      {funFactCategories.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Иконица</label>
                    <select
                      name="icon"
                      value={funFactForm.icon}
                      onChange={handleFunFactChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-800 focus:ring-1 focus:ring-green-800"
                    >
                      <option value="trees">Дрвеће</option>
                      <option value="leaf">Лист</option>
                      <option value="bird">Птица</option>
                      <option value="globe">Глобус</option>
                      <option value="flask">Наука</option>
                      <option value="book">Књига</option>
                    </select>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={generateFunFactCode}
                  className="w-full bg-green-800 text-white font-semibold py-3 rounded-lg hover:bg-green-900 transition-colors"
                >
                  Генериши код
                </button>
              </form>
            )}
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-green-800 mb-4">Генерисани код</h2>

            {generatedCode ? (
              <>
                <div className="relative">
                  <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm max-h-96 overflow-y-auto font-mono whitespace-pre-wrap">
                    {generatedCode}
                  </pre>

                  <button
                    onClick={handleCopyCode}
                    className="absolute top-2 right-2 flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-3 py-1 rounded transition-colors text-sm"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        Копирано!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Копирај
                      </>
                    )}
                  </button>
                </div>

                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg text-sm">
                  <h3 className="font-semibold text-green-800 mb-2">Упутство за копирање:</h3>
                  <ol className="text-green-700 space-y-2 list-decimal list-inside">
                    <li>
                      Кликни <strong>"Копирај"</strong> дугме горе
                    </li>
                    <li>
                      Отвори фајл{" "}
                      <code className="bg-white px-1 rounded font-bold">
                        {activeTab === "vijesti" ? "lib/news-data.tsx" : "app/zanimljivosti/page.tsx"}
                      </code>{" "}
                      у VS Code
                    </li>
                    <li>
                      Пронађи коментар{" "}
                      <code className="bg-white px-1 rounded">
                        {activeTab === "vijesti"
                          ? "// === DODAJ NOVE VIJESTI ISPOD OVOG KOMENTARA ==="
                          : "const funFacts = ["}
                      </code>
                    </li>
                    <li>
                      Залијепи код <strong>ИСПОД</strong> тог коментара
                    </li>
                    <li>
                      Сачувај фајл (<strong>Ctrl+S</strong>)
                    </li>
                  </ol>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-400">
                <p>Попуни форму и генериши код...</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-bold text-blue-900 mb-3 text-lg">📖 Како покренути сајт offline (локално):</h3>
          <ol className="text-blue-800 space-y-2 list-decimal list-inside">
            <li>
              Преузми пројекат са v0 - кликни три тачке у горњем десном углу и одабери <strong>"Download ZIP"</strong>
            </li>
            <li>Распакуј ZIP фајл у фолдер по избору</li>
            <li>
              Отвори терминал у том фолдеру (у VS Code: <strong>Ctrl + `</strong>)
            </li>
            <li>
              Инсталирај зависности: <code className="bg-white px-2 py-1 rounded">npm install</code>
            </li>
            <li>
              Покрени dev server: <code className="bg-white px-2 py-1 rounded">npm run dev</code>
            </li>
            <li>
              Отвори browser на: <code className="bg-white px-2 py-1 rounded">http://localhost:3000</code>
            </li>
          </ol>
        </div>
      </div>
    </main>
  )
}