import { useState } from 'react';
import { Modal, Radio, Button, Space } from 'antd';
import type { BrokerType } from 'entities/Portfolio';
import styles from './BrokerSelector.module.scss';

interface BrokerSelectorProps {
  visible: boolean;
  onSelect: (broker: BrokerType) => void;
  onCancel?: () => void;
}

const BROKERS = [
  { value: 'tinkoff_brokers' as BrokerType, label: 'Тинькофф' },
  { value: 'tradernet_ff' as BrokerType, label: 'Tradernet' },
  { value: 'finam_broker' as BrokerType, label: 'Финам' },
];

export const BrokerSelector = ({ visible, onSelect, onCancel }: BrokerSelectorProps) => {
  const [selectedBroker, setSelectedBroker] = useState<BrokerType>('tinkoff_brokers');

  const handleOk = () => {
    onSelect(selectedBroker);
  };

  return (
    <Modal
      title="Выбор брокера"
      open={visible}
      onOk={handleOk}
      onCancel={onCancel}
      okText="Продолжить"
      cancelText="Отмена"
      className={styles.brokerSelector}
    >
      <div className={styles.content}>
        <p>Выберите брокера для работы с портфелями:</p>
        <Radio.Group
          value={selectedBroker}
          onChange={(e) => setSelectedBroker(e.target.value)}
          className={styles.radioGroup}
        >
          <Space direction="vertical" size="middle">
            {BROKERS.map((broker) => (
              <Radio key={broker.value} value={broker.value} className={styles.radioOption}>
                {broker.label}
              </Radio>
            ))}
          </Space>
        </Radio.Group>
      </div>
    </Modal>
  );
};
