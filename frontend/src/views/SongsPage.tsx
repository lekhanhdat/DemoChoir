import { FilePdfOutlined, SearchOutlined } from '@ant-design/icons'
import { Alert, Empty, Input, Spin, Table, Tag, Typography } from 'antd'
import type { TableColumnsType } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import { ApiError, getSongs } from '../api/client'
import type { Song } from '../types'
import { filterSongsByKeyword } from '../utils/search'

export default function SongsPage() {
  const [songs, setSongs] = useState<Song[]>([])
  const [keyword, setKeyword] = useState('')
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

  const filteredSongs = useMemo(() => filterSongsByKeyword(songs, keyword), [songs, keyword])

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
        style={{ maxWidth: 480, marginBottom: 16 }}
      />

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
