import { Typography, Card } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';
import styles from './StrategiesPage.module.scss';

const { Title, Paragraph } = Typography;

const StrategiesAllPage = () => {
  return (
    <div className={styles.strategiesPage}>
      <Card>
        <div className={styles.header}>
          <FileTextOutlined className={styles.icon} />
          <Title level={2}>Все стратегии</Title>
        </div>
        <Paragraph>
          Здесь будет отображаться список всех торговых стратегий с возможностью создания, редактирования и управления.
        </Paragraph>
        <Paragraph type="secondary">
          Функционал в разработке...
        </Paragraph>
      </Card>
    </div>
  );
};

export default StrategiesAllPage;
