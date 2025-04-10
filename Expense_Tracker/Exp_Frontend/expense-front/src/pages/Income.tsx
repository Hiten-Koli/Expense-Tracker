import { useEffect, useState } from "react";
import { editIncome, getIncomes, removeIncome } from "../redux/slice/incomeSlice";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { Container, Grid, Box, Typography, Paper, TextField, MenuItem } from "@mui/material";
import { createIncome } from "../redux/slice/incomeSlice";
import TransactionForm, { TransactionFormValues } from "../components/TransactionForm";
import ItemTable from "../components/ItemTable";
import TransactionChart from "../components/TransactionChart";
import { useNavigate } from "react-router-dom";

const sources = ["Earned", "Passive", "Portfolio", "Others",];
const Income = () => {
  const { incomes, loading, error } = useAppSelector((state) => state.income);
  const {token} = useAppSelector((state)=>state.auth);
  
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [ordering, setOrdering] = useState("");
  const onSubmit = (values: TransactionFormValues) => {
    dispatch(createIncome(values));
  };

  useEffect(() => {
    dispatch(getIncomes({page, pageSize,  ordering}));
  }, [dispatch, page, pageSize,  ordering]);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  return (
    
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Incomes
        </Typography>

        {/* Chart & Form Side by Side */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <TransactionChart
                type= "income"
                data= {incomes}
              />
            </Paper>
          </Grid>            
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 2 }}>
                <Box display="flex" justifyContent="center">
                  <TransactionForm
                    type= "income"
                    options= {sources}
                    onSubmitHandler={onSubmit} />
                </Box>
              </Paper>
            </Grid>
        </Grid>

        {/* Table Below */}
        <Box mt={4}>
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
                items= {incomes}
                loading= {loading}
                error= {error}
                type= {"income"}
                labelOptions= {sources}
                onEdit= {(id, data)=>dispatch(editIncome({id, data}))}
                onDelete= {(id)=>dispatch(removeIncome(id))}
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

export default Income;
