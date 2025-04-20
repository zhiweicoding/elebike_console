import { querySymbol } from '@/services/ant-design-pro/api';
import {
  ModalForm,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import React from 'react';

export type UpdateFormProps = {
  onCancel: (flag?: boolean, formVals?: API.GoodListItem) => void;
  onSubmit: (values: API.GoodListItem) => Promise<void>;
  updateModalOpen: boolean;
  values: Partial<API.GoodListItem>;
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  return (
    <ModalForm
      initialValues={props.values}
      title="修改详情图"
      width="400px"
      autoFocusFirstInput
      open={props.updateModalOpen}
      onOpenChange={(visible) => {
        if (!visible) {
          props.onCancel(false, props.values);
        }
      }}
      modalProps={{
        destroyOnClose: true,
        onCancel: () => console.log('run'),
      }}
      onFinish={props.onSubmit}
    >
      <ProFormText
        name="goodTitle"
        label="标题"
        rules={[
          {
            required: true,
            message: '名称不能为空！',
          },
        ]}
      />
      <ProFormTextArea
        name="goodBrief"
        label="简介"
        placeholder="请输入商品简介"
        rules={[
          {
            required: true,
            message: '简介不能为空！',
          },
        ]}
      />
      <ProFormSelect
        name="symbolId"
        label="品种"
        rules={[
          {
            required: true,
            message: '请选择品种！',
          },
        ]}
        debounceTime={1000}
        request={async () => {
          try {
            const response = await querySymbol({
              current: 1,
              pageSize: 100,
            });
            const array = response.data;

            return array!.map((item) => ({
              label: item.symbolName,
              value: item.symbolId,
            }));
          } catch (error) {
            console.error('获取品种数据失败:', error);
            return [];
          }
        }}
      />
      <ProFormSelect
        name="pcSymbolId"
        label="PC端分类"
        rules={[
          {
            required: true,
            message: '请选择PC端分类！',
          },
        ]}
        valueEnum={{
          轻型电摩: '轻型电摩',
          电动自行车: '电动自行车',
          电动摩托车: '电动摩托车',
        }}
        placeholder="请选择PC端分类"
      />
      <ProFormDigit
        label="市场价"
        name="retailPrice"
        min={0.1}
        max={99999999}
        rules={[
          {
            required: true,
            message: '价格不能为空！',
          },
        ]}
        fieldProps={{ precision: 2 }}
      />
      <ProFormSelect
        name="isNew"
        label="上新模块"
        rules={[
          {
            required: true,
            message: '请选择！',
          },
        ]}
        valueEnum={{
          1: '是',
          0: '否',
        }}
      />
      <ProFormSelect
        name="isChosen"
        label="推荐模块"
        rules={[
          {
            required: true,
            message: '请选择！',
          },
        ]}
        valueEnum={{
          1: '是',
          0: '否',
        }}
      />
    </ModalForm>
  );
};

export default UpdateForm;
