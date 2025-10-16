# 🤖 Claude Code Instructions for Ranks Template

> **IMPORTANT**: This is a STRICT ARCHITECTURE project with SERIOUS FINANCIAL IMPLICATIONS.
> Follow ALL rules and patterns EXACTLY as described. NO DEVIATIONS without explicit approval.

---

## 🎯 Project Overview

This is an enterprise-grade React TypeScript application using **Feature-Sliced Design (FSD)** architecture with Redux Toolkit, React Router, and Ant Design. Every file has its place, every pattern must be followed religiously.

---

## 📐 CRITICAL ARCHITECTURE RULES

### Layer Hierarchy (NEVER VIOLATE)

```
app → pages → widgets → features → entities → shared
```

**ABSOLUTE RULES:**
1. ❌ **NEVER** import from a higher layer
2. ❌ **NEVER** import features in other features
3. ❌ **NEVER** import entities in other entities
4. ✅ **ALWAYS** import from lower layers only
5. ✅ **ALWAYS** use path aliases (never `../../..`)

---

## 🏗️ HOW TO CREATE COMPONENTS

### 1. PAGE COMPONENT (Full Structure)

**Location**: `src/pages/[PageName]/[PageName].tsx`

```tsx
// src/pages/DashboardPage/DashboardPage.tsx
import { useState, useEffect } from 'react';
import { Typography, Card, Row, Col, Space } from 'antd';
import { useSelector } from 'react-redux';
import { RootState } from 'app/providers/store/config/store';
import { useAppDispatch } from 'shared/hooks/useAppDispatch';
import { Header } from 'widgets/Header/Header';
import { StatsWidget } from 'widgets/StatsWidget/StatsWidget';
import { fetchDashboardData } from 'entities/Dashboard/slice/dashboardSlice';
import styles from './DashboardPage.module.scss';

const { Title, Paragraph } = Typography;

const DashboardPage = () => {
  const dispatch = useAppDispatch();
  const { data, isLoading, error } = useSelector((state: RootState) => state.dashboard);
  const [localState, setLocalState] = useState<string>('');

  // Data fetching on mount
  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  // Error handling
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <Header />
      <div className={styles.dashboardPage}>
        <div className={styles.container}>
          <Title level={1}>Dashboard</Title>

          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <StatsWidget data={data} loading={isLoading} />

            <Row gutter={[16, 16]}>
              <Col xs={24} md={12} lg={8}>
                <Card title="Card 1" loading={isLoading}>
                  Content 1
                </Card>
              </Col>
              <Col xs={24} md={12} lg={8}>
                <Card title="Card 2" loading={isLoading}>
                  Content 2
                </Card>
              </Col>
            </Row>
          </Space>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
```

**SCSS Module** (`DashboardPage.module.scss`):

```scss
@use 'app/styles/mixins' as mix;

.dashboardPage {
  min-height: calc(100vh - 64px);
  padding: var(--spacing-lg);
  background: var(--background-secondary);

  @include mix.respond-to('mobile') {
    padding: var(--spacing-md);
  }
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}
```

**Router Integration** (in `AppRouter.tsx`):

```tsx
// Add lazy import
const DashboardPage = lazy(() => import('pages/DashboardPage/DashboardPage'));

// Add route
<Route
  path="/dashboard"
  element={
    <RequireAuth>
      <Suspense fallback={<Loader />}>
        <DashboardPage />
      </Suspense>
    </RequireAuth>
  }
/>
```

---

### 2. WIDGET COMPONENT (Composite Block)

**Location**: `src/widgets/[WidgetName]/[WidgetName].tsx`

```tsx
// src/widgets/StatsWidget/StatsWidget.tsx
import { Card, Row, Col, Statistic } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { classNames } from 'shared/lib/helpers/classNames/classNames';
import styles from './StatsWidget.module.scss';

interface StatsData {
  users: number;
  revenue: number;
  orders: number;
  growth: number;
}

interface StatsWidgetProps {
  data: StatsData | null;
  loading?: boolean;
  className?: string;
}

export const StatsWidget = ({ data, loading = false, className }: StatsWidgetProps) => {
  return (
    <div className={classNames(styles.statsWidget, {}, [className])}>
      <Row gutter={16}>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="Total Users"
              value={data?.users || 0}
              prefix={<ArrowUpOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="Revenue"
              value={data?.revenue || 0}
              prefix="$"
              precision={2}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="Orders"
              value={data?.orders || 0}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="Growth"
              value={data?.growth || 0}
              suffix="%"
              prefix={data && data.growth >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
              valueStyle={{ color: data && data.growth >= 0 ? '#3f8600' : '#cf1322' }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};
```

