import { Typography, Card } from 'antd';
import { BarChartOutlined } from '@ant-design/icons';
import styles from './RiskPage.module.scss';

const { Title, Paragraph } = Typography;

const RiskAssessmentPage = () => {
  return (
    <div className={styles.riskPage}>
      <Card>
        <div className={styles.header}>
          <BarChartOutlined className={styles.icon} />
          <Title level={2}>Оценка риска</Title>
        </div>
        <Paragraph>
          Здесь будет дашборд с оценкой рисков портфеля: VaR, максимальная просадка, волатильность и стресс-тестирование.
        </Paragraph>
        <Paragraph type="secondary">
          Функционал в разработке...
        </Paragraph>
      </Card>
    </div>
  );
};

export default RiskAssessmentPage;
