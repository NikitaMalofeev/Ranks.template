import { Typography, Card } from 'antd';
import { FileOutlined } from '@ant-design/icons';
import styles from './RiskPage.module.scss';

const { Title, Paragraph } = Typography;

const RiskLimitsPage = () => {
  return (
    <div className={styles.riskPage}>
      <Card>
        <div className={styles.header}>
          <FileOutlined className={styles.icon} />
          <Title level={2}>Лимиты риска</Title>
        </div>
        <Paragraph>
          Здесь будет управление глобальными лимитами и лимитами по инструментам с мониторингом нарушений.
        </Paragraph>
        <Paragraph type="secondary">
          Функционал в разработке...
        </Paragraph>
      </Card>
    </div>
  );
};

export default RiskLimitsPage;