---

### 3. FEATURE COMPONENT (Business Feature)

**Location**: `src/features/[FeatureName]/[ComponentName]/[ComponentName].tsx`

```tsx
// src/features/ProductFilter/FilterPanel/FilterPanel.tsx
import { Form, Select, Input, Button, Space, InputNumber } from 'antd';
import { SearchOutlined, ClearOutlined } from '@ant-design/icons';
import { useAppDispatch } from 'shared/hooks/useAppDispatch';
import { setFilters, clearFilters } from 'entities/Product/slice/productSlice';
import styles from './FilterPanel.module.scss';

interface FilterFormValues {
  category?: string;
  priceMin?: number;
  priceMax?: number;
  search?: string;
}

interface FilterPanelProps {
  categories: string[];
  onFilterChange?: (filters: FilterFormValues) => void;
}

export const FilterPanel = ({ categories, onFilterChange }: FilterPanelProps) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();

  const handleFinish = (values: FilterFormValues) => {
    dispatch(setFilters(values));
    onFilterChange?.(values);
  };

  const handleClear = () => {
    form.resetFields();
    dispatch(clearFilters());
    onFilterChange?.({});
  };

  return (
    <div className={styles.filterPanel}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{}}
      >
        <Form.Item name="search" label="Search">
          <Input
            placeholder="Search products..."
            prefix={<SearchOutlined />}
          />
        </Form.Item>

        <Form.Item name="category" label="Category">
          <Select placeholder="Select category" allowClear>
            {categories.map(cat => (
              <Select.Option key={cat} value={cat}>
                {cat}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Space>
          <Form.Item name="priceMin" label="Min Price">
            <InputNumber min={0} placeholder="0" />
          </Form.Item>

          <Form.Item name="priceMax" label="Max Price">
            <InputNumber min={0} placeholder="1000" />
          </Form.Item>
        </Space>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
              Apply Filters
            </Button>
            <Button onClick={handleClear} icon={<ClearOutlined />}>
              Clear
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};
```

---

## 🗄️ ENTITY STRUCTURE (Business Data)

### Full Entity Implementation

**Location**: `src/entities/[EntityName]/`

#### 1. Types (`types/[entity].types.ts`)

```typescript
// src/entities/Product/types/product.types.ts

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  inStock: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilters {
  category?: string;
  priceMin?: number;
  priceMax?: number;
  search?: string;
  inStock?: boolean;
}

export interface ProductsState {
  items: Product[];
  filteredItems: Product[];
  selectedProduct: Product | null;
  filters: ProductFilters;
  isLoading: boolean;
  error: string | null;
  total: number;
  page: number;
  pageSize: number;
}

export interface FetchProductsParams {
  page?: number;
  pageSize?: number;
  filters?: ProductFilters;
}

export interface CreateProductDTO {
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  inStock: boolean;
}

export interface UpdateProductDTO extends Partial<CreateProductDTO> {
  id: string;
}
```

#### 2. API Layer (`api/[entity]Api.ts`)

