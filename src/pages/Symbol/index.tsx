import {delSymbol, querySymbol, modifySymbol, addSymbol} from '@/services/ant-design-pro/api';
import {PlusOutlined} from '@ant-design/icons';
import type {ActionType, ProColumns, ProDescriptionsItemProps} from '@ant-design/pro-components';
import {
  ModalForm,
  PageContainer,
  ProDescriptions,
  ProFormText,
  ProFormRadio,
  ProFormDigit,
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
const handleAdd = async (fields: API.SymbolListItem) => {
  const hide = message.loading('正在添加');
  try {
    await addSymbol({...fields});
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
const handleUpdate = async (fields: API.SymbolListItem) => {
  const hide = message.loading('正在修改');
  try {
    await modifySymbol(fields);
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
const handleRemove = async (selectedRows: API.SymbolListItem[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    const idArray = selectedRows.map((row) => row.symbolId)
    await delSymbol(idArray);
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
  const [currentRow, setCurrentRow] = useState<API.SymbolListItem>();

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();

  const columns: ProColumns<API.SymbolListItem>[] = [
    {
      title: (
        <FormattedMessage
          id="pages.symbol.query.symbolName.label"
          defaultMessage="Symbol Name"
        />
      ),
      dataIndex: 'symbolName',
      tip: '查询分类的名称',
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
      title: (
        <FormattedMessage
          id="pages.symbol.query.symbolName.sortNum"
          defaultMessage="顺序"
        />
      ),
      dataIndex: 'sortNum',
      tooltip: '序号越小越靠前',
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
      title: '基地',
      dataIndex: 'place',
      valueEnum: {
        1: {
          text: '天津基地',
        },
        0: {
          text: '无锡基地',
        },
      },
    },
    {
      title: '爆款',
      dataIndex: 'isPopular',
      valueEnum: {
        1: {
          text: '是',
          status: 'Success',
        },
        0: {
          text: '否',
          status: 'Warning',
        },
      },
    },
    {
      title: (<FormattedMessage id="pages.symbol.query.symbolName.modifyTime" defaultMessage="修改时间"/>),
      dataIndex: 'modifyTime',
      valueType: 'dateTime',
      search: false,
      renderFormItem: (item, {defaultRender}) => {
        return defaultRender(item);
      },
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="Operating"/>,
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="config"
          onClick={() => {
            handleUpdateModalOpen(true);
            setCurrentRow(record);
          }}
        >
          <FormattedMessage id="pages.searchTable.config" defaultMessage="修改"/>
        </a>,
        <a
          key="remove"
          onClick={async () => {
            await handleRemove([record]);
            actionRef.current?.reloadAndRest?.();
          }}
        >
          <FormattedMessage id="pages.searchTable.deletion" defaultMessage="删除"/>
        </a>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.SymbolListItem, API.PageParams>
        headerTitle={intl.formatMessage({
          id: 'pages.searchTable.title',
          defaultMessage: 'Enquiry form',
        })}
        actionRef={actionRef}
        rowKey="symbolId"
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
        request={querySymbol}
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
          const success = await handleAdd(value as API.SymbolListItem);
          if (success) {
            handleModalOpen(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        <ProFormText
          rules={[
            {
              required: true,
              message: (<FormattedMessage id="pages.searchTable.mustInput" defaultMessage="此项为必填项"/>),
            },
          ]}
          width="md"
          label="品种名称"
          name="symbolName"
        />
        <ProFormDigit
          label="排序(数字越小，越在前)"
          rules={[
            {
              required: true,
              message: (<FormattedMessage id="pages.searchTable.mustInput" defaultMessage="此项为必填项"/>),
            },
          ]}
          name="sortNum"
          width="md"
          min={1}
          max={999999}
        />
        <ProFormRadio.Group
          name="place"
          label="生产基地"
          rules={[
            {
              required: true,
              message: (<FormattedMessage id="pages.searchTable.mustInput" defaultMessage="此项为必填项"/>),
            },
          ]}
          radioType={"button"}
          options={[
            {
              label: '天津',
              value: '1',
            },
            {
              label: '无锡',
              value: '0',
            },
          ]}
        />
        <ProFormRadio.Group
          name="isPopular"
          label="是否爆款"
          rules={[
            {
              required: true,
              message: (<FormattedMessage id="pages.searchTable.mustInput" defaultMessage="此项为必填项"/>),
            },
          ]}
          radioType={"button"}
          options={[
            {
              label: '是',
              value: '1',
            },
            {
              label: '否',
              value: '0',
            },
          ]}
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
            symbolId: currentRow?.symbolId,
            createTIme: currentRow?.createTime,
            isDelete: 0
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
          rules={[
            {
              required: true,
              message: (<FormattedMessage id="pages.searchTable.mustInput" defaultMessage="此项为必填项"/>),
            },
          ]}
          width="md"
          label="品种名称"
          name="symbolName"
        />
        <ProFormDigit
          label="排序(数字越小，越在前)"
          rules={[
            {
              required: true,
              message: (<FormattedMessage id="pages.searchTable.mustInput" defaultMessage="此项为必填项"/>),
            },
          ]}
          name="sortNum"
          width="md"
          min={1}
          max={999999}
        />
        <ProFormRadio.Group
          name="place"
          label="生产基地"
          rules={[
            {
              required: true,
              message: (<FormattedMessage id="pages.searchTable.mustInput" defaultMessage="此项为必填项"/>),
            },
          ]}
          radioType={"button"}
          options={[
            {
              label: '天津',
              value: '1',
            },
            {
              label: '无锡',
              value: '0',
            },
          ]}
        />
        <ProFormRadio.Group
          name="isPopular"
          label="是否爆款"
          rules={[
            {
              required: true,
              message: (<FormattedMessage id="pages.searchTable.mustInput" defaultMessage="此项为必填项"/>),
            },
          ]}
          radioType={"button"}
          options={[
            {
              label: '是',
              value: 1,
            },
            {
              label: '否',
              value: 0,
            },
          ]}
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
        {currentRow?.symbolName && (
          <ProDescriptions<API.SymbolListItem>
            column={2}
            title={currentRow?.symbolName}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.symbolName,
            }}
            columns={columns as ProDescriptionsItemProps<API.SymbolListItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
