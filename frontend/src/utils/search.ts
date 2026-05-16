import type { Song } from '../types'

export function normalizeVietnamese(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim()
}

export function filterSongsByKeyword(songs: Song[], keyword: string): Song[] {
  const normalizedKeyword = normalizeVietnamese(keyword)

  if (!normalizedKeyword) {
    return songs
  }

  return songs.filter((song) => {
    const title = normalizeVietnamese(song.title)
    const firstLine = normalizeVietnamese(song.firstLine || '')
    return title.includes(normalizedKeyword) || firstLine.includes(normalizedKeyword)
  })
}