```typescript
// src/entities/Product/api/productApi.ts
import axios, { AxiosResponse } from 'axios';
import { API_BASE_URL } from 'shared/config/api.config';
import {
  Product,
  FetchProductsParams,
  CreateProductDTO,
  UpdateProductDTO,
} from '../types/product.types';

// Response types
interface ProductsResponse {
  data: Product[];
  total: number;
  page: number;
  pageSize: number;
}

interface SingleProductResponse {
  data: Product;
}

// Base URL for products
const PRODUCTS_URL = `${API_BASE_URL}/products`;

// Helper to add auth header
const getAuthHeader = (token: string) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export const productApi = {
  // GET: Fetch all products with filters
  getProducts: async (
    params: FetchProductsParams,
    token: string
  ): Promise<ProductsResponse> => {
    const response: AxiosResponse<ProductsResponse> = await axios.get(
      PRODUCTS_URL,
      {
        params: {
          page: params.page || 1,
          pageSize: params.pageSize || 20,
          ...params.filters,
        },
        ...getAuthHeader(token),
      }
    );
    return response.data;
  },

  // GET: Fetch single product by ID
  getProductById: async (
    id: string,
    token: string
  ): Promise<Product> => {
    const response: AxiosResponse<SingleProductResponse> = await axios.get(
      `${PRODUCTS_URL}/${id}`,
      getAuthHeader(token)
    );
    return response.data.data;
  },

  // POST: Create new product
  createProduct: async (
    data: CreateProductDTO,
    token: string
  ): Promise<Product> => {
    const response: AxiosResponse<SingleProductResponse> = await axios.post(
      PRODUCTS_URL,
      data,
      getAuthHeader(token)
    );
    return response.data.data;
  },

  // PUT: Update product
  updateProduct: async (
    data: UpdateProductDTO,
    token: string
  ): Promise<Product> => {
    const { id, ...updateData } = data;
    const response: AxiosResponse<SingleProductResponse> = await axios.put(
      `${PRODUCTS_URL}/${id}`,
      updateData,
      getAuthHeader(token)
    );
    return response.data.data;
  },

  // DELETE: Delete product
  deleteProduct: async (
    id: string,
    token: string
  ): Promise<void> => {
    await axios.delete(
      `${PRODUCTS_URL}/${id}`,
      getAuthHeader(token)
    );
  },

  // GET: Fetch categories
  getCategories: async (token: string): Promise<string[]> => {
    const response: AxiosResponse<{ data: string[] }> = await axios.get(
      `${PRODUCTS_URL}/categories`,
      getAuthHeader(token)
    );
    return response.data.data;
  },
};
```

#### 3. Redux Slice (`slice/[entity]Slice.ts`)

