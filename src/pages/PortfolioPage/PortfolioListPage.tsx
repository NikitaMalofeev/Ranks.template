import { useEffect, useState } from 'react';
import {
  Typography,
  Card,
  Table,
  Button,
  Space,
  Select,
  Radio,
  Slider,
  Input,
  Tag,
  Tooltip,
  Popconfirm,
  Row,
  Col,
  message,
  Badge
} from 'antd';
import {
  FileTextOutlined,
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  SyncOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  CopyOutlined,
  ExportOutlined,
  DeleteOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useSelector } from 'react-redux';
import { useAppDispatch } from 'shared/hooks/useAppDispatch';
import {
  fetchReferenceData,
  fetchPortfolios,
  deletePortfolio,
  togglePortfolioStatus,
  setFilters,
  resetFilters,
  selectFilteredPortfolios,
  selectPortfolioLoading,
  selectPortfolioError,
  selectPortfolioFilters,
  PortfolioType,
  PortfolioStatus,
  type Portfolio
} from 'entities/Portfolio';
import styles from './PortfolioListPage.module.scss';

const { Title } = Typography;
const { Search } = Input;

const PortfolioListPage = () => {
  const dispatch = useAppDispatch();
  const portfolios = useSelector(selectFilteredPortfolios);
  const loading = useSelector(selectPortfolioLoading);
  const error = useSelector(selectPortfolioError);
  const filters = useSelector(selectPortfolioFilters);

  const [profitRange, setProfitRange] = useState<[number, number]>([-100, 200]);

  useEffect(() => {
    // Load reference data and portfolios on mount
    dispatch(fetchReferenceData());
    dispatch(fetchPortfolios());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  const handleRefresh = () => {
    dispatch(fetchPortfolios());
  };

  const handleFilterChange = (key: string, value: any) => {
    dispatch(setFilters({ [key]: value }));
  };

  const handleResetFilters = () => {
    dispatch(resetFilters());
    setProfitRange([-100, 200]);
  };

  const handleDelete = async (id: string | number) => {
    try {
      await dispatch(deletePortfolio(id)).unwrap();
      message.success('Портфель успешно удален');
    } catch (err) {
      message.error('Ошибка при удалении портфеля');
    }
  };

  const handleToggleStatus = async (id: string | number) => {
    try {
      await dispatch(togglePortfolioStatus(id)).unwrap();
      message.success('Статус портфеля изменен');
    } catch (err) {
      message.error('Ошибка при изменении статуса');
    }
  };

  const handleViewDetails = (record: Portfolio) => {
    message.info(`Просмотр портфеля: ${record.name}`);
    // TODO: Navigate to portfolio details page
  };

  const handleEdit = (record: Portfolio) => {
    message.info(`Редактирование портфеля: ${record.name}`);
    // TODO: Navigate to portfolio edit page
  };

  const handleRebalance = (record: Portfolio) => {
    message.info(`Запуск ребалансировки портфеля: ${record.name}`);
    // TODO: Open rebalance modal
  };

  const handleDuplicate = (record: Portfolio) => {
    message.info(`Дублирование портфеля: ${record.name}`);
    // TODO: Implement duplicate logic
  };

  const handleExport = (record: Portfolio) => {
    message.info(`Экспорт портфеля: ${record.name}`);
    // TODO: Implement export logic
  };

  const getPortfolioTypeLabel = (type: PortfolioType) => {
    const typeLabels = {
      [PortfolioType.AGGRESSIVE]: 'Агрессивный',
      [PortfolioType.MODERATE]: 'Умеренный',
      [PortfolioType.CONSERVATIVE]: 'Консервативный',
      [PortfolioType.BALANCED]: 'Сбалансированный'
    };
    return typeLabels[type] || type;
  };

  const getPortfolioTypeColor = (type: PortfolioType) => {
    const colorMap = {
      [PortfolioType.AGGRESSIVE]: 'red',
      [PortfolioType.MODERATE]: 'orange',
      [PortfolioType.CONSERVATIVE]: 'blue',
      [PortfolioType.BALANCED]: 'green'
    };
    return colorMap[type] || 'default';
  };

  const columns: ColumnsType<Portfolio> = [
    {
      title: 'Название',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      width: 200,
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: 'Тип',
      dataIndex: 'type',
      key: 'type',
      sorter: (a, b) => a.type.localeCompare(b.type),
      width: 150,
      render: (type: PortfolioType) => (
        <Tag color={getPortfolioTypeColor(type)}>
          {getPortfolioTypeLabel(type)}
        </Tag>
      ),
    },
    {
      title: 'Кол-во инструментов',
      dataIndex: 'instrumentsCount',
      key: 'instrumentsCount',
      sorter: (a, b) => a.instrumentsCount - b.instrumentsCount,
      width: 150,
      align: 'center',
    },
    {
      title: 'Общая стоимость',
      dataIndex: 'totalValue',
      key: 'totalValue',
      sorter: (a, b) => a.totalValue - b.totalValue,
      width: 150,
      align: 'right',
      render: (value: number) => `${value.toLocaleString()} ₽`,
    },
    {
      title: 'Доходность (%)',
      dataIndex: 'profitLossPercent',
      key: 'profitLossPercent',
      sorter: (a, b) => a.profitLossPercent - b.profitLossPercent,
      width: 130,
      align: 'right',
      render: (percent: number) => {
        const color = percent >= 0 ? '#52c41a' : '#ff4d4f';
        return (
          <span style={{ color, fontWeight: 'bold' }}>
            {percent >= 0 ? '+' : ''}{percent.toFixed(2)}%
          </span>
        );
      },
    },
    {
      title: 'Доходность (₽)',
      dataIndex: 'profitLoss',
      key: 'profitLoss',
      sorter: (a, b) => a.profitLoss - b.profitLoss,
      width: 150,
      align: 'right',
      render: (value: number) => {
        const color = value >= 0 ? '#52c41a' : '#ff4d4f';
        return (
          <span style={{ color, fontWeight: 'bold' }}>
            {value >= 0 ? '+' : ''}{value.toLocaleString()} ₽
          </span>
        );
      },
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      sorter: (a, b) => a.status.localeCompare(b.status),
      width: 120,
      render: (status: PortfolioStatus) => {
        const statusConfig = {
          [PortfolioStatus.ACTIVE]: { color: 'success', text: 'Активен' },
          [PortfolioStatus.INACTIVE]: { color: 'default', text: 'Неактивен' },
          [PortfolioStatus.DRAFT]: { color: 'warning', text: 'Черновик' }
        };
        const config = statusConfig[status] || statusConfig[PortfolioStatus.DRAFT];
        return <Badge status={config.color as any} text={config.text} />;
      },
    },
    {
      title: 'Дата создания',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      width: 120,
      render: (date: string) => new Date(date).toLocaleDateString('ru-RU'),
    },
    {
      title: 'Последняя ребалансировка',
      dataIndex: 'lastRebalance',
      key: 'lastRebalance',
      sorter: (a, b) => {
        if (!a.lastRebalance) return 1;
        if (!b.lastRebalance) return -1;
        return new Date(a.lastRebalance).getTime() - new Date(b.lastRebalance).getTime();
      },
      width: 180,
      render: (date?: string) => date ? new Date(date).toLocaleDateString('ru-RU') : '—',
    },
    {
      title: 'Действия',
      key: 'actions',
      fixed: 'right',
      width: 280,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Просмотр">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handleViewDetails(record)}
            />
          </Tooltip>
          <Tooltip title="Редактировать">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Ребалансировать">
            <Button
              type="text"
              icon={<SyncOutlined />}
              onClick={() => handleRebalance(record)}
            />
          </Tooltip>
          <Tooltip title={record.status === PortfolioStatus.ACTIVE ? 'Деактивировать' : 'Активировать'}>
            <Button
              type="text"
              icon={record.status === PortfolioStatus.ACTIVE ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
              onClick={() => handleToggleStatus(record.id)}
            />
          </Tooltip>
          <Tooltip title="Дублировать">
            <Button
              type="text"
              icon={<CopyOutlined />}
              onClick={() => handleDuplicate(record)}
            />
          </Tooltip>
          <Tooltip title="Экспорт">
            <Button
              type="text"
              icon={<ExportOutlined />}
              onClick={() => handleExport(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Удалить портфель?"
            description="Вы уверены, что хотите удалить этот портфель?"
            onConfirm={() => handleDelete(record.id)}
            okText="Да"
            cancelText="Нет"
          >
            <Tooltip title="Удалить">
              <Button
                type="text"
                icon={<DeleteOutlined />}
                danger
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.portfolioListPage}>
      <Card>
        <div className={styles.header}>
          <FileTextOutlined className={styles.icon} />
          <Title level={2}>Список портфелей</Title>
        </div>

        {/* Filters Section */}
        <Card className={styles.filtersCard} size="small">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <div className={styles.filterItem}>
                <label>Тип портфеля:</label>
                <Select
                  value={filters.type}
                  onChange={(value) => handleFilterChange('type', value)}
                  style={{ width: '100%' }}
                  options={[
                    { value: 'all', label: 'Все типы' },
                    { value: PortfolioType.AGGRESSIVE, label: 'Агрессивный' },
                    { value: PortfolioType.MODERATE, label: 'Умеренный' },
                    { value: PortfolioType.CONSERVATIVE, label: 'Консервативный' },
                    { value: PortfolioType.BALANCED, label: 'Сбалансированный' },
                  ]}
                />
              </div>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <div className={styles.filterItem}>
                <label>Статус:</label>
                <Radio.Group
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  style={{ width: '100%' }}
                >
                  <Radio.Button value="all">Все</Radio.Button>
                  <Radio.Button value={PortfolioStatus.ACTIVE}>Активные</Radio.Button>
                  <Radio.Button value={PortfolioStatus.INACTIVE}>Неактивные</Radio.Button>
                </Radio.Group>
              </div>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <div className={styles.filterItem}>
                <label>Доходность (%):</label>
                <Slider
                  range
                  min={-100}
                  max={200}
                  value={profitRange}
                  onChange={(value) => {
                    setProfitRange(value as [number, number]);
                    handleFilterChange('profitRange', value);
                  }}
                  marks={{
                    '-100': '-100%',
                    0: '0%',
                    100: '100%',
                    200: '200%'
                  }}
                  tooltip={{ formatter: (value) => `${value}%` }}
                />
              </div>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <div className={styles.filterItem}>
                <label>Поиск:</label>
                <Search
                  placeholder="Поиск по названию..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  allowClear
                />
              </div>
            </Col>
          </Row>
          <Row style={{ marginTop: 16 }}>
            <Col span={24}>
              <Button onClick={handleResetFilters}>Сбросить фильтры</Button>
            </Col>
          </Row>
        </Card>

        {/* Action Buttons */}
        <div className={styles.actionButtons}>
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              size="large"
              onClick={() => message.info('Переход на страницу создания портфеля')}
            >
              Создать новый портфель
            </Button>
            <Button
              icon={<ReloadOutlined spin={loading} />}
              onClick={handleRefresh}
            >
              Обновить
            </Button>
          </Space>
        </div>

        {/* Main Table */}
        <Table
          columns={columns}
          dataSource={portfolios}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 25,
            showSizeChanger: true,
            pageSizeOptions: ['10', '25', '50', '100'],
            showTotal: (total) => `Всего портфелей: ${total}`,
          }}
          scroll={{ x: 1800 }}
          className={styles.table}
        />
      </Card>
    </div>
  );
};

export default PortfolioListPage;
