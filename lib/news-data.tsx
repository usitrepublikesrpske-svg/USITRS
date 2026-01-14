"use client"

import type React from "react"

export interface NewsItem {
  id: number
  title: string
  excerpt: string
  date: string
  dateSort: number // Додавање поља за сортирање датума
  category: string
  categoryLabel: string
  image: string
  slug: string
  content: React.ReactNode
  comments: number
  views: number
  gallery?: string[]
}

// Hardкодиране вијести - ПРАЗНА јер корисник жели управљање кроз админ панел
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
    if (!stored) return hardcodedNews
    const parsed = JSON.parse(stored)
    const sorted = parsed.sort((a: any, b: any) => {
      return (b.dateSort || 0) - (a.dateSort || 0)
    })
    return sorted.map((item: any, index: number) => ({
      ...item,
      slug: item.slug || `news-custom-${item.id || index}`,
      content: <div className="space-y-6" dangerouslySetInnerHTML={{ __html: item.contentHtml }} />,
      gallery: Array.isArray(item.gallery) ? item.gallery : undefined,
    }))
  } catch {
    return hardcodedNews
  }
}

export const newsItems: NewsItem[] = hardcodedNews

export function getNewsFromStorageWithHardcoded(): NewsItem[] {
  const stored = getNewsFromStorage()
  const combined = [...stored, ...hardcodedNews]
  const unique = Array.from(new Map(combined.map((item) => [item.id, item])).values())
  return unique.sort((a, b) => (b.dateSort || 0) - (a.dateSort || 0))
}

export function getNewsBySlug(slug: string): NewsItem | undefined {
  const all = getNewsFromStorageWithHardcoded()
  return all.find((item) => item.slug === slug)
}

export function getLatestNews(count = 6): NewsItem[] {
  const all = getNewsFromStorageWithHardcoded()
  return all.slice(0, count)
}
