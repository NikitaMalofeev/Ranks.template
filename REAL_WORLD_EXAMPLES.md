# 🌍 Real World Examples

Полные примеры реализации типичных задач в production-ready коде.

---

## 📊 Example 1: Dashboard with Real-Time Data

### Task
Create a dashboard page with:
- Real-time statistics
- Charts
- Data refresh every 30 seconds
- Filters

### Implementation

#### 1. Types

```typescript
// src/entities/Dashboard/types/dashboard.types.ts
export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  revenue: number;
  orders: number;
  growth: {
    users: number;
    revenue: number;
    orders: number;
  };
}

export interface DashboardFilters {
  period: 'day' | 'week' | 'month' | 'year';
  startDate?: string;
  endDate?: string;
}

export interface DashboardChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
  }[];
}

export interface DashboardState {
  stats: DashboardStats | null;
  chartData: DashboardChartData | null;
  filters: DashboardFilters;
  isLoading: boolean;
  error: string | null;
  lastUpdate: string | null;
}
```

#### 2. API

```typescript
// src/entities/Dashboard/api/dashboardApi.ts
import axios from 'axios';
import { API_BASE_URL } from 'shared/config/api.config';
import { DashboardStats, DashboardChartData, DashboardFilters } from '../types/dashboard.types';

const DASHBOARD_URL = `${API_BASE_URL}/dashboard`;

export const dashboardApi = {
  getStats: async (filters: DashboardFilters, token: string): Promise<DashboardStats> => {
    const response = await axios.get(`${DASHBOARD_URL}/stats`, {
      params: filters,
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  getChartData: async (filters: DashboardFilters, token: string): Promise<DashboardChartData> => {
    const response = await axios.get(`${DASHBOARD_URL}/chart`, {
      params: filters,
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};
```

#### 3. Redux Slice

```typescript
// src/entities/Dashboard/slice/dashboardSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { dashboardApi } from '../api/dashboardApi';
import { DashboardState, DashboardFilters } from '../types/dashboard.types';
import { RootState } from 'app/providers/store/config/store';

const initialState: DashboardState = {
  stats: null,
  chartData: null,
  filters: {
    period: 'week',
  },
  isLoading: false,
  error: null,
  lastUpdate: null,
};

export const fetchDashboardDataThunk = createAsyncThunk(
  'dashboard/fetchData',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.user.token;
      const filters = state.dashboard.filters;

      if (!token) {
        return rejectWithValue('No authentication token');
      }

      const [stats, chartData] = await Promise.all([
        dashboardApi.getStats(filters, token),
        dashboardApi.getChartData(filters, token),
      ]);

      return { stats, chartData };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch dashboard data');
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<DashboardFilters>) => {
      state.filters = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardDataThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDashboardDataThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload.stats;
        state.chartData = action.payload.chartData;
        state.lastUpdate = new Date().toISOString();
      })
      .addCase(fetchDashboardDataThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setFilters, clearError } = dashboardSlice.actions;
export default dashboardSlice.reducer;
```

#### 4. Page Component

```tsx
// src/pages/DashboardPage/DashboardPage.tsx
import { useEffect, useRef } from 'react';
import { Typography, Row, Col, Card, Select, Space } from 'antd';
import { useSelector } from 'react-redux';
import { RootState } from 'app/providers/store/config/store';
import { useAppDispatch } from 'shared/hooks/useAppDispatch';
import { fetchDashboardDataThunk, setFilters } from 'entities/Dashboard/slice/dashboardSlice';
import { Header } from 'widgets/Header/Header';
import { StatsCards } from 'widgets/Dashboard/StatsCards/StatsCards';
import { RevenueChart } from 'widgets/Dashboard/RevenueChart/RevenueChart';
import { Loader } from 'shared/ui/Loader/Loader';
import styles from './DashboardPage.module.scss';

const { Title } = Typography;

const DashboardPage = () => {
  const dispatch = useAppDispatch();
  const { stats, chartData, filters, isLoading, error, lastUpdate } = useSelector(
    (state: RootState) => state.dashboard
  );

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initial fetch
  useEffect(() => {
    dispatch(fetchDashboardDataThunk());
  }, [dispatch, filters]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      dispatch(fetchDashboardDataThunk());
    }, 30000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [dispatch, filters]);

  const handlePeriodChange = (period: 'day' | 'week' | 'month' | 'year') => {
    dispatch(setFilters({ ...filters, period }));
  };

  if (error) {
    return (
      <>
        <Header />
        <div className={styles.error}>Error: {error}</div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className={styles.dashboardPage}>
        <div className={styles.container}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* Header */}
            <div className={styles.header}>
              <Title level={2}>Dashboard</Title>
              <Select
                value={filters.period}
                onChange={handlePeriodChange}
                style={{ width: 120 }}
              >
                <Select.Option value="day">Today</Select.Option>
                <Select.Option value="week">This Week</Select.Option>
                <Select.Option value="month">This Month</Select.Option>
                <Select.Option value="year">This Year</Select.Option>
              </Select>
            </div>

            {/* Stats */}
            <StatsCards stats={stats} loading={isLoading} />

            {/* Chart */}
            <Card title="Revenue Trend" loading={isLoading}>
              {chartData && <RevenueChart data={chartData} />}
            </Card>

            {/* Last Update */}
            {lastUpdate && (
              <div className={styles.lastUpdate}>
                Last updated: {new Date(lastUpdate).toLocaleTimeString()}
              </div>
            )}
          </Space>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
```

