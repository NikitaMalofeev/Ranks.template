import { useState, lazy, Suspense } from 'react';
import { Layout, Tabs, Card, Table, Typography, Statistic, Row, Col, Button, Modal, Switch, message } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import type { TableColumnsType } from 'antd';
import { useSelector } from 'react-redux';
import { RootState } from 'app/providers/store/config/store';
import { useAppDispatch } from 'shared/hooks/useAppDispatch';
import { toggleMenuItem, selectMenuItems, resetMenuSettings } from 'entities/MenuSettings/slice/menuSettingsSlice';
import { addTab, removeTab, setActiveTab, selectTabs, selectActiveTabKey } from 'entities/Tabs';
import { Sidebar } from 'widgets/Sidebar/Sidebar';
import { Loader } from 'shared/ui/Loader/Loader';
import styles from './AdminPage.module.scss';

// Lazy load new pages
const DashboardPage = lazy(() => import('pages/DashboardPage/DashboardPage'));
const ExecutionsHistoryPage = lazy(() => import('pages/ExecutionsPage/ExecutionsHistoryPage'));
const ExecutionsActivePage = lazy(() => import('pages/ExecutionsPage/ExecutionsActivePage'));
const StrategiesAllPage = lazy(() => import('pages/StrategiesPage/StrategiesAllPage'));
const StrategiesBacktestingPage = lazy(() => import('pages/StrategiesPage/StrategiesBacktestingPage'));
const PortfolioCreatePage = lazy(() => import('pages/PortfolioPage/PortfolioCreatePage'));
const PortfolioListPage = lazy(() => import('pages/PortfolioPage/PortfolioListPage'));
const ModelPortfolioPage = lazy(() => import('pages/PortfolioPage/ModelPortfolioPage'));
const RiskAssessmentPage = lazy(() => import('pages/RiskPage/RiskAssessmentPage'));
const RiskLimitsPage = lazy(() => import('pages/RiskPage/RiskLimitsPage'));
const QuikQuotesPage = lazy(() => import('pages/QuikPage/QuikQuotesPage'));
const QuikOrdersPage = lazy(() => import('pages/QuikPage/QuikOrdersPage'));
const QuikMoneyPage = lazy(() => import('pages/QuikPage/QuikMoneyPage'));
const QuikPortfolioPage = lazy(() => import('pages/QuikPage/QuikPortfolioPage'));
const SettingsPage = lazy(() => import('pages/SettingsPage/SettingsPage'));

const { Content } = Layout;
const { Title } = Typography;

interface InvoiceDataType {
  key: string;
  invoiceNumber: string;
  date: string;
  amount: number;
  status: string;
}

