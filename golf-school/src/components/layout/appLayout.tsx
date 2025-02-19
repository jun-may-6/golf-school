import React from 'react';
import { GlobalLoading } from '../gateLayout/globalLoading';
import { useAppSelector } from '../../store';

type AppLayoutProps = {
  children: React.ReactNode;
};

export const AppLayout = ({ children }: AppLayoutProps): JSX.Element => {
  const loadingData = useAppSelector(state=>state.globalLoading)
  return (
    <>
    <GlobalLoading isLoading={loadingData.isLoading} loadingMessage={loadingData.message} />
    {children}
    </>
  );
};
