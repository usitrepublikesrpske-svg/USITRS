import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { getAllNews } from "@/lib/news-data"
import NewsArticleClient from "./client"

interface NewsArticlePageProps {
  params: Promise<{ slug: string }>
}

export default async function NewsArticlePage({ params }: NewsArticlePageProps) {
  const { slug } = await params

  const allNews = getAllNews()
  const article = allNews.find((item) => item.slug === slug)

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

  return <NewsArticleClient article={article} allNews={allNews} slug={slug} />
