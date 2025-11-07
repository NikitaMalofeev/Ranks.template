import { useEffect, useState } from 'react';
import {
  Typography,
  Card,
  Table,
  Button,
  Space,
  Select,
  message,
  Tag,
  Row,
  Col,
  Statistic,
  Descriptions,
  Spin,
  Alert
} from 'antd';
import {
  ReloadOutlined,
  PieChartOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useSelector } from 'react-redux';
import { useAppDispatch } from 'shared/hooks/useAppDispatch';
import {
  viewModelPortfolio,
  fetchAllStrategies,
  selectModelPortfolio,
  selectStrategies,
  selectPortfolioLoading,
  selectPortfolioError,
  type ModelPortfolioPosition,
  type Strategy
} from 'entities/Portfolio';
import styles from './ModelPortfolioPage.module.scss';

const { Title, Text } = Typography;

const ModelPortfolioPage = () => {
  const dispatch = useAppDispatch();
  const modelPortfolio = useSelector(selectModelPortfolio);
  const strategies = useSelector(selectStrategies);
  const loading = useSelector(selectPortfolioLoading);
  const error = useSelector(selectPortfolioError);

  const [selectedStrategyId, setSelectedStrategyId] = useState<number | null>(null);
  const [portfolioData, setPortfolioData] = useState<ModelPortfolioPosition[]>([]);

  // Load strategies on mount
  useEffect(() => {
    dispatch(fetchAllStrategies());
  }, [dispatch]);

  // Convert modelPortfolio object to array when it changes
  useEffect(() => {
    if (modelPortfolio) {
      const dataArray = Object.values(modelPortfolio);
      setPortfolioData(dataArray);
    }
  }, [modelPortfolio]);

  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  const handleStrategyChange = (strategyId: number) => {
    setSelectedStrategyId(strategyId);
    // Fetch model portfolio for selected strategy
    dispatch(viewModelPortfolio({ id_strategy: strategyId }));
  };

  const handleRefresh = () => {
    if (selectedStrategyId) {
      dispatch(viewModelPortfolio({ id_strategy: selectedStrategyId }));
      message.success('Данные обновлены');
    }
  };

  const formatMoneyValue = (value?: { units: number; nano: number; currency?: string }) => {
    if (!value) return '—';
    const total = value.units + value.nano / 1_000_000_000;
    return value.currency ? `${total.toFixed(2)} ${value.currency.toUpperCase()}` : total.toFixed(2);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleString('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTradingStatusLabel = (status?: number) => {
    const statusMap: Record<number, { label: string; color: string }> = {
      5: { label: 'Торгуется', color: 'green' },
      6: { label: 'Не торгуется', color: 'red' },
      0: { label: 'Неизвестно', color: 'default' }
    };
    return statusMap[status ?? 0] || statusMap[0];
  };

  const columns: ColumnsType<ModelPortfolioPosition> = [
    {
      title: 'ISIN',
      dataIndex: 'isin',
      key: 'isin',
      width: 130,
      fixed: 'left',
      render: (isin: string) => <strong>{isin}</strong>,
    },
    {
      title: 'Название',
      key: 'name',
      width: 200,
      render: (_, record) => record.data_api?.name || record.data_api?.ticker || '—',
    },
    {
      title: 'Тикер',
      key: 'ticker',
      width: 100,
      render: (_, record) => record.data_api?.ticker || '—',
    },
    {
      title: 'Доля (%)',
      dataIndex: 'share',
      key: 'share',
      width: 100,
      align: 'right',
      sorter: (a, b) => a.share - b.share,
      render: (share: number) => <strong style={{ color: '#1890ff' }}>{share.toFixed(2)}%</strong>,
    },
    {
      title: 'Статус',
      dataIndex: 'is_active',
      key: 'is_active',
      width: 100,
      align: 'center',
      filters: [
        { text: 'Активные', value: true },
        { text: 'Неактивные', value: false },
      ],
      onFilter: (value, record) => record.is_active === value,
      render: (isActive: boolean) => (
        <Tag icon={isActive ? <CheckCircleOutlined /> : <CloseCircleOutlined />} color={isActive ? 'success' : 'default'}>
          {isActive ? 'Активен' : 'Неактивен'}
        </Tag>
      ),
    },
    {
      title: 'FIGI',
      key: 'figi',
      width: 130,
      render: (_, record) => record.data_api?.figi || '—',
    },
    {
      title: 'Сектор',
      key: 'sector',
      width: 120,
      render: (_, record) => record.data_api?.sector || '—',
    },
    {
      title: 'Валюта',
      key: 'currency',
      width: 80,
      render: (_, record) => record.data_api?.currency?.toUpperCase() || '—',
    },
    {
      title: 'Лот',
      key: 'lot',
      width: 80,
      align: 'right',
      render: (_, record) => record.data_api?.lot || '—',
    },
    {
      title: 'Статус торговли',
      key: 'trading_status',
      width: 130,
      render: (_, record) => {
        const status = getTradingStatusLabel(record.data_api?.trading_status);
        return <Tag color={status.color}>{status.label}</Tag>;
      },
    },
    {
      title: 'Номинал',
      key: 'nominal',
      width: 120,
      align: 'right',
      render: (_, record) => formatMoneyValue(record.data_api?.nominal),
    },
    {
      title: 'Мин. шаг цены',
      key: 'min_price_increment',
      width: 120,
      align: 'right',
      render: (_, record) => formatMoneyValue(record.data_api?.min_price_increment),
    },
    {
      title: 'Страна',
      key: 'country',
      width: 150,
      render: (_, record) => record.data_api?.country_of_risk_name || record.data_api?.country_of_risk || '—',
    },
    {
      title: 'Биржа',
      key: 'exchange',
      width: 150,
      render: (_, record) => record.data_api?.exchange || '—',
    },
    {
      title: 'Class Code',
      key: 'class_code',
      width: 100,
      render: (_, record) => record.data_api?.class_code || '—',
    },
    {
      title: 'UID',
      key: 'uid',
      width: 200,
      render: (_, record) => record.data_api?.uid || '—',
    },
    {
      title: 'Asset UID',
      key: 'asset_uid',
      width: 200,
      render: (_, record) => record.data_api?.asset_uid || '—',
    },
    {
      title: 'Position UID',
      key: 'position_uid',
      width: 200,
      render: (_, record) => record.data_api?.position_uid || '—',
    },
    {
      title: 'IPO дата',
      key: 'ipo_date',
      width: 120,
      render: (_, record) => formatDate(record.data_api?.ipo_date),
    },
    {
      title: 'Объем выпуска',
      key: 'issue_size',
      width: 130,
      align: 'right',
      render: (_, record) => record.data_api?.issue_size?.toLocaleString() || '—',
    },
    {
      title: 'Создано',
      dataIndex: 'created',
      key: 'created',
      width: 160,
      render: (date: string) => formatDate(date),
    },
    {
      title: 'Изменено',
      dataIndex: 'modified',
      key: 'modified',
      width: 160,
      render: (date: string) => formatDate(date),
    },
  ];

  // Calculate statistics
  const totalShare = portfolioData.reduce((sum, item) => sum + item.share, 0);
  const activeCount = portfolioData.filter(item => item.is_active).length;
  const inactiveCount = portfolioData.length - activeCount;

  return (
    <div className={styles.modelPortfolioPage}>
      <Card>
        <div className={styles.header}>
          <PieChartOutlined className={styles.icon} />
          <Title level={2}>Модельный портфель</Title>
        </div>

        {/* Strategy Selection */}
        <Card className={styles.selectionCard} size="small">
          <Row gutter={16} align="middle">
            <Col flex="auto">
              <Space direction="vertical" style={{ width: '100%' }}>
                <Text strong>Выберите стратегию:</Text>
                <Select
                  placeholder="Выберите стратегию из списка"
                  value={selectedStrategyId}
                  onChange={handleStrategyChange}
                  style={{ width: '100%' }}
                  loading={loading && !strategies.length}
                  options={strategies.map(strategy => ({
                    value: strategy.id,
                    label: `${strategy.full_name} (ID: ${strategy.id})`,
                  }))}
                  showSearch
                  optionFilterProp="label"
                />
              </Space>
            </Col>
            <Col>
              <Button
                icon={<ReloadOutlined spin={loading} />}
                onClick={handleRefresh}
                disabled={!selectedStrategyId}
              >
                Обновить
              </Button>
            </Col>
          </Row>
        </Card>

        {/* Loading State */}
        {loading && !portfolioData.length && (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Spin size="large" tip="Загрузка данных модельного портфеля..." />
          </div>
        )}

        {/* No Strategy Selected */}
        {!selectedStrategyId && !loading && (
          <Alert
            message="Выберите стратегию"
            description="Пожалуйста, выберите стратегию из списка выше, чтобы просмотреть модельный портфель."
            type="info"
            showIcon
            icon={<InfoCircleOutlined />}
            style={{ marginTop: 16 }}
          />
        )}

        {/* Portfolio Data */}
        {selectedStrategyId && portfolioData.length > 0 && (
          <>
            {/* Statistics */}
            <Card className={styles.statsCard} size="small">
              <Row gutter={16}>
                <Col xs={24} sm={12} md={6}>
                  <Statistic
                    title="Всего позиций"
                    value={portfolioData.length}
                    prefix={<PieChartOutlined />}
                  />
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Statistic
                    title="Активных позиций"
                    value={activeCount}
                    valueStyle={{ color: '#52c41a' }}
                    prefix={<CheckCircleOutlined />}
                  />
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Statistic
                    title="Неактивных позиций"
                    value={inactiveCount}
                    valueStyle={{ color: '#8c8c8c' }}
                    prefix={<CloseCircleOutlined />}
                  />
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Statistic
                    title="Общая доля"
                    value={totalShare.toFixed(2)}
                    suffix="%"
                    valueStyle={{ color: totalShare === 100 ? '#52c41a' : '#faad14' }}
                  />
                </Col>
              </Row>
            </Card>

            {/* Selected Strategy Info */}
            {strategies.find(s => s.id === selectedStrategyId) && (
              <Card className={styles.strategyInfo} size="small" title="Информация о стратегии">
                <Descriptions column={{ xs: 1, sm: 2, md: 3 }} size="small">
                  <Descriptions.Item label="Название">
                    {strategies.find(s => s.id === selectedStrategyId)?.name}
                  </Descriptions.Item>
                  <Descriptions.Item label="Номер">
                    {strategies.find(s => s.id === selectedStrategyId)?.number}
                  </Descriptions.Item>
                  <Descriptions.Item label="Полное название">
                    {strategies.find(s => s.id === selectedStrategyId)?.full_name}
                  </Descriptions.Item>
                  <Descriptions.Item label="Рынок">
                    {strategies.find(s => s.id === selectedStrategyId)?.market}
                  </Descriptions.Item>
                  <Descriptions.Item label="Инструмент">
                    {strategies.find(s => s.id === selectedStrategyId)?.instrument}
                  </Descriptions.Item>
                  <Descriptions.Item label="Статус">
                    <Tag color={strategies.find(s => s.id === selectedStrategyId)?.is_active ? 'success' : 'default'}>
                      {strategies.find(s => s.id === selectedStrategyId)?.is_active ? 'Активна' : 'Неактивна'}
                    </Tag>
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            )}

            {/* Main Table */}
            <Table
              columns={columns}
              dataSource={portfolioData}
              rowKey="id"
              loading={loading}
              pagination={{
                pageSize: 25,
                showSizeChanger: true,
                pageSizeOptions: ['10', '25', '50', '100'],
                showTotal: (total) => `Всего позиций: ${total}`,
              }}
              scroll={{ x: 3000 }}
              className={styles.table}
              summary={() => (
                <Table.Summary fixed>
                  <Table.Summary.Row style={{ backgroundColor: '#fafafa' }}>
                    <Table.Summary.Cell index={0} colSpan={3}>
                      <strong>Итого:</strong>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={3} align="right">
                      <strong style={{ color: totalShare === 100 ? '#52c41a' : '#faad14' }}>
                        {totalShare.toFixed(2)}%
                      </strong>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={4} colSpan={20} />
                  </Table.Summary.Row>
                </Table.Summary>
              )}
            />
          </>
        )}

        {/* No Data */}
        {selectedStrategyId && !loading && portfolioData.length === 0 && (
          <Alert
            message="Нет данных"
            description="Для выбранной стратегии нет данных модельного портфеля."
            type="warning"
            showIcon
            style={{ marginTop: 16 }}
          />
        )}
      </Card>
    </div>
  );
};

export default ModelPortfolioPage;
