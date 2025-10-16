import { Typography, Card } from 'antd';
import { LineChartOutlined } from '@ant-design/icons';
import styles from './StrategiesPage.module.scss';

const { Title, Paragraph } = Typography;

const StrategiesBacktestingPage = () => {
  return (
    <div className={styles.strategiesPage}>
      <Card>
        <div className={styles.header}>
          <LineChartOutlined className={styles.icon} />
          <Title level={2}>Бэктестинг</Title>
        </div>
        <Paragraph>
          Здесь будет функционал тестирования стратегий на исторических данных с отображением результатов и графиков.
        </Paragraph>
        <Paragraph type="secondary">
          Функционал в разработке...
        </Paragraph>
      </Card>
    </div>
  );
};

export default StrategiesBacktestingPage;
