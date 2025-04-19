import {
  addArticle,
  delArticle,
  modifyArticle,
  queryArticles,
} from '@/services/ant-design-pro/api';
import { PlusOutlined } from '@ant-design/icons';
import {
  ActionType,
  FooterToolbar,
  PageContainer,
  ProColumns,
  ProDescriptions,
  ProDescriptionsItemProps,
  ProTable,
} from '@ant-design/pro-components';
import { FormattedMessage } from '@umijs/max';
import { Button, Drawer, message, Tabs, Typography } from 'antd';
import React, { useRef, useState } from 'react';
import ArticleContent from './components/ArticleContent';
import ImgForm from './components/ImgForm';
import NewForm from './components/NewForm';
import UpdateForm from './components/UpdateForm';

/**
 * 添加文章
 * @param fields
 */
const handleAdd = async (fields: API.ArticleListItem) => {
  const hide = message.loading('正在添加');
  try {
    await addArticle({ ...fields });
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
 * 更新文章
 * @param fields
 */
const handleUpdate = async (fields: API.ArticleListItem) => {
  const hide = message.loading('正在修改');
  try {
    await modifyArticle(fields);
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
 * 删除文章
 * @param selectedRows
 */
const handleRemove = async (selectedRows: API.ArticleListItem[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    const idArray = selectedRows.map((row) => row.articleId);
    await delArticle(idArray);
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
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [showImg, setShowImg] = useState<boolean>(false);
  const [imgUrl, setImgUrl] = useState<string[]>([]);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.ArticleListItem>();
  const [selectedRowsState, setSelectedRows] = useState<API.ArticleListItem[]>([]);

  const columns: ProColumns<API.ArticleListItem>[] = [
    {
      title: '标题',
      dataIndex: 'title',
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
      title: '作者',
      dataIndex: 'author',
    },
    {
      title: '封面图片',
      dataIndex: 'photoUrl',
      hideInForm: true,
      search: false,
      render: (dom, entity) => {
        if (entity.photoUrl) {
          return (
            <a
              onClick={() => {
                setImgUrl([entity.photoUrl || '']);
                setShowImg(true);
              }}
            >
              <img src={dom as string} alt="photoUrl" width={120} height={80} />
            </a>
          );
        } else {
          return '无封面图';
        }
      },
    },
    {
      title: '浏览量',
      dataIndex: 'hits',
      hideInForm: true,
      search: false,
    },
    {
      title: '发布时间',
      dataIndex: 'publishTime',
      valueType: 'dateTime',
      hideInForm: true,
      search: false,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      valueType: 'dateTime',
      hideInForm: true,
      search: false,
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="操作" />,
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
          修改
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
      <ProTable<API.ArticleListItem, API.PageParams>
        headerTitle="文章列表"
        pagination={{
          pageSize: 10,
        }}
        actionRef={actionRef}
        rowKey="articleId"
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
            <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="新建" />
          </Button>,
        ]}
        request={queryArticles}
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
              <FormattedMessage id="pages.searchTable.chosen" defaultMessage="已选择" />{' '}
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
          // 处理上传组件返回的格式
          if (value.photoUrl && Array.isArray(value.photoUrl) && value.photoUrl.length > 0) {
            value.photoUrl = value.photoUrl[0].response || value.photoUrl[0];
          }

          // 将富文本内容转换为纯文本形式存储在content字段中
          if (value.orgContent) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = value.orgContent;
            value.content = tempDiv.textContent || tempDiv.innerText || '';
          }

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
          // 将富文本内容转换为纯文本形式存储在content字段中
          if (value.orgContent) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = value.orgContent;
            value.content = tempDiv.textContent || tempDiv.innerText || '';
          }

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
        width={800}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={true}
      >
        {currentRow?.articleId && (
          <>
            <Typography.Title level={4}>{currentRow?.title}</Typography.Title>
            <Tabs
              defaultActiveKey="1"
              items={[
                {
                  key: '1',
                  label: '基本信息',
                  children: (
                    <ProDescriptions<API.ArticleListItem>
                      column={2}
                      title={null}
                      request={async () => ({
                        data: currentRow || {},
                      })}
                      params={{
                        id: currentRow?.articleId,
                      }}
                      columns={
                        columns.filter(
                          (col) => col.dataIndex !== 'option',
                        ) as ProDescriptionsItemProps<API.ArticleListItem>[]
                      }
                    />
                  ),
                },
                {
                  key: '2',
                  label: '文章内容',
                  children: <ArticleContent content={currentRow?.orgContent || ''} />,
                },
              ]}
            />
          </>
        )}
      </Drawer>
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
