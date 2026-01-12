"use client"

import type React from "react"

export interface NewsItem {
  id: number
  title: string
  excerpt: string
  date: string
  category: string
  categoryLabel: string
  image: string
  slug: string
  content: React.ReactNode
  comments: number
  views: number
  gallery?: string[]
}

// Hardкодиране вијести
const hardcodedNews: NewsItem[] = []

export function saveNewsToStorage(news: any) {
  if (typeof window === "undefined") return
  try {
    const existing = localStorage.getItem("customNews")
    const parsed = existing ? JSON.parse(existing) : []
    parsed.unshift({
      ...news,
      gallery: news.gallery || undefined,
    })
    localStorage.setItem("customNews", JSON.stringify(parsed))
  } catch (error) {
    console.error("Грешка при чувању вијести:", error)
  }
}

export function getNewsFromStorage(): NewsItem[] {
  if (typeof window === "undefined") return []
  try {
    const stored = localStorage.getItem("customNews")
    if (!stored) return []
    const parsed = JSON.parse(stored)
    return parsed.map((item: any, index: number) => ({
      ...item,
      slug: item.slug || `news-custom-${item.id || index}`,
      content: <div className="space-y-6" dangerouslySetInnerHTML={{ __html: item.contentHtml }} />,
      gallery: Array.isArray(item.gallery) ? item.gallery : undefined,
    }))
  } catch {
    return []
  }
}

// Исправка редосљеда - нове вијести прво, затим hard-coded
export const newsItems: NewsItem[] = typeof window !== "undefined" ? getNewsFromStorage() : []

// Helper funkcija за pronалаžенје вijesti по slug-u
export function getNewsBySlug(slug: string): NewsItem | undefined {
  return newsItems.find((item) => item.slug === slug)
}

// Helper funkcija за dobijanje najновијих вijesti
export function getLatestNews(count = 6): NewsItem[] {
  return newsItems.slice(0, count)
}
