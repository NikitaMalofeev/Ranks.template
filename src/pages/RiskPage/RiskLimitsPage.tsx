import { useState } from 'react';
import { Card, Tabs, Button, message, Typography } from 'antd';
import {
  SaveOutlined,
  ReloadOutlined,
  DownloadOutlined,
  UploadOutlined,
  SettingOutlined
} from '@ant-design/icons';
import styles from './RiskPage.module.scss';

const { Title } = Typography;

const RiskLimitsPage = () => {
  const [activeTab, setActiveTab] = useState('global');
  const [hasChanges, setHasChanges] = useState(false);

  const handleSaveAll = async () => {
    message.success('Все изменения сохранены');
    setHasChanges(false);
  };

  const handleReset = () => {
    message.info('Настройки сброшены до значений по умолчанию');
    setHasChanges(false);
  };

  const handleExport = () => {
    // TODO: Реализовать экспорт настроек
    message.info('Экспорт настроек...');
  };

  const handleImport = () => {
    // TODO: Реализовать импорт настроек
    message.info('Импорт настроек...');
  };

  const tabs = [
    {
      key: 'global',
      label: 'Глобальные лимиты',
      children: (
        <Card>
          <Title level={4}>Глобальные лимиты риска</Title>
          <p>Максимальная просадка портфеля (%): <strong>15%</strong></p>
          <p>Максимальный размер позиции (% от портфеля): <strong>30%</strong></p>
          <p>Максимальное плечо: <strong>1.5x</strong></p>
          <p>Максимальная концентрация в одном секторе (%): <strong>40%</strong></p>
          <p>Максимальный VaR за день (₽): <strong>50 000 ₽</strong></p>
          <Button type="primary" onClick={() => setHasChanges(true)} style={{ marginTop: 16 }}>
            Редактировать лимиты
          </Button>
        </Card>
      )
    },
    {
      key: 'instruments',
      label: 'Лимиты по инструментам',
      children: (
        <Card>
          <Title level={4}>Лимиты по инструментам</Title>
          <p>Здесь будет таблица с лимитами для каждого инструмента:</p>
          <ul>
            <li>Тикер</li>
            <li>Максимальный вес в портфеле (%)</li>
            <li>Максимальная позиция (в лотах)</li>
            <li>Stop-loss (%)</li>
            <li>Текущий вес</li>
            <li>Действия (редактировать, удалить)</li>
          </ul>
          <Button type="primary" onClick={() => setHasChanges(true)} style={{ marginTop: 16 }}>
            Добавить лимит
          </Button>
        </Card>
      )
    },
    {
      key: 'violations',
      label: 'Мониторинг нарушений',
      children: (
        <Card>
          <Title level={4}>Мониторинг нарушений лимитов</Title>
          <p>Здесь будет таблица с текущими и историческими нарушениями:</p>
          <ul>
            <li>Дата/время обнаружения</li>
            <li>Тип нарушения</li>
            <li>Инструмент/Сектор</li>
            <li>Лимит vs Фактическое значение</li>
            <li>Статус (активно/устранено)</li>
          </ul>
          <p style={{ marginTop: 16, color: '#52c41a' }}>
            ✓ Нарушений не обнаружено
          </p>
        </Card>
      )
    },
    {
      key: 'notifications',
      label: 'Уведомления',
      children: (
        <Card>
          <Title level={4}>Настройки уведомлений</Title>
          <p><strong>Каналы уведомлений:</strong></p>
          <p>✓ Email уведомления</p>
          <p>✓ Push уведомления в браузере</p>
          <p>✗ Telegram уведомления</p>

          <p style={{ marginTop: 16 }}><strong>Уведомлять о:</strong></p>
          <p>✓ Превышении лимитов</p>
          <p>✓ Критическом уровне риска</p>
          <p>✓ Приближении к stop-loss</p>
          <p>✗ Изменении волатильности</p>

          <Button type="primary" onClick={() => setHasChanges(true)} style={{ marginTop: 16 }}>
            Изменить настройки
          </Button>
        </Card>
      )
    }
  ];

  return (
    <div className={styles.riskPage}>
      <Card
        title={
          <div className={styles.header}>
            <SettingOutlined className={styles.icon} />
            <Title level={2} style={{ margin: 0 }}>Лимиты риска</Title>
          </div>
        }
        extra={
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={handleSaveAll}
              disabled={!hasChanges}
            >
              Сохранить
            </Button>
            <Button icon={<ReloadOutlined />} onClick={handleReset}>
              Сбросить
            </Button>
            <Button icon={<DownloadOutlined />} onClick={handleExport}>
              Экспорт
            </Button>
            <Button icon={<UploadOutlined />} onClick={handleImport}>
              Импорт
            </Button>
          </div>
        }
      >
        <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabs} />
      </Card>
    </div>
  );
};

export default RiskLimitsPage;
