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
  {
    id: 2,
    title: "Програм рада за 2025.",
    description: "Годишњи програм рада и активности удружења",
    type: "pdf",
    url: "https://drive.google.com/uc?export=download&id=YOUR_FILE_ID",
    category: "planovi",
    categoryLabel: "Планови",
    uploadDate: "10. Децембар 2025.",
    size: "1.8 MB",
  },
  {
    id: 3,
    title: "Фотографија са семинара",
    description: "Групна фотографија учесника стручног семинара о одрживом шумарству",
    type: "image",
    url: "https://drive.google.com/uc?export=view&id=YOUR_FILE_ID",
    category: "fotografije",
    categoryLabel: "Фотографије",
    uploadDate: "5. Децембар 2025.",
  },
]

export const documentCategories = [
  { value: "pravilnici", label: "Правилници" },
  { value: "planovi", label: "Планови" },
  { value: "izvjestaji", label: "Извјештаји" },
  { value: "fotografije", label: "Фотографије" },
  { value: "ostalo", label: "Остало" },
]
