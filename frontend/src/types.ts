export interface SongBook {
  songBookId: string
  name: string
}

export interface Song {
  title: string
  firstLine: string
  author: string
  songBookId: string
  pageNumber: number
  linkPdf?: string | null
}

export interface CreateSongPayload {
  title: string
  firstLine?: string
  author: string
  songBookId: string
  pageNumber: number
  linkPdf?: string
}

export interface CreateSongBookPayload {
  songBookId: string
  name: string
}
