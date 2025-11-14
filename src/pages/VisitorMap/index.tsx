import { PageContainer } from '@ant-design/pro-components';
import { Card, Empty } from 'antd';
import React from 'react';

const VisitorMap: React.FC = () => {
  return (
    <PageContainer header={{ title: '用户访问地图' }}>
      <Card>
        <Empty description="用户访问地图页面占位：后端接口接入后展示统计数据与地图" />
      </Card>
    </PageContainer>
  );
};

export default VisitorMap;
