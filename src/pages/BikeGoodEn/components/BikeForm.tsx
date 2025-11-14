import {
  ModalForm,
  ProFormSelect,
  ProFormText,
  ProFormUploadDragger,
} from '@ant-design/pro-components';
import { Alert, Col, message, Row, Typography } from 'antd';
import React, { useState } from 'react';
import type { BikeListItem } from '../index';

const { Title } = Typography;

export type BikeFormProps = {
  onCancel: () => void;
  onSubmit: (values: BikeListItem) => Promise<void>;
  modalOpen: boolean;
};

const BikeForm: React.FC<BikeFormProps> = (props) => {
  const [previewHtml, setPreviewHtml] = useState<string>('');
  const [uploadedImages, setUploadedImages] = useState<any[]>([]);

  const generateHtml = (fileList: any[]) => {
    if (!fileList || fileList.length === 0) return '';
    return fileList
      .filter((file) => file.status === 'done' && file.response)
      .map((file: any) => {
        const imageUrl = file.response;
        return `<p style="text-align: center;">
    <img data-src="${imageUrl}" src="${imageUrl}" style="width: 100%;" />
</p>
`;
      })
      .join('\n');
  };

  const handleFinish = async (values: any) => {
    const detailHtml = generateHtml(uploadedImages);
    await props.onSubmit({
      title: values.title,
      category: values.category,
      detailHtml: detailHtml,
    });
  };

  return (
    <ModalForm
      title="新增车辆"
      width="1200px"
      open={props.modalOpen}
      onOpenChange={(visible) => {
        if (!visible) {
          props.onCancel();
          setPreviewHtml('');
          setUploadedImages([]);
        }
      }}
      onFinish={handleFinish}
      modalProps={{
        destroyOnClose: true,
      }}
    >
      <Alert
        message="提示"
        description="请先创建车辆，然后在表格中点击“改主图”按钮上传主图。"
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
      />
      <Row gutter={24}>
        <Col span={12}>
          <ProFormText
            rules={[
              {
                required: true,
                message: '车辆型号必填！',
              },
            ]}
            label="车辆型号"
            name="title"
            placeholder="请输入车辆型号"
          />
          <ProFormSelect
            rules={[
              {
                required: true,
                message: '分类必选！',
              },
            ]}
            label="分类"
            name="category"
            valueEnum={{
              电三轮系列: '电三轮系列',
              电动摩托车: '电动摩托车',
              电动自行车: '电动自行车',
              电助力系列: '电助力系列',
              轻型电摩: '轻型电摩',
            }}
            placeholder="请选择分类"
          />
          <ProFormUploadDragger
            label="上传详情图片（多张，按顺序）"
            name="images"
            action="/proxy/v1/api/upload/common"
            description="点击或拖拽图片上传，支持多张图片"
            fieldProps={{
              onChange: (info) => {
                setUploadedImages(info.fileList);
                const html = generateHtml(info.fileList);
                setPreviewHtml(html);
                if (info.file.status === 'done') {
                  message.success(`${info.file.name} 上传成功`);
                } else if (info.file.status === 'error') {
                  message.error(`${info.file.name} 上传失败`);
                }
              },
            }}
          />
        </Col>
        <Col span={12}>
          <Title level={5}>详情预览</Title>
          <div
            style={{
              border: '1px solid #d9d9d9',
              borderRadius: '4px',
              padding: '16px',
              minHeight: '400px',
              maxHeight: '600px',
              overflow: 'auto',
              backgroundColor: '#fafafa',
            }}
          >
            {previewHtml ? (
              <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
            ) : (
              <div style={{ color: '#999', textAlign: 'center', marginTop: '100px' }}>
                上传图片后将在此处预览
              </div>
            )}
          </div>
        </Col>
      </Row>
    </ModalForm>
  );
};

export default BikeForm;
