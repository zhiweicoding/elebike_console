import {DefaultFooter} from '@ant-design/pro-components';
import {useIntl} from '@umijs/max';
import {useModel} from 'umi';
import React from 'react';

const Footer: React.FC = () => {
  const intl = useIntl();
  const defaultMessage = intl.formatMessage({
    id: 'app.copyright.produced',
    defaultMessage: 'Produced by zhiwei. diaozhiwei2k@gmail.com',
  });

  const currentYear = new Date().getFullYear();
  const copyright = useModel('copyright');
  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      copyright={`${currentYear} ${defaultMessage}`}
      links={[
        {
          key: 'copyright',
          title: `${copyright}`,
          href: '',
          blankTarget: true,
        },
      ]}
    />
  );
};

export default Footer;
