import { useState, useMemo } from 'react';
import { Layout, Menu, Button, Tooltip } from 'antd';
import { useSelector } from 'react-redux';
import {
  DashboardOutlined,
  UserOutlined,
  SettingOutlined,
  AppstoreOutlined,
  BarChartOutlined,
  FileTextOutlined,
  DollarOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
  FileOutlined,
  CalendarOutlined,
  LineChartOutlined,
  WarningOutlined,
  ApiOutlined,
  StockOutlined,
  ShoppingOutlined,
  WalletOutlined,
  FolderOpenOutlined,
  RiseOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { selectVisibleMenuItems, selectOpenKeys, setOpenKeys } from 'entities/MenuSettings/slice/menuSettingsSlice';
import { useAppDispatch } from 'shared/hooks/useAppDispatch';
import MiniLogo from 'shared/assets/icons/miniLogo.png';
import styles from './Sidebar.module.scss';

const { Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

interface SidebarProps {
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
  onMenuSelect?: (key: string, label: string) => void;
  onSettingsClick?: () => void;
}

export const Sidebar = ({ collapsed = false, onCollapse, onMenuSelect, onSettingsClick }: SidebarProps) => {
  const dispatch = useAppDispatch();
  const visibleMenuSettings = useSelector(selectVisibleMenuItems);
  const openKeys = useSelector(selectOpenKeys);

  const allMenuItems: MenuItem[] = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Главная',
    },
    {
      key: 'personal-cabinet',
      icon: <UserOutlined />,
      label: 'Личный кабинет',
      children: [
        {
          key: 'cabinet-profile',
          icon: <UserOutlined />,
          label: 'Мой профиль',
        },
        {
          key: 'cabinet-statistics',
          icon: <BarChartOutlined />,
          label: 'Моя статистика',
        },
      ],
    },
    {
      key: 'executions',
      icon: <LineChartOutlined />,
      label: 'Исполнения',
      children: [
        {
          key: 'executions-history',
          icon: <FileOutlined />,
          label: 'История исполнений',
        },
        {
          key: 'executions-active',
          icon: <FileOutlined />,
          label: 'Активные',
        },
      ],
    },
    {
      key: 'strategies',
      icon: <BarChartOutlined />,
      label: 'Стратегии',
      children: [
        {
          key: 'strategies-all',
          icon: <FileTextOutlined />,
          label: 'Все стратегии',
        },
        {
          key: 'strategies-backtesting',
          icon: <LineChartOutlined />,
          label: 'Бэктестинг',
        },
      ],
    },
    {
      key: 'portfolio-input',
      icon: <AppstoreOutlined />,
      label: 'Ввод модельного портфеля',
      children: [
        {
          key: 'portfolio-create',
          icon: <FileOutlined />,
          label: 'Создать портфель',
        },
        {
          key: 'portfolio-list',
          icon: <FileTextOutlined />,
          label: 'Список портфелей',
        },
      ],
    },
    {
      key: 'risk-profile',
      icon: <WarningOutlined />,
      label: 'Риск профили',
      children: [
        {
          key: 'risk-assessment',
          icon: <BarChartOutlined />,
          label: 'Оценка риска',
        },
        {
          key: 'risk-limits',
          icon: <FileOutlined />,
          label: 'Лимиты риска',
        },
      ],
    },
    {
      key: 'quik',
      icon: <ApiOutlined />,
      label: 'QUIK',
      children: [
        {
          key: 'quik-quotes',
          icon: <StockOutlined />,
          label: 'Котировки',
        },
        {
          key: 'quik-orders',
          icon: <ShoppingOutlined />,
          label: 'Ордера',
        },
        {
          key: 'quik-money',
          icon: <WalletOutlined />,
          label: 'Денежные средства',
        },
        {
          key: 'quik-portfolio',
          icon: <FolderOpenOutlined />,
          label: 'Портфель',
        },
      ],
    },
    {
      key: 'reports',
      icon: <FileTextOutlined />,
      label: 'Отчеты',
      disabled: true,
      children: [
        {
          key: 'reports-financial',
          icon: <DollarOutlined />,
          label: 'Финансовые',
          disabled: true,
        },
        {
          key: 'reports-sales',
          icon: <ShoppingCartOutlined />,
          label: 'Продажи',
          disabled: true,
        },
      ],
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Настройки',
    },
  ];

  // Фильтруем меню на основе настроек видимости
  const menuItems = useMemo(() => {
    const visibleKeys = new Set(visibleMenuSettings.map(item => item.key));
    return allMenuItems.filter(item => item && 'key' in item && visibleKeys.has(item.key as string));
  }, [visibleMenuSettings]);

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    // Find label for the clicked item
    const findLabel = (items: MenuItem[], key: string): string => {
      for (const item of items) {
        if (!item) continue;
        if ('key' in item && item.key === key && 'label' in item) {
          return item.label as string;
        }
        if ('children' in item && item.children) {
          const found = findLabel(item.children as MenuItem[], key);
          if (found) return found;
        }
      }
      return key;
    };

    const label = findLabel(allMenuItems, e.key);
    onMenuSelect?.(e.key, label);
  };

  const handleOpenChange = (keys: string[]) => {
    dispatch(setOpenKeys(keys));
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      className={styles.sidebar}
      width={250}
      theme="dark"
    >
      <div className={styles.logo}>
        <div className={styles.logoContent}>
          <img src={MiniLogo} alt="Logo" className={styles.logoIcon} />
          {!collapsed && <span className={styles.logoText}>Робоэдвайзинг</span>}
        </div>
        {!collapsed && (
          <Tooltip title="Настройки меню" placement="right">
            <Button
              type="text"
              icon={<SettingOutlined />}
              onClick={onSettingsClick}
              className={styles.settingsButton}
            />
          </Tooltip>
        )}
        {collapsed && (
          <Tooltip title="Настройки меню" placement="right">
            <Button
              type="text"
              icon={<SettingOutlined />}
              onClick={onSettingsClick}
              className={styles.settingsButtonCollapsed}
              style={{ padding: '4px', marginTop: '8px' }}
            />
          </Tooltip>
        )}
      </div>
      <Menu
        theme="dark"
        mode="inline"
        items={menuItems}
        onClick={handleMenuClick}
        openKeys={collapsed ? [] : openKeys}
        onOpenChange={handleOpenChange}
        className={styles.menu}
      />
    </Sider>
  );
};
