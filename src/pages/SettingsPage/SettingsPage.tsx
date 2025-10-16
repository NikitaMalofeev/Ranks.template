import { Typography, Card } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import styles from './SettingsPage.module.scss';

const { Title, Paragraph } = Typography;

const SettingsPage = () => {
  return (
    <div className={styles.settingsPage}>
      <Card>
        <div className={styles.header}>
          <SettingOutlined className={styles.icon} />
          <Title level={2}>Настройки</Title>
        </div>
        <Paragraph>
          Здесь будут общие настройки приложения, уведомлений и персонализации.
        </Paragraph>
        <Paragraph type="secondary">
          Функционал в разработке...
        </Paragraph>
      </Card>
    </div>
  );
};

export default SettingsPage;
