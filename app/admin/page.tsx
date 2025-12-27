"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Copy, Newspaper, Lightbulb, LogOut, Lock } from "lucide-react"
import { saveNewsToStorage } from "@/lib/news-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle2 } from "lucide-react"

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
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("adminLoggedIn") === "true"
    }
    return false
  })
  const [loginForm, setLoginForm] = useState({ username: "", password: "" })
  const [loginError, setLoginError] = useState("")

  const [activeTab, setActiveTab] = useState<"vijesti" | "zanimljivosti">("vijesti")
  const [managementTab, setManagementTab] = useState<"add" | "manage">("add")

  const [newsForm, setNewsForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    date: new Date().toLocaleDateString("sr-Latn-RS", { day: "numeric", month: "long", year: "numeric" }) + ".",
    category: "edukacija",
    image: "/forestry-news.jpg",
    gallery: "",
    comments: 0,
    views: 0,
    author: "Редакција",
  })

  const [funFactForm, setFunFactForm] = useState({
    title: "",
    fact: "",
    source: "",
    category: "drvo",
    icon: "trees",
  })

  const [savedNews, setSavedNews] = useState<any[]>([])
  const [savedFunFacts, setSavedFunFacts] = useState<any[]>([])
  const [generatedCode, setGeneratedCode] = useState("")
  const [copied, setCopied] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    if (loginForm.username === "predsjednik" && loginForm.password === "usit2025") {
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

    const categoryLabel = newsCategories.find((c) => c.value === newsForm.category)?.label || "Edukacija"

    const galleryArray = newsForm.gallery
      .split(",")
      .map((url) => url.trim())
      .filter((url) => url.length > 0)
    const galleryCode = galleryArray.length > 0 ? `\n    gallery: ${JSON.stringify(galleryArray)},` : ""

    const contentParagraphs = newsForm.content
      .split("\n\n")
      .map((para) => para.trim())
      .filter((para) => para.length > 0)
      .map((para) => `        <p>\n          ${para.replace(/\n/g, "\n          ")}\n        </p>`)
      .join("\n")

    const code = `{
    id: ${Date.now()},
    title: "${newsForm.title.replace(/"/g, '\\"')}",
    excerpt: "${newsForm.excerpt.replace(/"/g, '\\"')}",
    date: "${newsForm.date}",
    category: "${newsForm.category}",
    categoryLabel: "${categoryLabel}",
    image: "${newsForm.image}",
    slug: "${slug}",
    comments: ${newsForm.comments},
    views: ${newsForm.views},${galleryCode}
    content: (
      <div className="space-y-6">
${contentParagraphs}
      </div>
    ),
    author: "${newsForm.author}",
  },`

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
// LOKACIЈA: Pronađи "const funFacts = [" и zalijepi ODMAH NAKON [
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
      gallery: "",
      comments: 0,
      views: 0,
      author: "Редакција",
    })
    setFunFactForm({
      title: "",
      fact: "",
      source: "",
      category: "drvo",
      icon: "trees",
    })
    setGeneratedCode("")
    setCopied(false)
  }

  const handleDirectAddNews = () => {
    if (!newsForm.title || !newsForm.excerpt) {
      alert("Молимо попуните обавезна поља (Наслов и Кратак опис)")
      return
    }

    const galleryUrls = newsForm.gallery
      ? newsForm.gallery
          .split(",")
          .map((url) => url.trim())
          .filter((url) => url.length > 0)
          .slice(0, 6)
      : []

    const slug = newsForm.title
      .toLowerCase()
      .replace(/[čćž]/g, (match) => {
        const map: Record<string, string> = { č: "c", ć: "c", ž: "z" }
        return map[match] || match
      })
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")

    const contentHtml = newsForm.content
      .split("\n\n")
      .filter((para) => para.trim())
      .map((para) => `<p>${para.trim()}</p>`)
      .join("")

    const newNewsItem = {
      id: Date.now(),
      title: newsForm.title,
      excerpt: newsForm.excerpt,
      contentHtml: contentHtml,
      date: newsForm.date,
      category: newsForm.category,
      categoryLabel: newsCategories.find((cat) => cat.value === newsForm.category)?.label || newsForm.category,
      image: newsForm.image,
      slug: slug,
      comments: newsForm.comments,
      views: newsForm.views,
      gallery: galleryUrls.length > 0 ? galleryUrls : undefined,
      author: newsForm.author,
    }

    saveNewsToStorage(newNewsItem)
    resetForms()
    alert("Вијест успјешно додата! Преусмјеравам на страницу вијести...")
    window.location.href = "/news"
  }

  const handleDirectAddFunFact = () => {
    if (!funFactForm.title.trim() || !funFactForm.fact.trim()) {
      alert("Наслов и занимљивост су обавезни!")
      return
    }

    const categoryLabel = funFactCategories.find((c) => c.value === funFactForm.category)?.label || funFactForm.category

    const factData = {
      id: Date.now(),
      title: funFactForm.title,
      fact: funFactForm.fact,
      source: funFactForm.source,
      category: funFactForm.category,
      categoryLabel: categoryLabel,
      icon: funFactForm.icon,
    }

    try {
      const stored = localStorage.getItem("customFunFacts")
      const parsed = stored ? JSON.parse(stored) : []
      parsed.unshift(factData)
      localStorage.setItem("customFunFacts", JSON.stringify(parsed))
      resetForms()
      alert("Занимљивост је успјешно додата!")
      window.location.href = "/zanimljivosti"
    } catch (error) {
      alert("Грешка при додавању занимљивости!")
    }
  }

  const handleDeleteNews = (id: number) => {
    const updatedNews = savedNews.filter((item) => item.id !== id)
    localStorage.setItem("newsItems", JSON.stringify(updatedNews))
    setSavedNews(updatedNews)
    alert("Вијест је обрисана!")
  }

  const handleDeleteFunFact = (id: number) => {
    const updatedFacts = savedFunFacts.filter((item) => item.id !== id)
    localStorage.setItem("funFacts", JSON.stringify(updatedFacts))
    setSavedFunFacts(updatedFacts)
    alert("Занимљивост је обрисана!")
  }

  const handleEditNews = (newsItem: any) => {
    setManagementTab("add")
    setNewsForm({
      title: newsItem.title,
      excerpt: newsItem.excerpt,
      content: newsItem.content,
      date: newsItem.date,
      category: newsItem.category,
      image: newsItem.image,
      author: newsItem.author || "Редакција",
      comments: newsItem.comments?.toString() || "0",
      views: newsItem.views?.toString() || "0",
      gallery: newsItem.gallery?.join(", ") || "",
    })
    // Брисање старе верзије
    handleDeleteNews(newsItem.id)
  }

  const handleEditFunFact = (fact: any) => {
    setManagementTab("add")
    setFunFactForm({
      title: fact.title,
      fact: fact.fact,
      source: fact.source,
      category: fact.category,
      icon: fact.icon,
    })
    handleDeleteFunFact(fact.id)
  }

  useEffect(() => {
    if (isLoggedIn) {
      const storedNews = localStorage.getItem("newsItems")
      const storedFunFacts = localStorage.getItem("funFacts")

      if (storedNews) {
        try {
          setSavedNews(JSON.parse(storedNews))
        } catch (e) {
          setSavedNews([])
        }
      }

      if (storedFunFacts) {
        try {
          setSavedFunFacts(JSON.parse(storedFunFacts))
        } catch (e) {
          setSavedFunFacts([])
        }
      }
    }
  }, [isLoggedIn, managementTab])

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
              <Label className="block text-sm font-semibold text-gray-700 mb-2">Корисничко име</Label>
              <Input
                type="text"
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-800 focus:ring-2 focus:ring-green-800"
                placeholder="Унесите корисничко име"
                required
              />
            </div>

            <div>
              <Label className="block text-sm font-semibold text-gray-700 mb-2">Лозинка</Label>
              <Input
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

            <Button
              type="submit"
              className="w-full bg-green-800 text-white font-semibold py-3 rounded-lg hover:bg-green-900 transition-colors"
            >
              Пријави се
            </Button>
          </form>
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
          <Button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Одјави се
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex gap-4 mb-8">
          <TabsList>
            <TabsTrigger value="vijesti">
              <Newspaper className="w-5 h-5 mr-2" />
              Додај Вијест
            </TabsTrigger>
            <TabsTrigger value="zanimljivosti">
              <Lightbulb className="w-5 h-5 mr-2" />
              Додај Занимљивост
            </TabsTrigger>
          </TabsList>
          <TabsContent value="vijesti">
            {managementTab === "add" && (
              <Card>
                <CardHeader>
                  <CardTitle>Нова Вијест</CardTitle>
                  <CardDescription>Попуните форму да бисте додали нову вијест</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="block text-sm font-semibold text-gray-700 mb-2">Наслов вијести *</Label>
                    <Input
                      type="text"
                      name="title"
                      value={newsForm.title}
                      onChange={handleNewsChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-800 focus:ring-1 focus:ring-green-800"
                      placeholder="Унесите наслов вијести"
                    />
                  </div>

                  <div>
                    <Label className="block text-sm font-semibold text-gray-700 mb-2">
                      Кратак опис * (приказује се у листи вијести)
                    </Label>
                    <Textarea
                      name="excerpt"
                      value={newsForm.excerpt}
                      onChange={handleNewsChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-800 focus:ring-1 focus:ring-green-800 resize-none"
                      placeholder="Унесите кратак опис (2-3 реченице)"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label className="block text-sm font-semibold text-gray-700 mb-2">
                      Комплетан текст (приказује се када се отвори вијест)
                    </Label>
                    <Textarea
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
                      <Label className="block text-sm font-semibold text-gray-700 mb-2">Датум</Label>
                      <Input
                        type="text"
                        name="date"
                        value={newsForm.date}
                        onChange={handleNewsChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-800 focus:ring-1 focus:ring-green-800"
                        placeholder="нпр. 15. Новембар 2025."
                      />
                    </div>
                    <div>
                      <Label className="block text-sm font-semibold text-gray-700 mb-2">Категорија</Label>
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
                    <Label className="block text-sm font-semibold text-gray-700 mb-2">URL главне слике</Label>
                    <Input
                      type="text"
                      name="image"
                      value={newsForm.image}
                      onChange={handleNewsChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-800 focus:ring-1 focus:ring-green-800"
                      placeholder="/images/moja-slika.jpg"
                    />
                    <p className="text-xs text-gray-500 mt-1">Ставите слику у public folder и унесите путању овдје</p>
                  </div>

                  <div>
                    <Label className="block text-sm font-semibold text-gray-700 mb-2">
                      Галерија слика (опционално, максимално 6)
                    </Label>
                    <Textarea
                      name="gallery"
                      value={newsForm.gallery}
                      onChange={handleNewsChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-800 focus:ring-1 focus:ring-green-800 resize-none"
                      placeholder="/images/slika1.jpg, /images/slika2.jpg, /images/slika3.jpg"
                      rows={3}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Унесите URL-ове слика раздвојене зарезима (максимално 6). Слике ће се приказати као галерија на
                      дну чланка.
                    </p>
                    <p className="text-xs text-green-700 mt-1">
                      💡 Савјет: Можете користити Google Drive линкове или слике из public/images/ фолдера
                    </p>
                  </div>

                  <div>
                    <Label className="block text-sm font-semibold text-gray-700 mb-2">Автор</Label>
                    <Input
                      type="text"
                      name="author"
                      value={newsForm.author}
                      onChange={handleNewsChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-800 focus:ring-1 focus:ring-green-800"
                      placeholder="нпр. Редакција"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="block text-sm font-semibold text-gray-700 mb-2">Коментари</Label>
                      <Input
                        type="number"
                        name="comments"
                        value={newsForm.comments}
                        onChange={handleNewsChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-800 focus:ring-1 focus:ring-green-800"
                        min="0"
                      />
                    </div>
                    <div>
                      <Label className="block text-sm font-semibold text-gray-700 mb-2">Прегледи</Label>
                      <Input
                        type="number"
                        name="views"
                        value={newsForm.views}
                        onChange={handleNewsChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-800 focus:ring-1 focus:ring-green-800"
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={generateNewsCode}
                      className="px-6 py-3 bg-green-800 text-white rounded-lg font-semibold hover:bg-green-900 transition-colors"
                    >
                      Генериши код
                    </Button>
                    <Button
                      onClick={handleDirectAddNews}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Директно додај вијест
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            {managementTab === "manage" && (
              <div className="space-y-6">
                {savedNews.map((newsItem) => (
                  <div key={newsItem.id} className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold text-green-800 mb-4">{newsItem.title}</h2>
                    <p className="text-gray-600 mb-4">{newsItem.excerpt}</p>
                    <div className="flex gap-3">
                      <Button
                        onClick={() => handleEditNews(newsItem)}
                        className="px-6 py-3 bg-green-800 text-white rounded-lg font-semibold hover:bg-green-900 transition-colors"
                      >
                        Уреди
                      </Button>
                      <Button
                        onClick={() => handleDeleteNews(newsItem.id)}
                        className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
                      >
                        Обриши
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="zanimljivosti">
            {managementTab === "add" && (
              <Card>
                <CardHeader>
                  <CardTitle>Нова Занимљивост</CardTitle>
                  <CardDescription>Попуните форму да бисте додали нову занимљивост</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="block text-sm font-semibold text-gray-700 mb-2">Наслов *</Label>
                    <Input
                      type="text"
                      name="title"
                      value={funFactForm.title}
                      onChange={handleFunFactChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-800 focus:ring-1 focus:ring-green-800"
                      placeholder="нпр. Најстарије дрво на свијету"
                    />
                  </div>

                  <div>
                    <Label className="block text-sm font-semibold text-gray-700 mb-2">Занимљивост *</Label>
                    <Textarea
                      name="fact"
                      value={funFactForm.fact}
                      onChange={handleFunFactChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-800 focus:ring-1 focus:ring-green-800 resize-none"
                      placeholder="Унесите занимљиву чињеницу о шумарству..."
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label className="block text-sm font-semibold text-gray-700 mb-2">Извор (опционо)</Label>
                    <Input
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
                      <Label className="block text-sm font-semibold text-gray-700 mb-2">Категорија</Label>
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
                      <Label className="block text-sm font-semibold text-gray-700 mb-2">Иконица</Label>
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

                  <div className="flex gap-3">
                    <Button
                      onClick={generateFunFactCode}
                      className="px-6 py-3 bg-green-800 text-white rounded-lg font-semibold hover:bg-green-900 transition-colors"
                    >
                      Генериши код
                    </Button>
                    <Button
                      onClick={handleDirectAddFunFact}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Директно додај занимљивост
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            {managementTab === "manage" && (
              <div className="space-y-8">
                <div className="bg-gray-800 rounded-lg p-6">
                  <h3 className="text-2xl font-bold text-emerald-400 mb-6">Управљање вијестима</h3>
                  {savedNews.length === 0 ? (
                    <p className="text-gray-400">Нема сачуваних вијести.</p>
                  ) : (
                    <div className="space-y-4">
                      {savedNews.map((newsItem) => (
                        <div key={newsItem.id} className="bg-gray-700 rounded-lg p-4 flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-white mb-2">{newsItem.title}</h4>
                            <p className="text-sm text-gray-400 mb-2">{newsItem.excerpt}</p>
                            <div className="flex gap-4 text-xs text-gray-500">
                              <span>{newsItem.date}</span>
                              <span>{newsItem.category}</span>
                            </div>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <button
                              onClick={() => handleEditNews(newsItem)}
                              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                            >
                              Измијени
                            </button>
                            <button
                              onClick={() => {
                                if (confirm("Да ли сте сигурни да желите обрисати ову вијест?")) {
                                  handleDeleteNews(newsItem.id)
                                }
                              }}
                              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
                            >
                              Обриши
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-gray-800 rounded-lg p-6">
                  <h3 className="text-2xl font-bold text-emerald-400 mb-6">Управљање занимљивостима</h3>
                  {savedFunFacts.length === 0 ? (
                    <p className="text-gray-400">Нема сачуваних занимљивости.</p>
                  ) : (
                    <div className="space-y-4">
                      {savedFunFacts.map((fact) => (
                        <div key={fact.id} className="bg-gray-700 rounded-lg p-4 flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-white mb-2">{fact.title}</h4>
                            <p className="text-sm text-gray-400 mb-2">{fact.fact}</p>
                            <div className="flex gap-4 text-xs text-gray-500">
                              <span>{fact.date}</span>
                              <span>{fact.category}</span>
                            </div>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <button
                              onClick={() => handleEditFunFact(fact)}
                              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                            >
                              Измијени
                            </button>
                            <button
                              onClick={() => {
                                if (confirm("Да ли сте сигурни да желите обрисати ову занимљивост?")) {
                                  handleDeleteFunFact(fact.id)
                                }
                              }}
                              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
                            >
                              Обриши
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-green-800 mb-4">Генерисани код</h2>

          {generatedCode ? (
            <>
              <div className="relative">
                <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm max-h-96 overflow-y-auto font-mono whitespace-pre-wrap">
                  {generatedCode}
                </pre>

                <Button
                  onClick={handleCopyCode}
                  className="absolute top-2 right-2 flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-3 py-1 rounded transition-colors text-sm"
                >
                  {copied ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Копирано!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Копирај
                    </>
                  )}
                </Button>
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
