import { Form, Input, Button, Typography, Card } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAppDispatch } from 'shared/hooks/useAppDispatch';
import { setUserToken } from 'entities/User/slice/userSlice';
import styles from './LoginPage.module.scss';

const { Title } = Typography;

interface LoginFormValues {
  username: string;
  password: string;
}

const LoginPage = () => {
  const dispatch = useAppDispatch();

  const onFinish = (values: LoginFormValues) => {
    console.log('Login attempt:', values);
    // Mock authentication - replace with real API call
    const mockToken = 'mock-jwt-token-' + Date.now();
    dispatch(setUserToken(mockToken));
  };

  return (
    <div className={styles.loginPage}>
      <Card className={styles.loginCard}>
        <Title level={2} className={styles.title}>
          Login
        </Title>
        <Form
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Username"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block>
              Sign In
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
