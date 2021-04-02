import { ResponsiveLine, Serie } from '@nivo/line';

interface Props {
  data: Serie[];
}

const props: Props = {
  data: [
    {
      id: 'japan',
      color: 'hsl(19, 70%, 50%)',
      data: [
        {
          x: 'plane',
          y: 297,
        },
        {
          x: 'helicopter',
          y: 213,
        },
        {
          x: 'boat',
          y: 86,
        },
        {
          x: 'train',
          y: 201,
        },
        {
          x: 'subway',
          y: 156,
        },
        {
          x: 'bus',
          y: 130,
        },
        {
          x: 'car',
          y: 242,
        },
        {
          x: 'moto',
          y: 212,
        },
        {
          x: 'bicycle',
          y: 123,
        },
        {
          x: 'horse',
          y: 256,
        },
        {
          x: 'skateboard',
          y: 86,
        },
        {
          x: 'others',
          y: 291,
        },
      ],
    },
    {
      id: 'france',
      color: 'hsl(247, 70%, 50%)',
      data: [
        {
          x: 'plane',
          y: 85,
        },
        {
          x: 'helicopter',
          y: 123,
        },
        {
          x: 'boat',
          y: 85,
        },
        {
          x: 'train',
          y: 116,
        },
        {
          x: 'subway',
          y: 218,
        },
        {
          x: 'bus',
          y: 265,
        },
        {
          x: 'car',
          y: 114,
        },
        {
          x: 'moto',
          y: 63,
        },
        {
          x: 'bicycle',
          y: 262,
        },
        {
          x: 'horse',
          y: 72,
        },
        {
          x: 'skateboard',
          y: 267,
        },
        {
          x: 'others',
          y: 146,
        },
      ],
    },
    {
      id: 'us',
      color: 'hsl(104, 70%, 50%)',
      data: [
        {
          x: 'plane',
          y: 243,
        },
        {
          x: 'helicopter',
          y: 106,
        },
        {
          x: 'boat',
          y: 74,
        },
        {
          x: 'train',
          y: 254,
        },
        {
          x: 'subway',
          y: 87,
        },
        {
          x: 'bus',
          y: 55,
        },
        {
          x: 'car',
          y: 21,
        },
        {
          x: 'moto',
          y: 109,
        },
        {
          x: 'bicycle',
          y: 33,
        },
        {
          x: 'horse',
          y: 205,
        },
        {
          x: 'skateboard',
          y: 72,
        },
        {
          x: 'others',
          y: 253,
        },
      ],
    },
    {
      id: 'germany',
      color: 'hsl(309, 70%, 50%)',
      data: [
        {
          x: 'plane',
          y: 5,
        },
        {
          x: 'helicopter',
          y: 299,
        },
        {
          x: 'boat',
          y: 296,
        },
        {
          x: 'train',
          y: 145,
        },
        {
          x: 'subway',
          y: 59,
        },
        {
          x: 'bus',
          y: 286,
        },
        {
          x: 'car',
          y: 242,
        },
        {
          x: 'moto',
          y: 10,
        },
        {
          x: 'bicycle',
          y: 117,
        },
        {
          x: 'horse',
          y: 128,
        },
        {
          x: 'skateboard',
          y: 128,
        },
        {
          x: 'others',
          y: 133,
        },
      ],
    },
    {
      id: 'norway',
      color: 'hsl(50, 70%, 50%)',
      data: [
        {
          x: 'plane',
          y: 237,
        },
        {
          x: 'helicopter',
          y: 167,
        },
        {
          x: 'boat',
          y: 60,
        },
        {
          x: 'train',
          y: 137,
        },
        {
          x: 'subway',
          y: 265,
        },
        {
          x: 'bus',
          y: 145,
        },
        {
          x: 'car',
          y: 31,
        },
        {
          x: 'moto',
          y: 149,
        },
        {
          x: 'bicycle',
          y: 159,
        },
        {
          x: 'horse',
          y: 109,
        },
        {
          x: 'skateboard',
          y: 81,
        },
        {
          x: 'others',
          y: 226,
        },
      ],
    },
  ],
};

export function Chart(): JSX.Element {
  return (
    <ResponsiveLine
      data={props.data}
      margin={{ top: 10, right: 110, bottom: 75, left: 60 }}
      xScale={{ type: 'point' }}
      yScale={{
        type: 'linear',
        min: 'auto',
        max: 'auto',
        stacked: true,
        reverse: false,
      }}
      yFormat=" >-.2f"
      axisTop={null}
      axisRight={null}
      axisBottom={{
        orient: 'bottom',
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'transportation',
        legendOffset: 36,
        legendPosition: 'middle',
      }}
      axisLeft={{
        orient: 'left',
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'count',
        legendOffset: -40,
        legendPosition: 'middle',
      }}
      pointSize={10}
      pointColor={{ theme: 'background' }}
      pointBorderWidth={2}
      pointBorderColor={{ from: 'serieColor' }}
      pointLabelYOffset={-12}
      useMesh={true}
      legends={[
        {
          anchor: 'bottom-right',
          direction: 'column',
          justify: false,
          translateX: 100,
          translateY: 0,
          itemsSpacing: 0,
          itemDirection: 'left-to-right',
          itemWidth: 80,
          itemHeight: 20,
          itemOpacity: 0.75,
          symbolSize: 12,
          symbolShape: 'circle',
          symbolBorderColor: 'rgba(0, 0, 0, .5)',
          effects: [
            {
              on: 'hover',
              style: {
                itemBackground: 'rgba(0, 0, 0, .03)',
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
    />
  );
}
