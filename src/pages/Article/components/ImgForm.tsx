import { Image, Modal } from 'antd';
import React from 'react';

export type ImgFormProps = {
  onCancel: (flag?: boolean) => void;
  imgModalOpen: boolean;
  values: string[];
};

const ImgForm: React.FC<ImgFormProps> = (props) => {
  return (
    <Modal
      width={600}
      open={props.imgModalOpen}
      title="图片预览"
      onCancel={() => {
        props.onCancel();
      }}
      footer={null}
    >
      <Image.PreviewGroup>
        {props.values.map((item, index) => (
          <Image width={550} src={item} key={index} />
        ))}
      </Image.PreviewGroup>
    </Modal>
  );
};

export default ImgForm;
