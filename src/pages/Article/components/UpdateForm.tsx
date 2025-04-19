import {
  ModalForm,
  ProFormDateTimePicker,
  ProFormText,
  ProFormUploadDragger,
} from '@ant-design/pro-components';
import React, { useMemo } from 'react';
import RichTextEditor from './RichTextEditor';

export type UpdateFormProps = {
  onCancel: (flag?: boolean, formVals?: API.ArticleListItem) => void;
  onSubmit: (values: API.ArticleListItem) => Promise<void>;
  updateModalOpen: boolean;
  values: Partial<API.ArticleListItem>;
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  // 处理initialValues中的photoUrl，确保格式正确
  const initialValues = useMemo(() => {
    const values = { ...props.values };
    // 如果photoUrl存在且是字符串，转换为上传组件期望的格式
    if (values.photoUrl && typeof values.photoUrl === 'string') {
      // 使用as any绕过TypeScript类型检查
      (values as any).photoUrl = [
        {
          uid: '-1',
          name: 'image.png',
          status: 'done',
          url: values.photoUrl,
        },
      ];
    }
    return values;
  }, [props.values]);

  // 在提交前处理表单数据
  const handleSubmit = async (values: API.ArticleListItem) => {
    // 处理photoUrl，确保格式正确
    if (values.photoUrl && Array.isArray(values.photoUrl) && values.photoUrl.length > 0) {
      // 从数组中提取第一个图片的URL
      values.photoUrl = values.photoUrl[0].url;
    }
    if (values.photoUrl?.length === 0) {
      values.photoUrl = undefined;
    }
    return props.onSubmit(values);
  };

  return (
    <ModalForm
      title="修改文章"
      width={1000}
      initialValues={initialValues}
      open={props.updateModalOpen}
      onOpenChange={(visible) => {
        if (!visible) {
          props.onCancel();
        }
      }}
      modalProps={{
        destroyOnClose: true,
        onCancel: () => console.log('run'),
      }}
      onFinish={handleSubmit}
    >
      <ProFormText
        name="title"
        label="标题"
        rules={[
          {
            required: true,
            message: '标题不能为空！',
          },
        ]}
      />
      <ProFormText
        name="author"
        label="作者"
        rules={[
          {
            required: true,
            message: '作者不能为空！',
          },
        ]}
      />
      <ProFormDateTimePicker
        name="publishTime"
        label="发布时间"
        rules={[
          {
            required: true,
            message: '发布时间不能为空！',
          },
        ]}
      />
      <ProFormUploadDragger
        label="封面图片(可选)"
        name="photoUrl"
        action="/proxy/v1/api/upload/common"
        max={1}
        fieldProps={{
          height: 145,
        }}
        placeholder="点击或拖拽上传封面图片（可选）"
      />
      <RichTextEditor
        name="orgContent"
        label="文章内容"
        placeholder="请输入文章内容"
        rules={[
          {
            required: true,
            message: '文章内容不能为空！',
          },
        ]}
      />
      <ProFormText name="id" hidden />
      <ProFormText name="articleId" hidden />
      <ProFormText name="createdAt" hidden />
    </ModalForm>
  );
};

export default UpdateForm;