```typescript
// src/entities/Product/slice/productSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { productApi } from '../api/productApi';
import {
  ProductsState,
  Product,
  ProductFilters,
  FetchProductsParams,
  CreateProductDTO,
  UpdateProductDTO,
} from '../types/product.types';
import { RootState } from 'app/providers/store/config/store';

// Initial state
const initialState: ProductsState = {
  items: [],
  filteredItems: [],
  selectedProduct: null,
  filters: {},
  isLoading: false,
  error: null,
  total: 0,
  page: 1,
  pageSize: 20,
};

// Async thunks
export const fetchProductsThunk = createAsyncThunk<
  { products: Product[]; total: number },
  FetchProductsParams | undefined,
  { state: RootState; rejectValue: string }
>(
  'products/fetchAll',
  async (params = {}, { getState, rejectWithValue }) => {
    try {
      const token = getState().user.token;
      if (!token) {
        return rejectWithValue('No authentication token');
      }

      const response = await productApi.getProducts(params, token);
      return {
        products: response.data,
        total: response.total,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch products'
      );
    }
  }
);

export const fetchProductByIdThunk = createAsyncThunk<
  Product,
  string,
  { state: RootState; rejectValue: string }
>(
  'products/fetchById',
  async (id, { getState, rejectWithValue }) => {
    try {
      const token = getState().user.token;
      if (!token) {
        return rejectWithValue('No authentication token');
      }

      return await productApi.getProductById(id, token);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch product'
      );
    }
  }
);

export const createProductThunk = createAsyncThunk<
  Product,
  CreateProductDTO,
  { state: RootState; rejectValue: string }
>(
  'products/create',
  async (data, { getState, rejectWithValue }) => {
    try {
      const token = getState().user.token;
      if (!token) {
        return rejectWithValue('No authentication token');
      }

      return await productApi.createProduct(data, token);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create product'
      );
    }
  }
);

export const updateProductThunk = createAsyncThunk<
  Product,
  UpdateProductDTO,
  { state: RootState; rejectValue: string }
>(
  'products/update',
  async (data, { getState, rejectWithValue }) => {
    try {
      const token = getState().user.token;
      if (!token) {
        return rejectWithValue('No authentication token');
      }

      return await productApi.updateProduct(data, token);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update product'
      );
    }
  }
);

export const deleteProductThunk = createAsyncThunk<
  string,
  string,
  { state: RootState; rejectValue: string }
>(
  'products/delete',
  async (id, { getState, rejectWithValue }) => {
    try {
      const token = getState().user.token;
      if (!token) {
        return rejectWithValue('No authentication token');
      }

      await productApi.deleteProduct(id, token);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete product'
      );
    }
  }
);

// Slice
const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    // Set filters
    setFilters: (state, action: PayloadAction<ProductFilters>) => {
      state.filters = action.payload;
      // Apply filters to items
      state.filteredItems = state.items.filter(product => {
        const filters = action.payload;

        if (filters.category && product.category !== filters.category) {
          return false;
        }

        if (filters.priceMin !== undefined && product.price < filters.priceMin) {
          return false;
        }

        if (filters.priceMax !== undefined && product.price > filters.priceMax) {
          return false;
        }

        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          return (
            product.name.toLowerCase().includes(searchLower) ||
            product.description.toLowerCase().includes(searchLower)
          );
        }

        if (filters.inStock !== undefined && product.inStock !== filters.inStock) {
          return false;
        }

        return true;
      });
    },

    // Clear filters
    clearFilters: (state) => {
      state.filters = {};
      state.filteredItems = state.items;
    },

    // Select product
    selectProduct: (state, action: PayloadAction<Product | null>) => {
      state.selectedProduct = action.payload;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all products
    builder
      .addCase(fetchProductsThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.products;
        state.filteredItems = action.payload.products;
        state.total = action.payload.total;
      })
      .addCase(fetchProductsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Unknown error';
      });

    // Fetch product by ID
    builder
      .addCase(fetchProductByIdThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductByIdThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductByIdThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Unknown error';
      });

    // Create product
    builder
      .addCase(createProductThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createProductThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items.unshift(action.payload);
        state.filteredItems.unshift(action.payload);
        state.total += 1;
      })
      .addCase(createProductThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Unknown error';
      });

    // Update product
    builder
      .addCase(updateProductThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProductThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.items.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        const filteredIndex = state.filteredItems.findIndex(p => p.id === action.payload.id);
        if (filteredIndex !== -1) {
          state.filteredItems[filteredIndex] = action.payload;
        }
        if (state.selectedProduct?.id === action.payload.id) {
          state.selectedProduct = action.payload;
        }
      })
      .addCase(updateProductThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Unknown error';
      });

    // Delete product
    builder
      .addCase(deleteProductThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteProductThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = state.items.filter(p => p.id !== action.payload);
        state.filteredItems = state.filteredItems.filter(p => p.id !== action.payload);
        state.total -= 1;
        if (state.selectedProduct?.id === action.payload) {
          state.selectedProduct = null;
        }
      })
      .addCase(deleteProductThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Unknown error';
      });
  },
});

// Export actions
export const { setFilters, clearFilters, selectProduct, clearError } = productSlice.actions;

// Export selectors
export const selectProducts = (state: RootState) => state.products.filteredItems;
export const selectAllProducts = (state: RootState) => state.products.items;
export const selectSelectedProduct = (state: RootState) => state.products.selectedProduct;
export const selectProductsLoading = (state: RootState) => state.products.isLoading;
export const selectProductsError = (state: RootState) => state.products.error;
export const selectProductsFilters = (state: RootState) => state.products.filters;

// Export reducer
export default productSlice.reducer;
```

#### 4. Register in Store

```typescript
// src/app/providers/store/config/store.ts
import productReducer from 'entities/Product/slice/productSlice';

const rootReducer = combineReducers({
  user: userReducer,
  products: productReducer, // ADD HERE
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user', 'products'], // ADD TO PERSIST IF NEEDED
};
```

---

## 🎨 SHARED UI COMPONENT

**Location**: `src/shared/ui/[ComponentName]/[ComponentName].tsx`

```tsx
// src/shared/ui/Card/Card.tsx
import { ReactNode } from 'react';
import { Card as AntCard, CardProps as AntCardProps } from 'antd';
import { classNames } from 'shared/lib/helpers/classNames/classNames';
import styles from './Card.module.scss';

interface CardProps extends AntCardProps {
  children: ReactNode;
  variant?: 'default' | 'bordered' | 'hoverable';
  className?: string;
}

export const Card = ({
  children,
  variant = 'default',
  className,
  ...antdProps
}: CardProps) => {
  const mods = {
    [styles.bordered]: variant === 'bordered',
    [styles.hoverable]: variant === 'hoverable',
  };

  return (
    <AntCard
      className={classNames(styles.card, mods, [className])}
      {...antdProps}
    >
      {children}
    </AntCard>
  );
};
```

