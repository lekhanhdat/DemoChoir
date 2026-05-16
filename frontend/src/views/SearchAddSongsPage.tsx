import { FilePdfOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons'
import {
  Alert,
  Button,
  Col,
  Empty,
  Form,
  Input,
  Row,
  Select,
  Space,
  Spin,
  Table,
  Tag,
  Typography,
  message,
} from 'antd'
import type { TableColumnsType } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import { ApiError, createSong, getSongBooks, getSongs } from '../api/client'
import type { Song, SongBook } from '../types'
import { filterSongsByKeyword } from '../utils/search'

interface SongFormValues {
  title: string
  firstLine?: string
  author: string
  songBookId: string
  linkPdf?: string
}

export default function SearchAddSongsPage() {
  const [songs, setSongs] = useState<Song[]>([])
  const [songBooks, setSongBooks] = useState<SongBook[]>([])
  const [keyword, setKeyword] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [form] = Form.useForm<SongFormValues>()

  const loadData = async () => {
    setLoading(true)
    setErrorMessage(null)
    try {
      const [songsResponse, booksResponse] = await Promise.all([getSongs(), getSongBooks()])
      setSongs(songsResponse)
      setSongBooks(booksResponse)
    } catch (error) {
      const messageText =
        error instanceof ApiError ? error.message : 'Không thể tải dữ liệu từ máy chủ.'
      setErrorMessage(messageText)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadData()
  }, [])

  const filteredSongs = useMemo(() => filterSongsByKeyword(songs, keyword), [songs, keyword])

  const columns: TableColumnsType<Song> = [
    {
      title: 'Tên bài hát',
      dataIndex: 'title',
      key: 'title',
      render: (value: string) => <Typography.Text strong>{value}</Typography.Text>,
    },
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

  const handleCreateSong = async (values: SongFormValues) => {
    setSubmitting(true)
    try {
      const createdSong = await createSong({
        title: values.title.trim(),
        firstLine: values.firstLine?.trim(),
        author: values.author.trim(),
        songBookId: values.songBookId,
        linkPdf: values.linkPdf?.trim(),
      })

      setSongs((previous) => [createdSong, ...previous])
      form.resetFields()
      message.success('Đã thêm bài hát mới.')
    } catch (error) {
      const messageText =
        error instanceof ApiError ? error.message : 'Không thể tạo bài hát. Vui lòng thử lại.'
      message.error(messageText)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Space direction="vertical" size={20} style={{ width: '100%' }}>
      <div>
        <Typography.Title level={3} style={{ marginBottom: 0 }}>
          Tra cứu & thêm bài hát
        </Typography.Title>
        <Typography.Text type="secondary">
          Tìm nhanh theo tên bài hát hoặc câu đầu, và thêm bài hát mới ngay trên cùng trang.
        </Typography.Text>
      </div>

      <Input
        size="large"
        allowClear
        prefix={<SearchOutlined />}
        placeholder="Nhập tên bài hát hoặc câu đầu..."
        value={keyword}
        onChange={(event) => setKeyword(event.target.value)}
      />

      {errorMessage && <Alert type="error" showIcon message={errorMessage} />}

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={15}>
          <div className="section-surface">
            <Typography.Title level={5}>Kết quả bài hát</Typography.Title>
            {loading ? (
              <div className="center-content">
                <Spin />
              </div>
            ) : (
              <Table<Song>
                rowKey="id"
                columns={columns}
                dataSource={filteredSongs}
                pagination={{ pageSize: 8, showSizeChanger: false }}
                locale={{
                  emptyText: <Empty description="Chưa có bài hát nào" />,
                }}
                scroll={{ x: 760 }}
              />
            )}
          </div>
        </Col>
        <Col xs={24} lg={9}>
          <div className="section-surface">
            <Space direction="vertical" size={12} style={{ width: '100%' }}>
              <Typography.Title level={5}>Thêm bài hát mới</Typography.Title>

              {songBooks.length === 0 && !loading && (
                <Alert
                  type="warning"
                  showIcon
                  message="Chưa có tập sách. Vui lòng tạo tập sách trước ở trang Tập sách."
                />
              )}

              <Form<SongFormValues>
                form={form}
                layout="vertical"
                requiredMark={false}
                onFinish={handleCreateSong}
              >
                <Form.Item
                  label="Tên bài hát"
                  name="title"
                  rules={[{ required: true, message: 'Vui lòng nhập tên bài hát.' }]}
                >
                  <Input placeholder="Ví dụ: Xin Vâng" />
                </Form.Item>
                <Form.Item label="Câu đầu" name="firstLine">
                  <Input placeholder="Ví dụ: Xin vâng theo ý Chúa..." />
                </Form.Item>
                <Form.Item
                  label="Tác giả"
                  name="author"
                  rules={[{ required: true, message: 'Vui lòng nhập tác giả.' }]}
                >
                  <Input placeholder="Ví dụ: Lm. Kim Long" />
                </Form.Item>
                <Form.Item
                  label="Nằm trong sách nào"
                  name="songBookId"
                  rules={[{ required: true, message: 'Vui lòng chọn tập sách.' }]}
                >
                  <Select
                    placeholder="Chọn tập sách"
                    options={songBooks.map((book) => ({ value: book.id, label: book.name }))}
                  />
                </Form.Item>
                <Form.Item label="Link PDF" name="linkPdf">
                  <Input placeholder="https://..." />
                </Form.Item>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  htmlType="submit"
                  loading={submitting}
                  disabled={songBooks.length === 0}
                  block
                >
                  Thêm bài hát
                </Button>
              </Form>
            </Space>
          </div>
        </Col>
      </Row>
    </Space>
  )
}
