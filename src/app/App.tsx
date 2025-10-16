import { ConfigProvider } from 'antd';
import ruRU from 'antd/locale/ru_RU';
import AppRouter from './providers/router/ui/AppRouter';
import './styles/index.scss';

function App() {
  return (
    <ConfigProvider locale={ruRU}>
      <div className='app'>
        <AppRouter />
      </div>
    </ConfigProvider>
  );
}

export default App;
