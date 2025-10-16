import { Typography, Card } from 'antd';
import { FileOutlined } from '@ant-design/icons';
import styles from './PortfolioPage.module.scss';

const { Title, Paragraph } = Typography;

const PortfolioCreatePage = () => {
  return (
    <div className={styles.portfolioPage}>
      <Card>
        <div className={styles.header}>
          <FileOutlined className={styles.icon} />
          <Title level={2}>Создать портфель</Title>
        </div>
        <Paragraph>
          Здесь будет форма создания нового модельного портфеля с выбором инструментов, весов и настройками ребалансировки.
        </Paragraph>
        <Paragraph type="secondary">
          Функционал в разработке...
        </Paragraph>
      </Card>
    </div>
  );
};

export default PortfolioCreatePage;
