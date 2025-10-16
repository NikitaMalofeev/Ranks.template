import { Typography, Card, Row, Col } from 'antd';
import { DashboardOutlined } from '@ant-design/icons';
import styles from './DashboardPage.module.scss';

const { Title, Paragraph } = Typography;

const DashboardPage = () => {
  return (
    <div className={styles.dashboardPage}>
      <div className={styles.header}>
        <DashboardOutlined className={styles.icon} />
        <Title level={2}>Главная панель</Title>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12} lg={6}>
          <Card>
            <Title level={4}>Портфель</Title>
            <Paragraph type="secondary">Общая стоимость</Paragraph>
          </Card>
        </Col>
        <Col xs={24} md={12} lg={6}>
          <Card>
            <Title level={4}>Доходность</Title>
            <Paragraph type="secondary">За период</Paragraph>
          </Card>
        </Col>
        <Col xs={24} md={12} lg={6}>
          <Card>
            <Title level={4}>Активные стратегии</Title>
            <Paragraph type="secondary">Количество</Paragraph>
          </Card>
        </Col>
        <Col xs={24} md={12} lg={6}>
          <Card>
            <Title level={4}>Риск</Title>
            <Paragraph type="secondary">Текущий уровень</Paragraph>
          </Card>
        </Col>
      </Row>

      <Card style={{ marginTop: 24 }}>
        <Paragraph>
          Главная страница дашборда с ключевыми метриками и графиками.
        </Paragraph>
        <Paragraph type="secondary">
          Функционал в разработке...
        </Paragraph>
      </Card>
    </div>
  );
};

export default DashboardPage;
