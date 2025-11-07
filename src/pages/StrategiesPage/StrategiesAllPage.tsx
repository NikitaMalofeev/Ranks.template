import { useEffect, useState } from 'react';
import {
  Typography,
  Card,
  Table,
  Button,
  Space,
  Tag,
  Input,
  Select,
  Row,
  Col,
  Statistic,
  message,
  Modal,
  Form,
  InputNumber,
  Switch,
  Tooltip,
  Badge
} from 'antd';
import {
  FileTextOutlined,
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  FilterOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useAppDispatch, useAppSelector } from 'app/providers/store/config/hooks';
import {
  fetchAllStrategies,
  createStrategy,
  updateStrategy,
  deleteStrategyThunk,
  selectStrategies,
  selectPortfolioLoading,
  selectPortfolioError
} from 'entities/Portfolio/slice/portfolioSlice';
import type { Strategy, MarketType, InstrumentType } from 'entities/Portfolio/model/types';
import styles from './StrategiesPage.module.scss';

const { Title } = Typography;
const { Search } = Input;

const StrategiesAllPage = () => {
  const dispatch = useAppDispatch();
  const strategies = useAppSelector(selectStrategies) || [];
  const loading = useAppSelector(selectPortfolioLoading);
  const error = useAppSelector(selectPortfolioError);

  const [searchText, setSearchText] = useState('');
  const [filterType, setFilterType] = useState<'russian' | 'global' | 'all'>('all');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingStrategy, setEditingStrategy] = useState<Strategy | null>(null);
  const [updatedRows, setUpdatedRows] = useState<Set<number>>(new Set());
  const [form] = Form.useForm();

  // Начальная загрузка стратегий
  useEffect(() => {
    dispatch(fetchAllStrategies());
  }, [dispatch]);

  // Поллинг - обновление каждую минуту (60000 мс)
  useEffect(() => {
    const pollInterval = setInterval(async () => {
      try {
        const result = await dispatch(fetchAllStrategies()).unwrap();

        // Определяем какие строки были обновлены
        const newUpdatedIds = new Set<number>();
        result.forEach((newStrategy: Strategy) => {
          const oldStrategy = strategies.find(s => s.id === newStrategy.id);
          if (oldStrategy && oldStrategy.modified !== newStrategy.modified) {
            newUpdatedIds.add(newStrategy.id);
          }
        });

        if (newUpdatedIds.size > 0) {
          setUpdatedRows(newUpdatedIds);
          message.success(`Данные обновлены. Изменено стратегий: ${newUpdatedIds.size}`, 3);

          // Убираем подсветку через 3 секунды
          setTimeout(() => {
            setUpdatedRows(new Set());
          }, 3000);
        } else {
          message.info('Данные обновлены', 2);
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    }, 60000); // 1 минута

    return () => clearInterval(pollInterval);
  }, [dispatch, strategies]);

  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  // Фильтрация стратегий
  const filteredStrategies = strategies.filter((strategy) => {
    const matchesSearch = strategy.name.toLowerCase().includes(searchText.toLowerCase()) ||
                         strategy.description.toLowerCase().includes(searchText.toLowerCase()) ||
                         strategy.full_name.toLowerCase().includes(searchText.toLowerCase());
    const matchesType = filterType === 'all' ||
                        (filterType === 'russian' && strategy.market === 'market_robo_russian') ||
                        (filterType === 'global' && strategy.market === 'market_robo_usa');
    return matchesSearch && matchesType;
  });

  // Статистика
  const stats = {
    total: strategies.length,
    russian: strategies.filter(s => s.market === 'market_robo_russian').length,
    usa: strategies.filter(s => s.market === 'market_robo_usa').length,
    active: strategies.filter(s => s.is_active).length
  };

  const handleEdit = (strategy: Strategy) => {
    setEditingStrategy(strategy);
    form.setFieldsValue(strategy);
    setIsModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: 'Удалить стратегию?',
      content: 'Вы уверены, что хотите удалить эту стратегию?',
      okText: 'Удалить',
      okType: 'danger',
      cancelText: 'Отмена',
      onOk: async () => {
        try {
          await dispatch(deleteStrategyThunk(id)).unwrap();
          message.success('Стратегия удалена');
        } catch (err) {
          message.error('Ошибка при удалении стратегии');
        }
      }
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();

      if (editingStrategy) {
        // Обновление существующей стратегии
        await dispatch(updateStrategy({ id: editingStrategy.id, data: values })).unwrap();
        message.success('Стратегия обновлена');
      } else {
        // Создание новой стратегии
        await dispatch(createStrategy(values)).unwrap();
        message.success('Стратегия создана');
      }

      setIsModalVisible(false);
      form.resetFields();
      setEditingStrategy(null);
    } catch (err) {
      message.error('Ошибка при сохранении стратегии');
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingStrategy(null);
  };

  const handleRefresh = () => {
    dispatch(fetchAllStrategies());
    message.success('Данные обновлены');
  };

  const getMarketTag = (market: MarketType) => {
    const config = {
      market_robo_usa: { color: 'blue', text: 'США' },
      market_robo_russian: { color: 'green', text: 'Россия' }
    };
    const marketConfig = config[market] || { color: 'default', text: 'Не указан' };
    return <Tag color={marketConfig.color}>{marketConfig.text}</Tag>;
  };

  const getInstrumentTag = (instrument: InstrumentType) => {
    const config = {
      instrument_bonds: { color: 'gold', text: 'Облигации' },
      instrument_shares: { color: 'cyan', text: 'Акции' }
    };
    const instrumentConfig = config[instrument] || { color: 'default', text: 'Не указан' };
    return <Tag color={instrumentConfig.color}>{instrumentConfig.text}</Tag>;
  };

  const columns: ColumnsType<Strategy> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      sorter: (a, b) => a.id - b.id,
      fixed: 'left'
    },
    {
      title: 'Название',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      fixed: 'left',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (name) => <strong>{name}</strong>
    },
    {
      title: 'Номер',
      dataIndex: 'number',
      key: 'number',
      width: 100,
      sorter: (a, b) => a.number.localeCompare(b.number),
      render: (number) => <Tag color="purple">{number}</Tag>
    },
    {
      title: 'Полное название',
      dataIndex: 'full_name',
      key: 'full_name',
      width: 250,
      sorter: (a, b) => a.full_name.localeCompare(b.full_name),
    },
    {
      title: 'Статус',
      dataIndex: 'is_active',
      key: 'is_active',
      width: 120,
      filters: [
        { text: 'Активна', value: true },
        { text: 'Неактивна', value: false }
      ],
      onFilter: (value, record) => record.is_active === value,
      render: (is_active) => (
        <Tag color={is_active ? 'success' : 'default'}>
          {is_active ? 'Активна' : 'Неактивна'}
        </Tag>
      )
    },
    {
      title: 'Рынок',
      dataIndex: 'market',
      key: 'market',
      width: 130,
      filters: [
        { text: 'США', value: 'market_robo_usa' },
        { text: 'Россия', value: 'market_robo_russian' }
      ],
      onFilter: (value, record) => record.market === value,
      render: (market) => getMarketTag(market)
    },
    {
      title: 'Инструмент',
      dataIndex: 'instrument',
      key: 'instrument',
      width: 140,
      filters: [
        { text: 'Облигации', value: 'instrument_bonds' },
        { text: 'Акции', value: 'instrument_shares' }
      ],
      onFilter: (value, record) => record.instrument === value,
      render: (instrument) => getInstrumentTag(instrument)
    },
    {
      title: 'Описание',
      dataIndex: 'description',
      key: 'description',
      width: 250,
      ellipsis: true,
      render: (text) => (
        <Tooltip title={text}>
          {text || '-'}
        </Tooltip>
      )
    },
    {
      title: 'Дата создания',
      dataIndex: 'created',
      key: 'created',
      width: 150,
      sorter: (a, b) => {
        if (!a.created) return 1;
        if (!b.created) return -1;
        return new Date(a.created).getTime() - new Date(b.created).getTime();
      },
      render: (date) => date ? new Date(date).toLocaleString('ru-RU') : '-'
    },
    {
      title: 'Дата изменения',
      dataIndex: 'modified',
      key: 'modified',
      width: 150,
      sorter: (a, b) => {
        if (!a.modified) return 1;
        if (!b.modified) return -1;
        return new Date(a.modified).getTime() - new Date(b.modified).getTime();
      },
      render: (date) => date ? new Date(date).toLocaleString('ru-RU') : '-'
    },
    {
      title: 'Действия',
      key: 'actions',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Изменить
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            Удалить
          </Button>
        </Space>
      )
    }
  ];

  return (
    <div className={styles.strategiesPage}>
      <Card>
        <div className={styles.header}>
          <FileTextOutlined className={styles.icon} />
          <Title level={2}>Все стратегии</Title>
        </div>

        {/* Статистика */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={6}>
            <Card>
              <Statistic title="Всего стратегий" value={stats.total} />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Российские"
                value={stats.russian}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="США"
                value={stats.usa}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Активные"
                value={stats.active}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Фильтры и поиск */}
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={12}>
            <Search
              placeholder="Поиск по названию или описанию"
              allowClear
              enterButton={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onSearch={(value) => setSearchText(value)}
            />
          </Col>
          <Col span={6}>
            <Select
              style={{ width: '100%' }}
              placeholder="Фильтр по рынку"
              value={filterType}
              onChange={setFilterType}
              suffixIcon={<FilterOutlined />}
            >
              <Select.Option value="all">Все рынки</Select.Option>
              <Select.Option value="russian">Россия</Select.Option>
              <Select.Option value="global">США</Select.Option>
            </Select>
          </Col>
          <Col span={6}>
            <Space>
              <Button
                icon={<ReloadOutlined />}
                onClick={handleRefresh}
                loading={loading}
              >
                Обновить
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setIsModalVisible(true)}
              >
                Создать
              </Button>
            </Space>
          </Col>
        </Row>

        {/* Таблица */}
        <Table
          columns={columns}
          dataSource={filteredStrategies}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Всего: ${total}`
          }}
          scroll={{ x: 1600 }}
          rowClassName={(record) =>
            updatedRows.has(record.id) ? styles.updatedRow : ''
          }
        />

        {/* Модальное окно редактирования */}
        <Modal
          title={editingStrategy ? 'Редактировать стратегию' : 'Создать стратегию'}
          open={isModalVisible}
          onOk={handleModalOk}
          onCancel={handleModalCancel}
          width={600}
        >
          <Form form={form} layout="vertical">
            <Row gutter={16}>
              <Col span={16}>
                <Form.Item
                  name="name"
                  label="Название"
                  rules={[{ required: true, message: 'Введите название стратегии' }]}
                >
                  <Input placeholder="Название стратегии" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="number"
                  label="Номер"
                  rules={[{ required: true, message: 'Введите номер' }]}
                >
                  <Input placeholder="1F, 2S..." />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name="description" label="Описание">
              <Input.TextArea rows={3} placeholder="Описание стратегии" />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="market" label="Рынок" rules={[{ required: true }]}>
                  <Select placeholder="Выберите рынок">
                    <Select.Option value="market_robo_russian">Россия</Select.Option>
                    <Select.Option value="market_robo_usa">США</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="instrument" label="Инструмент" rules={[{ required: true }]}>
                  <Select placeholder="Выберите инструмент">
                    <Select.Option value="instrument_bonds">Облигации</Select.Option>
                    <Select.Option value="instrument_shares">Акции</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name="is_active" label="Активна" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </div>
  );
};

export default StrategiesAllPage;
