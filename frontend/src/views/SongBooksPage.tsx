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

function buildNextSongBookId(songBooks: SongBook[]): string {
  const numericIds = songBooks
    .map((book) => Number.parseInt(book.songBookId, 10))
    .filter((value) => Number.isFinite(value))

  if (numericIds.length === 0) {
    return '1'
  }

  return String(Math.max(...numericIds) + 1)
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

  const sortedSongBooks = useMemo(
    () => [...songBooks].sort((left, right) => left.name.localeCompare(right.name, 'vi')),
    [songBooks],
  )

  const handleCreateSongBook = async (values: SongBookFormValues) => {
    setSubmitting(true)
    try {
      const generatedSongBookId = buildNextSongBookId(songBooks)
      const created = await createSongBook({
        songBookId: generatedSongBookId,
        name: values.name.trim(),
      })
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
      render: (_, book) => <Tag color="gold">{songsByBookId.get(book.songBookId)?.length || 0}</Tag>,
    },
    {
      title: 'Xem bài trong tập',
      key: 'viewSongs',
      render: (_, book) => (
        <Button
          icon={<ReadOutlined />}
          onClick={() => navigate(`/songs?songBookId=${encodeURIComponent(book.songBookId)}`)}
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
          layout="vertical"
          form={form}
          onFinish={handleCreateSongBook}
          requiredMark={false}
        >
          <Form.Item
            label="Tên tập sách"
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập tên tập sách.' }]}
          >
            <Input placeholder="Ví dụ: Thánh ca Mùa Vọng" />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
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
            rowKey="songBookId"
            dataSource={sortedSongBooks}
            columns={columns}
            pagination={{ pageSize: 8, showSizeChanger: false }}
            locale={{ emptyText: <Empty description="Chưa có tập sách nào" /> }}
          />
        )}
      </div>
    </Space>
  )
}
