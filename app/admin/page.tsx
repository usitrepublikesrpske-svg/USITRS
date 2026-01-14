"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

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

interface FunFactForm {
  title: string
  fact: string
  source: string
  category: string
  icon: string
  image?: string
}

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("adminLoggedIn") === "true"
    }
    return false
  })
  const [loginForm, setLoginForm] = useState({ username: "", password: "" })
  const [loginError, setLoginError] = useState("")

  const [activeTab, setActiveTab] = useState<"vijesti" | "zanimljivosti" | "dokumenti">("vijesti")
  const [managementTab, setManagementTab] = useState<"add" | "manage">("add")

  const [loadedNews, setLoadedNews] = useState<any[]>([])
  const [loadedFunFacts, setLoadedFunFacts] = useState<any[]>([])
  const [loadedDocuments, setLoadedDocuments] = useState<any[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)

  const [newsForm, setNewsForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    date: new Date().toLocaleDateString("sr-Latn-RS", { day: "numeric", month: "long", year: "numeric" }),
    category: "edukacija",
    image: "/forestry-news.jpg",
    gallery: "",
    comments: 0,
    views: 0,
    author: "Редакција",
  })

  const [funFactForm, setFunFactForm] = useState<FunFactForm>({
    title: "",
    fact: "",
    source: "",
    category: "drvo",
    icon: "leaf",
    image: "",
  })

  const [documentForm, setDocumentForm] = useState({
    title: "",
    description: "",
    type: "pdf" as "pdf" | "image",
    url: "",
    category: "pravilnici",
    size: "",
  })

  const [savedNews, setSavedNews] = useState<any[]>([])
  const [savedFunFacts, setSavedFunFacts] = useState<any[]>([])
  const [generatedCode, setGeneratedCode] = useState("")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("customNews")
      const savedFacts = localStorage.getItem("customFunFacts")
      const savedDocs = localStorage.getItem("customDocuments")
      if (saved) setLoadedNews(JSON.parse(saved))
      if (savedFacts) setLoadedFunFacts(JSON.parse(savedFacts))
      if (savedDocs) setLoadedDocuments(JSON.parse(savedDocs))
    }
  }, [])

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

  const deleteNews = (id: string) => {
    const updated = loadedNews.filter((item) => item.id !== id)
    setLoadedNews(updated)
    localStorage.setItem("customNews", JSON.stringify(updated))
  }

  const deleteFunFact = (id: string) => {
    const updated = loadedFunFacts.filter((item) => item.id !== id)
    setLoadedFunFacts(updated)
    localStorage.setItem("customFunFacts", JSON.stringify(updated))
  }

  const deleteDocument = (id: string) => {
    const updated = loadedDocuments.filter((item) => item.id !== id)
    setLoadedDocuments(updated)
    localStorage.setItem("customDocuments", JSON.stringify(updated))
  }

  const editNews = (item: any) => {
    setNewsForm({
      title: item.title || "",
      excerpt: item.excerpt || "",
      content: item.contentHtml?.replace(/<p>|<\/p>/g, "").replace(/<br\/>/g, "\n\n") || item.content || "",
      date: item.date || "",
      category: item.category || "edukacija",
      image: item.image || "/forestry-news.jpg",
      gallery: Array.isArray(item.gallery) ? item.gallery.join(", ") : item.gallery || "",
      comments: item.comments || 0,
      views: item.views || 0,
      author: item.author || "Редакција",
    })
    setEditingId(item.id)
    setManagementTab("add")
  }

  const editFunFact = (item: any) => {
    setFunFactForm({
      title: item.title || "",
      fact: item.fact || "",
      source: item.source || "",
      category: item.category || "drvo",
      icon: item.icon || "leaf",
      image: item.image || "",
    })
    setEditingId(item.id)
    setManagementTab("add")
  }

  const editDocument = (item: any) => {
    setDocumentForm({
      title: item.title || "",
      description: item.description || "",
      type: item.type || "pdf",
      url: item.url || "",
      category: item.category || "pravilnici",
      size: item.size || "",
    })
    setEditingId(item.id)
    setManagementTab("add")
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

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setDocumentForm((prev) => ({ ...prev, [name]: value }))
  }

  const resetForms = () => {
    setNewsForm({
      title: "",
      excerpt: "",
      content: "",
      date: new Date().toLocaleDateString("sr-Latn-RS", { day: "numeric", month: "long", year: "numeric" }),
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
      icon: "leaf",
      image: "",
    })
    setDocumentForm({ title: "", description: "", type: "pdf", url: "", category: "pravilnici", size: "" })
    setGeneratedCode("")
    setCopied(false)
    setEditingId(null)
  }

  const handleDirectAddNews = () => {
    if (!newsForm.title.trim() || !newsForm.excerpt.trim() || !newsForm.content.trim()) {
      alert("Наслов, резиме и садржај су обавезни!")
      return
    }

    const galleryUrls = newsForm.gallery
      .split(",")
      .map((url) => url.trim())
      .filter((url) => url.length > 0)
      .slice(0, 6)

    const slug = newsForm.title
      .toLowerCase()
      .replace(/[čćžšđ]/g, (match) => {
        const map: Record<string, string> = { č: "c", ć: "c", ž: "z", š: "s", đ: "dj" }
        return map[match] || match
      })
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")

    const contentHtml = (newsForm.content || "")
      .split("\n\n")
      .filter((para) => para.trim())
      .map((para) => `<p>${para.trim()}</p>`)
      .join("")

    const newNewsItem = {
      id: editingId || Date.now().toString(),
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

    let updatedNewsList
    if (editingId) {
      updatedNewsList = loadedNews.map((item) => (item.id === editingId ? newNewsItem : item))
    } else {
      updatedNewsList = [...loadedNews, newNewsItem]
    }

    localStorage.setItem("customNews", JSON.stringify(updatedNewsList))
    setLoadedNews(updatedNewsList)
    resetForms()
    alert("Вијест успјешно додата/ажурирана!")
  }

  const handleDirectAddFunFact = () => {
    if (!funFactForm.title.trim() || !funFactForm.fact.trim()) {
      alert("Наслов и занимљивост су обавезни!")
      return
    }

    const categoryLabel = funFactCategories.find((c) => c.value === funFactForm.category)?.label || funFactForm.category

    const factData = {
      id: editingId || Date.now().toString(),
      title: funFactForm.title,
      fact: funFactForm.fact,
      source: funFactForm.source,
      category: funFactForm.category,
      categoryLabel: categoryLabel,
      icon: funFactForm.icon,
      image: funFactForm.image || "",
    }

    let updatedFunFacts
    if (editingId) {
      updatedFunFacts = loadedFunFacts.map((item) => (item.id === editingId ? factData : item))
    } else {
      updatedFunFacts = [...loadedFunFacts, factData]
    }

    try {
      localStorage.setItem("customFunFacts", JSON.stringify(updatedFunFacts))
      setLoadedFunFacts(updatedFunFacts)
      resetForms()
      alert("Занимљивост је успјешно додата/ажурирана!")
    } catch (error) {
      alert("Грешка при додавању/ажурирању занимљивости!")
    }
  }

  const handleDirectAddDocument = () => {
    if (!documentForm.title || !documentForm.url) {
      alert("Наслов и URL су обавезни!")
      return
    }

    const documentId = editingId || Date.now().toString()
    const newDocument = {
      id: documentId,
      ...documentForm,
      uploadDate: new Date().toLocaleDateString("sr-Latn-RS", { day: "numeric", month: "long", year: "numeric" }),
    }

    let updated = loadedDocuments
    if (editingId) {
      updated = loadedDocuments.map((doc) => (doc.id === editingId ? newDocument : doc))
    } else {
      updated = [...loadedDocuments, newDocument]
    }

    setLoadedDocuments(updated)
    localStorage.setItem("customDocuments", JSON.stringify(updated))

    setDocumentForm({ title: "", description: "", type: "pdf", url: "", category: "pravilnici", size: "" })
    setEditingId(null)
    setManagementTab("manage")
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 to-green-700 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
          <h1 className="text-3xl font-bold text-green-900 mb-6 text-center">Админ Панел</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Корисничко име</label>
              <input
                type="text"
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Унесите корисничко име"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Лозинка</label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Унесите лозинку"
              />
            </div>
            {loginError && <p className="text-red-500 text-sm">{loginError}</p>}
            <button
              type="submit"
              className="w-full bg-green-700 text-white py-2 rounded-lg hover:bg-green-800 font-medium"
            >
              Пријава
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-green-900">Админ Панел</h1>
          <Button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Одјави се
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex gap-4 mb-6 border-b flex-wrap">
            <Button
              variant="ghost"
              onClick={() => {
                setManagementTab("add")
                setActiveTab("vijesti")
                setEditingId(null)
              }}
              className={`px-6 py-3 font-medium transition-colors ${
                managementTab === "add"
                  ? "text-green-700 border-b-2 border-green-700"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Додај садржај
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setManagementTab("manage")
                setActiveTab("vijesti")
              }}
              className={`px-6 py-3 font-medium transition-colors ${
                managementTab === "manage"
                  ? "text-green-700 border-b-2 border-green-700"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Управљај садржајем
            </Button>
          </div>

          {managementTab === "add" ? (
            <>
              <div className="flex gap-4 mb-6 border-b">
                <Button
                  variant="ghost"
                  onClick={() => setActiveTab("vijesti")}
                  className={`px-6 py-3 font-medium transition-colors ${
                    activeTab === "vijesti"
                      ? "text-green-700 border-b-2 border-green-700"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Додај вијест
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setActiveTab("zanimljivosti")}
                  className={`px-6 py-3 font-medium transition-colors ${
                    activeTab === "zanimljivosti"
                      ? "text-green-700 border-b-2 border-green-700"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Додај занимљивост
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setActiveTab("dokumenti")}
                  className={`px-6 py-3 font-medium transition-colors ${
                    activeTab === "dokumenti"
                      ? "text-green-700 border-b-2 border-green-700"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Додај документ
                </Button>
              </div>

              {activeTab === "vijesti" ? (
                <Card>
                  <CardHeader>
                    <CardTitle>{editingId ? "Уреди Вијест" : "Нова Вијест"}</CardTitle>
                    <CardDescription>Попуните форму да бисте додали/ажурирали вијест</CardDescription>
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
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="block text-sm font-semibold text-gray-700 mb-2">Датум</Label>
                        <Input
                          type="text"
                          name="date"
                          value={newsForm.date}
                          onChange={handleNewsChange}
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
                        placeholder="/images/moja-slika.jpg"
                      />
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
                        placeholder="/images/slika1.jpg, /images/slika2.jpg"
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label className="block text-sm font-semibold text-gray-700 mb-2">Автор</Label>
                      <Input
                        type="text"
                        name="author"
                        value={newsForm.author}
                        onChange={handleNewsChange}
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
                          min="0"
                        />
                      </div>
                      <div>
                        <Label className="block text-sm font-semibold text-gray-700 mb-2">Прегледи</Label>
                        <Input type="number" name="views" value={newsForm.views} onChange={handleNewsChange} min="0" />
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        onClick={handleDirectAddNews}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                      >
                        {editingId ? "Ажурирај вијест" : "Додај вијест"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : activeTab === "zanimljivosti" ? (
                <Card>
                  <CardHeader>
                    <CardTitle>{editingId ? "Уреди Занимљивост" : "Нова Занимљивост"}</CardTitle>
                    <CardDescription>Попуните форму да бисте додали/ажурирали занимљивост</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label className="block text-sm font-semibold text-gray-700 mb-2">Наслов *</Label>
                      <Input
                        type="text"
                        name="title"
                        value={funFactForm.title}
                        onChange={handleFunFactChange}
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
                        placeholder="нпр. National Geographic"
                      />
                    </div>

                    <div>
                      <Label className="block text-sm font-semibold text-gray-700 mb-2">
                        Слика - Thumbnail (опционо)
                      </Label>
                      <Input
                        type="text"
                        name="image"
                        value={funFactForm.image || ""}
                        onChange={handleFunFactChange}
                        placeholder="/images/slika.jpg или Google Drive URL"
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
                        onClick={handleDirectAddFunFact}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                      >
                        {editingId ? "Ажурирај занимљивост" : "Додај занимљивост"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>{editingId ? "Уреди Документ" : "Нови Документ"}</CardTitle>
                    <CardDescription>Попуните форму да бисте додали/ажурирали документ</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label className="block text-sm font-semibold text-gray-700 mb-2">Наслов *</Label>
                      <Input
                        type="text"
                        name="title"
                        value={documentForm.title}
                        onChange={handleDocumentChange}
                        placeholder="нпр. Статут Удружења"
                      />
                    </div>

                    <div>
                      <Label className="block text-sm font-semibold text-gray-700 mb-2">Опис</Label>
                      <Textarea
                        name="description"
                        value={documentForm.description}
                        onChange={handleDocumentChange}
                        placeholder="Опис документа..."
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="block text-sm font-semibold text-gray-700 mb-2">Тип</Label>
                        <select
                          name="type"
                          value={documentForm.type}
                          onChange={handleDocumentChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-800 focus:ring-1 focus:ring-green-800"
                        >
                          <option value="pdf">PDF</option>
                          <option value="image">Слика</option>
                        </select>
                      </div>
                      <div>
                        <Label className="block text-sm font-semibold text-gray-700 mb-2">Категорија</Label>
                        <select
                          name="category"
                          value={documentForm.category}
                          onChange={handleDocumentChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-800 focus:ring-1 focus:ring-green-800"
                        >
                          <option value="pravilnici">Правилници</option>
                          <option value="planovi">Планови</option>
                          <option value="izvjestaji">Извјештаји</option>
                          <option value="fotografije">Фотографије</option>
                          <option value="ostalo">Остало</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <Label className="block text-sm font-semibold text-gray-700 mb-2">Google Drive URL *</Label>
                      <Input
                        type="text"
                        name="url"
                        value={documentForm.url}
                        onChange={handleDocumentChange}
                        placeholder="https://drive.google.com/uc?export=download&id=YOUR_FILE_ID"
                      />
                    </div>

                    <div>
                      <Label className="block text-sm font-semibold text-gray-700 mb-2">Величина (опционо)</Label>
                      <Input
                        type="text"
                        name="size"
                        value={documentForm.size}
                        onChange={handleDocumentChange}
                        placeholder="нпр. 2.4 MB"
                      />
                    </div>

                    <div className="flex gap-3">
                      <Button
                        onClick={handleDirectAddDocument}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                      >
                        {editingId ? "Ажурирај документ" : "Додај документ"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <div className="space-y-4">
              <div className="flex gap-4 mb-6 border-b">
                <Button
                  variant="ghost"
                  onClick={() => setActiveTab("vijesti")}
                  className={`px-6 py-3 font-medium transition-colors ${
                    activeTab === "vijesti"
                      ? "text-green-700 border-b-2 border-green-700"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Вијести
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setActiveTab("zanimljivosti")}
                  className={`px-6 py-3 font-medium transition-colors ${
                    activeTab === "zanimljivosti"
                      ? "text-green-700 border-b-2 border-green-700"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Занимљивости
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setActiveTab("dokumenti")}
                  className={`px-6 py-3 font-medium transition-colors ${
                    activeTab === "dokumenti"
                      ? "text-green-700 border-b-2 border-green-700"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Документи
                </Button>
              </div>

              {activeTab === "vijesti" && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-800">Сачуване вијести</h3>
                  {loadedNews.length === 0 ? (
                    <p className="text-gray-500">Нема сачуваних вијести</p>
                  ) : (
                    loadedNews.map((news) => (
                      <div key={news.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-800">{news.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{news.excerpt}</p>
                            <p className="text-xs text-gray-500 mt-2">Датум: {news.date}</p>
                          </div>
                          <div className="flex gap-2 flex-shrink-0">
                            <Button
                              onClick={() => editNews(news)}
                              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm"
                            >
                              Измијени
                            </Button>
                            <Button
                              onClick={() => {
                                if (window.confirm("Да ли сте сигурни?")) {
                                  deleteNews(news.id)
                                }
                              }}
                              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm"
                            >
                              Обриши
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === "zanimljivosti" && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-800">Сачуване занимљивости</h3>
                  {loadedFunFacts.length === 0 ? (
                    <p className="text-gray-500">Нема сачуваних занимљивости</p>
                  ) : (
                    loadedFunFacts.map((fact) => (
                      <div key={fact.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-800">{fact.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{fact.fact}</p>
                            <p className="text-xs text-gray-500 mt-2">Категорија: {fact.categoryLabel}</p>
                          </div>
                          <div className="flex gap-2 flex-shrink-0">
                            <Button
                              onClick={() => editFunFact(fact)}
                              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm"
                            >
                              Измијени
                            </Button>
                            <Button
                              onClick={() => {
                                if (window.confirm("Да ли сте сигурни?")) {
                                  deleteFunFact(fact.id)
                                }
                              }}
                              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm"
                            >
                              Обриши
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === "dokumenti" && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-800">Сачувани документи</h3>
                  {loadedDocuments.length === 0 ? (
                    <p className="text-gray-500">Нема сачуваних докумената</p>
                  ) : (
                    loadedDocuments.map((doc) => (
                      <div key={doc.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-800">{doc.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{doc.description}</p>
                            <p className="text-xs text-gray-500 mt-2">
                              Тип: {doc.type === "pdf" ? "PDF" : "Слика"} | Датум: {doc.uploadDate}
                            </p>
                          </div>
                          <div className="flex gap-2 flex-shrink-0">
                            <Button
                              onClick={() => editDocument(doc)}
                              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm"
                            >
                              Измијени
                            </Button>
                            <Button
                              onClick={() => {
                                if (window.confirm("Да ли сте сигурни?")) {
                                  deleteDocument(doc.id)
                                }
                              }}
                              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm"
                            >
                              Обриши
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
