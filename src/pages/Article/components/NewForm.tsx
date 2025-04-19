import {
  ModalForm,
  ProFormDateTimePicker,
  ProFormText,
  ProFormUploadDragger,
} from '@ant-design/pro-components';
import React from 'react';
import RichTextEditor from './RichTextEditor';

export type NewFormProps = {
  onCancel: (flag?: boolean, formVals?: API.ArticleListItem) => void;
  onSubmit: (values: API.ArticleListItem) => Promise<void>;
  modalOpen: boolean;
  values: Partial<API.ArticleListItem>;
};

const NewForm: React.FC<NewFormProps> = (props) => {
  return (
    <ModalForm
      title="新建文章"
      width={1000}
      open={props.modalOpen}
      onOpenChange={(visible) => {
        if (!visible) {
          props.onCancel();
        }
      }}
      modalProps={{
        destroyOnClose: true,
        onCancel: () => console.log('run'),
      }}
      onFinish={props.onSubmit}
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
    </ModalForm>
  );
};

export default NewForm;
