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
const hardcodedNews: NewsItem[] = [
  {
    id: 1765920544806,
    title: "Савремена механизација у шумарству",
    excerpt:
      "На Шумарском факултету у Бањалуци одржан је стручни скуп посвећен примјени савремене механизације у шумарству Републике Српске, на којем су представници струке, институција и привреде указали на алармантан пад производње шумских дрвних сортимената и озбиљне финансијске губитке у сектору. Истакнута је неопходност хитног увођења савремених технологија, унапређења радних услова и системских рјешења како би се зауставили негативни трендови који угрожавају шумарство и дрвопрерађивачку индустрију као једну од кључних привредних грана Републике Српске.",
    date: "11. децембар 2025.",
    category: "dogadjaji",
    categoryLabel: "Догађаји",
    image: "/forestry-news.jpg",
    slug: "savremena-mehanizacija-u-sumarstvu",
    comments: 0,
    views: 345,
    content: (
      <div className="space-y-6">
        <p>
          САОПШТЕЊЕ ЗА ЈАВНОСТ
          <br />У амфитеатру Шумарског факултета у Бањалуци, 11. децембра 2025. године, одржан је стручни скуп на тему
          примјене савремене механизације у шумарству Републике Српске, у организацији Удружења шумарских инжењера и
          техничара Републике Српске. Скуп је окупио представнике шумских газдинстава ЈПШ „Шуме Републике Српске" а.д.
          Соколац, Министарства пољопривреде, шумарства и водопривреде, Центра за животну средину, Привредне коморе
          Републике Српске, представнике Удружења извођача радова у шумарству, као и академску заједницу.
        </p>
        <p>
          Након уводне ријечи и поздравног обраћања декана Шумарског факултета, проф. др Војислава Дукића и Предсједника
          Удружења инжењера и техничара Републике Српске др Срђана Дражића, учесницима су представљене стручне
          презентације које су обухватиле Техничко-технолошку типизацију терена, употребу дронова у савременом
          шумарству, значај и примјену жичано - ужетних система, те анализу стања производње у шумарству Републике
          Српске са посебним освртом на кључне изазове и могућа рјешења.
        </p>
        <p>
          Посебан акценат у дискусији стављен је на неопходност увођења савремене механизације – харвестера, форвардера,
          шумских жичара и дронова – као једног од кључних предуслова за повећање ефикасности, безбједности рада и
          одрживости шумарске производње. Истовремено, указано је на озбиљне структурне проблеме са којима се шумарство
          Републике Српске суочава већ дужи низ година.
        </p>
        <p>
          Анализе представљене на скупу показују да је у посљедњих шест година евидентан континуиран пад производње
          шумских дрвних сортимената, како у државним, тако и у приватним шумама. Просјечна реализација планиране
          производње у оквиру ЈПШ „Шуме Републике Српске" износила је око 90%, што на годишњем нивоу значи нереализован
          приход од приближно 25 милиона КМ, односно око 150 милиона КМ у шестогодишњем периоду. Као кључни узроци
          наведени су недостатак адекватне радне снаге (сјекача, тракториста те стручно техничког кадра), сложени
          поступци јавних набавки, недостаци законске регулативе, временски услови и друго.
        </p>
        <p>УШИТ РЕПУБЛИКЕ СРПСКЕ</p>
      </div>
    ),
  },
]

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
    return parsed.map((item: any) => ({
      ...item,
      content: <div className="space-y-6" dangerouslySetInnerHTML={{ __html: item.contentHtml }} />,
      gallery: Array.isArray(item.gallery) ? item.gallery : undefined,
    }))
  } catch {
    return []
  }
}

export const newsItems: NewsItem[] =
  typeof window !== "undefined" ? [...getNewsFromStorage(), ...hardcodedNews] : hardcodedNews

// Helper funkcija за pronалаžенје вijesti по slug-u
export function getNewsBySlug(slug: string): NewsItem | undefined {
  return newsItems.find((item) => item.slug === slug)
}

// Helper funkcija за dobijanje najновијих вijesti
export function getLatestNews(count = 6): NewsItem[] {
  return newsItems.slice(0, count)
}