interface UserDataType {
  key: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

interface ProductDataType {
  key: string;
  name: string;
  price: number;
  stock: number;
  category: string;
}

const AdminPage = () => {
  const dispatch = useAppDispatch();
  const menuItems = useSelector(selectMenuItems);
  const panes = useSelector(selectTabs);
  const activeKey = useSelector(selectActiveTabKey);
  const [collapsed, setCollapsed] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Mock data
  const invoicesMonthly: InvoiceDataType[] = [
    { key: '1', invoiceNumber: 'INV-001', date: '2025-01-15', amount: 1500.00, status: 'Оплачен' },
    { key: '2', invoiceNumber: 'INV-002', date: '2025-01-20', amount: 2300.00, status: 'Ожидает' },
    { key: '3', invoiceNumber: 'INV-003', date: '2025-01-25', amount: 3200.00, status: 'Оплачен' },
  ];

  const invoicesYearly: InvoiceDataType[] = [
    { key: '1', invoiceNumber: 'INV-2024-001', date: '2024-12-31', amount: 15000.00, status: 'Оплачен' },
    { key: '2', invoiceNumber: 'INV-2024-002', date: '2024-11-30', amount: 23000.00, status: 'Оплачен' },
  ];

  const usersData: UserDataType[] = [
    { key: '1', name: 'Иван Иванов', email: 'ivan@example.com', role: 'Администратор', status: 'Активен' },
    { key: '2', name: 'Петр Петров', email: 'petr@example.com', role: 'Менеджер', status: 'Активен' },
    { key: '3', name: 'Сидор Сидоров', email: 'sidor@example.com', role: 'Пользователь', status: 'Заблокирован' },
  ];

  const productsData: ProductDataType[] = [
    { key: '1', name: 'Товар А', price: 1500, stock: 50, category: 'Электроника' },
    { key: '2', name: 'Товар Б', price: 800, stock: 120, category: 'Аксессуары' },
    { key: '3', name: 'Товар В', price: 2500, stock: 30, category: 'Электроника' },
  ];

  const invoiceColumns: TableColumnsType<InvoiceDataType> = [
    { title: '№ Счета', dataIndex: 'invoiceNumber', key: 'invoiceNumber' },
    { title: 'Дата', dataIndex: 'date', key: 'date' },
    { title: 'Сумма', dataIndex: 'amount', key: 'amount', render: (amount: number) => `${amount.toFixed(2)} ₽` },
    { title: 'Статус', dataIndex: 'status', key: 'status' },
  ];

  const userColumns: TableColumnsType<UserDataType> = [
    { title: 'Имя', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Роль', dataIndex: 'role', key: 'role' },
    { title: 'Статус', dataIndex: 'status', key: 'status' },
  ];

  const productColumns: TableColumnsType<ProductDataType> = [
    { title: 'Название', dataIndex: 'name', key: 'name' },
    { title: 'Цена', dataIndex: 'price', key: 'price', render: (price: number) => `${price} ₽` },
    { title: 'Остаток', dataIndex: 'stock', key: 'stock' },
    { title: 'Категория', dataIndex: 'category', key: 'category' },
  ];

  const handleMenuSelect = (key: string, label: string) => {
    // Добавляем таб через Redux
    dispatch(addTab({ key, label, closable: true }));
  };

  const handleTabChange = (key: string) => {
    dispatch(setActiveTab(key));
  };

  const handleTabEdit = (targetKey: string | React.MouseEvent | React.KeyboardEvent, action: 'add' | 'remove') => {
    if (action === 'remove') {
      dispatch(removeTab(targetKey as string));
    }
  };

  const renderTabContent = (key: string) => {
    switch (key) {
      // Личный кабинет
      case 'cabinet-profile':
        return (
          <div>
            <Title level={3}>Мой профиль</Title>
            <Row gutter={[16, 16]}>
              <Col xs={24} lg={8}>
                <Card title="Основная информация">
                  <p><strong>ФИО:</strong> Иванов Иван Иванович</p>
                  <p><strong>ID трейдера:</strong> TR-00123</p>
                  <p><strong>Email:</strong> ivanov@example.com</p>
                  <p><strong>Телефон:</strong> +7 (999) 123-45-67</p>
                  <p><strong>Дата регистрации:</strong> 15.01.2023</p>
                  <p><strong>Статус:</strong> <span style={{ color: '#52c41a' }}>Активен</span></p>
                  <p><strong>Уровень доступа:</strong> Senior Trader</p>
                  <p><strong>Рейтинг:</strong> ⭐⭐⭐⭐⭐ (4.9/5.0)</p>
                </Card>
              </Col>
              <Col xs={24} lg={8}>
                <Card title="Торговая статистика">
                  <Statistic title="Активных стратегий" value={12} />
                  <Statistic title="Управляемых портфелей" value={8} />
                  <Statistic title="Клиентов" value={24} />
                  <Statistic title="Общий объем под управлением" value={125000000} suffix="₽" />
                  <Statistic title="Средняя доходность" value={18.5} suffix="%" />
                </Card>
              </Col>
              <Col xs={24} lg={8}>
                <Card title="Финансовые показатели">
                  <Statistic title="Заработано за месяц" value={450000} suffix="₽" />
                  <Statistic title="Заработано за год" value={5400000} suffix="₽" />
                  <Statistic title="Средняя комиссия" value={2.5} suffix="%" />
                  <Statistic title="Успешных сделок" value={87} suffix="%" />
                </Card>
              </Col>
            </Row>
            <Tabs
              style={{ marginTop: 24 }}
              items={[
                {
                  key: 'credentials',
                  label: 'Квалификация и сертификаты',
                  children: (
                    <Card>
                      <ul>
                        <li>Сертифицированный финансовый аналитик (CFA)</li>
                        <li>Аттестат ФСФР серия 1.0</li>
                        <li>Квалификация по работе с деривативами</li>
                        <li>Опыт работы: 8 лет</li>
                      </ul>
                    </Card>
                  ),
                },
                {
                  key: 'achievements',
                  label: 'Достижения',
                  children: (
                    <Card>
                      <p>🏆 Лучший трейдер месяца - Январь 2025</p>
                      <p>🥇 Топ-5 по доходности - 2024 год</p>
                      <p>💎 Премиум трейдер с 2023 года</p>
                      <p>📈 Стабильная доходность 12 месяцев подряд</p>
                    </Card>
                  ),
                },
              ]}
            />
          </div>
        );

      case 'cabinet-strategies':
        return (
          <div>
            <Title level={3}>Мои стратегии</Title>
            <Tabs
              items={[
                {
                  key: 'active',
                  label: 'Активные (12)',
                  children: (
                    <Card>
                      <Table
                        columns={[
                          { title: 'Название', dataIndex: 'name', key: 'name' },
                          { title: 'Тип', dataIndex: 'type', key: 'type' },
                          { title: 'Статус', dataIndex: 'status', key: 'status' },
                          { title: 'Доходность', dataIndex: 'return', key: 'return', render: (val: number) => `${val}%` },
                          { title: 'Риск', dataIndex: 'risk', key: 'risk' },
                          { title: 'AUM', dataIndex: 'aum', key: 'aum', render: (val: number) => `${(val / 1000000).toFixed(1)}M ₽` },
                          { title: 'Клиентов', dataIndex: 'clients', key: 'clients' },
                          { title: 'Запущена', dataIndex: 'started', key: 'started' },
                        ]}
                        dataSource={[
                          { key: '1', name: 'Momentum Pro', type: 'Momentum', status: 'Активна', return: 24.5, risk: 'Средний', aum: 15000000, clients: 8, started: '15.06.2024' },
                          { key: '2', name: 'Arbitrage Master', type: 'Арбитраж', status: 'Активна', return: 18.2, risk: 'Низкий', aum: 25000000, clients: 12, started: '20.03.2024' },
                          { key: '3', name: 'Value Growth', type: 'Value', status: 'Активна', return: 21.8, risk: 'Средний', aum: 18000000, clients: 6, started: '10.01.2024' },
                          { key: '4', name: 'Dividend Plus', type: 'Dividend', status: 'Активна', return: 15.3, risk: 'Низкий', aum: 30000000, clients: 15, started: '05.02.2023' },
                        ]}
                      />
                    </Card>
                  ),
                },
                {
                  key: 'paused',
                  label: 'На паузе (3)',
                  children: (
                    <Card>
                      <Table
                        columns={[
                          { title: 'Название', dataIndex: 'name', key: 'name' },
                          { title: 'Причина паузы', dataIndex: 'reason', key: 'reason' },
                          { title: 'Дата паузы', dataIndex: 'pauseDate', key: 'pauseDate' },
                          { title: 'Доходность до паузы', dataIndex: 'return', key: 'return', render: (val: number) => `${val}%` },
                        ]}
                        dataSource={[
                          { key: '1', name: 'Tech Focus', reason: 'Ребалансировка', pauseDate: '10.01.2025', return: 16.8 },
                        ]}
                      />
                    </Card>
                  ),
                },
                {
                  key: 'performance',
                  label: 'Производительность',
                  children: (
                    <Card>
                      <Row gutter={[16, 16]}>
                        <Col span={6}>
                          <Statistic title="Средняя доходность" value={19.5} suffix="%" />
                        </Col>
                        <Col span={6}>
                          <Statistic title="Лучшая стратегия" value={24.5} suffix="%" />
                        </Col>
                        <Col span={6}>
                          <Statistic title="Sharpe Ratio (средний)" value={1.85} precision={2} />
                        </Col>
                        <Col span={6}>
                          <Statistic title="Max Drawdown" value={8.2} suffix="%" />
                        </Col>
                      </Row>
                    </Card>
                  ),
                },
              ]}
            />
          </div>
        );

      case 'cabinet-portfolios':
        return (
          <div>
            <Title level={3}>Мои портфели</Title>
            <Tabs
              items={[
                {
                  key: 'all',
                  label: 'Все портфели (8)',
                  children: (
                    <Card>
                      <Table
                        columns={[
                          { title: 'Название', dataIndex: 'name', key: 'name' },
                          { title: 'Клиент', dataIndex: 'client', key: 'client' },
                          { title: 'Стоимость', dataIndex: 'value', key: 'value', render: (val: number) => `${(val / 1000000).toFixed(2)}M ₽` },
                          { title: 'Активов', dataIndex: 'assets', key: 'assets' },
                          { title: 'Доходность', dataIndex: 'return', key: 'return', render: (val: number) => `${val}%` },
                          { title: 'Риск-профиль', dataIndex: 'riskProfile', key: 'riskProfile' },
                          { title: 'Последнее обновление', dataIndex: 'lastUpdate', key: 'lastUpdate' },
                        ]}
                        dataSource={[
                          { key: '1', name: 'Портфель А', client: 'ООО "Инвест"', value: 25000000, assets: 15, return: 22.3, riskProfile: 'Умеренный', lastUpdate: '14.01.2025' },
                          { key: '2', name: 'Портфель Б', client: 'Петров П.П.', value: 8000000, assets: 8, return: 18.5, riskProfile: 'Консервативный', lastUpdate: '14.01.2025' },
                          { key: '3', name: 'Портфель В', client: 'ООО "Капитал"', value: 35000000, assets: 22, return: 25.8, riskProfile: 'Агрессивный', lastUpdate: '13.01.2025' },
                        ]}
                      />
                    </Card>
                  ),
                },
                {
                  key: 'by-risk',
                  label: 'По риск-профилю',
                  children: (
                    <Card>
                      <Row gutter={[16, 16]}>
                        <Col span={8}>
                          <Card title="Консервативные (2)">
                            <Statistic value={43000000} suffix="₽" />
                            <p>Средняя доходность: 15.5%</p>
                          </Card>
                        </Col>
                        <Col span={8}>
                          <Card title="Умеренные (4)">
                            <Statistic value={62000000} suffix="₽" />
                            <p>Средняя доходность: 19.8%</p>
                          </Card>
                        </Col>
                        <Col span={8}>
                          <Card title="Агрессивные (2)">
                            <Statistic value={20000000} suffix="₽" />
                            <p>Средняя доходность: 24.2%</p>
                          </Card>
                        </Col>
                      </Row>
                    </Card>
                  ),
                },
                {
                  key: 'allocation',
                  label: 'Распределение активов',
                  children: (
                    <Card>
                      <p>Общая структура портфелей:</p>
                      <ul>
                        <li>Акции: 45%</li>
                        <li>Облигации: 30%</li>
                        <li>Деривативы: 15%</li>
                        <li>Наличные: 10%</li>
                      </ul>
                    </Card>
                  ),
                },
              ]}
            />
          </div>
        );

      case 'cabinet-clients':
        return (
          <div>
            <Title level={3}>Мои клиенты</Title>
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
              <Col span={6}>
                <Card>
                  <Statistic title="Всего клиентов" value={24} />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic title="Активных" value={22} />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic title="VIP клиентов" value={5} />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic title="Новых за месяц" value={3} />
                </Card>
              </Col>
            </Row>
            <Tabs
              items={[
                {
                  key: 'all-clients',
                  label: 'Все клиенты',
                  children: (
                    <Card>
                      <Table
                        columns={[
                          { title: 'Клиент', dataIndex: 'name', key: 'name' },
                          { title: 'Тип', dataIndex: 'type', key: 'type' },
                          { title: 'Портфелей', dataIndex: 'portfolios', key: 'portfolios' },
                          { title: 'AUM', dataIndex: 'aum', key: 'aum', render: (val: number) => `${(val / 1000000).toFixed(1)}M ₽` },
                          { title: 'Доходность', dataIndex: 'return', key: 'return', render: (val: number) => `${val}%` },
                          { title: 'С нами с', dataIndex: 'since', key: 'since' },
                          { title: 'Статус', dataIndex: 'status', key: 'status' },
                        ]}
                        dataSource={[
                          { key: '1', name: 'ООО "Инвест Групп"', type: 'Юр. лицо', portfolios: 3, aum: 45000000, return: 21.5, since: '15.03.2023', status: 'VIP' },
                          { key: '2', name: 'Петров Петр Петрович', type: 'Физ. лицо', portfolios: 1, aum: 8000000, return: 18.3, since: '20.06.2023', status: 'Активен' },
                          { key: '3', name: 'ООО "Капитал Инвест"', type: 'Юр. лицо', portfolios: 2, aum: 35000000, return: 24.8, since: '10.01.2024', status: 'VIP' },
                          { key: '4', name: 'Сидоров Сидор Сидорович', type: 'Физ. лицо', portfolios: 1, aum: 5000000, return: 16.2, since: '15.08.2024', status: 'Активен' },
                        ]}
                      />
                    </Card>
                  ),
                },
                {
                  key: 'vip',
                  label: 'VIP клиенты (5)',
                  children: (
                    <Card>
                      <Table
                        columns={[
                          { title: 'Клиент', dataIndex: 'name', key: 'name' },
                          { title: 'AUM', dataIndex: 'aum', key: 'aum', render: (val: number) => `${(val / 1000000).toFixed(1)}M ₽` },
                          { title: 'Доходность YTD', dataIndex: 'ytd', key: 'ytd', render: (val: number) => `${val}%` },
                          { title: 'Менеджер', dataIndex: 'manager', key: 'manager' },
                        ]}
                        dataSource={[
                          { key: '1', name: 'ООО "Инвест Групп"', aum: 45000000, ytd: 21.5, manager: 'Иванов И.И.' },
                          { key: '2', name: 'ООО "Капитал Инвест"', aum: 35000000, ytd: 24.8, manager: 'Иванов И.И.' },
                        ]}
                      />
                    </Card>
                  ),
                },
                {
                  key: 'new',
                  label: 'Новые клиенты',
                  children: (
                    <Card>
                      <p>Клиенты, присоединившиеся за последние 30 дней:</p>
                      <ul>
                        <li>Иванова А.А. - 05.01.2025 (3M ₽)</li>
                        <li>ООО "Новый Капитал" - 08.01.2025 (12M ₽)</li>
                        <li>Козлов К.К. - 12.01.2025 (5M ₽)</li>
                      </ul>
                    </Card>
                  ),
                },
              ]}
            />
          </div>
        );

      case 'cabinet-statistics':
        return (
          <div>
            <Title level={3}>Моя статистика</Title>
            <Tabs
              items={[
                {
                  key: 'overall',
                  label: 'Общая статистика',
                  children: (
                    <>
                      <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12} md={6}>
                          <Card>
                            <Statistic title="Всего сделок" value={1248} />
                          </Card>
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                          <Card>
                            <Statistic title="Успешных сделок" value={1086} />
                          </Card>
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                          <Card>
                            <Statistic title="Win Rate" value={87} suffix="%" />
                          </Card>
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                          <Card>
                            <Statistic title="Profit Factor" value={2.35} precision={2} />
                          </Card>
                        </Col>
                      </Row>
                      <Card title="Доходность по месяцам" style={{ marginTop: 16 }}>
                        <Table
                          columns={[
                            { title: 'Месяц', dataIndex: 'month', key: 'month' },
                            { title: 'Доходность', dataIndex: 'return', key: 'return', render: (val: number) => `${val}%` },
                            { title: 'Сделок', dataIndex: 'trades', key: 'trades' },
                            { title: 'Прибыль', dataIndex: 'profit', key: 'profit', render: (val: number) => `${val.toLocaleString()} ₽` },
                          ]}
                          dataSource={[
                            { key: '1', month: 'Январь 2025', return: 3.2, trades: 145, profit: 420000 },
                            { key: '2', month: 'Декабрь 2024', return: 2.8, trades: 138, profit: 380000 },
                            { key: '3', month: 'Ноябрь 2024', return: 4.1, trades: 152, profit: 520000 },
                          ]}
                        />
                      </Card>
                    </>
                  ),
                },
                {
                  key: 'by-strategy',
                  label: 'По стратегиям',
                  children: (
                    <Card>
                      <Table
                        columns={[
                          { title: 'Стратегия', dataIndex: 'strategy', key: 'strategy' },
                          { title: 'Сделок', dataIndex: 'trades', key: 'trades' },
                          { title: 'Успешных', dataIndex: 'successful', key: 'successful' },
                          { title: 'Win Rate', dataIndex: 'winRate', key: 'winRate', render: (val: number) => `${val}%` },
                          { title: 'Доходность', dataIndex: 'return', key: 'return', render: (val: number) => `${val}%` },
                          { title: 'Sharpe Ratio', dataIndex: 'sharpe', key: 'sharpe' },
                        ]}
                        dataSource={[
                          { key: '1', strategy: 'Momentum Pro', trades: 385, successful: 342, winRate: 88.8, return: 24.5, sharpe: 1.92 },
                          { key: '2', strategy: 'Arbitrage Master', trades: 520, successful: 468, winRate: 90.0, return: 18.2, sharpe: 2.15 },
                          { key: '3', strategy: 'Value Growth', trades: 245, successful: 198, winRate: 80.8, return: 21.8, sharpe: 1.75 },
                        ]}
                      />
                    </Card>
                  ),
                },
                {
                  key: 'risk-metrics',
                  label: 'Риск-метрики',
                  children: (
                    <Card>
                      <Row gutter={[16, 16]}>
                        <Col span={8}>
                          <Statistic title="Max Drawdown" value={8.2} suffix="%" />
                        </Col>
                        <Col span={8}>
                          <Statistic title="Volatility" value={12.5} suffix="%" />
                        </Col>
                        <Col span={8}>
                          <Statistic title="VaR (95%)" value={125000} suffix="₽" />
                        </Col>
                        <Col span={8}>
                          <Statistic title="Sharpe Ratio" value={1.85} precision={2} />
                        </Col>
                        <Col span={8}>
                          <Statistic title="Sortino Ratio" value={2.45} precision={2} />
                        </Col>
                        <Col span={8}>
                          <Statistic title="Calmar Ratio" value={2.85} precision={2} />
                        </Col>
                      </Row>
                    </Card>
                  ),
                },
              ]}
            />
          </div>
        );

      case 'cabinet-operations':
        return (
          <div>
            <Title level={3}>История операций</Title>
            <Tabs
              items={[
                {
                  key: 'recent',
                  label: 'Последние операции',
                  children: (
                    <Card>
                      <Table
                        columns={[
                          { title: 'Дата', dataIndex: 'date', key: 'date' },
                          { title: 'Время', dataIndex: 'time', key: 'time' },
                          { title: 'Операция', dataIndex: 'operation', key: 'operation' },
                          { title: 'Актив', dataIndex: 'asset', key: 'asset' },
                          { title: 'Количество', dataIndex: 'quantity', key: 'quantity' },
                          { title: 'Цена', dataIndex: 'price', key: 'price', render: (val: number) => `${val.toLocaleString()} ₽` },
                          { title: 'Сумма', dataIndex: 'amount', key: 'amount', render: (val: number) => `${val.toLocaleString()} ₽` },
                          { title: 'Портфель', dataIndex: 'portfolio', key: 'portfolio' },
                        ]}
                        dataSource={[
                          { key: '1', date: '15.01.2025', time: '10:25:30', operation: 'Покупка', asset: 'SBER', quantity: 100, price: 285.50, amount: 28550, portfolio: 'Портфель А' },
                          { key: '2', date: '15.01.2025', time: '11:15:45', operation: 'Продажа', asset: 'GAZP', quantity: 50, price: 168.20, amount: 8410, portfolio: 'Портфель Б' },
                          { key: '3', date: '14.01.2025', time: '14:30:12', operation: 'Покупка', asset: 'YNDX', quantity: 20, price: 3250.00, amount: 65000, portfolio: 'Портфель В' },
                        ]}
                      />
                    </Card>
                  ),
                },
                {
                  key: 'by-type',
                  label: 'По типу операций',
                  children: (
                    <Card>
                      <Row gutter={[16, 16]}>
                        <Col span={6}>
                          <Card>
                            <Statistic title="Покупки" value={685} />
                            <p>Объем: 52M ₽</p>
                          </Card>
                        </Col>
                        <Col span={6}>
                          <Card>
                            <Statistic title="Продажи" value={563} />
                            <p>Объем: 48M ₽</p>
                          </Card>
                        </Col>
                        <Col span={6}>
                          <Card>
                            <Statistic title="Дивиденды" value={42} />
                            <p>Получено: 1.2M ₽</p>
                          </Card>
                        </Col>
                        <Col span={6}>
                          <Card>
                            <Statistic title="Комиссии" value={245} />
                            <p>Уплачено: 380K ₽</p>
                          </Card>
                        </Col>
                      </Row>
                    </Card>
                  ),
                },
                {
                  key: 'by-period',
                  label: 'По периодам',
                  children: (
                    <Card>
                      <Table
                        columns={[
                          { title: 'Период', dataIndex: 'period', key: 'period' },
                          { title: 'Операций', dataIndex: 'count', key: 'count' },
                          { title: 'Объем', dataIndex: 'volume', key: 'volume', render: (val: number) => `${(val / 1000000).toFixed(1)}M ₽` },
                          { title: 'Прибыль/Убыток', dataIndex: 'pnl', key: 'pnl', render: (val: number) => `${val > 0 ? '+' : ''}${val.toLocaleString()} ₽` },
                        ]}
                        dataSource={[
                          { key: '1', period: 'Сегодня', count: 15, volume: 2500000, pnl: 125000 },
                          { key: '2', period: 'Эта неделя', count: 89, volume: 15000000, pnl: 680000 },
                          { key: '3', period: 'Этот месяц', count: 245, volume: 52000000, pnl: 2400000 },
                        ]}
                      />
                    </Card>
                  ),
                },
              ]}
            />
          </div>
        );

      case 'cabinet-commissions':
        return (
          <div>
            <Title level={3}>Комиссии и выплаты</Title>
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
              <Col span={6}>
                <Card>
                  <Statistic title="Заработано в январе" value={450000} suffix="₽" />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic title="Заработано в 2025" value={450000} suffix="₽" />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic title="Средняя комиссия" value={2.5} suffix="%" />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic title="К выплате" value={420000} suffix="₽" />
                </Card>
              </Col>
            </Row>
            <Tabs
              items={[
                {
                  key: 'earnings',
                  label: 'История выплат',
                  children: (
                    <Card>
                      <Table
                        columns={[
                          { title: 'Дата', dataIndex: 'date', key: 'date' },
                          { title: 'Период', dataIndex: 'period', key: 'period' },
                          { title: 'Комиссия управления', dataIndex: 'managementFee', key: 'managementFee', render: (val: number) => `${val.toLocaleString()} ₽` },
                          { title: 'Комиссия успеха', dataIndex: 'successFee', key: 'successFee', render: (val: number) => `${val.toLocaleString()} ₽` },
                          { title: 'Итого', dataIndex: 'total', key: 'total', render: (val: number) => `${val.toLocaleString()} ₽` },
                          { title: 'Статус', dataIndex: 'status', key: 'status' },
                        ]}
                        dataSource={[
                          { key: '1', date: '10.01.2025', period: 'Декабрь 2024', managementFee: 280000, successFee: 150000, total: 430000, status: 'Выплачено' },
                          { key: '2', date: '10.12.2024', period: 'Ноябрь 2024', managementFee: 260000, successFee: 180000, total: 440000, status: 'Выплачено' },
                          { key: '3', date: '10.11.2024', period: 'Октябрь 2024', managementFee: 270000, successFee: 160000, total: 430000, status: 'Выплачено' },
                        ]}
                      />
                    </Card>
                  ),
                },
                {
                  key: 'breakdown',
                  label: 'Детализация по клиентам',
                  children: (
                    <Card>
                      <Table
                        columns={[
                          { title: 'Клиент', dataIndex: 'client', key: 'client' },
                          { title: 'AUM', dataIndex: 'aum', key: 'aum', render: (val: number) => `${(val / 1000000).toFixed(1)}M ₽` },
                          { title: 'Ставка управления', dataIndex: 'mgmtRate', key: 'mgmtRate', render: (val: number) => `${val}%` },
                          { title: 'Ставка успеха', dataIndex: 'successRate', key: 'successRate', render: (val: number) => `${val}%` },
                          { title: 'Заработано', dataIndex: 'earned', key: 'earned', render: (val: number) => `${val.toLocaleString()} ₽` },
                        ]}
                        dataSource={[
                          { key: '1', client: 'ООО "Инвест Групп"', aum: 45000000, mgmtRate: 2.0, successRate: 20, earned: 185000 },
                          { key: '2', client: 'Петров П.П.', aum: 8000000, mgmtRate: 2.5, successRate: 15, earned: 42000 },
                          { key: '3', client: 'ООО "Капитал Инвест"', aum: 35000000, mgmtRate: 2.0, successRate: 20, earned: 168000 },
                        ]}
                      />
                    </Card>
                  ),
                },
                {
                  key: 'annual',
                  label: 'Годовой отчет',
                  children: (
                    <Card>
                      <Row gutter={[16, 16]}>
                        <Col span={12}>
                          <Statistic title="Всего за 2024" value={5400000} suffix="₽" />
                          <p>Комиссия управления: 3.2M ₽</p>
                          <p>Комиссия успеха: 2.2M ₽</p>
                        </Col>
                        <Col span={12}>
                          <Statistic title="Средний доход/месяц" value={450000} suffix="₽" />
                          <p>Рост к 2023: +15%</p>
                        </Col>
                      </Row>
                    </Card>
                  ),
                },
              ]}
            />
          </div>
        );

      case 'cabinet-documents':
        return (
          <div>
            <Title level={3}>Документы</Title>
            <Tabs
              items={[
                {
                  key: 'contracts',
                  label: 'Договоры',
                  children: (
                    <Card>
                      <Table
                        columns={[
                          { title: 'Номер', dataIndex: 'number', key: 'number' },
                          { title: 'Клиент', dataIndex: 'client', key: 'client' },
                          { title: 'Тип', dataIndex: 'type', key: 'type' },
                          { title: 'Дата заключения', dataIndex: 'date', key: 'date' },
                          { title: 'Статус', dataIndex: 'status', key: 'status' },
                          { title: 'Действие', key: 'action', render: () => <a>Скачать</a> },
                        ]}
                        dataSource={[
                          { key: '1', number: 'ДУ-2024-123', client: 'ООО "Инвест Групп"', type: 'Договор управления', date: '15.03.2023', status: 'Активен' },
                          { key: '2', number: 'ДУ-2024-145', client: 'Петров П.П.', type: 'Договор управления', date: '20.06.2023', status: 'Активен' },
                        ]}
                      />
                    </Card>
                  ),
                },
                {
                  key: 'reports',
                  label: 'Отчеты клиентам',
                  children: (
                    <Card>
                      <Table
                        columns={[
                          { title: 'Период', dataIndex: 'period', key: 'period' },
                          { title: 'Клиент', dataIndex: 'client', key: 'client' },
                          { title: 'Тип отчета', dataIndex: 'type', key: 'type' },
                          { title: 'Дата формирования', dataIndex: 'generated', key: 'generated' },
                          { title: 'Действие', key: 'action', render: () => <a>Скачать</a> },
                        ]}
                        dataSource={[
                          { key: '1', period: 'Декабрь 2024', client: 'ООО "Инвест Групп"', type: 'Ежемесячный', generated: '05.01.2025' },
                          { key: '2', period: 'Q4 2024', client: 'Петров П.П.', type: 'Квартальный', generated: '10.01.2025' },
                        ]}
                      />
                    </Card>
                  ),
                },
                {
                  key: 'certificates',
                  label: 'Сертификаты и лицензии',
                  children: (
                    <Card>
                      <ul>
                        <li>Аттестат ФСФР серия 1.0 - действителен до 15.06.2026</li>
                        <li>Сертификат CFA Level III - бессрочно</li>
                        <li>Квалификация по деривативам - действительна до 20.12.2025</li>
                        <li>Лицензия на брокерскую деятельность - действительна до 30.06.2027</li>
                      </ul>
                    </Card>
                  ),
                },
              ]}
            />
          </div>
        );

      case 'cabinet-performance':
        return (
          <div>
            <Title level={3}>Производительность</Title>
            <Tabs
              items={[
                {
                  key: 'kpi',
                  label: 'KPI',
                  children: (
                    <>
                      <Row gutter={[16, 16]}>
                        <Col span={8}>
                          <Card title="Месячный KPI">
                            <Statistic title="Целевая доходность" value={2.5} suffix="%" />
                            <Statistic title="Фактическая доходность" value={3.2} suffix="%" valueStyle={{ color: '#52c41a' }} />
                            <p style={{ color: '#52c41a' }}>✓ Цель выполнена (+128%)</p>
                          </Card>
                        </Col>
                        <Col span={8}>
                          <Card title="Квартальный KPI">
                            <Statistic title="Целевая доходность" value={7.5} suffix="%" />
                            <Statistic title="Текущая доходность" value={6.8} suffix="%" />
                            <p>Прогресс: 91%</p>
                          </Card>
                        </Col>
                        <Col span={8}>
                          <Card title="Годовой KPI">
                            <Statistic title="Целевая доходность" value={18} suffix="%" />
                            <Statistic title="Текущая доходность" value={19.5} suffix="%" valueStyle={{ color: '#52c41a' }} />
                            <p style={{ color: '#52c41a' }}>✓ Цель выполнена (+108%)</p>
                          </Card>
                        </Col>
                      </Row>
                      <Card title="Детальные метрики" style={{ marginTop: 16 }}>
                        <Row gutter={[16, 16]}>
                          <Col span={6}>
                            <Statistic title="Новых клиентов (цель)" value="3 / 2" />
                          </Col>
                          <Col span={6}>
                            <Statistic title="Удержание клиентов" value={96} suffix="%" />
                          </Col>
                          <Col span={6}>
                            <Statistic title="Рост AUM" value={15} suffix="%" />
                          </Col>
                          <Col span={6}>
                            <Statistic title="Рейтинг качества" value={4.9} suffix="/5.0" />
                          </Col>
                        </Row>
                      </Card>
                    </>
                  ),
                },
                {
                  key: 'benchmarks',
                  label: 'Сравнение с бенчмарками',
                  children: (
                    <Card>
                      <Table
                        columns={[
                          { title: 'Показатель', dataIndex: 'metric', key: 'metric' },
                          { title: 'Мои результаты', dataIndex: 'myResult', key: 'myResult' },
                          { title: 'Бенчмарк', dataIndex: 'benchmark', key: 'benchmark' },
                          { title: 'Разница', dataIndex: 'diff', key: 'diff', render: (val: string) => val },
                        ]}
                        dataSource={[
                          { key: '1', metric: 'Годовая доходность', myResult: '19.5%', benchmark: '15.0% (MOEX)', diff: '+4.5%' },
                          { key: '2', metric: 'Sharpe Ratio', myResult: '1.85', benchmark: '1.20', diff: '+0.65' },
                          { key: '3', metric: 'Max Drawdown', myResult: '8.2%', benchmark: '12.0%', diff: '-3.8%' },
                          { key: '4', metric: 'Win Rate', myResult: '87%', benchmark: '65%', diff: '+22%' },
                        ]}
                      />
                    </Card>
                  ),
                },
                {
                  key: 'ranking',
                  label: 'Рейтинг среди трейдеров',
                  children: (
                    <Card>
                      <Row gutter={[16, 16]}>
                        <Col span={8}>
                          <Card>
                            <Statistic title="Позиция в рейтинге" value={5} suffix="/150" />
                            <p>Топ-5 трейдеров компании</p>
                          </Card>
                        </Col>
                        <Col span={8}>
                          <Card>
                            <Statistic title="Рейтинг по доходности" value={3} suffix="/150" />
                          </Card>
                        </Col>
                        <Col span={8}>
                          <Card>
                            <Statistic title="Рейтинг по AUM" value={8} suffix="/150" />
                          </Card>
                        </Col>
                      </Row>
                    </Card>
                  ),
                },
              ]}
            />
          </div>
        );

      case 'cabinet-settings':
        return (
          <div>
            <Title level={3}>Настройки профиля</Title>
            <Tabs
              items={[
                {
                  key: 'personal',
                  label: 'Личные данные',
                  children: (
                    <Card>
                      <p><strong>ФИО:</strong> Иванов Иван Иванович</p>
                      <p><strong>Email:</strong> ivanov@example.com</p>
                      <p><strong>Телефон:</strong> +7 (999) 123-45-67</p>
                      <p><strong>Дата рождения:</strong> 15.06.1985</p>
                      <p><strong>Адрес:</strong> г. Москва, ул. Ленина, д. 10</p>
                      <Button type="primary" style={{ marginTop: 16 }}>Редактировать</Button>
                    </Card>
                  ),
                },
                {
                  key: 'notifications',
                  label: 'Уведомления',
                  children: (
                    <Card>
                      <p>✅ Email уведомления о сделках</p>
                      <p>✅ SMS уведомления о важных событиях</p>
                      <p>✅ Push-уведомления в приложении</p>
                      <p>✅ Еженедельный отчет по email</p>
                      <p>✅ Уведомления об исполнении ордеров</p>
                      <p>❌ Маркетинговые рассылки</p>
                      <Button type="primary" style={{ marginTop: 16 }}>Изменить настройки</Button>
                    </Card>
                  ),
                },
                {
                  key: 'security',
                  label: 'Безопасность',
                  children: (
                    <Card>
                      <p>🔒 Двухфакторная аутентификация: <strong>Включена</strong></p>
                      <p>🔑 Последняя смена пароля: 10.12.2024</p>
                      <p>📱 Привязанные устройства: 3</p>
                      <p>🌍 Последний вход: 15.01.2025 10:30 (Москва)</p>
                      <Button type="primary" style={{ marginTop: 16, marginRight: 8 }}>Сменить пароль</Button>
                      <Button>Управление устройствами</Button>
                    </Card>
                  ),
                },
                {
                  key: 'trading',
                  label: 'Торговые настройки',
                  children: (
                    <Card>
                      <p><strong>Лимит на сделку:</strong> 5,000,000 ₽</p>
                      <p><strong>Дневной лимит:</strong> 50,000,000 ₽</p>
                      <p><strong>Максимальное плечо:</strong> 1:5</p>
                      <p><strong>Автоматическое исполнение:</strong> Включено</p>
                      <p><strong>Риск на сделку:</strong> 2%</p>
                      <Button type="primary" style={{ marginTop: 16 }}>Изменить лимиты</Button>
                    </Card>
                  ),
                },
              ]}
            />
          </div>
        );

      // Исполнения
      case 'executions-history':
        return (
          <Suspense fallback={<Loader />}>
            <ExecutionsHistoryPage />
          </Suspense>
        );

      case 'executions-active':
        return (
          <Suspense fallback={<Loader />}>
            <ExecutionsActivePage />
          </Suspense>
        );

      case 'executions-completed':
        return (
          <Card>
            <Title level={3}>Завершенные исполнения</Title>
            <p>Список завершенных исполнений...</p>
          </Card>
        );

      // Стратегии
      case 'strategies-all':
        return (
          <Suspense fallback={<Loader />}>
            <StrategiesAllPage />
          </Suspense>
        );

      case 'strategies-active':
        return (
          <Card>
            <Title level={3}>Активные стратегии</Title>
            <p>Список активных торговых стратегий...</p>
          </Card>
        );

      case 'strategies-backtesting':
        return (
          <Suspense fallback={<Loader />}>
            <StrategiesBacktestingPage />
          </Suspense>
        );

      // Ввод модельного портфеля
      case 'portfolio-create':
        return (
          <Suspense fallback={<Loader />}>
            <PortfolioCreatePage />
          </Suspense>
        );

      case 'portfolio-list':
        return (
          <Suspense fallback={<Loader />}>
            <PortfolioListPage />
          </Suspense>
        );

      case 'portfolio-model':
        return (
          <Suspense fallback={<Loader />}>
            <ModelPortfolioPage />
          </Suspense>
        );

      case 'portfolio-optimization':
        return (
          <Card>
            <Title level={3}>Оптимизация портфеля</Title>
            <p>Инструменты оптимизации модельного портфеля...</p>
          </Card>
        );

      // Риск профили
      case 'risk-assessment':
        return (
          <Suspense fallback={<Loader />}>
            <RiskAssessmentPage />
          </Suspense>
        );

      case 'risk-limits':
        return (
          <Suspense fallback={<Loader />}>
            <RiskLimitsPage />
          </Suspense>
        );

      case 'risk-monitoring':
        return (
          <Card>
            <Title level={3}>Мониторинг рисков</Title>
            <p>Real-time мониторинг рисков и alert-система...</p>
          </Card>
        );

      case 'risk-reports':
        return (
          <div>
            <Title level={3}>Отчеты по рискам</Title>
            <Tabs
              items={[
                {
                  key: 'daily',
                  label: 'Ежедневные',
                  children: <Card><p>Ежедневные отчеты по рискам...</p></Card>,
                },
                {
                  key: 'weekly',
                  label: 'Еженедельные',
                  children: <Card><p>Еженедельные отчеты...</p></Card>,
                },
                {
                  key: 'monthly',
                  label: 'Ежемесячные',
                  children: <Card><p>Ежемесячные отчеты...</p></Card>,
                },
              ]}
            />
          </div>
        );

      // QUIK
      case 'quik-quotes':
        return (
          <Suspense fallback={<Loader />}>
            <QuikQuotesPage />
          </Suspense>
        );

      case 'quik-orders':
        return (
          <Suspense fallback={<Loader />}>
            <QuikOrdersPage />
          </Suspense>
        );

      case 'quik-money':
        return (
          <Suspense fallback={<Loader />}>
            <QuikMoneyPage />
          </Suspense>
        );

      case 'quik-portfolio':
        return (
          <Suspense fallback={<Loader />}>
            <QuikPortfolioPage />
          </Suspense>
        );

      case 'dashboard':
        return (
          <Suspense fallback={<Loader />}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
                <Button
                  icon={<SettingOutlined />}
                  onClick={() => setSettingsOpen(true)}
                  type="default"
                >
                  Настройки меню
                </Button>
              </div>
              <DashboardPage />
            </div>
          </Suspense>
        );

      case 'invoices-monthly':
        return (
          <div>
            <Title level={3}>Счета по месяцам</Title>
            <Tabs
              items={[
                {
                  key: 'january',
                  label: 'Январь 2025',
                  children: (
                    <Card>
                      <Table columns={invoiceColumns} dataSource={invoicesMonthly} />
                    </Card>
                  ),
                },
                {
                  key: 'february',
                  label: 'Февраль 2025',
                  children: (
                    <Card>
                      <Table columns={invoiceColumns} dataSource={[]} locale={{ emptyText: 'Нет данных за февраль' }} />
                    </Card>
                  ),
                },
                {
                  key: 'march',
                  label: 'Март 2025',
                  children: (
                    <Card>
                      <Table columns={invoiceColumns} dataSource={[]} locale={{ emptyText: 'Нет данных за март' }} />
                    </Card>
                  ),
                },
              ]}
            />
          </div>
        );

      case 'invoices-yearly':
        return (
          <div>
            <Title level={3}>Счета по годам</Title>
            <Tabs
              items={[
                {
                  key: '2025',
                  label: '2025',
                  children: (
                    <Card>
                      <Table columns={invoiceColumns} dataSource={invoicesMonthly} />
                    </Card>
                  ),
                },
                {
                  key: '2024',
                  label: '2024',
                  children: (
                    <Card>
                      <Table columns={invoiceColumns} dataSource={invoicesYearly} />
                    </Card>
                  ),
                },
              ]}
            />
          </div>
        );

      case 'invoices-pending':
        return (
          <Card>
            <Title level={3}>Ожидающие оплату</Title>
            <Table
              columns={invoiceColumns}
              dataSource={invoicesMonthly.filter(inv => inv.status === 'Ожидает')}
            />
          </Card>
        );

      case 'invoices-paid':
        return (
          <Card>
            <Title level={3}>Оплаченные счета</Title>
            <Table
              columns={invoiceColumns}
              dataSource={invoicesMonthly.filter(inv => inv.status === 'Оплачен')}
            />
          </Card>
        );

      case 'users-all':
        return (
          <Card>
            <Title level={3}>Все пользователи</Title>
            <Table columns={userColumns} dataSource={usersData} />
          </Card>
        );

      case 'users-active':
        return (
          <Card>
            <Title level={3}>Активные пользователи</Title>
            <Table
              columns={userColumns}
              dataSource={usersData.filter(user => user.status === 'Активен')}
            />
          </Card>
        );

      case 'users-blocked':
        return (
          <Card>
            <Title level={3}>Заблокированные пользователи</Title>
            <Table
              columns={userColumns}
              dataSource={usersData.filter(user => user.status === 'Заблокирован')}
            />
          </Card>
        );

      case 'products-all':
        return (
          <div>
            <Title level={3}>Все товары</Title>
            <Tabs
              items={[
                {
                  key: 'list',
                  label: 'Список',
                  children: (
                    <Card>
                      <Table columns={productColumns} dataSource={productsData} />
                    </Card>
                  ),
                },
                {
                  key: 'grid',
                  label: 'Сетка',
                  children: (
                    <Card>
                      <Row gutter={[16, 16]}>
                        {productsData.map(product => (
                          <Col key={product.key} xs={24} sm={12} md={8}>
                            <Card title={product.name}>
                              <p>Цена: {product.price} ₽</p>
                              <p>Остаток: {product.stock} шт.</p>
                              <p>Категория: {product.category}</p>
                            </Card>
                          </Col>
                        ))}
                      </Row>
                    </Card>
                  ),
                },
              ]}
            />
          </div>
        );

      case 'products-categories':
        return (
          <Card>
            <Title level={3}>Категории товаров</Title>
            <p>Список категорий...</p>
          </Card>
        );

      case 'products-stock':
        return (
          <Card>
            <Title level={3}>Склад</Title>
            <Table columns={productColumns} dataSource={productsData} />
          </Card>
        );

      case 'analytics-sales':
        return (
          <div>
            <Title level={3}>Аналитика продаж</Title>
            <Tabs
              items={[
                {
                  key: 'daily',
                  label: 'По дням',
                  children: <Card><p>График продаж по дням...</p></Card>,
                },
                {
                  key: 'weekly',
                  label: 'По неделям',
                  children: <Card><p>График продаж по неделям...</p></Card>,
                },
                {
                  key: 'monthly',
                  label: 'По месяцам',
                  children: <Card><p>График продаж по месяцам...</p></Card>,
                },
              ]}
            />
          </div>
        );

      case 'analytics-traffic':
        return (
          <Card>
            <Title level={3}>Аналитика трафика</Title>
            <p>Данные о посещаемости...</p>
          </Card>
        );

      case 'analytics-conversion':
        return (
          <Card>
            <Title level={3}>Конверсия</Title>
            <p>Показатели конверсии...</p>
          </Card>
        );

      case 'reports-financial':
        return (
          <Card>
            <Title level={3}>Финансовые отчеты</Title>
            <p>Финансовая отчетность...</p>
          </Card>
        );

      case 'reports-sales':
        return (
          <Card>
            <Title level={3}>Отчеты по продажам</Title>
            <p>Отчеты о продажах...</p>
          </Card>
        );

      case 'settings':
        return (
          <Suspense fallback={<Loader />}>
            <SettingsPage />
          </Suspense>
        );

      default:
        return <Card><p>Контент для {key}</p></Card>;
    }
  };

  const tabItems = panes.map(pane => ({
    key: pane.key,
    label: pane.label,
    closable: pane.closable,
    children: <div className={styles.tabContent}>{renderTabContent(pane.key)}</div>,
  }));

  const handleToggleMenuItem = (key: string) => {
    dispatch(toggleMenuItem(key));
    message.success('Настройки меню сохранены');
  };

  const handleResetSettings = () => {
    dispatch(resetMenuSettings());
    message.success('Настройки меню сброшены');
  };

  return (
    <Layout className={styles.adminPage}>
      <Sidebar
        collapsed={collapsed}
        onCollapse={setCollapsed}
        onMenuSelect={handleMenuSelect}
        onSettingsClick={() => setSettingsOpen(true)}
      />
      <Layout className={styles.contentLayout}>
        <Content className={styles.content}>
          <Tabs
            type="editable-card"
            activeKey={activeKey}
            onChange={handleTabChange}
            onEdit={handleTabEdit}
            items={tabItems}
            hideAdd
            className={styles.mainTabs}
          />
        </Content>
      </Layout>

      <Modal
        title="Настройки меню"
        open={settingsOpen}
        onCancel={() => setSettingsOpen(false)}
        footer={[
          <Button key="reset" onClick={handleResetSettings}>
            Сбросить
          </Button>,
          <Button key="close" type="primary" onClick={() => setSettingsOpen(false)}>
            Закрыть
          </Button>,
        ]}
        width={600}
      >
        <div>
          <p style={{ marginBottom: 16, color: '#8c8c8c' }}>
            Выберите пункты меню, которые хотите отображать в боковом меню
          </p>
          {menuItems.map(item => (
            <div
              key={item.key}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 0',
                borderBottom: '1px solid #f0f0f0',
              }}
            >
              <span style={{ fontSize: 14 }}>{item.label}</span>
              <Switch
                checked={item.visible}
                onChange={() => handleToggleMenuItem(item.key)}
                disabled={item.key === 'dashboard'}
              />
            </div>
          ))}
          <p style={{ marginTop: 16, fontSize: 12, color: '#8c8c8c' }}>
            * Dashboard не может быть скрыт
          </p>
        </div>
      </Modal>
    </Layout>
  );
};

export default AdminPage;
