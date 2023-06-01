export interface User {
  id: number,
  username: string,
  email: string,
  jwt: string,
  role: {
    type: string
  }
}

export interface Comment {
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
  comments: Comment[],
  number: number
  price: number
}

export interface ApplicationError {
  name: string,
  message: string,
  details?: string[],
}