---

## 🔗 CUSTOM HOOK

**Location**: `src/shared/hooks/[hookName].ts`

```typescript
// src/shared/hooks/useDebounce.ts
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Usage in component:
// const debouncedSearch = useDebounce(searchTerm, 500);
```

```typescript
// src/shared/hooks/usePagination.ts
import { useState, useCallback } from 'react';

interface UsePaginationResult {
  page: number;
  pageSize: number;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  reset: () => void;
}

export function usePagination(
  initialPage: number = 1,
  initialPageSize: number = 20
): UsePaginationResult {
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const reset = useCallback(() => {
    setPage(initialPage);
    setPageSize(initialPageSize);
  }, [initialPage, initialPageSize]);

  return {
    page,
    pageSize,
    setPage,
    setPageSize,
    reset,
  };
}
```

---

## 📝 FORM HANDLING

### Complete Form Example with Validation

```tsx
// src/features/ProductForm/CreateProductForm/CreateProductForm.tsx
import { Form, Input, InputNumber, Select, Switch, Button, message } from 'antd';
import { useState } from 'react';
import { useAppDispatch } from 'shared/hooks/useAppDispatch';
import { createProductThunk } from 'entities/Product/slice/productSlice';
import { CreateProductDTO } from 'entities/Product/types/product.types';
import styles from './CreateProductForm.module.scss';

const { TextArea } = Input;

interface CreateProductFormProps {
  categories: string[];
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const CreateProductForm = ({
  categories,
  onSuccess,
  onCancel,
}: CreateProductFormProps) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const handleFinish = async (values: CreateProductDTO) => {
    setLoading(true);

    try {
      await dispatch(createProductThunk(values)).unwrap();
      message.success('Product created successfully!');
      form.resetFields();
      onSuccess?.();
    } catch (error: any) {
      message.error(error || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      initialValues={{
        inStock: true,
        price: 0,
      }}
      className={styles.createProductForm}
    >
      <Form.Item
        name="name"
        label="Product Name"
        rules={[
          { required: true, message: 'Please enter product name' },
          { min: 3, message: 'Name must be at least 3 characters' },
          { max: 100, message: 'Name must not exceed 100 characters' },
        ]}
      >
        <Input placeholder="Enter product name" />
      </Form.Item>

      <Form.Item
        name="description"
        label="Description"
        rules={[
          { required: true, message: 'Please enter description' },
          { min: 10, message: 'Description must be at least 10 characters' },
        ]}
      >
        <TextArea
          rows={4}
          placeholder="Enter product description"
          showCount
          maxLength={500}
        />
      </Form.Item>

      <Form.Item
        name="price"
        label="Price"
        rules={[
          { required: true, message: 'Please enter price' },
          { type: 'number', min: 0, message: 'Price must be positive' },
        ]}
      >
        <InputNumber
          prefix="$"
          style={{ width: '100%' }}
          precision={2}
          min={0}
          placeholder="0.00"
        />
      </Form.Item>

      <Form.Item
        name="category"
        label="Category"
        rules={[{ required: true, message: 'Please select category' }]}
      >
        <Select placeholder="Select category">
          {categories.map(cat => (
            <Select.Option key={cat} value={cat}>
              {cat}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="imageUrl"
        label="Image URL"
        rules={[
          { type: 'url', message: 'Please enter valid URL' },
        ]}
      >
        <Input placeholder="https://example.com/image.jpg" />
      </Form.Item>

      <Form.Item
        name="inStock"
        label="In Stock"
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          block
        >
          Create Product
        </Button>
        {onCancel && (
          <Button
            onClick={onCancel}
            style={{ marginTop: 8 }}
            block
          >
            Cancel
          </Button>
        )}
      </Form.Item>
    </Form>
  );
};
```

---

## 🌐 HTTP REQUEST PATTERNS

### Axios Interceptor Setup

```typescript
// src/shared/api/axios.config.ts
import axios from 'axios';
import { API_BASE_URL } from 'shared/config/api.config';

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token from localStorage
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh token
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        const { token } = response.data;
        localStorage.setItem('authToken', token);

        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout user
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
```

---

## 🔐 AUTHENTICATION FLOW

### Complete Auth Implementation

