import { useEffect } from "react";
import { editIncome, getIncomes, removeIncome } from "../redux/slice/incomeSlice";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { Container, Grid, Box, Typography, Paper } from "@mui/material";
import { createIncome } from "../redux/slice/incomeSlice";
import TransactionForm, { TransactionFormValues } from "../components/TransactionForm";
import ItemTable from "../components/ItemTable";
import TransactionChart from "../components/TransactionChart";

const sources = ["Earned", "Passive", "Portfolio", "Others",];
const Income = () => {
  const { incomes, loading, error } = useAppSelector((state) => state.income);
  const dispatch = useAppDispatch();

  const onSubmit = (values: TransactionFormValues) => {
    dispatch(createIncome(values));
  };

  useEffect(() => {
    dispatch(getIncomes());
  }, [dispatch]);

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
        </Box>
      </Container>
  );
};

export default Income;
