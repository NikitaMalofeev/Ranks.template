import { ErrorInfo } from 'react';
import { Button, Result } from 'antd';
import styles from './ErrorPage.module.scss';

interface ErrorPageProps {
  error?: Error;
  errorInfo?: ErrorInfo;
  resetErrorBoundary?: () => void;
}

const ErrorPage = ({ error, errorInfo, resetErrorBoundary }: ErrorPageProps) => {
  return (
    <div className={styles.errorPage}>
      <Result
        status="500"
        title="Something went wrong"
        subTitle={error?.message || 'An unexpected error occurred'}
        extra={
          resetErrorBoundary ? (
            <Button type="primary" onClick={resetErrorBoundary}>
              Try Again
            </Button>
          ) : (
            <Button type="primary" onClick={() => window.location.href = '/'}>
              Go Home
            </Button>
          )
        }
      />
      {errorInfo && (
        <details className={styles.details}>
          <summary>Error Details</summary>
          <pre>{errorInfo.componentStack}</pre>
        </details>
      )}
    </div>
  );
};

export default ErrorPage;
