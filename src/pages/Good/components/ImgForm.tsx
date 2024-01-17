import {useIntl} from '@umijs/max';
import {Drawer, Modal} from 'antd';
import React from 'react';


export type ImgFormProps = {
  onCancel: (flag?: boolean, formVals?: string[]) => void;
  imgModalOpen: boolean;
  values: string[];
};

const ImgForm: React.FC<ImgFormProps> = (props) => {
  const intl = useIntl();
  const values = props.values;
  return (
    <Drawer
      width={600}
      open={props.imgModalOpen}
      onClose={() => {
        props.onCancel();
      }}
      closable={false}
    >
      {values.map((item, index) => {
        return <img key={index} src={item} alt={`Image ${index}`} width={500}/>
      })}
    </Drawer>
  );
};

export default ImgForm;
