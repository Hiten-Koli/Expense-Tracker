import { useEffect, useState } from "react";
import { editExpense, getExpenses, removeExpense } from "../redux/slice/expenseSlice";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { Container, Grid, Box, Typography, Paper, TextField, MenuItem } from "@mui/material";
import { createExpense } from "../redux/slice/expenseSlice";
import TransactionForm, { TransactionFormValues } from "../components/TransactionForm";
import ItemTable from "../components/ItemTable";
import TransactionChart from "../components/TransactionChart";
import { useNavigate } from "react-router-dom";

const categories = ["Food", "Transport", "Shopping", "Entertainment", "Bills", "Others",];
const Expense = () => {
  const { expenses, loading, error } = useAppSelector((state) => state.expense);
  const {token} =useAppSelector((state)=>state.auth);
  
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [ordering, setOrdering] = useState("");
  
  const onSubmit = (values: TransactionFormValues) => {
    dispatch(createExpense(values));
  };

  useEffect(() => {
    dispatch(getExpenses({page, pageSize,  ordering}));
  }, [dispatch, page, pageSize, ordering ]);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);
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
        <Box  mt={4}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
            <TextField
                label="Sort By"
                select
                value={ordering}
                onChange={(e) => setOrdering(e.target.value)}
                size="small"
                sx={{ width: 200 }}
              >
                <MenuItem value="">None</MenuItem>
                <MenuItem value="amount">Amount (Asc)</MenuItem>
                <MenuItem value="-amount">Amount (Desc)</MenuItem>
                <MenuItem value="title">Title (Asc)</MenuItem>
                <MenuItem value="-title">Title (Desc)</MenuItem>
              </TextField>
              <TextField
                label="Items per Page"
                select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                size="small"
                sx={{ width: 150 }}
              >
                {[5, 10, 20].map((size) => (
                  <MenuItem key={size} value={size}>
                    {size}
                  </MenuItem>
                ))}
            </TextField>
          </Box>
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
            <Box display="flex" justifyContent="center" mt={2}>
              <TextField
                type="number"
                label="Page"
                value={page}
                onChange={(e) => setPage(Number(e.target.value))}
                size="small"
                sx={{ width: 100 }}
              />
            </Box>
        </Box>
      </Container>
  );
};

export default Expense;
