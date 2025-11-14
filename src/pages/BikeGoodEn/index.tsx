import {
  addBikeEn,
  delBikeEn,
  modifyBikeEn,
  queryBikeEn,
  saveMainImageEn,
} from '@/services/ant-design-pro/bikeEn';
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
import { FormattedMessage } from '@umijs/max';
import { Button, Drawer, message } from 'antd';
import React, { useRef, useState } from 'react';
import BikeForm from './components/BikeForm';
import UpdateBikeForm from './components/UpdateBikeForm';

export type BikeListItem = {
  productId?: string;
  title?: string;
  category?: string;
  detailHtml?: string;
  prevProductId?: string;
  prevProductTitle?: string;
  createdAt?: string;
  updatedAt?: string;
  images?: Array<{
    id: number;
    productId: string;
    imagePath: string;
    isMain: number;
  }>;
};

const BikeTableList: React.FC = () => {
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [showMainImage, setShowMainImage] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<BikeListItem>();
  const [selectedRowsState, setSelectedRows] = useState<BikeListItem[]>([]);

  /**
   * 新增车辆
   */
  const handleAdd = async (fields: BikeListItem) => {
    const hide = message.loading('正在添加');
    try {
      await addBikeEn({
        title: fields.title,
        category: fields.category,
        detailHtml: fields.detailHtml,
      });
      hide();
      message.success('添加成功');
      return true;
    } catch (error) {
      hide();
      message.error('添加失败，请重试！');
      return false;
    }
  };

  /**
   * 更新车辆
   */
  const handleUpdate = async (fields: BikeListItem) => {
    const hide = message.loading('正在更新');
    try {
      await modifyBikeEn({
        productId: fields.productId,
        title: fields.title,
        category: fields.category,
        detailHtml: fields.detailHtml,
      });
      hide();
      message.success('更新成功');
      return true;
    } catch (error) {
      hide();
      message.error('更新失败，请重试！');
      return false;
    }
  };

  /**
   * 删除车辆
   */
  const handleRemove = async (selectedRows: BikeListItem[]) => {
    const hide = message.loading('正在删除');
    if (!selectedRows || selectedRows.length === 0) return true;
    try {
      const productIds = selectedRows.map((row) => row.productId!);
      await delBikeEn(productIds);
      hide();
      message.success('删除成功');
      return true;
    } catch (error) {
      hide();
      message.error('删除失败，请重试！');
      return false;
    }
  };

  const columns: ProColumns<BikeListItem>[] = [
    {
      title: '车辆型号',
      dataIndex: 'title',
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
      title: '分类',
      dataIndex: 'category',
      valueEnum: {
        电三轮系列: { text: '电三轮系列' },
        电动摩托车: { text: '电动摩托车' },
        电动自行车: { text: '电动自行车' },
        电助力系列: { text: '电助力系列' },
        轻型电摩: { text: '轻型电摩' },
      },
    },
    {
      title: '主图',
      dataIndex: 'images',
      hideInForm: true,
      search: false,
      render: (_, entity) => {
        const mainImage = entity.images?.find((img) => img.isMain === 1);
        if (mainImage) {
          return <img src={mainImage.imagePath} alt="main" width={63} height={63} />;
        }
        return '';
      },
    },
    {
      title: '详情HTML',
      dataIndex: 'detailHtml',
      valueType: 'textarea',
      hideInTable: true,
      hideInSearch: true,
      ellipsis: true,
      render: (_, entity) => (
        <div
          dangerouslySetInnerHTML={{ __html: entity.detailHtml || '' }}
          style={{ maxWidth: '800px', overflow: 'auto' }}
        />
      ),
    },
    {
      title: '上一个商品ID',
      dataIndex: 'prevProductId',
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: '上一个商品标题',
      dataIndex: 'prevProductTitle',
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: '创建时间',
      sorter: true,
      dataIndex: 'createdAt',
      valueType: 'dateTime',
      hideInForm: true,
      search: false,
    },
    {
      title: '更新时间',
      sorter: true,
      dataIndex: 'updatedAt',
      valueType: 'dateTime',
      hideInForm: true,
      search: false,
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="Operating" />,
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="edit"
          onClick={() => {
            handleUpdateModalOpen(true);
            setCurrentRow(record);
          }}
        >
          编辑
        </a>,
        <a
          key="uploadMain"
          onClick={() => {
            setShowMainImage(true);
            setCurrentRow(record);
          }}
        >
          改主图
        </a>,
        <a
          key="delete"
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
      <ProTable<BikeListItem, API.PageParams>
        headerTitle="车辆管理"
        actionRef={actionRef}
        rowKey="productId"
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
        request={queryBikeEn}
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
      <BikeForm
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
      />
      <UpdateBikeForm
        onSubmit={async (value) => {
          const success = await handleUpdate(value);
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
        {currentRow?.productId && (
          <ProDescriptions<BikeListItem>
            column={2}
            title={currentRow?.title}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.productId,
            }}
            columns={columns as ProDescriptionsItemProps<BikeListItem>[]}
          />
        )}
      </Drawer>
      <ModalForm
        title="修改主图"
        width="400px"
        autoFocusFirstInput
        open={showMainImage}
        modalProps={{
          destroyOnClose: true,
          onCancel: () => console.log('run'),
        }}
        onOpenChange={setShowMainImage}
        onFinish={async (value) => {
          if (currentRow && value.mainImage && value.mainImage.length > 0) {
            const imageUrl = value.mainImage[0].response;
            try {
              await saveMainImageEn({
                productId: currentRow.productId!,
                imagePath: imageUrl,
                isMain: 1,
              });
              message.success('主图上传成功');
              setShowMainImage(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            } catch (error) {
              message.error('主图上传失败，请重试！');
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
          name="mainImage"
          action="/proxy/v1/api/upload/common"
        />
      </ModalForm>
    </PageContainer>
  );
};

export default BikeTableList;
