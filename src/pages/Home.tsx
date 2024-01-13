import RcResizeObserver from 'rc-resize-observer';
import {ProCard, StatisticCard} from '@ant-design/pro-components';
import {theme} from 'antd';
import React, {useState, useEffect} from 'react';
import {queryStatistic, queryPie} from "@/services/ant-design-pro/api";
import {Pie} from '@ant-design/charts';
import {Bar} from '@ant-design/plots';

const {Divider} = StatisticCard;

const Home: React.FC = () => {
  const {token} = theme.useToken();
  const [responsive, setResponsive] = useState(false);

  // 定义 state 来存储统计数据
  const [statistics, setStatistics] = useState({
    symbol: 0, // 商品分类数量
    good: 0,  // 商品总数
    store: 0    // 绑定店铺数量
  });

  //定义 state 来存储饼图数据
  const [pieData, setPieData] = useState<API.PieItem[]>([]);

  useEffect(() => {
    // 异步获取统计数据
    const fetchData = async () => {
      try {
        const data = await queryStatistic();
        const pieData = await queryPie();
        const msgBody = data.msgBody;
        const pieMsgBody = pieData.msgBody;
        setStatistics({
          symbol: msgBody.symbol ?? 0,
          good: msgBody.good ?? 0,
          store: msgBody.store ?? 0
        });
        setPieData(pieMsgBody ?? []);
      } catch (error) {
        // 错误处理
        console.error("Failed to fetch statistics:", error);
      }
    };

    fetchData().then(r => {
      console.log(r)
    });
  }, []); // 空数组表示仅在组件挂载时运行

  const SelfPie = () => {
    const config = {
      data: pieData,
      angleField: 'value',
      colorField: 'type',
      paddingRight: 80,
      innerRadius: 0.6,
      label: {
        text: 'value',
        style: {
          fontWeight: 'bold',
        },
      },
      legend: {
        color: {
          title: false,
          position: 'right',
          rowPadding: 5,
        },
      },
    };
    return <Pie {...config} />;
  };

  const SelfBar = () => {
    const config = {
      data: {
        value: pieData,
      },
      xField: 'type',
      yField: 'value',
      label: {
        text: 'value',
        style: {
          textAnchor: (d: { value: string | number; }) => (+d.value > 0 ? 'right' : 'start'),
          fill: (d: { value: string | number; }) => (+d.value > 0 ? '#fff' : '#000'),
          dx: (d: { value: string | number; }) => (+d.value > 0 ? -5 : 5),
        }
      }
    };
    return <Bar {...config} />;
  };

  const currentDay = new Date().toLocaleDateString('zh', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const currentWeek = new Date().toLocaleDateString('zh', {
    weekday: 'long',
  });

  return (
    <RcResizeObserver
      key="resize-observer"
      onResize={(offset) => {
        setResponsive(offset.width < 596);
      }}
    >
      <ProCard
        style={{
          color: token.colorTextHeading,
        }}
        title="数据概览"
        extra={currentDay + ' ' + currentWeek}
        split={responsive ? 'horizontal' : 'vertical'}
        headerBordered
        bordered
      >
        <StatisticCard.Group direction={responsive ? 'column' : 'row'}>
          <StatisticCard
            statistic={{
              title: '商品分类',
              value: statistics.symbol,
              suffix: '个',
            }}
          />
          <Divider type={responsive ? 'horizontal' : 'vertical'}/>
          <StatisticCard
            statistic={{
              title: '商品总数',
              value: statistics.good,
              suffix: '个',
            }}
          />
          <Divider type={responsive ? 'horizontal' : 'vertical'}/>
          <StatisticCard
            statistic={{
              title: '绑定店铺',
              value: statistics.store,
              suffix: '个',
            }}
          />
        </StatisticCard.Group>
      </ProCard>
      <StatisticCard.Group direction={responsive ? 'column' : 'row'}>
        <StatisticCard
          title="上传商品占比情况"
          chart={
            <SelfBar/>
          }
        />
        <Divider type={responsive ? 'horizontal' : 'vertical'}/>
        <StatisticCard
          title="上传商品占比情况"
          chart={
            <SelfPie/>
          }
        />
      </StatisticCard.Group>
    </RcResizeObserver>
  );
};

export default Home;