---

## 🛒 Example 2: E-Commerce Cart with Persistence

### Task
Create a shopping cart that:
- Persists across sessions
- Calculates totals
- Handles quantity changes
- Shows real-time updates

### Implementation

#### 1. Types

```typescript
// src/entities/Cart/types/cart.types.ts
export interface CartItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  maxQuantity?: number;
}

export interface CartState {
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  discountCode: string | null;
  discountAmount: number;
}
```

#### 2. Redux Slice with Calculations

```typescript
// src/entities/Cart/slice/cartSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartState, CartItem } from '../types/cart.types';

const TAX_RATE = 0.1; // 10%
const SHIPPING_THRESHOLD = 100;
const SHIPPING_COST = 10;

const calculateTotals = (items: CartItem[], discountAmount: number = 0) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * TAX_RATE;
  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + tax + shipping - discountAmount;

  return { subtotal, tax, shipping, total };
};

const initialState: CartState = {
  items: [],
  subtotal: 0,
  tax: 0,
  shipping: 0,
  total: 0,
  discountCode: null,
  discountAmount: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(
        item => item.productId === action.payload.productId
      );

      if (existingItem) {
        const newQuantity = existingItem.quantity + action.payload.quantity;
        const maxQuantity = existingItem.maxQuantity || Infinity;

        existingItem.quantity = Math.min(newQuantity, maxQuantity);
      } else {
        state.items.push(action.payload);
      }

      const totals = calculateTotals(state.items, state.discountAmount);
      Object.assign(state, totals);
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.productId !== action.payload);

      const totals = calculateTotals(state.items, state.discountAmount);
      Object.assign(state, totals);
    },

    updateQuantity: (
      state,
      action: PayloadAction<{ productId: string; quantity: number }>
    ) => {
      const item = state.items.find(i => i.productId === action.payload.productId);

      if (item) {
        const maxQuantity = item.maxQuantity || Infinity;
        item.quantity = Math.max(1, Math.min(action.payload.quantity, maxQuantity));

        const totals = calculateTotals(state.items, state.discountAmount);
        Object.assign(state, totals);
      }
    },

    applyDiscount: (
      state,
      action: PayloadAction<{ code: string; amount: number }>
    ) => {
      state.discountCode = action.payload.code;
      state.discountAmount = action.payload.amount;

      const totals = calculateTotals(state.items, state.discountAmount);
      Object.assign(state, totals);
    },

    clearCart: (state) => {
      return initialState;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  applyDiscount,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
```

#### 3. Cart Widget

```tsx
// src/widgets/Cart/CartDropdown/CartDropdown.tsx
import { Badge, Dropdown, Button, List, InputNumber, Empty, Space } from 'antd';
import { ShoppingCartOutlined, DeleteOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { RootState } from 'app/providers/store/config/store';
import { useAppDispatch } from 'shared/hooks/useAppDispatch';
import { removeFromCart, updateQuantity } from 'entities/Cart/slice/cartSlice';
import { useNavigate } from 'react-router-dom';
import styles from './CartDropdown.module.scss';

export const CartDropdown = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items, total } = useSelector((state: RootState) => state.cart);

  const handleQuantityChange = (productId: string, quantity: number) => {
    dispatch(updateQuantity({ productId, quantity }));
  };

  const handleRemove = (productId: string) => {
    dispatch(removeFromCart(productId));
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const menu = (
    <div className={styles.cartDropdown}>
      {items.length === 0 ? (
        <Empty description="Cart is empty" />
      ) : (
        <>
          <List
            dataSource={items}
            renderItem={item => (
              <List.Item
                key={item.productId}
                actions={[
                  <InputNumber
                    min={1}
                    max={item.maxQuantity}
                    value={item.quantity}
                    onChange={(val) => handleQuantityChange(item.productId, val || 1)}
                    size="small"
                  />,
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleRemove(item.productId)}
                  />,
                ]}
              >
                <List.Item.Meta
                  title={item.productName}
                  description={`$${item.price.toFixed(2)} x ${item.quantity}`}
                />
              </List.Item>
            )}
          />

          <div className={styles.total}>
            <strong>Total:</strong> ${total.toFixed(2)}
          </div>

          <Button type="primary" block onClick={handleCheckout}>
            Proceed to Checkout
          </Button>
        </>
      )}
    </div>
  );

  return (
    <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
      <Badge count={items.length} showZero>
        <Button icon={<ShoppingCartOutlined />} />
      </Badge>
    </Dropdown>
  );
};
```

