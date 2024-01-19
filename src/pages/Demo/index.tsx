import React from 'react';
import { Map, APILoader } from '@uiw/react-amap';

const Demo = () => (
  <APILoader akey="a77478385099aef85f4c7dabf7fce005">
    <Map style={{ height: 300 }}/>
  </APILoader>
);

export default Demo
