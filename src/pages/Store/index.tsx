import {addStore, delStore, modifyStore, queryStore} from '@/services/ant-design-pro/api';
import {PlusOutlined} from '@ant-design/icons';
import {
  ActionType,
  FooterToolbar,
  ModalForm,
  PageContainer,
  ProColumns,
  ProDescriptions,
  ProDescriptionsItemProps,
  ProFormUploadDragger,
  ProTable
} from '@ant-design/pro-components';
import {FormattedMessage, useIntl} from '@umijs/max';
import {Button, Drawer, message} from 'antd';
import React, {useRef, useState} from 'react';
import UpdateForm from './components/UpdateForm';
import ImgForm from "./components/ImgForm";
import NewForm from "./components/NewForm";

/**
 * @en-US Add node
 * @zh-CN 添加节点
 * @param fields
 */
const handleAdd = async (fields: API.StoreListItem) => {
  const hide = message.loading('正在添加');
  try {
    await addStore({...fields});
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败，请稍后重试');
    return false;
  }
};

/**
 * @en-US Update node
 * @zh-CN 更新节点
 *
 * @param fields
 */
const handleUpdate = async (fields: API.StoreListItem) => {
  const hide = message.loading('正在修改');
  try {
    await modifyStore(fields);
    hide();

    message.success('修改成功');
    return true;
  } catch (error) {
    hide();
    message.error('修改失败，请稍后重试!');
    return false;
  }
};

/**
 *  Delete node
 * @zh-CN 删除节点
 *
 * @param selectedRows
 */
const handleRemove = async (selectedRows: API.StoreListItem[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    const idArray = selectedRows.map((row) => row.storeId)
    await delStore(idArray);
    hide();
    message.success('删除成功');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请稍后重试');
    return false;
  }
};

