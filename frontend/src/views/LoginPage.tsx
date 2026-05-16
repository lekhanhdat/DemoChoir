import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Alert, Button, Card, Form, Input, Space, Typography } from 'antd'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginWithDemoAccount } from '../utils/auth'

interface LoginFormValues {
  username: string
  password: string
}

export default function LoginPage() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const navigate = useNavigate()

  const onSubmit = (values: LoginFormValues) => {
    const success = loginWithDemoAccount(values.username.trim(), values.password)
    if (!success) {
      setErrorMessage('Sai tài khoản demo. Vui lòng dùng demo / demo123.')
      return
    }

    setErrorMessage(null)
    navigate('/', { replace: true })
  }

  return (
    <div className="login-page">
      <Card className="login-card">
        <Space direction="vertical" size={20} style={{ width: '100%' }}>
          <div>
            <Typography.Title level={3} style={{ marginBottom: 4 }}>
              Gia Phuoc Choir
            </Typography.Title>
            <Typography.Text type="secondary">Đăng nhập demo để bắt đầu.</Typography.Text>
          </div>

          {errorMessage && <Alert type="error" showIcon message={errorMessage} />}

          <Form<LoginFormValues> layout="vertical" onFinish={onSubmit} requiredMark={false}>
            <Form.Item
              label="Tên đăng nhập"
              name="username"
              rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập.' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="demo" autoComplete="username" />
            </Form.Item>
            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu.' }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="demo123"
                autoComplete="current-password"
              />
            </Form.Item>
            <Button type="primary" htmlType="submit" block>
              Đăng nhập
            </Button>
          </Form>
        </Space>
      </Card>
    </div>
  )
}
