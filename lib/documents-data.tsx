export interface Document {
  id: number
  title: string
  description: string
  type: "pdf" | "image"
  url: string
  category: string
  categoryLabel: string
  uploadDate: string
  size?: string
}

export const documents: Document[] = [
  {
    id: 1,
    title: "Статут Удружења",
    description: "Званични статут Удружења шумарских инжењера и техничара Републике Српске",
    type: "pdf",
    url: "https://drive.google.com/uc?export=download&id=150ASJXKKf4r81o2l8Lxx9yG1_A9hV9fw",
    category: "pravilnici",
    categoryLabel: "Правилници",
    uploadDate: "15. Децембар 2025.",
    size: "2.4 MB",
  },
]

export const documentCategories = [
  { value: "pravilnici", label: "Правилници" },
  { value: "planovi", label: "Планови" },
  { value: "izvjestaji", label: "Извјештаји" },
  { value: "fotografije", label: "Фотографије" },
  { value: "ostalo", label: "Остало" },
]

export function getDocumentsFromStorage(): Document[] {
  return documents.sort((a, b) => {
    const dateA = new Date(a.uploadDate).getTime()
    const dateB = new Date(b.uploadDate).getTime()
    return dateB - dateA
  })
}
