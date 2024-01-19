import {
  ModalForm,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProFormTextArea, ProFormUploadDragger, StepsForm,
} from '@ant-design/pro-components';
import {useIntl} from '@umijs/max';
import {message, Modal} from 'antd';
import React from 'react';
import {querySymbol} from "@/services/ant-design-pro/api";

export type UpdateFormProps = {
  onCancel: (flag?: boolean, formVals?: API.StoreListItem) => void;
  onSubmit: (values: API.StoreListItem) => Promise<void>;
  updateModalOpen: boolean;
  values: Partial<API.StoreListItem>;
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const intl = useIntl();
  return (
    <StepsForm
      stepsProps={{
        size: 'small',
      }}
      stepsFormRender={(dom, submitter) => {
        return (
          <Modal
            width={1200}
            style={{padding: '32px 40px 48px'}}
            destroyOnClose
            title='修改门店'
            open={props.updateModalOpen}
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
      <StepsForm.StepForm
        title='基本信息'
        initialValues={{
          storeName: props.values.storeName,
          storeDesc: props.values.storeDesc,
          phoneNum: props.values.phoneNum,
          backupPhoneNum: props.values.backupPhoneNum,
        }}
      >
        <ProFormText
          name="storeName"
          label='名称'
          rules={[
            {
              required: true,
              message: '名称不能为空！',
            },
          ]}
        />
        <ProFormTextArea
          name="storeDesc"
          label='简介'
          placeholder='请输入门店简介'
          rules={[
            {
              required: true,
              message: '简介不能为空！',
            },
          ]}
        />
        <ProFormDigit
          label="手机号码"
          name="phoneNum"
          min={1}
          max={99999999999}
          rules={[
            {
              required: true,
              message: '至少输入一个电话！',
            },
          ]}
          fieldProps={{precision: 0}}
        />
        <ProFormDigit
          label="备用手机号码"
          name="backupPhoneNum"
          min={1}
          max={99999999999}
          fieldProps={{precision: 0}}
        />
      </StepsForm.StepForm>
      <StepsForm.StepForm
        title='设置门店位置'
        initialValues={{
          address: props.values.address,
          lnglat: props.values.lnglat,
        }}
      >
        <ProFormText
          name="address"
          placeholder={'把④的内容复制到这里'}
          label='地址'
          rules={[
            {
              required: true,
              message: '地址不能为空！',
            },
          ]}
        />
        <ProFormText
          name="lnglat"
          placeholder={'把③的内容复制到这里'}
          label='经纬度'
          rules={[
            {
              required: true,
              message: '经纬度不能为空！',
            },
          ]}
        />
        <a href={'https://lbs.qq.com/getPoint/'} target="_blank"
           rel="noopener noreferrer">打开新页面，在页面中选择经纬度</a>
        <br/>
        <img width={800} alt={'经纬度示例'}
             src={'https://bike-1256485110.cos.ap-beijing.myqcloud.com/iShot_2024-01-18_16.09.00.png'}/>
      </StepsForm.StepForm>
      <StepsForm.StepForm
        title='设置详情图'
        initialValues={{
          staffWx: props.values.staffWx,
        }}
      >
        <ProFormText
          name="staffWx"
          label='客服链接'
          placeholder={'把②复制的客服链接粘贴到这里'}
          rules={[
            {
              required: true,
              message: '客服链接不能为空！',
            },
          ]}
        />
        <a href={'https://work.weixin.qq.com/wework_admin/frame#/app/servicer'} target="_blank"
           rel="noopener noreferrer">打开新页面，在页面中选择客服链接</a>
        <br/>
        <img width={800} alt={'新建客服'}
             src={'https://bike-1256485110.cos.ap-beijing.myqcloud.com/clipboard_20240118_041849.png'}/>
        <br/>
        <img width={800} alt={'新建客服'}
             src={'https://bike-1256485110.cos.ap-beijing.myqcloud.com/iShot_2024-01-18_16.20.24.png'}/>

      </StepsForm.StepForm>
    </StepsForm>
  );
};

export default UpdateForm;
