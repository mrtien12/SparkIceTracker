import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { insertIcebergTableSchema, type InsertIcebergTable, type IcebergTable } from "@shared/schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface AddIcebergTableDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingTable?: IcebergTable | null;
}

export default function AddIcebergTableDialog({ open, onOpenChange, editingTable }: AddIcebergTableDialogProps) {
  const { toast } = useToast();
  
  const form = useForm<InsertIcebergTable>({
    resolver: zodResolver(insertIcebergTableSchema),
    defaultValues: {
      tableName: "",
      tableJobType: "",
      tableLocation: "",
      isActive: false,
    },
  });

  useEffect(() => {
    if (editingTable) {
      form.reset({
        tableName: editingTable.tableName,
        tableJobType: editingTable.tableJobType,
        tableLocation: editingTable.tableLocation,
        isActive: editingTable.isActive,
      });
    } else {
      form.reset({
        tableName: "",
        tableJobType: "",
        tableLocation: "",
        isActive: false,
      });
    }
  }, [editingTable, form]);

  const createIcebergTableMutation = useMutation({
    mutationFn: (data: InsertIcebergTable) => apiRequest("POST", "/api/iceberg-tables", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/iceberg-tables"] });
      toast({ title: "Success", description: "Iceberg table created successfully" });
      onOpenChange(false);
      form.reset();
    },
    onError: (error: any) => {
      const message = error?.message || "Failed to create iceberg table";
      if (message.includes("already exists")) {
        form.setError("tableName", { message: "Table name already exists" });
      } else {
        toast({ title: "Error", description: message, variant: "destructive" });
      }
    },
  });

  const updateIcebergTableMutation = useMutation({
    mutationFn: (data: Partial<IcebergTable>) => apiRequest("PUT", `/api/iceberg-tables/${editingTable!.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/iceberg-tables"] });
      toast({ title: "Success", description: "Iceberg table updated successfully" });
      onOpenChange(false);
      form.reset();
    },
    onError: (error: any) => {
      const message = error?.message || "Failed to update iceberg table";
      if (message.includes("already exists")) {
        form.setError("tableName", { message: "Table name already exists" });
      } else {
        toast({ title: "Error", description: message, variant: "destructive" });
      }
    },
  });

  const onSubmit = (data: InsertIcebergTable) => {
    if (editingTable) {
      updateIcebergTableMutation.mutate(data);
    } else {
      createIcebergTableMutation.mutate(data);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editingTable ? "Edit Iceberg Table" : "Add New Iceberg Table"}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="tableName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Table Name</FormLabel>
                  <FormControl>
                    <Input placeholder="customer_transactions" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="tableJobType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select job type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="STREAMING">Streaming</SelectItem>
                      <SelectItem value="BATCH">Batch</SelectItem>
                      <SelectItem value="INCREMENTAL">Incremental</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="tableLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Table Location</FormLabel>
                  <FormControl>
                    <Input placeholder="s3://vietin-data-lake/tables/table_name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-vietinblue-600 hover:bg-vietinblue-700"
                disabled={createIcebergTableMutation.isPending || updateIcebergTableMutation.isPending}
              >
                {editingTable ? "Update Table" : "Create Table"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
