import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {Button, Card,CardContent,Typography,Box} from "@mui/material";
import { useAppDispatch } from "../hooks/hooks";
import { uploadBulkExpense } from "../redux/slice/expenseSlice";
import { useEffect, useState } from "react";
const bulkFileSchema = z.object({
    file: z
      .any()
      .refine(
        (fileList) =>
          fileList instanceof FileList &&
          fileList.length > 0 &&
          [
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          ].includes(fileList[0].type),
        {
          message: "Only .xlsx files are allowed",
        }
      ),
  });
  
  type BulkFileValues = z.infer<typeof bulkFileSchema>;
  
  const BulkFileUpload = () => {
    const dispatch = useAppDispatch();
    const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  
    const {
      register,
      handleSubmit,
      formState: { errors },
      reset,
      watch,
    } = useForm<BulkFileValues>({
      resolver: zodResolver(bulkFileSchema),
    });
  
    const watchedFile = watch("file");
  
    useEffect(() => {
      if (watchedFile instanceof FileList && watchedFile.length > 0) {
        setSelectedFileName(watchedFile[0].name);
      } else {
        setSelectedFileName(null);
      }
    }, [watchedFile]);
  
    const onSubmit = (values: BulkFileValues) => {
      const formData = new FormData();
      formData.append("file", values.file[0]); // 🟢 append the actual file directly with key "file"
  
      dispatch(uploadBulkExpense(formData));
      reset();
      setSelectedFileName(null);
    };
  
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Card sx={{ width: 400, padding: 3, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h5" align="center" gutterBottom>
              Add Bulk Expense
            </Typography>
  
            <form
              onSubmit={handleSubmit(onSubmit)}
              style={{ display: "flex", flexDirection: "column", gap: "20px" }}
            >
              <Button variant="contained" component="label">
                Upload File
                <input type="file" hidden {...register("file")} />
              </Button>
  
              {errors.file && (
                <Typography variant="body2" color="error">
                  {errors.file.message?.toString()}
                </Typography>
              )}
  
              {selectedFileName && (
                <Typography variant="body2" color="textSecondary">
                  Selected: {selectedFileName}
                </Typography>
              )}
  
              <Button variant="contained" color="primary" type="submit" fullWidth>
                Add Bulk Expense
              </Button>
            </form>
          </CardContent>
        </Card>
      </Box>
    );
  };
  
  export default BulkFileUpload;