---

## 📝 Example 3: Form with Multi-Step Wizard

### Task
Create a multi-step form for user registration with:
- Step validation
- Progress indicator
- Data persistence between steps
- Final submission

### Implementation

```tsx
// src/features/Registration/RegistrationWizard/RegistrationWizard.tsx
import { useState } from 'react';
import { Steps, Button, message, Form } from 'antd';
import { PersonalInfoStep } from './steps/PersonalInfoStep';
import { AccountInfoStep } from './steps/AccountInfoStep';
import { PreferencesStep } from './steps/PreferencesStep';
import { ReviewStep } from './steps/ReviewStep';
import { useAppDispatch } from 'shared/hooks/useAppDispatch';
import { registerUserThunk } from 'entities/User/slice/userSlice';
import styles from './RegistrationWizard.module.scss';

interface FormData {
  // Personal Info
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phone: string;

  // Account Info
  email: string;
  password: string;
  confirmPassword: string;

  // Preferences
  newsletter: boolean;
  notifications: boolean;
  theme: 'light' | 'dark';
}

const steps = [
  { title: 'Personal Info', key: 'personal' },
  { title: 'Account Info', key: 'account' },
  { title: 'Preferences', key: 'preferences' },
  { title: 'Review', key: 'review' },
];

export const RegistrationWizard = () => {
  const [current, setCurrent] = useState(0);
  const [formData, setFormData] = useState<Partial<FormData>>({});
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();

  const next = async () => {
    try {
      const values = await form.validateFields();
      setFormData({ ...formData, ...values });
      setCurrent(current + 1);
      form.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await dispatch(registerUserThunk(formData as FormData)).unwrap();
      message.success('Registration successful!');
      // Redirect to dashboard
    } catch (error: any) {
      message.error(error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (current) {
      case 0:
        return <PersonalInfoStep form={form} initialValues={formData} />;
      case 1:
        return <AccountInfoStep form={form} initialValues={formData} />;
      case 2:
        return <PreferencesStep form={form} initialValues={formData} />;
      case 3:
        return <ReviewStep data={formData as FormData} />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.registrationWizard}>
      <Steps current={current} items={steps} />

      <div className={styles.content}>
        {renderStep()}
      </div>

      <div className={styles.actions}>
        {current > 0 && (
          <Button onClick={prev}>
            Previous
          </Button>
        )}

        {current < steps.length - 1 && (
          <Button type="primary" onClick={next}>
            Next
          </Button>
        )}

        {current === steps.length - 1 && (
          <Button type="primary" onClick={handleSubmit} loading={loading}>
            Submit
          </Button>
        )}
      </div>
    </div>
  );
};
```

---

## 🔍 Example 4: Advanced Search with Debounce

```tsx
// src/features/ProductSearch/SearchBar/SearchBar.tsx
import { useState, useEffect } from 'react';
import { Input, AutoComplete, Spin } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useDebounce } from 'shared/hooks/useDebounce';
import { useAppDispatch } from 'shared/hooks/useAppDispatch';
import { searchProductsThunk } from 'entities/Product/slice/productSlice';
import { useSelector } from 'react-redux';
import { RootState } from 'app/providers/store/config/store';
import styles from './SearchBar.module.scss';

export const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [options, setOptions] = useState<{ value: string; label: string }[]>([]);
  const debouncedSearch = useDebounce(searchTerm, 500);
  const dispatch = useAppDispatch();
  const { searchResults, isSearching } = useSelector((state: RootState) => state.products);

  // Perform search when debounced value changes
  useEffect(() => {
    if (debouncedSearch.trim().length >= 3) {
      dispatch(searchProductsThunk(debouncedSearch));
    } else {
      setOptions([]);
    }
  }, [debouncedSearch, dispatch]);

  // Update autocomplete options when search results change
  useEffect(() => {
    if (searchResults) {
      setOptions(
        searchResults.map(product => ({
          value: product.id,
          label: product.name,
        }))
      );
    }
  }, [searchResults]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleSelect = (value: string) => {
    // Navigate to product page or show details
    console.log('Selected product:', value);
  };

  return (
    <AutoComplete
      options={options}
      onSearch={handleSearch}
      onSelect={handleSelect}
      className={styles.searchBar}
      notFoundContent={isSearching ? <Spin size="small" /> : null}
    >
      <Input
        size="large"
        placeholder="Search products..."
        prefix={<SearchOutlined />}
        suffix={isSearching && <Spin size="small" />}
      />
    </AutoComplete>
  );
};
```

