export interface SongBook {
  id: string
  name: string
}

export interface Song {
  id: string
  title: string
  firstLine: string
  author: string
  songBookId: string
  songBookNameSnapshot: string
  linkPdf?: string | null
}

export interface CreateSongPayload {
  title: string
  firstLine?: string
  author: string
  songBookId: string
  linkPdf?: string
}

export interface CreateSongBookPayload {
  name: string
}
