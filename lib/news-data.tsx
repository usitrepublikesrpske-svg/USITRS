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
  contentHtml: string
  comments: number
  views: number
  gallery?: string[]
}

// Sve вијести су hardcoded direktnо у kodу и биће увек доступне
export const newsItems: NewsItem[] = [
  {
    id: 1,
    title: "Одржана III сједница Скупштине УШИТ РС",
    excerpt:
      "Скупштина удружења је одржала своју трећу сједницу у којој су разматрана важна питања развоја и активности удружења.",
    date: "10. јануар 2026.",
    dateSort: 1735689600000, // 10. години 2026
    category: "dogadjaji",
    categoryLabel: "Догађаји",
    image: "/meeting-conference-organization.jpg",
    slug: "odrjana-iii-sjednica",
    content: (
      <div className="prose prose-sm">
        <p>На III сједници Скупштине УШИТ РС разматрана су значајна питања за развој удружења.</p>
        <p>Скупштина је усвојила стратешке одлуке за наредни период и одобрила нове пројекте у области шумарства.</p>
      </div>
    ),
    contentHtml:
      "<p>На III сједници Скупштине УШИТ РС разматрана су значајна питања за развој удружења.</p><p>Скупштина је усвојила стратешке одлуке за наредни период и одобрила нове пројекте у области шумарства.</p>",
    comments: 0,
    views: 0,
  },
  {
    id: 2,
    title: "Прва вијест из маја 2025",
    excerpt: "Кратак опис прве вијести",
    date: "15. май 2025.",
    dateSort: 1747324800000, // 15. май 2025
    category: "edukacija",
    categoryLabel: "Едукација",
    image: "/forest-education.jpg",
    slug: "prva-vijest-maj-2025",
    content: (
      <div>
        <p>Детаљан садржај прве вијesti из маја 2025. године.</p>
      </div>
    ),
    contentHtml: "<p>Детаљан садржај прве вијesti из маја 2025. године.</p>",
    comments: 0,
    views: 5,
  },
  {
    id: 4,
    title: "sdafdfad",
    excerpt: "asd asd fasdf ",
    date: "13.01.2026.",
    dateSort: 1736726400000,
    category: "edukacija",
    categoryLabel: "Едукација",
    image: "/forestry-news.jpg",
    slug: "sdafdfad",
    content: (
      <div>
        <p>f asdf ad adad adfa d</p>
      </div>
    ),
    contentHtml: "<p>f asdf ad adad adfa d</p>",
    comments: 0,
    views: 0,
  },
]

export function getNewsFromStorage(): NewsItem[] {
  return newsItems.sort((a, b) => b.dateSort - a.dateSort)
}

export function getNewsBySlug(slug: string): NewsItem | undefined {
  return newsItems.find((item) => item.slug === slug)
}

export function getLatestNews(count = 6): NewsItem[] {
  return newsItems.sort((a, b) => b.dateSort - a.dateSort).slice(0, count)
}

export function getNewsFromStorageWithHardcoded(): NewsItem[] {
  if (typeof window === "undefined") {
    return getNewsFromStorage()
  }

  try {
    const stored = localStorage.getItem("customNews")
    if (stored) {
      const parsed = JSON.parse(stored)
      const combined = [...parsed, ...newsItems]
      const unique = Array.from(new Map(combined.map((item) => [item.id, item])).values())
      return unique.sort((a, b) => b.dateSort - a.dateSort)
    }
  } catch {
    // Silent error handling
  }

  return getNewsFromStorage()
}
