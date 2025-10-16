import { Typography, Card, Row, Col, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { DashboardOutlined } from '@ant-design/icons';
import { Header } from 'widgets/Header/Header';
import styles from './HomePage.module.scss';

const { Title, Paragraph } = Typography;

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <div className={styles.homePage}>
        <div className={styles.content}>
          <Title level={1}>Welcome to Ranks Template</Title>
          <Paragraph>
            This is a template project based on Feature-Sliced Design architecture.
          </Paragraph>

          <Button
            type="primary"
            size="large"
            icon={<DashboardOutlined />}
            onClick={() => navigate('/admin')}
            className={styles.adminButton}
          >
            Go to Admin Panel
          </Button>

          <Row gutter={[16, 16]} className={styles.features}>
            <Col xs={24} md={12}>
              <Card title="🚀 Technology Stack" bordered={false}>
                <ul>
                  <li>React + TypeScript + Vite</li>
                  <li>Redux Toolkit with Redux Persist</li>
                  <li>React Router DOM v7</li>
                  <li>Ant Design (antd)</li>
                  <li>SCSS modules</li>
                </ul>
              </Card>
            </Col>

            <Col xs={24} md={12}>
              <Card title="📐 Architecture" bordered={false}>
                <ul>
                  <li>Feature-Sliced Design</li>
                  <li>Clear layer separation</li>
                  <li>Scalable structure</li>
                  <li>Type-safe codebase</li>
                  <li>Path aliases configured</li>
                </ul>
              </Card>
            </Col>
          </Row>

          <Card className={styles.infoCard}>
            <Title level={4}>Getting Started</Title>
            <Paragraph>
              Check out <code>README.md</code> and <code>ARCHITECTURE.md</code> for detailed documentation.
            </Paragraph>
            <Paragraph>
              This template is ready to use. Start building your features in the <code>features/</code> directory!
            </Paragraph>
          </Card>
        </div>
      </div>
    </>
  );
};

export default HomePage;
