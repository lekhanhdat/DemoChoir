import {
  BookOutlined,
  LogoutOutlined,
  SearchOutlined,
  UnorderedListOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Button, Layout, Menu, Space, Typography } from 'antd'
import { useMemo } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { clearAuth } from '../utils/auth'

const { Header, Sider, Content } = Layout

export default function AppShell() {
  const location = useLocation()
  const navigate = useNavigate()

  const selectedKey = useMemo(() => {
    if (location.pathname.startsWith('/song-books')) {
      return '/song-books'
    }
    if (location.pathname.startsWith('/songs')) {
      return '/songs'
    }
    return '/'
  }, [location.pathname])

  const menuItems = [
    { key: '/', icon: <SearchOutlined />, label: 'Tra cứu & thêm' },
    { key: '/songs', icon: <UnorderedListOutlined />, label: 'Bài hát' },
    { key: '/song-books', icon: <BookOutlined />, label: 'Tập sách' },
  ]

  const handleLogout = () => {
    clearAuth()
    navigate('/login', { replace: true })
  }

  return (
    <Layout className="app-layout">
      <Sider theme="light" breakpoint="lg" collapsedWidth="0">
        <div className="brand">Gia Phuoc Choir</div>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={(event) => navigate(event.key)}
        />
      </Sider>
      <Layout>
        <Header className="app-header">
          <Typography.Title level={4} className="app-title">
            Gia Phuoc Choir
          </Typography.Title>
          <Space size={16}>
            <Space size={8}>
              <UserOutlined />
              <Typography.Text>Ca trưởng (demo)</Typography.Text>
            </Space>
            <Button icon={<LogoutOutlined />} onClick={handleLogout}>
              Đăng xuất
            </Button>
          </Space>
        </Header>
        <Content className="app-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
