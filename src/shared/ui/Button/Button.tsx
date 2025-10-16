import { Button as AntButton, ButtonProps as AntButtonProps } from 'antd';
import { classNames } from 'shared/lib/helpers/classNames/classNames';
import styles from './Button.module.scss';

interface ButtonProps extends AntButtonProps {
  className?: string;
}

export const Button = ({ className, children, ...props }: ButtonProps) => {
  return (
    <AntButton
      className={classNames(styles.button, {}, [className])}
      {...props}
    >
      {children}
    </AntButton>
  );
};
