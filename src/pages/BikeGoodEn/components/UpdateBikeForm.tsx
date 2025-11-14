import { saveMainImageEn } from '@/services/ant-design-pro/bikeEn';
import {
  ModalForm,
  ProFormSelect,
  ProFormText,
  ProFormUploadDragger,
} from '@ant-design/pro-components';
import { Col, Divider, message, Row, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import type { BikeListItem } from '../index';

const { Title, Text } = Typography;

export type UpdateBikeFormProps = {
  onCancel: () => void;
  onSubmit: (values: BikeListItem) => Promise<void>;
  updateModalOpen: boolean;
  values: Partial<BikeListItem>;
};

const UpdateBikeForm: React.FC<UpdateBikeFormProps> = (props) => {
  const [previewHtml, setPreviewHtml] = useState<string>('');
  const [uploadedImages, setUploadedImages] = useState<any[]>([]);

  useEffect(() => {
    // 初始化预览为原有内容
    setPreviewHtml(props.values.detailHtml || '');
  }, [props.values.detailHtml]);

  const generateNewImagesHtml = (fileList: any[]) => {
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

  const handleFinish = async (formValues: any) => {
    // 如果上传了新的详情图片，完全替换原有内容
    let detailHtml = props.values.detailHtml || '';
    const newImagesHtml = generateNewImagesHtml(uploadedImages);
    if (newImagesHtml) {
      // 完全替换为新内容
      detailHtml = newImagesHtml;
    }

    // 先更新车辆基本信息
    await props.onSubmit({
      productId: props.values.productId,
      title: formValues.title,
      category: formValues.category,
      detailHtml: detailHtml,
    });

    // 如果上传了主图，保存主图
    if (formValues.mainImage && formValues.mainImage.length > 0) {
      try {
        const imageUrl = formValues.mainImage[0].response;
        await saveMainImageEn({
          productId: props.values.productId!,
          imagePath: imageUrl,
          isMain: 1,
        });
        message.success('主图上传成功');
      } catch (error) {
        message.error('主图上传失败，请重试！');
      }
    }
  };

  return (
    <ModalForm
      title="编辑车辆"
      width="1200px"
      open={props.updateModalOpen}
      onOpenChange={(visible) => {
        if (!visible) {
          props.onCancel();
          setPreviewHtml('');
          setUploadedImages([]);
        }
      }}
      onFinish={handleFinish}
      initialValues={props.values}
      modalProps={{
        destroyOnClose: true,
      }}
    >
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
            label="修改主图（可选，1:1比例）"
            name="mainImage"
            max={1}
            action="/proxy/v1/api/upload/common"
            description="上传新的主图将替换原有主图"
            fieldProps={{
              onChange: (info) => {
                if (info.file.status === 'done') {
                  message.success(`${info.file.name} 上传成功`);
                } else if (info.file.status === 'error') {
                  message.error(`${info.file.name} 上传失败`);
                }
              },
            }}
          />
          <ProFormUploadDragger
            label="重新上传详情图片（可选，多张）"
            name="images"
            action="/proxy/v1/api/upload/common"
            description="上传新图片将完全替换原有详情内容，不上传则保留原有内容"
            fieldProps={{
              onChange: (info) => {
                setUploadedImages(info.fileList);
                const newHtml = generateNewImagesHtml(info.fileList);
                // 如果上传了新图片，预览新内容；否则显示原有内容
                if (newHtml) {
                  setPreviewHtml(newHtml);
                } else {
                  setPreviewHtml(props.values.detailHtml || '');
                }
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
          <Text type="secondary">上传新图片后将显示新内容，未上传则显示原有内容</Text>
          <Divider style={{ margin: '12px 0' }} />
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
              <div style={{ color: '#999', textAlign: 'center', marginTop: '100px' }}>暂无内容</div>
            )}
          </div>
        </Col>
      </Row>
    </ModalForm>
  );
};

export default UpdateBikeForm;
