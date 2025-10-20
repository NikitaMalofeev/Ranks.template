import { useEffect } from 'react';
import { Form, Input, Button, Typography, Card, Alert, message, Space, Tag } from 'antd';
import { UserOutlined, LockOutlined, ClearOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from 'app/providers/store/config/store';
import { useAppDispatch } from 'shared/hooks/useAppDispatch';
import { loginThunk, clearError, logout } from 'entities/User/slice/userSlice';
import styles from './LoginPage.module.scss';

const { Title, Text } = Typography;

interface LoginFormValues {
  username: string;
  password: string;
  token?: string;
}

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state: RootState) => state.user);

  // Определяем окружение
  const environment = import.meta.env.VITE_ENVIRONMENT || 'TEST';
  const isProd = environment === 'PROD';

  useEffect(() => {
    // Очистить ошибки при монтировании компонента
    dispatch(clearError());
  }, [dispatch]);

  const onFinish = async (values: LoginFormValues) => {
    try {
      await dispatch(loginThunk(values)).unwrap();
      message.success('Вход выполнен успешно!');
      // После успешного логина, PublicRoute автоматически перенаправит на /admin
      navigate('/admin', { replace: true });
    } catch (err: any) {
      message.error(err || 'Ошибка входа');
    }
  };

  const handleClearStorage = () => {
    // Очистка Redux состояния
    dispatch(logout());
    // Очистка localStorage
    localStorage.clear();
    sessionStorage.clear();
    message.success('Данные очищены! Страница перезагрузится...');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <div className={styles.loginPage}>
      <Card className={styles.loginCard}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Title level={2} className={styles.title} style={{ margin: 0 }}>
            Login
          </Title>
          <Tag color={isProd ? 'red' : 'blue'} style={{ fontSize: 12 }}>
            {isProd ? 'PRODUCTION' : 'TEST'}
          </Tag>
        </div>

        {error && (
          <Alert
            message="Login Failed"
            description={error}
            type="error"
            closable
            onClose={() => dispatch(clearError())}
            style={{ marginBottom: 16 }}
          />
        )}

        <Form
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
          initialValues={{
            username: isProd
              ? import.meta.env.VITE_LOGIN_USERNAME_PROD || ''
              : import.meta.env.VITE_LOGIN_USERNAME || '',
            password: isProd
              ? import.meta.env.VITE_LOGIN_PASSWORD_PROD || ''
              : import.meta.env.VITE_LOGIN_PASSWORD || '',
            token: isProd
              ? import.meta.env.VITE_LOGIN_TOKEN_PROD || ''
              : undefined
          }}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Username"
              size="large"
              disabled={isLoading}
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
              disabled={isLoading}
            />
          </Form.Item>

          {isProd && (
            <Form.Item
              name="token"
              rules={[{ required: true, message: 'Please input your token!' }]}
            >
              <Input
                prefix={<LockOutlined />}
                placeholder="Token"
                size="large"
                disabled={isLoading}
              />
            </Form.Item>
          )}

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={isLoading}
            >
              Sign In
            </Button>
          </Form.Item>

          {isProd && (
            <div style={{ textAlign: 'center', marginTop: -8, marginBottom: 8 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Production Environment
              </Text>
            </div>
          )}
        </Form>

        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <Space direction="vertical" size="small">
            <Text type="secondary" style={{ fontSize: 12 }}>
              Проблемы с входом?
            </Text>
            <Button
              size="small"
              icon={<ClearOutlined />}
              onClick={handleClearStorage}
              danger
            >
              Очистить данные и перезагрузить
            </Button>
          </Space>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
