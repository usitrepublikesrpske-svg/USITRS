"use client"

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
  contentHtml?: string
}

const hardcodedFunFacts: FunFact[] = []

export const funFactsItems: FunFact[] = []

export function getAllFunFacts(): FunFact[] {
  // Vraća samo hardcoded zanимљивости - bez localStorage
  return funFactsItems.sort((a, b) => b.dateSort - a.dateSort)
}

export function getFunFactBySlug(slug: string): FunFact | null {
  return funFactsItems.find((fact) => fact.slug === slug) || null
}
