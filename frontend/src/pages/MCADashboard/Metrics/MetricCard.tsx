import React from 'react';

import { Card, CardBody, CardHeader, CardTitle } from '@patternfly/react-core';
import { getMetricData } from './api/metricsData';

import { Unit } from './types';

type MetricCardProps = {
  name: string;
  query: string;
  refreshRate: number;
  unit?: Unit;
};

const MetricCard: React.FC<MetricCardProps> = ({
  name,
  query,
  refreshRate,
  unit,
}: MetricCardProps): React.ReactElement => {
  const [percentage, setPercentage] = React.useState(0.0);
  const [noGpu, setNoGpu] = React.useState("");

  const getData = async () => {
    const data = await getMetricData(query);
    if (data === 'No GPUs Detected') {
      setNoGpu(data);
    } else {
      setPercentage(Math.round(data * 100) / 100);
    }
  };

  React.useEffect(() => {
    getData();
  }, []);

  React.useEffect(() => {
    const interval = setInterval(async () => {
      getData();
    }, refreshRate);

    return () => clearInterval(interval);
  }, [refreshRate]);

  return (
    <Card className="metric-card">
      <CardHeader className="metric-card-header">{name}</CardHeader>
      <CardBody className="metric-card-data">
        {noGpu === "" ? (
          <>
            {Math.round(percentage * 100) / 100}
            {unit === Unit.PERCENT && unit}
          </>
        ) : (
          <>
            {noGpu}
          </>
        )}
      </CardBody>
    </Card>
  );
};

export default MetricCard;
