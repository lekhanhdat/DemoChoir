import { FilePdfOutlined, SearchOutlined } from '@ant-design/icons'
import { Alert, Col, Empty, Input, Row, Select, Spin, Table, Tag, Typography } from 'antd'
import type { TableColumnsType } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ApiError, getSongs } from '../api/client'
import type { Song } from '../types'
import { filterSongsByKeyword } from '../utils/search'

export default function SongsPage() {
  const [searchParams] = useSearchParams()
  const [songs, setSongs] = useState<Song[]>([])
  const [keyword, setKeyword] = useState('')
  const [authorFilter, setAuthorFilter] = useState<string | undefined>(undefined)
  const [songBookFilter, setSongBookFilter] = useState<string | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    const loadSongs = async () => {
      setLoading(true)
      setErrorMessage(null)
      try {
        const response = await getSongs()
        setSongs(response)
      } catch (error) {
        const messageText =
          error instanceof ApiError ? error.message : 'Không thể tải danh sách bài hát.'
        setErrorMessage(messageText)
      } finally {
        setLoading(false)
      }
    }

    void loadSongs()
  }, [])

  useEffect(() => {
    const songBookIdFromQuery = searchParams.get('songBookId') || undefined
    const authorFromQuery = searchParams.get('author') || undefined
    setSongBookFilter(songBookIdFromQuery)
    setAuthorFilter(authorFromQuery)
  }, [searchParams])

  const filteredSongs = useMemo(() => {
    let result = filterSongsByKeyword(songs, keyword)

    if (authorFilter) {
      result = result.filter((song) => song.author === authorFilter)
    }

    if (songBookFilter) {
      result = result.filter((song) => song.songBookId === songBookFilter)
    }

    return result
  }, [songs, keyword, authorFilter, songBookFilter])

  const authorOptions = useMemo(
    () =>
      [...new Set(songs.map((song) => song.author))]
        .sort((left, right) => left.localeCompare(right, 'vi'))
        .map((author) => ({
          value: author,
          label: author,
        })),
    [songs],
  )

  const songBookOptions = useMemo(() => {
    const entries = new Map<string, string>()
    for (const song of songs) {
      if (!entries.has(song.songBookId)) {
        entries.set(song.songBookId, song.songBookNameSnapshot)
      }
    }

    return [...entries.entries()]
      .sort((left, right) => left[1].localeCompare(right[1], 'vi'))
      .map(([id, name]) => ({
        value: id,
        label: name,
      }))
  }, [songs])

  const columns: TableColumnsType<Song> = [
    { title: 'Tên bài hát', dataIndex: 'title', key: 'title' },
    {
      title: 'Câu đầu',
      dataIndex: 'firstLine',
      key: 'firstLine',
      render: (value: string) => value || <Typography.Text type="secondary">-</Typography.Text>,
    },
    { title: 'Tác giả', dataIndex: 'author', key: 'author' },
    {
      title: 'Tập sách',
      dataIndex: 'songBookNameSnapshot',
      key: 'songBookNameSnapshot',
      render: (value: string) => <Tag>{value}</Tag>,
    },
    {
      title: 'Link PDF',
      dataIndex: 'linkPdf',
      key: 'linkPdf',
      render: (value?: string | null) =>
        value ? (
          <a href={value} target="_blank" rel="noreferrer">
            <FilePdfOutlined /> Mở PDF
          </a>
        ) : (
          <Typography.Text type="secondary">-</Typography.Text>
        ),
    },
  ]

  return (
    <div className="section-surface">
      <Typography.Title level={3}>Bài hát</Typography.Title>
      <Input
        allowClear
        prefix={<SearchOutlined />}
        placeholder="Tìm nhanh theo tên bài hát hoặc câu đầu"
        value={keyword}
        onChange={(event) => setKeyword(event.target.value)}
        style={{ maxWidth: 480, marginBottom: 12 }}
      />

      <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
        <Col xs={24} md={12}>
          <Select
            allowClear
            placeholder="Lọc theo tác giả"
            value={authorFilter}
            onChange={(value) => setAuthorFilter(value)}
            options={authorOptions}
            style={{ width: '100%' }}
          />
        </Col>
        <Col xs={24} md={12}>
          <Select
            allowClear
            placeholder="Lọc theo tập sách"
            value={songBookFilter}
            onChange={(value) => setSongBookFilter(value)}
            options={songBookOptions}
            style={{ width: '100%' }}
          />
        </Col>
      </Row>

      {errorMessage && <Alert type="error" showIcon message={errorMessage} style={{ marginBottom: 16 }} />}

      {loading ? (
        <div className="center-content">
          <Spin />
        </div>
      ) : (
        <Table<Song>
          rowKey="id"
          dataSource={filteredSongs}
          columns={columns}
          pagination={{ pageSize: 10, showSizeChanger: false }}
          locale={{ emptyText: <Empty description="Chưa có bài hát nào" /> }}
          scroll={{ x: 760 }}
        />
      )}
    </div>
  )
}
