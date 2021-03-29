interface Props {
  readonly data: {
    timestamp: string;
    sensor_id: string;
    temp_avg: number;
    temp_min: number;
    temp_max: number;
    temp_std: number;
  }[];
}

export function DataSheet({ data }: Props): JSX.Element {
  return (
    <table className="text-left w-full table-auto">
      <thead>
        <tr>
          <th>timestamp</th>
          <th>temp_avg</th>
          <th>temp_min</th>
          <th>temp_max</th>
          <th>temp_std</th>
        </tr>
      </thead>
      <tbody>
        {data.map((v, i) => (
          <tr className="hover:bg-gray-300 odd:bg-gray-100" key={i}>
            <td>{v.timestamp}</td>
            <td>{v.temp_avg}</td>
            <td>{v.temp_min}</td>
            <td>{v.temp_max}</td>
            <td>{v.temp_std}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
