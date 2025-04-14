import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {TextField,Button,MenuItem,Card,CardContent,Typography,Box,} from "@mui/material";

const transactionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  amount: z.coerce.number({ invalid_type_error: "Amount is required" }).positive("Amount must be positive"),
  label : z.string().min(1, "This field is required"),
  description: z.string().min(1, "Description is required"),
});

export type TransactionFormValues = z.infer<typeof transactionSchema>;

interface Props {
  type: "expense" | "income";
  options: string[]; // categories or sources
  onSubmitHandler: (values: TransactionFormValues) => void;
}

const TransactionForm = ({type, options, onSubmitHandler}:Props) => {

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
  });

  const onSubmit = (values: TransactionFormValues) => {
    const payload:any = {
      ...values,
      [type==="expense"?"category":"source"]:values.label
    }
    delete payload.label;
    onSubmitHandler(payload);
    reset();
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="80vh"
    >
      <Card sx={{ width: 400, padding: 3, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" align="center" gutterBottom>
            {(type==="expense")?"Add new Expense":"Add new Income"}
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <TextField
              label="Title"
              fullWidth
              {...register("title")}
              error={!!errors.title}
              helperText={errors.title?.message}
            />

            <TextField
              label="Amount"
              type="number"
              fullWidth
              {...register("amount", { valueAsNumber: true })}
              error={!!errors.amount}
              helperText={errors.amount?.message}
            />

            <TextField
              select
              label={(type==="expense")?"Category":"Sources"}
              fullWidth
              {...register("label")}
              error={!!errors.label}
              helperText={errors.label?.message}
            >
              {options.map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Description"
              fullWidth
              {...register("description")}
              error={!!errors.description}
              helperText={errors.description?.message}
            />

            <Button variant="contained" color="primary" type="submit" fullWidth>
              Add {type.charAt(0).toUpperCase() + type.slice(1)}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default TransactionForm;
