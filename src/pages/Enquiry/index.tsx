import { PageContainer } from '@ant-design/pro-components';
import { Card, Empty } from 'antd';
import React from 'react';

const Enquiry: React.FC = () => {
  return (
    <PageContainer header={{ title: '销售机会' }}>
      <Card>
        <Empty description="销售机会页面占位：后端接口接入后展示列表与详情" />
      </Card>
    </PageContainer>
  );
};

export default Enquiry;