const TableList: React.FC = () => {
  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  /**
   * @en-US The pop-up window of the distribution update window
   * @zh-CN 分布更新窗口的弹窗
   * */
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);

  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [showImg, setShowImg] = useState<boolean>(false);
  const [imgUrl, setImgUrl] = useState<string[]>([]);
  const [showLogo, setLogo] = useState<boolean>(false);
  const [showLicenseUrl, setLicenseUrl] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.StoreListItem>();
  const [selectedRowsState, setSelectedRows] = useState<API.StoreListItem[]>([]);

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();

  const columns: ProColumns<API.StoreListItem>[] = [
    {
      title: '门店名称',
      dataIndex: 'storeName',
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: '门店简介',
      dataIndex: 'storeDesc',
      valueType: 'textarea',
    },
    {
      title: '门店Logo',
      dataIndex: 'storeLogo',
      hideInForm: true,
      search: false,
      render: (dom, entity) => {
        return (
          <img src={dom as string} alt="storeLogo" width={63} height={63}/>
        );
      },
    },
    {
      title: '电话号码',
      dataIndex: 'phoneNum',
    },
    {
      title: '备用号码',
      dataIndex: 'backupPhoneNum',
    },
    {
      title: '客服链接',
      dataIndex: 'staffWx',
      copyable: true,
      render: (dom, entity) => {
        console.log(dom)
        return (
          <a href={entity.staffWx as string}
             target="_blank"
             rel="noopener noreferrer">
            点击测试
          </a>
        );
      },
    },
    {
      title: '地址',
      dataIndex: 'address',
      copyable: true,
    },
    {
      title: '经纬度',
      dataIndex: 'lnglat',
      copyable: true,
    },
    {
      title: '营业执照',
      dataIndex: 'licenseUrl',
      tip: '可以点击查看大图',
      hideInForm: true,
      search: false,
      render: (dom, entity) => {
        if (entity.licenseUrl && entity.licenseUrl !== '') {
          return (
            <a
              onClick={() => {
                setImgUrl([entity.licenseUrl || '']);
                setShowImg(true);
              }}
            >
              <img src={dom as string} alt="licenseUrl" width={120} height={63}/>
            </a>
          );
        } else {
          return '';
        }

      },
    },
    {
      title: (
        <FormattedMessage
          id="pages.searchTable.titleUpdatedAt"
          defaultMessage="Last scheduled time"
        />
      ),
      sorter: true,
      dataIndex: 'createTime',
      valueType: 'dateTime',
      hideInForm: true,
      search: false,
      renderFormItem: (item, {defaultRender, ...rest}, form) => {
        return defaultRender(item);
      },
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="Operating"/>,
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="upload"
          onClick={() => {
            handleUpdateModalOpen(true);
            setCurrentRow(record);
          }}
        >
          修改
        </a>,
        <a
          key="uploadLogo"
          onClick={() => {
            setLogo(true);
            setCurrentRow(record);
          }}
        >
          修改Logo
        </a>,
        <a
          key="uploadLicense"
          onClick={() => {
            setLicenseUrl(true);
            setCurrentRow(record);
          }}
        >
          修改营业执照
        </a>,
        <a key="del"
           onClick={() => {
             handleRemove([record]).then(r => {
               setCurrentRow(undefined);
               if (actionRef.current) {
                 actionRef.current.reload();
               }
             });
           }}>
          删除
        </a>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.StoreListItem, API.PageParams>
        headerTitle={intl.formatMessage({
          id: 'pages.searchTable.title',
          defaultMessage: 'Enquiry form',
        })}
        actionRef={actionRef}
        rowKey="storeId"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalOpen(true);
            }}
          >
            <PlusOutlined/> <FormattedMessage id="pages.searchTable.new" defaultMessage="New"/>
          </Button>,
        ]}
        request={queryStore}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              <FormattedMessage id="pages.searchTable.chosen" defaultMessage="Chosen"/>{' '}
              <a style={{fontWeight: 600}}>{selectedRowsState.length}</a>{' '}
              <FormattedMessage id="pages.searchTable.item" defaultMessage="项"/>
              &nbsp;&nbsp;
            </div>
          }
        >
          <Button
            onClick={async () => {
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >取消</Button>
          <Button
            type="primary" onClick={async () => {
            await handleRemove(selectedRowsState);
            setSelectedRows([]);
            actionRef.current?.reloadAndRest?.();
          }}> 批量删除</Button>
        </FooterToolbar>
      )}
      <NewForm
        onCancel={() => {
          handleModalOpen(false);
          if (!showDetail) {
            setCurrentRow(undefined);
          }
        }}
        onSubmit={async (value) => {
          const success = await handleAdd(value);
          if (success) {
            handleModalOpen(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        modalOpen={createModalOpen}
        values={currentRow || {}}
      />
      <UpdateForm
        onSubmit={async (value) => {
          if (currentRow) {
            currentRow.storeName = value.storeName;
            currentRow.storeDesc = value.storeDesc;
            currentRow.phoneNum = value.phoneNum;
            currentRow.backupPhoneNum = value.backupPhoneNum;
            currentRow.staffWx = value.staffWx;
            currentRow.address = value.address;
            currentRow.lnglat = value.lnglat;
          }
          const success = await handleUpdate(currentRow || {});
          if (success) {
            handleUpdateModalOpen(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={(visible) => {
          handleUpdateModalOpen(false);
          if (!updateModalOpen) {
            setCurrentRow(undefined);
          }
        }}
        updateModalOpen={updateModalOpen}
        values={currentRow || {}}
      />

      <Drawer
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.storeId && (
          <ProDescriptions<API.StoreListItem>
            column={2}
            title={currentRow?.storeId}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.storeId,
            }}
            columns={columns as ProDescriptionsItemProps<API.StoreListItem>[]}
          />
        )}
      </Drawer>
      <ModalForm
        title='修改营业执照'
        width="400px"
        autoFocusFirstInput
        open={showLicenseUrl}
        modalProps={{
          destroyOnClose: true,
          onCancel: () => console.log('run'),
        }}
        onOpenChange={setLicenseUrl}
        onFinish={async (value) => {
          if (currentRow) {
            currentRow.licenseUrl = value.licenseUrl[0].response;
          }
          const success = await handleUpdate(currentRow || {});
          if (success) {
            setLicenseUrl(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        <ProFormUploadDragger
          rules={[
            {
              required: true,
              message: '如不上传，可关闭窗口！',
            },
          ]}
          max={1} label="上传营业执照" name="licenseUrl" action="/proxy/v1/api/upload/common"/>
      </ModalForm>
      <ModalForm
        title='修改Logo'
        width="400px"
        autoFocusFirstInput
        open={showLogo}
        modalProps={{
          destroyOnClose: true,
          onCancel: () => console.log('run'),
        }}
        onOpenChange={setLogo}
        onFinish={async (value) => {
          if (currentRow) {
            currentRow.storeLogo = value.storeLogo[0].response;
          }
          const success = await handleUpdate(currentRow || {});
          if (success) {
            setLogo(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        <ProFormUploadDragger
          rules={[
            {
              required: true,
              message: '如不上传，可关闭窗口！',
            },
          ]}
          max={1} label="上传Logo" name="storeLogo" action="/proxy/v1/api/upload/common"/>
      </ModalForm>
      <ImgForm
        onCancel={() => {
          setShowImg(false);
          if (!showImg) {
            setImgUrl([]);
          }
        }}
        imgModalOpen={showImg}
        values={imgUrl || []}
      />
    </PageContainer>
  );
};

export default TableList;
