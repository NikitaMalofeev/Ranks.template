import { useState, useEffect } from 'react';
import {
  Typography,
  Card,
  Table,
  Button,
  Space,
  Tag,
  Progress,
  Badge,
  Modal,
  message,
  Popconfirm,
  Descriptions,
  Tooltip
} from 'antd';
import {
  FileOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  SyncOutlined,
  WifiOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import styles from './ExecutionsActivePage.module.scss';

const { Title } = Typography;

interface ActiveExecution {
  key: string;
  orderTime: string;
  ticker: string;
  securityName: string;
  operationType: 'BUY' | 'SELL';
  totalQuantity: number;
  executedQuantity: number;
  orderPrice: number;
  marketPrice: number;
  status: 'PENDING' | 'PARTIAL' | 'EXECUTING' | 'PAUSED';
  progress: number;
  strategy: string;
}

const ExecutionsActivePage = () => {
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(true);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<ActiveExecution | null>(null);
  const [data, setData] = useState<ActiveExecution[]>([
    {
      key: '1',
      orderTime: '10:25:30',
      ticker: 'SBER',
      securityName: 'Сбербанк',
      operationType: 'BUY',
      totalQuantity: 100,
      executedQuantity: 75,
      orderPrice: 285.50,
      marketPrice: 285.70,
      status: 'EXECUTING',
      progress: 75,
      strategy: 'Momentum Pro'
    },
    {
      key: '2',
      orderTime: '10:30:15',
      ticker: 'GAZP',
      securityName: 'Газпром',
      operationType: 'SELL',
      totalQuantity: 50,
      executedQuantity: 0,
      orderPrice: 168.20,
      marketPrice: 168.15,
      status: 'PENDING',
      progress: 0,
      strategy: 'Arbitrage Master'
    },
    {
      key: '3',
      orderTime: '10:32:45',
      ticker: 'LKOH',
      securityName: 'ЛУКОЙЛ',
      operationType: 'BUY',
      totalQuantity: 50,
      executedQuantity: 30,
      orderPrice: 6850.00,
      marketPrice: 6855.00,
      status: 'PARTIAL',
      progress: 60,
      strategy: 'Value Growth'
    },
    {
      key: '4',
      orderTime: '10:35:20',
      ticker: 'YNDX',
      securityName: 'Яндекс',
      operationType: 'BUY',
      totalQuantity: 20,
      executedQuantity: 10,
      orderPrice: 3250.00,
      marketPrice: 3248.50,
      status: 'PAUSED',
      progress: 50,
      strategy: 'Momentum Pro'
    }
  ]);

  // Simulate real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setData(prevData =>
        prevData.map(item => ({
          ...item,
          marketPrice: item.marketPrice + (Math.random() - 0.5) * 2,
          executedQuantity: item.status === 'EXECUTING' && item.executedQuantity < item.totalQuantity
            ? Math.min(item.executedQuantity + Math.floor(Math.random() * 5), item.totalQuantity)
            : item.executedQuantity,
          progress: item.status === 'EXECUTING'
            ? Math.round((item.executedQuantity / item.totalQuantity) * 100)
            : item.progress
        }))
      );
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const handlePause = (record: ActiveExecution) => {
    message.info(`Приостановка ордера ${record.ticker}...`);
    setData(prevData =>
      prevData.map(item =>
        item.key === record.key ? { ...item, status: 'PAUSED' as const } : item
      )
    );
    message.success(`Ордер ${record.ticker} приостановлен`);
  };

  const handleResume = (record: ActiveExecution) => {
    message.info(`Возобновление ордера ${record.ticker}...`);
    setData(prevData =>
      prevData.map(item =>
        item.key === record.key ? { ...item, status: 'EXECUTING' as const } : item
      )
    );
    message.success(`Ордер ${record.ticker} возобновлен`);
  };

  const handleCancel = (record: ActiveExecution) => {
    message.warning(`Отмена ордера ${record.ticker}...`);
    setData(prevData => prevData.filter(item => item.key !== record.key));
    message.success(`Ордер ${record.ticker} отменен`);
  };

  const handleShowDetails = (record: ActiveExecution) => {
    setSelectedRecord(record);
    setDetailsVisible(true);
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      message.success('Данные обновлены');
      setLoading(false);
    }, 1000);
  };

  const columns: ColumnsType<ActiveExecution> = [
    {
      title: 'Время размещения',
      dataIndex: 'orderTime',
      key: 'orderTime',
      width: 140,
    },
    {
      title: 'Тикер',
      dataIndex: 'ticker',
      key: 'ticker',
      width: 100,
      render: (text, record) => (
        <div>
          <strong>{text}</strong>
          <div style={{ fontSize: 12, color: '#8c8c8c' }}>{record.securityName}</div>
        </div>
      ),
    },
    {
      title: 'Тип операции',
      dataIndex: 'operationType',
      key: 'operationType',
      width: 120,
      render: (type: string) => (
        <Tag color={type === 'BUY' ? 'green' : 'red'}>
          {type === 'BUY' ? 'Покупка' : 'Продажа'}
        </Tag>
      ),
    },
    {
      title: 'Количество',
      key: 'quantity',
      width: 140,
      render: (_, record) => (
        <div>
          <div><strong>{record.executedQuantity}</strong> / {record.totalQuantity} лотов</div>
          <Progress
            percent={record.progress}
            size="small"
            status={record.status === 'PAUSED' ? 'exception' : 'active'}
            showInfo={false}
          />
        </div>
      ),
    },
    {
      title: 'Цена заявки',
      dataIndex: 'orderPrice',
      key: 'orderPrice',
      width: 130,
      align: 'right',
      render: (price: number) => `${price.toFixed(2)} ₽`,
    },
    {
      title: 'Рыночная цена',
      dataIndex: 'marketPrice',
      key: 'marketPrice',
      width: 140,
      align: 'right',
      render: (price: number, record) => {
        const diff = price - record.orderPrice;
        const color = diff > 0 ? '#52c41a' : diff < 0 ? '#ff4d4f' : '#000';
        return (
          <div>
            <div style={{ fontWeight: 'bold' }}>{price.toFixed(2)} ₽</div>
            <div style={{ fontSize: 12, color }}>{diff >= 0 ? '+' : ''}{diff.toFixed(2)}</div>
          </div>
        );
      },
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => {
        const statusConfig = {
          PENDING: { color: 'default', text: 'Ожидание', icon: <SyncOutlined spin /> },
          PARTIAL: { color: 'processing', text: 'Частично', icon: <SyncOutlined spin /> },
          EXECUTING: { color: 'processing', text: 'Исполняется', icon: <SyncOutlined spin /> },
          PAUSED: { color: 'warning', text: 'Приостановлен', icon: <PauseCircleOutlined /> }
        };
        const config = statusConfig[status as keyof typeof statusConfig];
        return (
          <Tag icon={config.icon} color={config.color}>
            {config.text}
          </Tag>
        );
      },
    },
    {
      title: 'Прогресс',
      dataIndex: 'progress',
      key: 'progress',
      width: 120,
      render: (progress: number, record) => (
        <Progress
          percent={progress}
          size="small"
          status={record.status === 'PAUSED' ? 'exception' : 'active'}
        />
      ),
    },
    {
      title: 'Действия',
      key: 'actions',
      fixed: 'right',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          {record.status === 'PAUSED' ? (
            <Tooltip title="Возобновить">
              <Button
                type="text"
                icon={<PlayCircleOutlined />}
                onClick={() => handleResume(record)}
                style={{ color: '#52c41a' }}
              />
            </Tooltip>
          ) : (
            <Tooltip title="Приостановить">
              <Button
                type="text"
                icon={<PauseCircleOutlined />}
                onClick={() => handlePause(record)}
                style={{ color: '#faad14' }}
              />
            </Tooltip>
          )}
          <Popconfirm
            title="Отменить ордер?"
            description="Вы уверены, что хотите отменить этот ордер?"
            onConfirm={() => handleCancel(record)}
            okText="Да"
            cancelText="Нет"
          >
            <Tooltip title="Отменить">
              <Button
                type="text"
                icon={<CloseCircleOutlined />}
                danger
              />
            </Tooltip>
          </Popconfirm>
          <Tooltip title="Детали">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handleShowDetails(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.executionsActivePage}>
      <Card>
        <div className={styles.header}>
          <FileOutlined className={styles.icon} />
          <Title level={2}>Активные исполнения</Title>
          <div className={styles.connectionStatus}>
            <Badge status={connected ? 'success' : 'error'} />
            <WifiOutlined style={{ color: connected ? '#52c41a' : '#ff4d4f' }} />
            <span style={{ marginLeft: 8, fontSize: 14 }}>
              {connected ? 'Подключено' : 'Отключено'}
            </span>
          </div>
        </div>

        <div className={styles.actionButtons}>
          <Space>
            <Button
              icon={<SyncOutlined spin={loading} />}
              onClick={handleRefresh}
              loading={loading}
            >
              Обновить
            </Button>
            <Tag color="blue">Активных ордеров: {data.length}</Tag>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          loading={loading}
          scroll={{ x: 1200 }}
          className={styles.table}
          rowClassName={(record) => {
            if (record.status === 'PAUSED') return styles.pausedRow;
            if (record.status === 'EXECUTING') return styles.executingRow;
            return '';
          }}
        />

        {data.length === 0 && (
          <div className={styles.emptyState}>
            <p>Нет активных исполнений</p>
          </div>
        )}
      </Card>

      {/* Details Modal */}
      <Modal
        title="Детали активного ордера"
        open={detailsVisible}
        onCancel={() => setDetailsVisible(false)}
        width={800}
        footer={[
          <Button key="close" type="primary" onClick={() => setDetailsVisible(false)}>
            Закрыть
          </Button>,
        ]}
      >
        {selectedRecord && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="ID ордера" span={2}>
              {selectedRecord.key}
            </Descriptions.Item>
            <Descriptions.Item label="Время размещения">
              {selectedRecord.orderTime}
            </Descriptions.Item>
            <Descriptions.Item label="Биржа">
              MOEX
            </Descriptions.Item>
            <Descriptions.Item label="Тикер">
              <strong>{selectedRecord.ticker}</strong>
            </Descriptions.Item>
            <Descriptions.Item label="Название бумаги">
              {selectedRecord.securityName}
            </Descriptions.Item>
            <Descriptions.Item label="Тип операции">
              <Tag color={selectedRecord.operationType === 'BUY' ? 'green' : 'red'}>
                {selectedRecord.operationType === 'BUY' ? 'Покупка' : 'Продажа'}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Статус">
              <Tag color={selectedRecord.status === 'EXECUTING' ? 'processing' : 'warning'}>
                {selectedRecord.status}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Количество всего">
              {selectedRecord.totalQuantity} лотов
            </Descriptions.Item>
            <Descriptions.Item label="Исполнено">
              {selectedRecord.executedQuantity} лотов
            </Descriptions.Item>
            <Descriptions.Item label="Прогресс" span={2}>
              <Progress percent={selectedRecord.progress} status="active" />
            </Descriptions.Item>
            <Descriptions.Item label="Цена заявки">
              {selectedRecord.orderPrice.toFixed(2)} ₽
            </Descriptions.Item>
            <Descriptions.Item label="Текущая рыночная цена">
              {selectedRecord.marketPrice.toFixed(2)} ₽
            </Descriptions.Item>
            <Descriptions.Item label="Стратегия" span={2}>
              {selectedRecord.strategy}
            </Descriptions.Item>
            <Descriptions.Item label="Портфель" span={2}>
              Портфель А (основной)
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default ExecutionsActivePage;
