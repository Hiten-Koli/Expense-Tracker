import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {TextField,Button, Card,CardContent,Typography,Box} from "@mui/material";
import { useAppDispatch } from "../hooks/hooks";
import { createBudget } from "../redux/slice/budgetSlice";
import { DateField } from '@mui/x-date-pickers/DateField';

const budgetSchema = z
    .object({
        amount_limit: z.number({ invalid_type_error: "Amount is required" }).positive("Amount must be positive"),
        start_date : z.coerce.date({ message:"Invalid date string!"}),
        end_date: z.coerce.date({ message:"Invalid date string!"}),
    })
    .refine((data) => data.end_date > data.start_date, {
        message: "End date must be after start date",
        path: ["end_date"], // attaches error to end_date
    });;

export type BudgetFormValues = z.infer<typeof budgetSchema>;

const BudgetForm = ()=>{
    const dispatch = useAppDispatch();
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
      } = useForm<BudgetFormValues>({
        resolver: zodResolver(budgetSchema),
      });
    const onSubmit = (values: BudgetFormValues) => {
        const formattedValues = {
            ...values,
            start_date: values.start_date.toISOString().split("T")[0], // "YYYY-MM-DD"
            end_date: values.end_date.toISOString().split("T")[0],     // "YYYY-MM-DD"
          };
        
          dispatch(createBudget(formattedValues));
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
                Add New Budget
            </Typography>

            <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            
            <TextField
                label="Amount"
                type="number"
                fullWidth
                {...register("amount_limit", { valueAsNumber: true })}
                error={!!errors.amount_limit}
                helperText={errors.amount_limit?.message}
            />
            <Controller
              control={control}
              name="start_date"
              render={({ field }) => (
                <DateField
                  {...field}
                  label="Start Date"
                  format="YYYY-MM-DD"
                  fullWidth
                  slotProps={{
                    textField: {
                      error: !!errors.start_date,
                      helperText: errors.start_date?.message,
                    },
                  }}
                />
              )}
            />

            <Controller
              control={control}
              name="end_date"
              render={({ field }) => (
                <DateField
                  {...field}
                  label="End Date"
                  format="YYYY-MM-DD"
                  fullWidth
                  slotProps={{
                    textField: {
                      error: !!errors.end_date,
                      helperText: errors.end_date?.message,
                    },
                  }}
                />
              )}
            />
            <Button variant="contained" color="primary" type="submit" fullWidth>
                Add Budget
            </Button>
            </form>
        </CardContent>
        </Card>
    </Box>
    );
}

export default BudgetForm;