```typescript
// src/entities/Auth/slice/authSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '../api/authApi';

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: localStorage.getItem('authToken'),
  refreshToken: localStorage.getItem('refreshToken'),
  isAuthenticated: !!localStorage.getItem('authToken'),
  isLoading: false,
  error: null,
};

export const loginThunk = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authApi.login(credentials);

      // Save tokens
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('refreshToken', response.refreshToken);

      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Login failed'
      );
    }
  }
);

export const logoutThunk = createAsyncThunk(
  'auth/logout',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: AuthState };
      if (state.auth.token) {
        await authApi.logout(state.auth.token);
      }

      // Clear tokens
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('persist:root');

      return null;
    } catch (error: any) {
      // Still clear tokens even if API call fails
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('persist:root');

      return null;
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });

    // Logout
    builder
      .addCase(logoutThunk.fulfilled, (state) => {
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.error = null;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
```

---

## 📦 DATA PERSISTENCE (Redux Persist)

### Whitelist Strategy

```typescript
// In store.ts
const persistConfig = getPersistConfig({
  key: 'root',
  storage,
  whitelist: [
    // Auth
    'auth.token',
    'auth.refreshToken',

    // User
    'user.profile',
    'user.preferences',

    // Products (don't persist loading states!)
    'products.items',         // ✅ Persist data
    'products.filters',       // ✅ Persist filters
    // 'products.isLoading',  // ❌ Don't persist
    // 'products.error',      // ❌ Don't persist

    // Cart
    'cart.items',
    'cart.total',
  ],
  rootReducer,
});
```

**RULES:**
- ✅ **DO persist**: User data, auth tokens, cart, preferences
- ❌ **DON'T persist**: Loading states, errors, temporary UI state

---

## 🎨 STYLING GUIDELINES

### SCSS Module Structure

```scss
// Component.module.scss
@use 'app/styles/mixins' as mix;

// Container
.componentName {
  padding: var(--spacing-md);
  background: var(--background-color);

  // Responsive
  @include mix.respond-to('tablet') {
    padding: var(--spacing-lg);
  }

  // Modifier classes
  &--variant {
    border: 1px solid var(--border-color);
  }

  // Child elements
  &__header {
    margin-bottom: var(--spacing-md);
    @include mix.flex-between;
  }

  &__title {
    font-size: var(--font-size-xl);
    font-weight: 600;
    color: var(--text-color);
  }

  &__content {
    // Content styles
  }

  // States
  &.isLoading {
    opacity: 0.6;
    pointer-events: none;
  }

  &.hasError {
    border-color: var(--error-color);
  }
}

// Nested component
.nestedComponent {
  padding: var(--spacing-sm);

  .componentName & {
    // Styles when nested inside componentName
    background: white;
  }
}
```

### classNames Usage

```tsx
import { classNames } from 'shared/lib/helpers/classNames/classNames';

<div
  className={classNames(
    styles.component,
    {
      [styles.isLoading]: isLoading,
      [styles.hasError]: !!error,
      [styles['component--primary']]: variant === 'primary',
    },
    [className, isActive && 'active']
  )}
>
```

---

## ⚡ PERFORMANCE OPTIMIZATION

### 1. React.memo

```tsx
import { memo } from 'react';

interface ProductCardProps {
  product: Product;
  onSelect: (id: string) => void;
}

export const ProductCard = memo(({ product, onSelect }: ProductCardProps) => {
  return (
    <Card onClick={() => onSelect(product.id)}>
      {product.name}
    </Card>
  );
}, (prevProps, nextProps) => {
  // Custom comparison
  return prevProps.product.id === nextProps.product.id;
});
```

### 2. useCallback

```tsx
import { useCallback } from 'react';

const handleClick = useCallback((id: string) => {
  dispatch(selectProduct(id));
}, [dispatch]);
```

### 3. useMemo

```tsx
import { useMemo } from 'react';

const expensiveCalculation = useMemo(() => {
  return products.reduce((acc, p) => acc + p.price, 0);
}, [products]);
```

### 4. Lazy Loading

```tsx
import { lazy, Suspense } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

<Suspense fallback={<Loader />}>
  <HeavyComponent />
</Suspense>
```

---

## 🧪 ERROR HANDLING

### API Error Handling Pattern

