import { Card, CardContent, Typography } from "@mui/material";
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';

interface PieData {
  id: number;
  value: number;
  label: string;
}  
interface Transaction {
  amount: number;
  category?: string;
  source?: string;
}

interface Props {
  type: "expense" | "income";
  data: Transaction[];
}

const TransactionChart = ({type, data}:Props) => {

  const categoryTotals: Record<string, number> = (data ?? []).reduce(
    (acc, curr) => {
      const category = ((type==="expense")?curr.category:curr.source)  ?? "Uncategorized";
      acc[category] = (acc[category] || 0) + (Number(curr.amount) || 0);
      return acc;
    },
    {} as Record<string, number>
  );

  const pieData: PieData[] = Object.entries(categoryTotals).map(
    ([label, value], index) => ({
      id: index,
      value,
      label: `${label} (${new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 0,
      }).format(value)})`,
    })
  );

  const highestSpending =
    pieData.length > 0
      ? pieData.reduce((max, curr) =>
          curr.value > max.value ? curr : max
        )
      : null;

  return (
    <Card
      sx={{
        maxWidth: 600,
        mx: "auto",
        my: 4,
        boxShadow: 3,
        borderRadius: 4,
        p: 2,
      }}
    >
      <CardContent>
        <Typography variant="h6" textAlign="center" gutterBottom>
          {(type==='expense'?"Expense":"Income")} Distribution
        </Typography>

        {pieData.length === 0 ? (
          <Typography variant="body2" textAlign="center">
            No {type} data to display.
          </Typography>
        ) : (
          <>
            {highestSpending && (
              <Typography
                variant="subtitle1"
                color="secondary"
                textAlign="center"
                gutterBottom
              >
                Highest {(type==='expense'?"spending":"Income")}:{" "}
                <strong>{highestSpending.label}</strong>
              </Typography>
            )}

            <PieChart
              series={[
                {
                  arcLabel: (item) => `${item.label}`,
                  data: pieData,
                  innerRadius: 20,
                  outerRadius: 100,
                  paddingAngle: 2,
                  cornerRadius: 4,
                  cx:130,
                  cy:100,
                },
              ]}
              height={300}
              slotProps={{
                legend: {
                  direction: 'row',
                  position: { vertical: 'bottom', horizontal: 'middle' },
                },
              }}
              sx={{
                [`& .${pieArcLabelClasses.root}`]: {
                  fill: 'white',
                  fontSize: 12,
                },
              }}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionChart;
