import { useEffect } from "react";
import { editExpense, getExpenses, removeExpense } from "../redux/slice/expenseSlice";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { Container, Grid, Box, Typography, Paper } from "@mui/material";
import { createExpense } from "../redux/slice/expenseSlice";
import TransactionForm, { TransactionFormValues } from "../components/TransactionForm";
import ItemTable from "../components/ItemTable";
import TransactionChart from "../components/TransactionChart";

const categories = ["Food", "Transport", "Shopping", "Entertainment", "Bills", "Others",];
const Expense = () => {
  const { expenses, loading, error } = useAppSelector((state) => state.expense);
  const dispatch = useAppDispatch();
  
  const onSubmit = (values: TransactionFormValues) => {
    dispatch(createExpense(values));
  };

  useEffect(() => {
    dispatch(getExpenses());
  }, [dispatch]);

  return (
    
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Expenses
        </Typography>

        {/* Chart & Form Side by Side */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <TransactionChart
                type= "expense"
                data= {expenses}
              />
            </Paper>
          </Grid>            
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 2 }}>
                <Box display="flex" justifyContent="center">
                  <TransactionForm
                    type= "expense"
                    options= {categories}
                    onSubmitHandler={onSubmit} />
                </Box>
              </Paper>
            </Grid>
        </Grid>
        {/* Table Below */}
        <Box mt={4}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <ItemTable
              items= {expenses}
              loading= {loading}
              error= {error}
              type= {"expense"}
              labelOptions= {categories}
              onEdit= {(id, data)=>dispatch(editExpense({id, data}))}
              onDelete= {(id)=>dispatch(removeExpense(id))}
              />
          </Paper>
        </Box>
      </Container>
  );
};

export default Expense;