---

## 📊 Example 5: Data Table with Pagination and Sorting

```tsx
// src/widgets/ProductTable/ProductTable.tsx
import { useState, useEffect } from 'react';
import { Table, Button, Space, Tag, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { useSelector } from 'react-redux';
import { RootState } from 'app/providers/store/config/store';
import { useAppDispatch } from 'shared/hooks/useAppDispatch';
import {
  fetchProductsThunk,
  deleteProductThunk,
} from 'entities/Product/slice/productSlice';
import { Product } from 'entities/Product/types/product.types';
import styles from './ProductTable.module.scss';

interface ProductTableProps {
  onEdit?: (product: Product) => void;
}

export const ProductTable = ({ onEdit }: ProductTableProps) => {
  const dispatch = useAppDispatch();
  const { filteredItems, isLoading, total, page, pageSize } = useSelector(
    (state: RootState) => state.products
  );

  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: page,
    pageSize: pageSize,
    total: total,
  });

  useEffect(() => {
    dispatch(fetchProductsThunk({
      page: pagination.current,
      pageSize: pagination.pageSize,
    }));
  }, [dispatch, pagination.current, pagination.pageSize]);

  const handleTableChange = (newPagination: TablePaginationConfig, filters: any, sorter: any) => {
    setPagination(newPagination);
  };

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteProductThunk(id)).unwrap();
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const columns: ColumnsType<Product> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      filters: [
        { text: 'Electronics', value: 'electronics' },
        { text: 'Clothing', value: 'clothing' },
        { text: 'Food', value: 'food' },
      ],
      onFilter: (value, record) => record.category === value,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      sorter: (a, b) => a.price - b.price,
      render: (price: number) => `$${price.toFixed(2)}`,
    },
    {
      title: 'Stock',
      dataIndex: 'inStock',
      key: 'inStock',
      render: (inStock: boolean) => (
        <Tag color={inStock ? 'green' : 'red'}>
          {inStock ? 'In Stock' : 'Out of Stock'}
        </Tag>
      ),
      filters: [
        { text: 'In Stock', value: true },
        { text: 'Out of Stock', value: false },
      ],
      onFilter: (value, record) => record.inStock === value,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => onEdit?.(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this product?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={filteredItems}
      loading={isLoading}
      pagination={pagination}
      onChange={handleTableChange}
      rowKey="id"
      className={styles.productTable}
    />
  );
};
```

---

## 🎯 Example 6: File Upload with Progress

```tsx
// src/features/FileUpload/UploadArea/UploadArea.tsx
import { useState } from 'react';
import { Upload, message, Progress, Button } from 'antd';
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
import type { UploadProps, RcFile } from 'antd/es/upload';
import axios from 'axios';
import { API_BASE_URL } from 'shared/config/api.config';
import styles from './UploadArea.module.scss';

interface UploadAreaProps {
  onSuccess?: (url: string) => void;
  maxSize?: number; // in MB
  acceptedTypes?: string[];
}

export const UploadArea = ({
  onSuccess,
  maxSize = 10,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/gif'],
}: UploadAreaProps) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const customUpload = async (options: any) => {
    const { file, onSuccess: onUploadSuccess, onError } = options;

    setUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 1)
            );
            setProgress(percentCompleted);
          },
        }
      );

      message.success('File uploaded successfully!');
      onUploadSuccess(response.data);
      onSuccess?.(response.data.url);
    } catch (error: any) {
      message.error('Upload failed');
      onError(error);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const beforeUpload = (file: RcFile) => {
    const isValidType = acceptedTypes.includes(file.type);
    if (!isValidType) {
      message.error(`You can only upload ${acceptedTypes.join(', ')} files!`);
      return false;
    }

    const isValidSize = file.size / 1024 / 1024 < maxSize;
    if (!isValidSize) {
      message.error(`File must be smaller than ${maxSize}MB!`);
      return false;
    }

    return true;
  };

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: false,
    customRequest: customUpload,
    beforeUpload,
    showUploadList: false,
  };

  return (
    <div className={styles.uploadArea}>
      <Upload.Dragger {...uploadProps} disabled={uploading}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          Click or drag file to this area to upload
        </p>
        <p className="ant-upload-hint">
          Support for single upload. File size must be less than {maxSize}MB.
        </p>
      </Upload.Dragger>

      {uploading && (
        <div className={styles.progress}>
          <Progress percent={progress} status="active" />
        </div>
      )}
    </div>
  );
};
```

---

Эти примеры покрывают 90% типичных сценариев в real-world приложениях! 🚀
