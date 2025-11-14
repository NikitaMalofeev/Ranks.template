import { useState, useEffect } from 'react';
import { Row, Col, Card, Spin, Typography, Statistic, Progress, Tag } from 'antd';
import { WarningOutlined, CheckCircleOutlined } from '@ant-design/icons';
import styles from './RiskPage.module.scss';

const { Title } = Typography;

// Моковые данные (потом заменим на реальные из API)
const mockRiskMetrics = {
  risk_level: 'medium' as const,
  risk_score: 5.5,
  var_95: 45000,
  max_drawdown: -8.5,
  volatility: 18.2,
  calculated_at: new Date().toISOString()
};

const RiskAssessmentPage = () => {
  const [loading, setLoading] = useState(false);
  const [riskMetrics, setRiskMetrics] = useState(mockRiskMetrics);

  useEffect(() => {
    fetchRiskData();
  }, []);

  const fetchRiskData = async () => {
    setLoading(true);
    try {
      // TODO: Реальный запрос к API
      setTimeout(() => {
        setRiskMetrics(mockRiskMetrics);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Ошибка загрузки метрик риска:', error);
      setLoading(false);
    }
  };

  const riskLevelText = {
    low: 'НИЗКИЙ',
    medium: 'СРЕДНИЙ',
    high: 'ВЫСОКИЙ'
  };

  const riskLevelColor = {
    low: '#52c41a',
    medium: '#faad14',
    high: '#ff4d4f'
  };

  const varLimit = 50000;
  const isVarNormal = riskMetrics.var_95 <= varLimit;
  const isDrawdownNormal = riskMetrics.max_drawdown > -10;

  const getVolatilityLevel = (vol: number) => {
    if (vol < 15) return { text: 'Низкая', color: '#52c41a' };
    if (vol < 25) return { text: 'Средняя', color: '#faad14' };
    return { text: 'Высокая', color: '#ff4d4f' };
  };

  const volatilityLevel = getVolatilityLevel(riskMetrics.volatility);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className={styles.riskPage}>
      <Card>
        <div className={styles.header}>
          <WarningOutlined className={styles.icon} />
          <Title level={2}>Оценка риска портфеля</Title>
        </div>

        {/* Верхний ряд - карточки метрик */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          {/* Карточка 1: Уровень риска */}
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Уровень риска"
                value={riskLevelText[riskMetrics.risk_level]}
                prefix={<WarningOutlined />}
                valueStyle={{ color: riskLevelColor[riskMetrics.risk_level], fontSize: '20px' }}
              />
              <Progress
                percent={riskMetrics.risk_score * 10}
                strokeColor={riskLevelColor[riskMetrics.risk_level]}
                showInfo={false}
                style={{ marginTop: 8 }}
              />
              <div style={{ fontSize: 12, color: '#8c8c8c', marginTop: 4 }}>
                Шкала от 0 до 10: {riskMetrics.risk_score.toFixed(1)}
              </div>
            </Card>
          </Col>

          {/* Карточка 2: VaR (95%) */}
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="VaR (95%)"
                value={riskMetrics.var_95}
                precision={0}
                suffix="₽"
                valueStyle={{ fontSize: '20px' }}
              />
              <div style={{ fontSize: 12, color: '#8c8c8c', marginTop: 4 }}>за день</div>
              <div style={{ marginTop: 8 }}>
                {isVarNormal ? (
                  <Tag color="success" icon={<CheckCircleOutlined />}>
                    Норма: ✓
                  </Tag>
                ) : (
                  <Tag color="warning" icon={<WarningOutlined />}>
                    Превышен: ⚠️
                  </Tag>
                )}
              </div>
            </Card>
          </Col>

          {/* Карточка 3: Max Drawdown */}
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Max Drawdown"
                value={riskMetrics.max_drawdown}
                precision={1}
                suffix="%"
                valueStyle={{
                  color: isDrawdownNormal ? '#52c41a' : '#ff4d4f',
                  fontSize: '20px'
                }}
              />
              <div style={{ fontSize: 12, color: '#8c8c8c', marginTop: 4 }}>за месяц</div>
              {!isDrawdownNormal && (
                <div style={{ marginTop: 8 }}>
                  <Tag color="error">Превышен лимит -10%</Tag>
                </div>
              )}
            </Card>
          </Col>

          {/* Карточка 4: Волатильность */}
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Волатильность"
                value={riskMetrics.volatility}
                precision={1}
                suffix="%"
                valueStyle={{ fontSize: '20px' }}
              />
              <div style={{ fontSize: 12, color: '#8c8c8c', marginTop: 4 }}>годовая</div>
              <div style={{ marginTop: 8 }}>
                <Tag color={volatilityLevel.color}>
                  {volatilityLevel.text}: {volatilityLevel.color === '#ff4d4f' ? '⚠️' : '✓'}
                </Tag>
              </div>
            </Card>
          </Col>
        </Row>

        {/* TODO: Добавить остальные секции согласно ТЗ */}
        {/* - График динамики риска */}
        {/* - Распределение рисков по активам */}
        {/* - Таблица рисков по позициям */}
        {/* - Блок стресс-тестирования */}
        {/* - Анализ концентрации риска */}
      </Card>
    </div>
  );
};

export default RiskAssessmentPage;
