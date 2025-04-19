import { Card } from 'antd';
import React from 'react';
import 'react-quill/dist/quill.snow.css';

interface ArticleContentProps {
  content: string;
}

const ArticleContent: React.FC<ArticleContentProps> = ({ content }) => {
  return (
    <Card bordered={false}>
      <div dangerouslySetInnerHTML={{ __html: content }} className="ql-editor" />
    </Card>
  );
};

export default ArticleContent;
