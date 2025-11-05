import { useEffect, useState } from 'react';
import { Typography, Card, Form, Select, Button, Table, InputNumber, Switch, Space, message, Radio, Divider } from 'antd';
import { FileOutlined, PlusOutlined, DeleteOutlined, SaveOutlined, EditOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from 'app/providers/store/config/hooks';
import {
  fetchAllStrategies,
  addModelPortfolio,
  viewModelPortfolio,
  updateModelPortfolioItem,
  selectStrategies,
  selectModelPortfolio,
  selectPortfolioLoading,
  selectPortfolioError
} from 'entities/Portfolio/slice/portfolioSlice';
import type { ModelPortfolioItem } from 'entities/Portfolio/model/types';
import styles from './PortfolioPage.module.scss';

const { Title } = Typography;

type Mode = 'create' | 'edit';

const PortfolioCreatePage = () => {
  const dispatch = useAppDispatch();
  const strategies = useAppSelector(selectStrategies) || [];
  const modelPortfolio = useAppSelector(selectModelPortfolio);
  const loading = useAppSelector(selectPortfolioLoading);
  const error = useAppSelector(selectPortfolioError);

  const [form] = Form.useForm();
  const [mode, setMode] = useState<Mode>('create');
  const [selectedStrategy, setSelectedStrategy] = useState<number | null>(null);
  const [portfolioItems, setPortfolioItems] = useState<ModelPortfolioItem[]>([]);

  useEffect(() => {
    dispatch(fetchAllStrategies());
  }, [dispatch]);

  useEffect(() => {
    if (selectedStrategy && mode === 'edit') {
      // В режиме редактирования загружаем существующий портфель
      dispatch(viewModelPortfolio({ id_strategy: selectedStrategy })).then((result) => {
        if (result.meta.requestStatus === 'fulfilled' && result.payload) {
          const data = result.payload as any;
          setPortfolioItems(data.items || []);
        }
      });
    } else if (selectedStrategy && mode === 'create') {
      // В режиме создания начинаем с пустого списка
      setPortfolioItems([]);
    }
  }, [selectedStrategy, mode, dispatch]);

  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
    setSelectedStrategy(null);
    setPortfolioItems([]);
  };

  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  const handleStrategyChange = (value: number) => {
    setSelectedStrategy(value);
  };

  const handleAddItem = () => {
    const newItem: ModelPortfolioItem = {
      is_active: true,
      isin: '',
      share: 0
    };
    setPortfolioItems([...portfolioItems, newItem]);
  };

  const handleDeleteItem = (index: number) => {
    const newItems = portfolioItems.filter((_, i) => i !== index);
    setPortfolioItems(newItems);
  };

  const handleItemChange = (index: number, field: keyof ModelPortfolioItem, value: any) => {
    const newItems = [...portfolioItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setPortfolioItems(newItems);
  };

  const handleSubmit = async () => {
    if (!selectedStrategy) {
      message.warning('Выберите стратегию');
      return;
    }

    const validItems = portfolioItems.filter(item => item.isin && item.share > 0);

    if (validItems.length === 0) {
      message.warning('Добавьте хотя бы один инструмент');
      return;
    }

    try {
      await dispatch(addModelPortfolio({
        id_strategy: selectedStrategy,
        items: validItems
      })).unwrap();
      message.success('Модельный портфель успешно добавлен');
    } catch (err) {
      message.error('Ошибка при добавлении модельного портфеля');
    }
  };

  const handleUpdateItem = async (itemId: number, newShare: number) => {
    try {
      await dispatch(updateModelPortfolioItem({
        id_item: itemId,
        edit_share: newShare
      })).unwrap();
      message.success('Элемент успешно обновлен');
    } catch (err) {
      message.error('Ошибка при обновлении элемента');
    }
  };

  const columns = [
    {
      title: 'Активен',
      dataIndex: 'is_active',
      key: 'is_active',
      width: 100,
      render: (_: any, __: any, index: number) => (
        <Switch
          checked={portfolioItems[index]?.is_active || false}
          onChange={(checked) => handleItemChange(index, 'is_active', checked)}
        />
      ),
    },
    {
      title: 'ISIN',
      dataIndex: 'isin',
      key: 'isin',
      render: (_: any, __: any, index: number) => (
        <input
          type="text"
          value={portfolioItems[index]?.isin || ''}
          onChange={(e) => handleItemChange(index, 'isin', e.target.value)}
          placeholder="Введите ISIN"
          style={{ width: '100%', padding: '4px 8px', border: '1px solid #d9d9d9', borderRadius: '2px' }}
        />
      ),
    },
    {
      title: 'Доля (%)',
      dataIndex: 'share',
      key: 'share',
      width: 150,
      render: (_: any, __: any, index: number) => (
        <InputNumber
          min={0}
          max={100}
          value={portfolioItems[index]?.share || 0}
          onChange={(value) => handleItemChange(index, 'share', value || 0)}
          style={{ width: '100%' }}
        />
      ),
    },
    {
      title: 'Действия',
      key: 'actions',
      width: mode === 'edit' ? 180 : 100,
      render: (_: any, record: any, index: number) => (
        <Space>
          {mode === 'edit' && record.id && (
            <Button
              size="small"
              type="primary"
              icon={<SaveOutlined />}
              onClick={() => handleUpdateItem(record.id, portfolioItems[index]?.share || 0)}
            >
              Обновить
            </Button>
          )}
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteItem(index)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.portfolioPage}>
      <Card>
        <div className={styles.header}>
          <FileOutlined className={styles.icon} />
          <Title level={2}>Ввод модельного портфеля</Title>
        </div>

        <Form form={form} layout="vertical">
          <Form.Item label="Режим работы">
            <Radio.Group
              value={mode}
              onChange={(e) => handleModeChange(e.target.value)}
              buttonStyle="solid"
            >
              <Radio.Button value="create">
                <PlusOutlined /> Создать новый
              </Radio.Button>
              <Radio.Button value="edit">
                <EditOutlined /> Редактировать существующий
              </Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Divider />

          <Form.Item label="Выберите стратегию" required>
            <Select
              placeholder="Выберите стратегию"
              onChange={handleStrategyChange}
              loading={loading}
              value={selectedStrategy}
              style={{ width: '100%' }}
            >
              {strategies?.map((strategy) => (
                <Select.Option key={strategy.id} value={strategy.id}>
                  {strategy.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Инструменты">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button
                type="dashed"
                icon={<PlusOutlined />}
                onClick={handleAddItem}
                style={{ marginBottom: 16 }}
              >
                Добавить инструмент
              </Button>

              <Table
                dataSource={portfolioItems}
                columns={columns}
                rowKey={(_, index) => index?.toString() || '0'}
                pagination={false}
                loading={loading}
                locale={{ emptyText: 'Нет инструментов' }}
              />
            </Space>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              onClick={handleSubmit}
              loading={loading}
              disabled={!selectedStrategy || portfolioItems.length === 0}
            >
              {mode === 'create' ? 'Создать модельный портфель' : 'Сохранить изменения'}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default PortfolioCreatePage;
