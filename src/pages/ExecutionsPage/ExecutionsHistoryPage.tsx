import { useState } from 'react';
import {
  Typography,
  Card,
  Table,
  Button,
  Space,
  DatePicker,
  Select,
  Radio,
  Checkbox,
  Input,
  Tag,
  Dropdown,
  Modal,
  Statistic,
  Row,
  Col,
  Descriptions
} from 'antd';
import {
  FileOutlined,
  ReloadOutlined,
  ExportOutlined,
  SearchOutlined,
  EyeOutlined,
  BarChartOutlined,
  DownOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import styles from './ExecutionsHistoryPage.module.scss';

const { Title } = Typography;
const { RangePicker } = DatePicker;

interface ExecutionRecord {
  key: string;
  datetime: string;
  ticker: string;
  securityName: string;
  operationType: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  totalAmount: number;
  commission: number;
  status: 'EXECUTED' | 'PARTIAL' | 'CANCELLED' | 'ERROR';
  strategy: string;
  comment?: string;
}

const ExecutionsHistoryPage = () => {
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<ExecutionRecord | null>(null);
  const [filterPeriod, setFilterPeriod] = useState<string>('all');
  const [filterInstrument, setFilterInstrument] = useState<string>('all');
  const [filterOperation, setFilterOperation] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string[]>(['EXECUTED', 'PARTIAL', 'CANCELLED']);
  const [filterStrategy, setFilterStrategy] = useState<string>('all');
  const [searchText, setSearchText] = useState<string>('');

  // Mock data
  const mockData: ExecutionRecord[] = [
    {
      key: '1',
      datetime: '2025-10-16 10:25:30',
      ticker: 'SBER',
      securityName: 'Сбербанк',
      operationType: 'BUY',
      quantity: 100,
      price: 285.50,
      totalAmount: 28550,
      commission: 28.55,
      status: 'EXECUTED',
      strategy: 'Momentum Pro',
      comment: 'Открытие длинной позиции по сигналу'
    },
    {
      key: '2',
      datetime: '2025-10-16 11:15:45',
      ticker: 'GAZP',
      securityName: 'Газпром',
      operationType: 'SELL',
      quantity: 50,
      price: 168.20,
      totalAmount: 8410,
      commission: 8.41,
      status: 'EXECUTED',
      strategy: 'Arbitrage Master',
      comment: 'Фиксация прибыли'
    },
    {
      key: '3',
      datetime: '2025-10-15 14:30:12',
      ticker: 'YNDX',
      securityName: 'Яндекс',
      operationType: 'BUY',
      quantity: 20,
      price: 3250.00,
      totalAmount: 65000,
      commission: 65.00,
      status: 'EXECUTED',
      strategy: 'Value Growth',
      comment: ''
    },
    {
      key: '4',
      datetime: '2025-10-15 16:45:22',
      ticker: 'LKOH',
      securityName: 'ЛУКОЙЛ',
      operationType: 'BUY',
      quantity: 30,
      price: 6850.00,
      totalAmount: 205500,
      commission: 205.50,
      status: 'PARTIAL',
      strategy: 'Momentum Pro',
      comment: 'Частичное исполнение 30/50 лотов'
    },
    {
      key: '5',
      datetime: '2025-10-14 09:15:00',
      ticker: 'ROSN',
      securityName: 'Роснефть',
      operationType: 'SELL',
      quantity: 100,
      price: 542.30,
      totalAmount: 54230,
      commission: 54.23,
      status: 'CANCELLED',
      strategy: 'Dividend Plus',
      comment: 'Отменено вручную'
    }
  ];

  const columns: ColumnsType<ExecutionRecord> = [
    {
      title: 'Дата/Время',
      dataIndex: 'datetime',
      key: 'datetime',
      sorter: (a, b) => dayjs(a.datetime).unix() - dayjs(b.datetime).unix(),
      width: 160,
    },
    {
      title: 'Тикер',
      dataIndex: 'ticker',
      key: 'ticker',
      sorter: (a, b) => a.ticker.localeCompare(b.ticker),
      width: 100,
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: 'Название бумаги',
      dataIndex: 'securityName',
      key: 'securityName',
      sorter: (a, b) => a.securityName.localeCompare(b.securityName),
      width: 150,
    },
    {
      title: 'Операция',
      dataIndex: 'operationType',
      key: 'operationType',
      sorter: (a, b) => a.operationType.localeCompare(b.operationType),
      width: 100,
      render: (type: string) => (
        <Tag color={type === 'BUY' ? 'green' : 'red'}>
          {type === 'BUY' ? 'Покупка' : 'Продажа'}
        </Tag>
      ),
    },
    {
      title: 'Количество (лоты)',
      dataIndex: 'quantity',
      key: 'quantity',
      sorter: (a, b) => a.quantity - b.quantity,
      width: 140,
      align: 'right',
    },
    {
      title: 'Цена исполнения',
      dataIndex: 'price',
      key: 'price',
      sorter: (a, b) => a.price - b.price,
      width: 140,
      align: 'right',
      render: (price: number) => `${price.toFixed(2)} ₽`,
    },
    {
      title: 'Сумма сделки',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      sorter: (a, b) => a.totalAmount - b.totalAmount,
      width: 140,
      align: 'right',
      render: (amount: number) => `${amount.toLocaleString()} ₽`,
    },
    {
      title: 'Комиссия',
      dataIndex: 'commission',
      key: 'commission',
      sorter: (a, b) => a.commission - b.commission,
      width: 120,
      align: 'right',
      render: (commission: number) => `${commission.toFixed(2)} ₽`,
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      sorter: (a, b) => a.status.localeCompare(b.status),
      width: 120,
      render: (status: string) => {
        const statusConfig = {
          EXECUTED: { color: 'success', text: 'Исполнено' },
          PARTIAL: { color: 'warning', text: 'Частично' },
          CANCELLED: { color: 'default', text: 'Отменено' },
          ERROR: { color: 'error', text: 'Ошибка' }
        };
        const config = statusConfig[status as keyof typeof statusConfig];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: 'Стратегия',
      dataIndex: 'strategy',
      key: 'strategy',
      sorter: (a, b) => a.strategy.localeCompare(b.strategy),
      width: 150,
    },
    {
      title: 'Комментарий',
      dataIndex: 'comment',
      key: 'comment',
      width: 200,
      ellipsis: true,
    },
    {
      title: 'Действия',
      key: 'actions',
      fixed: 'right',
      width: 100,
      render: (_, record) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => handleShowDetails(record)}
        >
          Детали
        </Button>
      ),
    },
  ];

  const handleShowDetails = (record: ExecutionRecord) => {
    setSelectedRecord(record);
    setDetailsVisible(true);
  };

  const handleExport = (format: string) => {
    console.log(`Экспорт в формат: ${format}`);
    // TODO: Implement export functionality
  };

  const exportMenuItems = [
    { key: 'excel', label: 'Excel (.xlsx)' },
    { key: 'csv', label: 'CSV' },
    { key: 'pdf', label: 'PDF отчет' },
  ];

  // Calculate totals
  const totalTrades = mockData.length;
  const totalVolume = mockData.reduce((sum, record) => sum + record.totalAmount, 0);
  const totalCommission = mockData.reduce((sum, record) => sum + record.commission, 0);

  return (
    <div className={styles.executionsHistoryPage}>
      <Card>
        <div className={styles.header}>
          <FileOutlined className={styles.icon} />
          <Title level={2}>История исполнений</Title>
        </div>

        {/* Filters Section */}
        <Card className={styles.filtersCard} size="small">
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            {/* First row of filters */}
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={8} lg={6}>
                <div className={styles.filterItem}>
                  <label>Период:</label>
                  <Select
                    value={filterPeriod}
                    onChange={setFilterPeriod}
                    style={{ width: '100%' }}
                    options={[
                      { value: 'all', label: 'Все время' },
                      { value: 'today', label: 'Сегодня' },
                      { value: 'week', label: 'Неделя' },
                      { value: 'month', label: 'Месяц' },
                      { value: 'custom', label: 'Выбрать период' },
                    ]}
                  />
                </div>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <div className={styles.filterItem}>
                  <label>Инструмент:</label>
                  <Select
                    showSearch
                    value={filterInstrument}
                    onChange={setFilterInstrument}
                    style={{ width: '100%' }}
                    placeholder="Выберите тикер"
                    options={[
                      { value: 'all', label: 'Все инструменты' },
                      { value: 'SBER', label: 'SBER - Сбербанк' },
                      { value: 'GAZP', label: 'GAZP - Газпром' },
                      { value: 'YNDX', label: 'YNDX - Яндекс' },
                      { value: 'LKOH', label: 'LKOH - ЛУКОЙЛ' },
                      { value: 'ROSN', label: 'ROSN - Роснефть' },
                    ]}
                  />
                </div>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <div className={styles.filterItem}>
                  <label>Тип операции:</label>
                  <Radio.Group
                    value={filterOperation}
                    onChange={(e) => setFilterOperation(e.target.value)}
                    style={{ width: '100%' }}
                  >
                    <Radio.Button value="all">Все</Radio.Button>
                    <Radio.Button value="BUY">Покупка</Radio.Button>
                    <Radio.Button value="SELL">Продажа</Radio.Button>
                  </Radio.Group>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <div className={styles.filterItem}>
                  <label>Стратегия:</label>
                  <Select
                    value={filterStrategy}
                    onChange={setFilterStrategy}
                    style={{ width: '100%' }}
                    options={[
                      { value: 'all', label: 'Все стратегии' },
                      { value: 'momentum', label: 'Momentum Pro' },
                      { value: 'arbitrage', label: 'Arbitrage Master' },
                      { value: 'value', label: 'Value Growth' },
                      { value: 'dividend', label: 'Dividend Plus' },
                    ]}
                  />
                </div>
              </Col>
            </Row>

            {/* Second row of filters */}
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={12}>
                <div className={styles.filterItem}>
                  <label>Статус:</label>
                  <Checkbox.Group
                    value={filterStatus}
                    onChange={setFilterStatus}
                    style={{ width: '100%' }}
                  >
                    <Checkbox value="EXECUTED">Исполнено</Checkbox>
                    <Checkbox value="PARTIAL">Частично</Checkbox>
                    <Checkbox value="CANCELLED">Отменено</Checkbox>
                    <Checkbox value="ERROR">Ошибка</Checkbox>
                  </Checkbox.Group>
                </div>
              </Col>
              <Col xs={24} sm={12} md={12}>
                <div className={styles.filterItem}>
                  <label>Поиск:</label>
                  <Input
                    placeholder="Поиск по всем полям..."
                    prefix={<SearchOutlined />}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    allowClear
                  />
                </div>
              </Col>
            </Row>
          </Space>
        </Card>

        {/* Action Buttons */}
        <div className={styles.actionButtons}>
          <Space>
            <Button icon={<ReloadOutlined />} onClick={() => console.log('Обновить')}>
              Обновить
            </Button>
            <Dropdown
              menu={{
                items: exportMenuItems,
                onClick: ({ key }) => handleExport(key),
              }}
            >
              <Button icon={<ExportOutlined />}>
                Экспорт <DownOutlined />
              </Button>
            </Dropdown>
            <Button icon={<BarChartOutlined />} type="primary">
              Аналитика
            </Button>
          </Space>
        </div>

        {/* Statistics Cards */}
        <Row gutter={[16, 16]} className={styles.statsRow}>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic title="Всего сделок" value={totalTrades} />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="Общий объем"
                value={totalVolume}
                suffix="₽"
                precision={2}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="Общая комиссия"
                value={totalCommission}
                suffix="₽"
                precision={2}
              />
            </Card>
          </Col>
        </Row>

        {/* Main Table */}
        <Table
          columns={columns}
          dataSource={mockData}
          pagination={{
            pageSize: 25,
            showSizeChanger: true,
            pageSizeOptions: ['25', '50', '100'],
            showTotal: (total) => `Всего записей: ${total}`,
          }}
          scroll={{ x: 1500 }}
          className={styles.table}
        />
      </Card>

      {/* Details Modal */}
      <Modal
        title="Детали исполнения"
        open={detailsVisible}
        onCancel={() => setDetailsVisible(false)}
        width={800}
        footer={[
          <Button key="export" icon={<ExportOutlined />}>
            Экспорт деталей
          </Button>,
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
            <Descriptions.Item label="Дата/Время">
              {selectedRecord.datetime}
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
              <Tag color={selectedRecord.status === 'EXECUTED' ? 'success' : 'warning'}>
                {selectedRecord.status === 'EXECUTED' ? 'Исполнено' : selectedRecord.status}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Количество (лоты)">
              {selectedRecord.quantity}
            </Descriptions.Item>
            <Descriptions.Item label="Цена исполнения">
              {selectedRecord.price.toFixed(2)} ₽
            </Descriptions.Item>
            <Descriptions.Item label="Сумма сделки">
              {selectedRecord.totalAmount.toLocaleString()} ₽
            </Descriptions.Item>
            <Descriptions.Item label="Комиссия">
              {selectedRecord.commission.toFixed(2)} ₽
            </Descriptions.Item>
            <Descriptions.Item label="Стратегия" span={2}>
              {selectedRecord.strategy}
            </Descriptions.Item>
            <Descriptions.Item label="Портфель" span={2}>
              Портфель А (основной)
            </Descriptions.Item>
            <Descriptions.Item label="Пользователь" span={2}>
              Иванов И.И.
            </Descriptions.Item>
            <Descriptions.Item label="Комментарий" span={2}>
              {selectedRecord.comment || '—'}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default ExecutionsHistoryPage;
