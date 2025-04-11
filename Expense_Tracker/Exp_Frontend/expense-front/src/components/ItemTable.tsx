import { Table, TableHead, TableRow, TableCell, TableBody, Paper, TableContainer, Typography, IconButton, CircularProgress, Box,TextField, MenuItem} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
interface Props {
  items: any[];
  loading: boolean;
  error: string | null;
  type: "expense" | "income";
  labelOptions: string[];
  onEdit: (id: number, data: any) => void;
  onDelete: (id: number) => void;
}
const ItemTable = ({items, loading,error, type, labelOptions, onEdit, onDelete}:Props) => {
  // 

  const [editId, setEditId] = useState<number | null>(null);
  const [editData, setEditData] = useState({
    title: "",
    amount: 0,
    label: "",
    description: "",
  });

  const handleEditClick = (item: any) => {
    setEditId(item.id);
    setEditData({
      title: item.title,
      amount: item.amount,
      label: type === "expense" ? item.category : item.source,
      description: item.description,
    });
  };

  const handleSaveClick = (id: number) => {
    const updatedData = {
      ...editData,
      [type === "expense" ? "category" : "source"]: editData.label,
    } as any;
    delete updatedData.label;
    onEdit(id, updatedData);
    setEditId(null); 
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) {
    console.log(loading)
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
        {type === "expense" ? "Expense List" : "Income List"}
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>Title</strong></TableCell>
            <TableCell><strong>Created At</strong></TableCell>
            <TableCell><strong>Amount</strong></TableCell>
            <TableCell><strong>{type === "expense" ? "Category" : "Source"}</strong></TableCell>
            <TableCell><strong>Description</strong></TableCell>
            <TableCell align="center"><strong>Actions</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(items ?? []).map((item) => {
            const isEditing = editId === item.id;

            return (
              <TableRow key={item.id}>
                <TableCell>
                  {isEditing ? (
                    <TextField
                      name="title"
                      value={editData.title}
                      onChange={handleChange}
                      size="small"
                    />
                  ) : (
                    item.title
                  )}
                </TableCell>
                <TableCell>
                  {new Date(item.created_at).toISOString().split("T")[0]}
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <TextField
                      name="amount"
                      value={editData.amount}
                      onChange={handleChange}
                      size="small"
                      type="number"
                    />
                  ) : (
                    item.amount
                  )}
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <TextField
                      select
                      name="category"
                      value={editData.label}
                      onChange={handleChange}
                      size="small"
                     >
                      {labelOptions.map((opt) => (
                        <MenuItem key={opt} value={opt}>
                          {opt}
                        </MenuItem>
                      ))}
                    </TextField>
                  ) : (
                    type === "expense" ? item.category : item.source
                  )}
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <TextField
                      name="description"
                      value={editData.description}
                      onChange={handleChange}
                      size="small"
                    />
                  ) : (
                    item.description
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
                    onClick={() => onDelete(item.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
          {items.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} align="center">
                No {type}s added yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ItemTable;
