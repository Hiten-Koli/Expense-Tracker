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
import { Controller, useForm } from "react-hook-form";
import { DateField } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";

const categories = ["Food", "Transport", "Shopping", "Entertainment", "Bills", "Others",];
const Expense = () => {
  const { expenses, loading, error } = useAppSelector((state) => state.expense);
  const {token} =useAppSelector((state)=>state.auth);
  const { control, formState: { errors } } = useForm();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [ordering, setOrdering] = useState("");
  const [start_date, setStartDate] = useState<Dayjs|null>(null);
  const [end_date, setEndDate] = useState<Dayjs|null>(null);
  
  const onSubmit = (values: TransactionFormValues) => {
    dispatch(createExpense(values));
  };

  useEffect(() => {    
    dispatch(getExpenses({
      page, 
      pageSize,  
      ordering, 
      start_date: start_date? start_date.format("YYYY-MM-DD"):undefined, 
      end_date: end_date? end_date.format("YYYY-MM-DD"): undefined
    }));
  }, [dispatch, page, pageSize, ordering, start_date, end_date]);

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
              {/* Bulk Upload  */}
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
            sx={{ width: 220 }}
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="amount">Amount (Asc)</MenuItem>
            <MenuItem value="-amount">Amount (Desc)</MenuItem>
            <MenuItem value="title">Title (Asc)</MenuItem>
            <MenuItem value="-title">Title (Desc)</MenuItem>
          </TextField>
          <Controller
              control={control}
              name="start_date"
              render={({ field }) => (
                <DateField
                  {...field}
                  label="Start Date"
                  format="YYYY-MM-DD"
                  value={dayjs(start_date)}
                  onChange={(newValue) => {
                    setStartDate(newValue);
                    field.onChange(newValue);
                  }}
                  sx={{ width: 150 }}
                  slotProps={{
                    textField: {
                      error: !!errors.start_date,
                    },
                  }}
                />
              )}
            />
            {/* use Controller to use DateField */}
            <Controller
              control={control}
              name="end_date"
              render={({ field }) => (
                <DateField
                  {...field}
                  label="End Date"
                  format="YYYY-MM-DD"
                  value={dayjs(end_date)}
                  onChange={(newValue) => {
                    setEndDate(newValue);
                    field.onChange(newValue);
                  }}
                  sx={{ width: 150 }}
                  slotProps={{
                    textField: {
                      error: !!errors.end_date,
                    },
                  }}
                />
              )}
            />
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
