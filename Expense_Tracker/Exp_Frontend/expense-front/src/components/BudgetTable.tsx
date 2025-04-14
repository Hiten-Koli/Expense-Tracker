import { Table, TableHead, TableRow, TableCell, TableBody, Paper, TableContainer, Typography, IconButton, CircularProgress, Box,TextField} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect} from "react";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import {  getBudgets, removeBudget } from "../redux/slice/budgetSlice";

const BudgetTable = ()=>{
    const { budgets, loading, error } = useAppSelector((state) => state.budget);
    const dispatch = useAppDispatch();
    
    useEffect(() => {
        dispatch(getBudgets());
    }, [dispatch]);

    // const [editId, setEditId] = useState<number | null>(null);
    // const [editData, setEditData] = useState({
    //     amount_limit: 0,
    //     start_date: "",
    //     end_date: "",
    // });

  // const handleEditClick = (item: any) => {
  //   setEditId(item.id);
  //   setEditData({
  //     amount_limit: item.amount_limit,
  //     start_date: item.start_date,
  //     end_date: item.end_date,
  //   });
  // };

  // const handleSaveClick = (id: number) => {
  //   const data:any =  editData
  //   dispatch(editBudget({id, data}));
  //   setEditId(null); 
  // };
  const handleDelete = (id:number)=>{
    dispatch(removeBudget(id)).then(()=>{
      dispatch(getBudgets());
    })
    // setEditId(null)
  }

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target;
  //   setEditData((prev) => ({ ...prev, [name]: value }));
  // };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" align="center" mt={4}>
        {error}
      </Typography>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ mt: 4, borderRadius: 3 }}>
      <Typography variant="h6" align="center" sx={{ padding: 2 }}>
        Budget List
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>Amount Limit</strong></TableCell>
            <TableCell><strong>Start Date</strong></TableCell>
            <TableCell><strong>End Date</strong></TableCell>
            <TableCell align="center"><strong>Actions</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(budgets ?? []).map((item) => {
            // const isEditing = editId === item.id;

            return (
              <TableRow 
                key={item.id}
                sx={{
                  color: item.notified===true?
                    'red': new Date(item.end_date)< new Date() ? 'green':'inherit',
                  '& td': {color: item.notified===true?
                    'red': new Date(item.end_date)< new Date() ? 'green':'inherit',},
                }}
                >
                <TableCell>
                    {item.amount_limit}
                </TableCell>
                <TableCell>
                    {item.start_date}
                </TableCell>
                <TableCell>
                    {item.end_date}
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(item.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
          {budgets.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} align="center">
                No Budgets added yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
export default BudgetTable;