import { Layout, Button, Typography } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from 'app/providers/store/config/store';
import { useAppDispatch } from 'shared/hooks/useAppDispatch';
import { logout } from 'entities/User/slice/userSlice';
import styles from './Header.module.scss';

const { Header: AntHeader } = Layout;
const { Title } = Typography;

export const Header = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('persist:root');
    navigate('/login');
  };

  return (
    <AntHeader className={styles.header}>
      <div className={styles.container}>
        <Title level={4} className={styles.logo} onClick={() => navigate('/')}>
          Ranks Template
        </Title>
        {isAuthenticated && (
          <Button
            type="text"
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            className={styles.logoutBtn}
          >
            Logout
          </Button>
        )}
      </div>
    </AntHeader>
  );
};
