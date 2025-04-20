import ImgForm from '@/pages/Good/components/ImgForm';
import NewForm from '@/pages/Good/components/NewForm';
import {
  addGood,
  delGood,
  modifyGood,
  queryGood,
  querySymbol,
} from '@/services/ant-design-pro/api';
import { PlusOutlined } from '@ant-design/icons';
import {
  ActionType,
  FooterToolbar,
  ModalForm,
  PageContainer,
  ProColumns,
  ProDescriptions,
  ProDescriptionsItemProps,
  ProFormUploadDragger,
  ProTable,
} from '@ant-design/pro-components';
import { FormattedMessage, useIntl } from '@umijs/max';
import { Button, Drawer, message } from 'antd';
import React, { useRef, useState } from 'react';
import UpdateForm from './components/UpdateForm';

/**
 * @en-US Add node
 * @zh-CN 添加节点
 * @param fields
 */
const handleAdd = async (fields: API.GoodListItem) => {
  const hide = message.loading('正在添加');
  try {
    await addGood({ ...fields });
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
const handleUpdate = async (fields: API.GoodListItem) => {
  const hide = message.loading('正在修改');
  try {
    await modifyGood(fields);
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
const handleRemove = async (selectedRows: API.GoodListItem[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    const idArray = selectedRows.map((row) => row.goodId);
    await delGood(idArray);
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
  const [showListPicUrl, setListPicUrl] = useState<boolean>(false);
  const [showScenePicUrl, setScenePicUrl] = useState<boolean>(false);
  const [showPhotoUrl, setPhotoUrl] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.GoodListItem>();
  const [selectedRowsState, setSelectedRows] = useState<API.GoodListItem[]>([]);

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();

  const fetchSymbolData = async () => {
    message.loading('正在获取品种数据');
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
  };

  const columns: ProColumns<API.GoodListItem>[] = [
    {
      title: '商品标题',
      dataIndex: 'goodTitle',
      copyable: true,
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
      title: '商品简介',
      dataIndex: 'goodBrief',
      valueType: 'textarea',
    },
    {
      title: '品种',
      dataIndex: 'symbolId',
      request: async () => await fetchSymbolData(),
      valueType: 'select',
    },
    {
      title: 'PC端分类',
      dataIndex: 'pcSymbolId',
      hideInForm: true,
      valueEnum: {
        轻型电摩: { text: '轻型电摩' },
        电动自行车: { text: '电动自行车' },
        电动摩托车: { text: '电动摩托车' },
      },
    },
    {
      title: '活动图片',
      dataIndex: 'scenePicUrl',
      hideInForm: true,
      search: false,
      render: (dom, entity) => {
        // @ts-ignore
        return (
          <a
            onClick={() => {
              setImgUrl([entity.scenePicUrl || '']);
              setShowImg(true);
            }}
          >
            <img src={dom as string} alt="scenePicUrl" width={152} height={63} />
          </a>
        );
      },
    },
    {
      title: '主图',
      dataIndex: 'listPicUrl',
      hideInForm: true,
      search: false,
      render: (dom, entity) => {
        // @ts-ignore
        return (
          <a
            onClick={() => {
              setImgUrl([entity.listPicUrl || '']);
              setShowImg(true);
            }}
          >
            <img src={dom as string} alt="listPicUrl" width={63} height={63} />
          </a>
        );
      },
    },
    {
      title: '详情图(点击查看)',
      dataIndex: 'photoUrl',
      hideInForm: true,
      search: false,
      render: (dom, entity) => {
        const photoUrlArray = entity.photoUrlArray;
        if (photoUrlArray && photoUrlArray?.length > 0) {
          return (
            <a
              onClick={() => {
                setImgUrl(entity.photoUrlArray || []);
                setShowImg(true);
              }}
            >
              <img src={photoUrlArray[0]} alt="photoUrl" width={63} height={63} />
            </a>
          );
        } else {
          return '';
        }
      },
    },
    {
      title: '市场价',
      dataIndex: 'retailPrice',
      hideInForm: true,
      search: false,
      renderText: (val: string) => `${val}元`,
    },
    {
      title: '上新模块',
      dataIndex: 'isNew',
      hideInForm: true,
      valueEnum: {
        1: {
          text: '是',
          status: 'Success',
        },
        0: {
          text: '否',
          status: 'Processing',
        },
      },
    },
    {
      title: '推荐模块',
      dataIndex: 'isChosen',
      hideInForm: true,
      valueEnum: {
        1: {
          text: '是',
          status: 'Success',
        },
        0: {
          text: '否',
          status: 'Processing',
        },
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
      renderFormItem: (item, { defaultRender }) => {
        return defaultRender(item);
      },
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="Operating" />,
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
          key="uploadMain"
          onClick={() => {
            setListPicUrl(true);
            setCurrentRow(record);
          }}
        >
          改主图
        </a>,
        <a
          key="uploadhor"
          onClick={() => {
            setScenePicUrl(true);
            setCurrentRow(record);
          }}
        >
          改横图
        </a>,
        <a
          key="uploadDetail"
          onClick={() => {
            setPhotoUrl(true);
            setCurrentRow(record);
          }}
        >
          改详情
        </a>,
        <a
          key="del"
          onClick={() => {
            handleRemove([record]).then(() => {
              setCurrentRow(undefined);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            });
          }}
        >
          删除
        </a>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.GoodListItem, API.PageParams>
        headerTitle={intl.formatMessage({
          id: 'pages.searchTable.title',
          defaultMessage: 'Enquiry form',
        })}
        actionRef={actionRef}
        rowKey="goodId"
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
            <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
          </Button>,
        ]}
        request={queryGood}
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
              <FormattedMessage id="pages.searchTable.chosen" defaultMessage="Chosen" />{' '}
              <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}
              <FormattedMessage id="pages.searchTable.item" defaultMessage="项" />
              &nbsp;&nbsp;
            </div>
          }
        >
          <Button
            onClick={async () => {
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            取消
          </Button>
          <Button
            type="primary"
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            {' '}
            批量删除
          </Button>
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
            currentRow.goodTitle = value.goodTitle;
            currentRow.goodBrief = value.goodBrief;
            currentRow.retailPrice = value.retailPrice;
            currentRow.isNew = value.isNew;
            currentRow.isChosen = value.isChosen;
            currentRow.symbolId = value.symbolId;
            currentRow.pcSymbolId = value.pcSymbolId;
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
        onCancel={() => {
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
        {currentRow?.goodId && (
          <ProDescriptions<API.GoodListItem>
            column={2}
            title={currentRow?.goodId}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.goodId,
            }}
            columns={columns as ProDescriptionsItemProps<API.GoodListItem>[]}
          />
        )}
      </Drawer>
      <ModalForm
        title="修改主图"
        width="400px"
        autoFocusFirstInput
        open={showListPicUrl}
        modalProps={{
          destroyOnClose: true,
          onCancel: () => console.log('run'),
        }}
        onOpenChange={setListPicUrl}
        onFinish={async (value) => {
          if (currentRow) {
            currentRow.listPicUrl = value.listPicUrl[0].response;
          }
          const success = await handleUpdate(currentRow || {});
          if (success) {
            setListPicUrl(false);
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
              message: '主图必传！',
            },
          ]}
          max={1}
          label="上传主图(1:1)"
          name="listPicUrl"
          action="/proxy/v1/api/upload/common"
        />
      </ModalForm>
      <ModalForm
        title="修改横图"
        width="400px"
        autoFocusFirstInput
        open={showScenePicUrl}
        modalProps={{
          destroyOnClose: true,
          onCancel: () => console.log('run'),
        }}
        onOpenChange={setScenePicUrl}
        onFinish={async (value) => {
          if (currentRow) {
            currentRow.scenePicUrl = value.scenePicUrl[0].response;
          }
          const success = await handleUpdate(currentRow || {});
          if (success) {
            setScenePicUrl(false);
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
              message: '横图必传！',
            },
          ]}
          max={1}
          label="上传横图(1027*428)"
          name="scenePicUrl"
          action="/proxy/v1/api/upload/common"
        />
      </ModalForm>
      <ModalForm
        title="修改详情图"
        width="400px"
        autoFocusFirstInput
        open={showPhotoUrl}
        onOpenChange={setPhotoUrl}
        modalProps={{
          destroyOnClose: true,
          onCancel: () => console.log('run'),
        }}
        onFinish={async (value) => {
          const photoUrlArray: Array<Record<string, any>> = value.photoUrl;
          const photoUrlList: string[] = photoUrlArray.map((item) => String(item.response));

          if (currentRow) {
            currentRow.photoUrl = JSON.stringify(photoUrlList);
          }
          const success = await handleUpdate(currentRow || {});
          if (success) {
            setPhotoUrl(false);
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
              message: '至少上传一张！',
            },
          ]}
          label="详情图(1080宽，长度随意，图片至少一张)"
          name="photoUrl"
          action="/proxy/v1/api/upload/common"
        />
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
