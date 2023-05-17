interface Comments {
  id: number,
  description: string,
  rating: number
}

export interface Manga {
  id: number,
  title: string,
  cover: {
   url: string,
   alternativeText: string
  },
  comments: Comments[],
  number: number
  price: number
}
