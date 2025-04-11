import { Container, Grid, Box, Typography, Paper } from "@mui/material";
import BudgetForm from "../components/BudgetForm";
import BudgetTable from "../components/BudgetTable";

const Budget=()=>{
  console.log(Grid)
    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Budget
          </Typography>
  
          {/* Form Side by Side */}
            <Grid item xs={12} md={6}>
                <Paper elevation={3} sx={{ p: 2 }}>
                  <Box display="flex" justifyContent="center">
                    <BudgetForm />
                  </Box>
                </Paper>
             </Grid>
          {/* Table Below */}
          <Box mt={4}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <BudgetTable                />
            </Paper>
          </Box>
        </Container>
    );
}
export default Budget;