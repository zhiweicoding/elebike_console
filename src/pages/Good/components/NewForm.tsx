import {
  ProFormDateTimePicker, ProFormDigit,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea, ProFormUploadDragger,
  StepsForm,
} from '@ant-design/pro-components';
import {FormattedMessage, useIntl} from '@umijs/max';
import {message, Modal} from 'antd';
import React from 'react';
import {querySymbol} from "@/services/ant-design-pro/api";


export type NewFormProps = {
  onCancel: (flag?: boolean, formVals?: API.GoodListItem) => void;
  onSubmit: (values: API.GoodListItem) => Promise<void>;
  modalOpen: boolean;
  values: Partial<API.GoodListItem>;
};

const NewForm: React.FC<NewFormProps> = (props) => {
  const intl = useIntl();
  return (
    <StepsForm
      stepsProps={{
        size: 'small',
      }}
      stepsFormRender={(dom, submitter) => {
        return (
          <Modal
            width={640}
            style={{padding: '32px 40px 48px'}}
            destroyOnClose
            title='新建商品'
            open={props.modalOpen}
            footer={submitter}
            onCancel={() => {
              props.onCancel();
            }}
          >
            {dom}
          </Modal>
        );
      }}
      onFinish={props.onSubmit}
    >
      <StepsForm.StepForm title='基本信息'>
        <ProFormText
          name="goodTitle"
          label='标题'
          rules={[
            {
              required: true,
              message: '名称不能为空！',
            },
          ]}
        />
        <ProFormTextArea
          name="goodBrief"
          label='简介'
          placeholder='请输入商品简介'
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
            const hide = message.loading('正在获取品种数据');
            try {
              const response = await querySymbol({
                current: 1,
                pageSize: 100,
              });
              const array = response.data;

              return array!.map(item => ({
                label: item.symbolName,
                value: item.symbolId,
              }));
            } catch (error) {
              console.error('获取品种数据失败:', error);
              return [];
            }
          }}
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
          fieldProps={{precision: 2}}
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
          valueEnum={
            {
              1: '是',
              0: '否',
            }
          }
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
          valueEnum={
            {
              1: '是',
              0: '否',
            }
          }
        />
      </StepsForm.StepForm>
      <StepsForm.StepForm
        title='上传图片'
      >
        <ProFormUploadDragger
          rules={[
            {
              required: true,
              message: '横图必传！',
            },
          ]}
          max={1} label="上传横图(1027*428)" name="scenePicUrl" action="/v1/api/upload/common" />
        <ProFormUploadDragger
          rules={[
            {
              required: true,
              message: '主图必传！',
            },
          ]}
          max={1} label="上传主图(1:1)" name="listPicUrl" action="/v1/api/upload/common"/>
      </StepsForm.StepForm>
      <StepsForm.StepForm
        title='设置详情图'
      >
        <ProFormUploadDragger
          rules={[
            {
              required: true,
              message: '至少上传一张！',
            },
          ]}
          label="详情图(1080宽，长度随意，图片至少一张)" name="photoUrl" action="/v1/api/upload/common"/>

      </StepsForm.StepForm>
    </StepsForm>
  );
};

export default NewForm;