```typescript
// In component
const handleAction = async () => {
  try {
    setLoading(true);
    const result = await dispatch(someThunk(data)).unwrap();
    message.success('Action successful!');
    onSuccess?.(result);
  } catch (error: any) {
    // Error already handled by Redux
    message.error(error || 'Action failed');
    console.error('Action error:', error);
  } finally {
    setLoading(false);
  }
};
```

### Global Error Boundary

```tsx
// Already implemented in app/providers/ErrorBoundary/ErrorBoundary.tsx
<ErrorBoundary
  fallbackRender={(error, errorInfo, reset) => (
    <ErrorPage
      error={error}
      errorInfo={errorInfo}
      resetErrorBoundary={reset}
    />
  )}
>
  <App />
</ErrorBoundary>
```

---

## 🔒 SECURITY BEST PRACTICES

### 1. Environment Variables

```typescript
// ✅ CORRECT - Use env variables
const apiUrl = import.meta.env.VITE_API_BASE_URL;

// ❌ WRONG - Don't hardcode
const apiUrl = 'http://api.example.com';
```

### 2. Token Storage

```typescript
// ✅ CORRECT - Use httpOnly cookies for sensitive tokens (backend sets)
// Or encrypted localStorage with short expiry

// ❌ WRONG - Plain text in localStorage without rotation
localStorage.setItem('password', 'plain-text-password'); // NEVER!
```

### 3. Input Sanitization

```typescript
import DOMPurify from 'dompurify';

// Sanitize HTML before rendering
const sanitizedHTML = DOMPurify.sanitize(userInput);
```

### 4. XSS Prevention

```tsx
// ✅ CORRECT - React escapes by default
<div>{userInput}</div>

// ❌ WRONG - dangerouslySetInnerHTML without sanitization
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✅ CORRECT - If you must use HTML, sanitize first
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userInput) }} />
```

---

## 📋 COMPLETE FEATURE CHECKLIST

When implementing a new feature:

1. ✅ Create types in `entities/[Entity]/types/`
2. ✅ Create API methods in `entities/[Entity]/api/`
3. ✅ Create Redux slice in `entities/[Entity]/slice/`
4. ✅ Register slice in `store.ts`
5. ✅ Create UI components in appropriate layer
6. ✅ Add routing if needed
7. ✅ Add error handling
8. ✅ Add loading states
9. ✅ Add TypeScript types everywhere
10. ✅ Add SCSS modules for styling
11. ✅ Test all CRUD operations
12. ✅ Handle edge cases
13. ✅ Add user feedback (messages)
14. ✅ Optimize performance (memo, callbacks)
15. ✅ Document complex logic

---

## 🚨 CRITICAL DON'TS

### NEVER DO THESE:

1. ❌ Import from higher layers (features → pages, entities → features)
2. ❌ Use `any` type without VERY good reason
3. ❌ Hardcode API URLs
4. ❌ Store passwords in state/localStorage
5. ❌ Mutate Redux state directly (use immer via RTK)
6. ❌ Use `../../../` relative imports (use aliases)
7. ❌ Skip error handling in async operations
8. ❌ Commit `.env` file
9. ❌ Leave console.log in production code
10. ❌ Skip TypeScript errors with `@ts-ignore`

---

## ✅ ALWAYS DO THESE:

1. ✅ Use path aliases (`shared/`, `entities/`, etc.)
2. ✅ Type everything with TypeScript
3. ✅ Handle loading and error states
4. ✅ Use Redux for global state
5. ✅ Use local state for UI-only state
6. ✅ Follow FSD layer hierarchy
7. ✅ Use SCSS modules for styling
8. ✅ Add user feedback (messages, notifications)
9. ✅ Optimize with memo/callback when needed
10. ✅ Test your code before committing

---

## 🎯 FINAL NOTES

This project uses **SERIOUS ARCHITECTURE** for **HIGH-STAKES APPLICATIONS**.

Every pattern, every rule, every structure exists for a reason:
- **Maintainability** - Easy to understand and modify
- **Scalability** - Grows with your team and features
- **Reliability** - Predictable behavior, fewer bugs
- **Performance** - Optimized from the start
- **Security** - Best practices baked in

**FOLLOW THE PATTERNS. DON'T IMPROVISE.**

When in doubt:
1. Check existing code for patterns
2. Refer to this document
3. Follow FSD principles
4. Ask before breaking rules

---

**Good luck building enterprise-grade applications!** 🚀

*This document must be treated as LAW for this codebase.*
