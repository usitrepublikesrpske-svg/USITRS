export interface FunFact {
  id: number
  title: string
  fact: string
  date: string
  dateSort: number // Додавање поља за сортирање датума
  category: string
  categoryLabel: string
  source?: string
  image?: string
  icon?: string
  slug: string
}

const hardcodedFunFacts: FunFact[] = []

export function getHardcodedFunFacts(): FunFact[] {
  return hardcodedFunFacts
}

export function getFunFactsFromStorage(): FunFact[] {
  if (typeof window === "undefined") return []
  try {
    const stored = localStorage.getItem("customFunFacts")
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error("Грешка при учитавању занимљивости из localStorage:", error)
    return []
  }
}

export function getAllFunFacts(): FunFact[] {
  const stored = getFunFactsFromStorage()
  const hardcoded = getHardcodedFunFacts()
  const combined = [...stored, ...hardcoded]

  // Уклањање дупликата по ID-у
  const unique = Array.from(new Map(combined.map((item) => [item.id, item])).values())

  return unique.sort((a, b) => (b.dateSort || 0) - (a.dateSort || 0))
}

export function getFunFactBySlug(slug: string): FunFact | null {
  const all = getAllFunFacts()
  return all.find((fact) => fact.slug === slug) || null
}
