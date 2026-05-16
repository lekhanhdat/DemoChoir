import type { CreateSongBookPayload, CreateSongPayload, Song, SongBook } from '../types'

const DEFAULT_API_BASE_URL = 'http://127.0.0.1:8000'
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL).replace(
  /\/$/,
  '',
)

class ApiError extends Error {
  statusCode: number

  constructor(message: string, statusCode: number) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
    ...options,
  })

  if (!response.ok) {
    let message = 'Có lỗi xảy ra khi gọi API.'
    try {
      const body = await response.json()
      message = body.detail || message
    } catch {
      // Ignore JSON parsing errors and keep the default message.
    }
    throw new ApiError(message, response.status)
  }

  return response.json() as Promise<T>
}

export function getSongBooks(): Promise<SongBook[]> {
  return request<SongBook[]>('/api/song-books')
}

export function createSongBook(payload: CreateSongBookPayload): Promise<SongBook> {
  return request<SongBook>('/api/song-books', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function getSongs(): Promise<Song[]> {
  return request<Song[]>('/api/songs')
}

export function createSong(payload: CreateSongPayload): Promise<Song> {
  return request<Song>('/api/songs', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export { ApiError, API_BASE_URL }
