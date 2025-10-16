import { Typography, Card } from 'antd';
import { StockOutlined } from '@ant-design/icons';
import styles from './QuikPage.module.scss';

const { Title, Paragraph } = Typography;

const QuikQuotesPage = () => {
  return (
    <div className={styles.quikPage}>
      <Card>
        <div className={styles.header}>
          <StockOutlined className={styles.icon} />
          <Title level={2}>Котировки QUIK</Title>
        </div>
        <Paragraph>
          Здесь будут отображаться котировки инструментов из QUIK в режиме реального времени.
        </Paragraph>
        <Paragraph type="secondary">
          Функционал в разработке...
        </Paragraph>
      </Card>
    </div>
  );
};

export default QuikQuotesPage;
