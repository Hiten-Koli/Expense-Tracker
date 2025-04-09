import { Table, TableHead, TableRow, TableCell, TableBody, Paper, TableContainer, Typography, IconButton, CircularProgress, Box,TextField} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { useEffect, useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { editBudget, getBudgets, removeBudget } from "../redux/slice/budgetSlice";

const BudgetTable = ()=>{
    const { budgets, loading, error } = useAppSelector((state) => state.budget);
    const dispatch = useAppDispatch();
    
    useEffect(() => {
        dispatch(getBudgets());
    }, [dispatch]);

    const [editId, setEditId] = useState<number | null>(null);
    const [editData, setEditData] = useState({
        amount_limit: 0,
        start_date: "",
        end_date: "",
    });

  const handleEditClick = (item: any) => {
    setEditId(item.id);
    setEditData({
      amount_limit: item.amount,
      start_date: item.start_date,
      end_date: item.end_date,
    });
  };

  const handleSaveClick = (id: number) => {
    const data:any =  editData
    dispatch(editBudget({id, data}));
    setEditId(null); 
  };
  const handleDelete = (id:number)=>{
    dispatch(removeBudget(id))
    setEditId(null)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

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
            const isEditing = editId === item.id;

            return (
              <TableRow 
                key={item.id}
                sx={{
                  color: new Date(item.end_date)< new Date()? 'green':'inherit',
                  '& td': {color: new Date(item.end_date)< new Date()? 'green':'inherit',},
                }}
                >
                <TableCell>
                  {isEditing ? (
                    <TextField
                      name="amount"
                      value={editData.amount_limit}
                      onChange={handleChange}
                      size="small"
                      type="number"
                    />
                  ) : (
                    item.amount_limit
                  )}
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <TextField
                      name="description"
                      value={editData.start_date}
                      onChange={handleChange}
                      size="small"
                    />
                  ) : (
                    item.start_date
                  )}
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <TextField
                      name="description"
                      value={editData.end_date}
                      onChange={handleChange}
                      size="small"
                    />
                  ) : (
                    item.end_date
                  )}
                </TableCell>
                <TableCell align="center">
                  {isEditing ? (
                    <IconButton color="primary" onClick={() => handleSaveClick(item.id)}>
                      <SaveIcon />
                    </IconButton>
                  ) : (
                    <IconButton color="info" onClick={() => handleEditClick(item)}>
                      <EditIcon />
                    </IconButton>
                  )}
                  {isEditing &&
                    <IconButton color="warning" onClick={() => setEditId(null)}>
                      <CloseIcon />
                    </IconButton>
                  }
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