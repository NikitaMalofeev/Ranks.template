import { Spin } from 'antd';
import styles from './Loader.module.scss';

interface LoaderProps {
  fullscreen?: boolean;
  size?: 'small' | 'default' | 'large';
}

export const Loader = ({ fullscreen = true, size = 'large' }: LoaderProps) => {
  if (fullscreen) {
    return (
      <div className={styles.loaderFullscreen}>
        <Spin size={size} />
      </div>
    );
  }

  return <Spin size={size} />;
};
