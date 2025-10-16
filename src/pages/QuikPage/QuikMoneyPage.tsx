import { Typography, Card } from 'antd';
import { WalletOutlined } from '@ant-design/icons';
import styles from './QuikPage.module.scss';

const { Title, Paragraph } = Typography;

const QuikMoneyPage = () => {
  return (
    <div className={styles.quikPage}>
      <Card>
        <div className={styles.header}>
          <WalletOutlined className={styles.icon} />
          <Title level={2}>Денежные средства QUIK</Title>
        </div>
        <Paragraph>
          Здесь будет отображаться информация о денежных средствах: баланс, свободные средства, история движений.
        </Paragraph>
        <Paragraph type="secondary">
          Функционал в разработке...
        </Paragraph>
      </Card>
    </div>
  );
};

export default QuikMoneyPage;
