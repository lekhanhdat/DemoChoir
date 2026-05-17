import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Alert, Button, Card, Form, Input, Space, Typography } from 'antd'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginWithLocalAccount } from '../utils/auth'

interface LoginFormValues {
  username: string
  password: string
}

export default function LoginPage() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const navigate = useNavigate()

  const onSubmit = (values: LoginFormValues) => {
    const success = loginWithLocalAccount(values.username, values.password)
    if (!success) {
      setErrorMessage('Sai tài khoản hoặc mật khẩu.')
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
            <Typography.Title level={3} style={{ marginBottom: 4, textAlign: 'center' }}>
              Ca đoàn giáo xứ Gia Phước
            </Typography.Title>
          </div>

          {errorMessage && <Alert type="error" showIcon message={errorMessage} />}

          <Form<LoginFormValues> layout="vertical" onFinish={onSubmit} requiredMark={false}>
            <Form.Item
              label="Tên đăng nhập"
              name="username"
              rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập.' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Tên đăng nhập" autoComplete="username" />
            </Form.Item>
            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu.' }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Mật khẩu"
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
