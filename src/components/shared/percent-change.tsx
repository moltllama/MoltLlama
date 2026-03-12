interface PercentChangeProps {
  value: number;
}

export function PercentChange({ value }: PercentChangeProps) {
  if (value > 0) {
    return (
      <span className="text-data-positive font-medium">
        +{value.toFixed(2)}%
      </span>
    );
  }

  if (value < 0) {
    return (
      <span className="text-data-negative font-medium">
        {value.toFixed(2)}%
      </span>
    );
  }

  return (
    <span className="text-data-neutral font-medium">
      {value.toFixed(2)}%
    </span>
  );
}
