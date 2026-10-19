import { App as AntApp, ConfigProvider } from 'antd';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/router';

export default function App() {
  return (
    <ConfigProvider
      theme={{
        tokens: {
          colorPrimary: '#15803d',
          borderRadius: 8,
        },
      }}
    >
      <AntApp>
        <RouterProvider router={router} />
      </AntApp>
    </ConfigProvider>
  );
}
