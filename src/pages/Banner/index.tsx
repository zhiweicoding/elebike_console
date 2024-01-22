import {delBanner, queryBanner, modifyBanner, addBanner} from '@/services/ant-design-pro/api';
import {PlusOutlined} from '@ant-design/icons';
import {
  ActionType,
  ProColumns,
  ProDescriptions,
  type ProDescriptionsItemProps,
  ProFormUploadDragger
} from '@ant-design/pro-components';
import {
  ModalForm,
  PageContainer,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';
import {FormattedMessage, useIntl} from '@umijs/max';
import {Button, Drawer, message} from 'antd';
import React, {useRef, useState} from 'react';

/**
 * @en-US Add node
 * @zh-CN 添加节点
 * @param fields
 */
const handleAdd = async (fields: API.BannerListItem) => {
  const hide = message.loading('正在添加');
  try {
    await addBanner({...fields});
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败，请稍后重试！');
    return false;
  }
};

/**
 * @en-US Update node
 * @zh-CN 更新节点
 *
 * @param fields
 */
const handleUpdate = async (fields: API.BannerListItem) => {
  const hide = message.loading('正在修改');
  try {
    await modifyBanner({...fields});
    hide();
    message.success('修改成功');
    return true;
  } catch (error) {
    hide();
    message.error('修改失败，请稍后重试！');
    return false;
  }
};

/**
 *  Delete node
 * @zh-CN 删除节点
 *
 * @param selectedRows
 */
const handleRemove = async (selectedRows: API.BannerListItem[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    const idArray = selectedRows.map((row) => row.id)
    await delBanner(idArray);
    hide();
    message.success('删除成功');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请稍后重试！');
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

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.BannerListItem>();

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();

  const columns: ProColumns<API.BannerListItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      tip: '轮播图的id',
      search: false,
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
      title: ('跳转地址-公众号文章'),
      dataIndex: 'link',
      tooltip: '点击后的跳转地址，可跳转公众号文章',
      hideInForm: true,
      search: false,
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
      title: '图片地址',
      dataIndex: 'imageUrl',
      hideInForm: true,
      search: false,
      render: (dom, entity) => {
        // @ts-ignore
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            <img src={dom as string} alt="图片地址" width={330} height={120}/>
          </a>
        );
      },
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="Operating"/>,
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [

        <a
          key="remove"
          onClick={async () => {
            await handleRemove([record]);
            actionRef.current?.reloadAndRest?.();
          }}
        >
          <FormattedMessage id="pages.searchTable.deletion" defaultMessage="删除"/>
        </a>,
        <a
          key="link"
          onClick={() => {
            handleUpdateModalOpen(true);
            setCurrentRow(record);
          }}
        >
          <FormattedMessage id="pages.searchTable.configLink" defaultMessage="设置跳转地址"/>
        </a>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.BannerListItem, API.PageParams>
        headerTitle={intl.formatMessage({
          id: 'pages.searchTable.title',
          defaultMessage: 'Enquiry form',
        })}
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
          collapsed: true,
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
        request={queryBanner}
        columns={columns}
      />
      <ModalForm
        title={intl.formatMessage({
          id: 'pages.symbol.query.createForm.new',
          defaultMessage: '新建分类',
        })}
        width="400px"
        autoFocusFirstInput
        open={createModalOpen}
        onOpenChange={handleModalOpen}
        onFinish={async (value) => {
          const success = await handleAdd(value as API.BannerListItem);
          if (success) {
            handleModalOpen(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >

        <ProFormUploadDragger max={1} label="上传图片" name="imageUrl" action="/proxy/v1/api/upload/common"/>
        <ProFormText
          width="md"
          label="跳转地址(没有不填)"
          name="link"
        />
      </ModalForm>
      <ModalForm
        initialValues={currentRow || {}}
        title={intl.formatMessage({
          id: 'pages.symbol.query.modifyForm.modify',
          defaultMessage: '修改',
        })}
        width="400px"
        open={updateModalOpen}
        modalProps={{
          destroyOnClose: true,
          onCancel: () => {
            handleUpdateModalOpen(false);
            if (!showDetail) {
              setCurrentRow(undefined);
            }
          },
        }}
        onOpenChange={handleUpdateModalOpen}
        onFinish={async (value) => {
          const updateParam = {
            ...value,
            id: currentRow?.id,
          }
          const success = await handleUpdate(updateParam);
          if (success) {
            handleUpdateModalOpen(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        <ProFormText
          width="md"
          label="跳转地址(没有不填)"
          name="link"
        />
      </ModalForm>

      <Drawer
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.id && (
          <ProDescriptions<API.SymbolListItem>
            column={2}
            title={currentRow?.id}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.id,
            }}
            columns={columns as ProDescriptionsItemProps<API.SymbolListItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
