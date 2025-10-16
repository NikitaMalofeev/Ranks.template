import { Typography, Card } from 'antd';
import { ShoppingOutlined } from '@ant-design/icons';
import styles from './QuikPage.module.scss';

const { Title, Paragraph } = Typography;

const QuikOrdersPage = () => {
  return (
    <div className={styles.quikPage}>
      <Card>
        <div className={styles.header}>
          <ShoppingOutlined className={styles.icon} />
          <Title level={2}>Ордера QUIK</Title>
        </div>
        <Paragraph>
          Здесь будет управление ордерами: создание, изменение, отмена, история.
        </Paragraph>
        <Paragraph type="secondary">
          Функционал в разработке...
        </Paragraph>
      </Card>
    </div>
  );
};

export default QuikOrdersPage;
