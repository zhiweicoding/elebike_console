import { addBpc, delBpc, modifyBpc, queryBpc } from '@/services/ant-design-pro/api';
import { PlusOutlined } from '@ant-design/icons';
import {
  ActionType,
  ModalForm,
  PageContainer,
  ProColumns,
  ProDescriptions,
  ProFormText,
  ProFormUploadDragger,
  ProTable,
  type ProDescriptionsItemProps,
} from '@ant-design/pro-components';
import { FormattedMessage } from '@umijs/max';
import { Button, Drawer, message } from 'antd';
import React, { useRef, useState } from 'react';

/**
 * @en-US Add node
 * @zh-CN 添加节点
 * @param fields
 */
const handleAdd = async (fields: API.BannerListItem) => {
  const hide = message.loading('正在添加');
  try {
    await addBpc({ ...fields });
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
    await modifyBpc({ ...fields });
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
    const idArray = selectedRows.map((row) => row.id);
    await delBpc(idArray);
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

  const columns: ProColumns<API.BannerListItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      tooltip: 'PC端轮播图的id',
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
      title: '跳转地址-PC端页面',
      dataIndex: 'link',
      tooltip: '点击后的跳转地址',
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
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            <img src={dom as string} alt="图片地址" width={330} height={120} />
          </a>
        );
      },
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="操作" />,
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
          <FormattedMessage id="pages.searchTable.deletion" defaultMessage="删除" />
        </a>,
        <a
          key="link"
          onClick={() => {
            handleUpdateModalOpen(true);
            setCurrentRow(record);
          }}
        >
          <FormattedMessage id="pages.searchTable.configLink" defaultMessage="设置跳转地址" />
        </a>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.BannerListItem, API.PageParams>
        headerTitle="PC端轮播图列表"
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
            <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="新建" />
          </Button>,
        ]}
        request={queryBpc}
        columns={columns}
      />
      <ModalForm
        title="新建PC端轮播图"
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
        <ProFormUploadDragger
          max={1}
          label="上传图片"
          name="imageUrl"
          action="/proxy/v1/api/upload/common"
          extra="推荐尺寸 1920x400"
        />
        <ProFormText
          width="md"
          label="跳转地址(选填)"
          name="link"
          placeholder="请输入页面链接地址"
        />
      </ModalForm>
      <ModalForm
        initialValues={currentRow || {}}
        title="修改PC端轮播图"
        width="400px"
        open={updateModalOpen}
        onOpenChange={handleUpdateModalOpen}
        onFinish={async (value) => {
          const success = await handleUpdate(value as API.BannerListItem);
          if (success) {
            handleUpdateModalOpen(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        <ProFormText name="id" label="ID" width="md" disabled />
        <ProFormText name="link" label="跳转地址" width="md" placeholder="请输入页面链接地址" />
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
          <ProDescriptions<API.BannerListItem>
            column={2}
            title={currentRow?.id}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.id,
            }}
            columns={columns as ProDescriptionsItemProps<API.BannerListItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
