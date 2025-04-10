import { useEffect, useState } from "react";
import { editExpense, getExpenses, removeExpense } from "../redux/slice/expenseSlice";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { Container, Grid, Box, Typography, Paper, TextField, MenuItem } from "@mui/material";
import { createExpense } from "../redux/slice/expenseSlice";
import TransactionForm, { TransactionFormValues } from "../components/TransactionForm";
import ItemTable from "../components/ItemTable";
import TransactionChart from "../components/TransactionChart";
import { useNavigate } from "react-router-dom";
import BulkFileUpload from "../components/BulkFileUpload";

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
        {/* Chart */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <TransactionChart type="expense" data={expenses} />
          </Paper>
        </Grid>

        {/* Form + Bulk Upload */}
        <Grid item xs={1} md={6}>
          <Paper elevation={3} sx={{p:2} }>
            <Box display="flex" alignItems="center" justifyContent="space-between" gap={2}>
              {/* Transaction Form */}
              <Box flex={1} sx={{ width: 380 }}>
                <TransactionForm
                  type="expense"
                  options={categories}
                  onSubmitHandler={onSubmit}
                />
              </Box>

              {/* OR Divider */}
              <Typography variant="body2" color="textSecondary" sx={{ mx: 1 }}>
                OR
              </Typography>

              {/* Bulk Upload with fixed smaller width */}
              <Box sx={{ width: 250 }}>
                <BulkFileUpload />
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Filters & Table */}
      <Box mt={4}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
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
            {[5, 10, 20, 50].map((size) => (
              <MenuItem key={size} value={size}>
                {size}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        <Paper elevation={3} sx={{ p: 2 }}>
          <ItemTable
            items={expenses}
            loading={loading}
            error={error}
            type="expense"
            labelOptions={categories}
            onEdit={(id, data) => dispatch(editExpense({ id, data }))}
            onDelete={(id) => dispatch(removeExpense(id))}
          />
        </Paper>

        {/* Page Selector */}
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
