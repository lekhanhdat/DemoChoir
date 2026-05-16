import { FolderAddOutlined, ReadOutlined } from '@ant-design/icons'
import { Alert, Button, Empty, Form, Input, Space, Spin, Table, Tag, Typography, message } from 'antd'
import type { TableColumnsType } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ApiError, createSongBook, getSongBooks, getSongs } from '../api/client'
import type { Song, SongBook } from '../types'

interface SongBookFormValues {
  name: string
}

export default function SongBooksPage() {
  const [songBooks, setSongBooks] = useState<SongBook[]>([])
  const [songs, setSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [form] = Form.useForm<SongBookFormValues>()
  const navigate = useNavigate()

  const loadData = async () => {
    setLoading(true)
    setErrorMessage(null)
    try {
      const [booksResponse, songsResponse] = await Promise.all([getSongBooks(), getSongs()])
      setSongBooks(booksResponse)
      setSongs(songsResponse)
    } catch (error) {
      const messageText =
        error instanceof ApiError ? error.message : 'Không thể tải dữ liệu tập sách.'
      setErrorMessage(messageText)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadData()
  }, [])

  const songsByBookId = useMemo(() => {
    const map = new Map<string, Song[]>()
    for (const song of songs) {
      const current = map.get(song.songBookId) || []
      current.push(song)
      map.set(song.songBookId, current)
    }
    return map
  }, [songs])

  const firstPageByBookId = useMemo(() => {
    const map = new Map<string, number | null>()
    for (const songBook of songBooks) {
      const pages = (songsByBookId.get(songBook.id) || [])
        .map((song) => song.pageNumber)
        .filter((page): page is number => typeof page === 'number' && page > 0)
      map.set(songBook.id, pages.length > 0 ? Math.min(...pages) : null)
    }
    return map
  }, [songBooks, songsByBookId])

  const sortedSongBooks = useMemo(() => {
    return [...songBooks].sort((left, right) => {
      const leftPage = firstPageByBookId.get(left.id) ?? Number.MAX_SAFE_INTEGER
      const rightPage = firstPageByBookId.get(right.id) ?? Number.MAX_SAFE_INTEGER
      if (leftPage !== rightPage) {
        return leftPage - rightPage
      }
      return left.name.localeCompare(right.name, 'vi')
    })
  }, [songBooks, firstPageByBookId])

  const handleCreateSongBook = async (values: SongBookFormValues) => {
    setSubmitting(true)
    try {
      const created = await createSongBook({ name: values.name.trim() })
      setSongBooks((previous) => [created, ...previous])
      form.resetFields()
      message.success('Đã thêm tập sách mới.')
    } catch (error) {
      const messageText =
        error instanceof ApiError ? error.message : 'Không thể tạo tập sách. Vui lòng thử lại.'
      message.error(messageText)
    } finally {
      setSubmitting(false)
    }
  }

  const columns: TableColumnsType<SongBook> = [
    {
      title: 'Tên tập sách',
      dataIndex: 'name',
      key: 'name',
      render: (value: string) => <Typography.Text strong>{value}</Typography.Text>,
    },
    {
      title: 'Số bài hát',
      key: 'songCount',
      render: (_, book) => <Tag color="gold">{songsByBookId.get(book.id)?.length || 0}</Tag>,
    },
    {
      title: 'Trang nhỏ nhất',
      key: 'firstPage',
      render: (_, book) => {
        const page = firstPageByBookId.get(book.id)
        return typeof page === 'number' ? <Tag color="blue">{page}</Tag> : <Tag>-</Tag>
      },
    },
    {
      title: 'Xem bài trong tập',
      key: 'viewSongs',
      render: (_, book) => (
        <Button
          icon={<ReadOutlined />}
          onClick={() => navigate(`/songs?songBookId=${encodeURIComponent(book.id)}`)}
        >
          Xem bài
        </Button>
      ),
    },
  ]

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <div className="section-surface">
        <Typography.Title level={3}>Tập sách</Typography.Title>
        <Form<SongBookFormValues>
          layout="inline"
          form={form}
          onFinish={handleCreateSongBook}
          requiredMark={false}
        >
          <Form.Item
            label="Tên tập sách"
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập tên tập sách.' }]}
            style={{ flex: 1, minWidth: 280 }}
          >
            <Input placeholder="Ví dụ: Thánh ca mùa vọng" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" icon={<FolderAddOutlined />} htmlType="submit" loading={submitting}>
              Thêm tập sách mới
            </Button>
          </Form.Item>
        </Form>
      </div>

      <div className="section-surface">
        {errorMessage && <Alert type="error" showIcon message={errorMessage} style={{ marginBottom: 16 }} />}

        {loading ? (
          <div className="center-content">
            <Spin />
          </div>
        ) : (
          <Table<SongBook>
            rowKey="id"
            dataSource={sortedSongBooks}
            columns={columns}
            pagination={{ pageSize: 8, showSizeChanger: false }}
            locale={{ emptyText: <Empty description="Chưa có tập sách nào" /> }}
            onRow={(record) => ({
              onClick: () => navigate(`/songs?songBookId=${encodeURIComponent(record.id)}`),
              style: { cursor: 'pointer' },
            })}
          />
        )}
      </div>
    </Space>
  )
}
