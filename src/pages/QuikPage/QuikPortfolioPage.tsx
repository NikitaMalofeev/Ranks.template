import { Typography, Card } from 'antd';
import { FolderOpenOutlined } from '@ant-design/icons';
import styles from './QuikPage.module.scss';

const { Title, Paragraph } = Typography;

const QuikPortfolioPage = () => {
  return (
    <div className={styles.quikPage}>
      <Card>
        <div className={styles.header}>
          <FolderOpenOutlined className={styles.icon} />
          <Title level={2}>Портфель QUIK</Title>
        </div>
        <Paragraph>
          Здесь будет отображаться портфель позиций из QUIK с текущими ценами и прибылью/убытком.
        </Paragraph>
        <Paragraph type="secondary">
          Функционал в разработке...
        </Paragraph>
      </Card>
    </div>
  );
};

export default QuikPortfolioPage;
