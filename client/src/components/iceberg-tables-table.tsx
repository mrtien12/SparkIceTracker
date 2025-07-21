import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Plus, Database } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AddIcebergTableDialog from "./add-iceberg-table-dialog";
import type { IcebergTable } from "@shared/schema";

export default function IcebergTablesTable() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingTable, setEditingTable] = useState<IcebergTable | null>(null);
  const { toast } = useToast();

  const { data: icebergTables = [], isLoading } = useQuery<IcebergTable[]>({
    queryKey: ["/api/iceberg-tables"],
  });

  const deleteTableMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/iceberg-tables/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/iceberg-tables"] });
      toast({ title: "Success", description: "Iceberg table deleted successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete iceberg table", variant: "destructive" });
    },
  });

  const toggleTableMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
      apiRequest("PUT", `/api/iceberg-tables/${id}`, { isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/iceberg-tables"] });
      toast({ title: "Success", description: "Iceberg table status updated" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update iceberg table status", variant: "destructive" });
    },
  });

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this iceberg table?")) {
      deleteTableMutation.mutate(id);
    }
  };

  const handleToggle = (id: number, currentStatus: boolean) => {
    toggleTableMutation.mutate({ id, isActive: !currentStatus });
  };

  const getJobTypeBadgeVariant = (jobType: string) => {
    switch (jobType) {
      case "STREAMING":
        return "bg-green-100 text-green-800";
      case "BATCH":
        return "bg-blue-100 text-blue-800";
      case "INCREMENTAL":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="text-center">Loading iceberg tables...</div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Iceberg Tables</h2>
        <Button onClick={() => setIsAddDialogOpen(true)} className="bg-vietinblue-600 hover:bg-vietinblue-700">
          <Plus className="mr-2 h-4 w-4" />
          Add Iceberg Table
        </Button>
      </div>

      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Table Name</TableHead>
              <TableHead>Job Type</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {icebergTables.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  No iceberg tables found. Add your first iceberg table to get started.
                </TableCell>
              </TableRow>
            ) : (
              icebergTables.map((table) => (
                <TableRow key={table.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                        <Database className="text-blue-600" size={16} />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{table.tableName}</div>
                        <div className="text-sm text-gray-500">Production</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${getJobTypeBadgeVariant(table.tableJobType)} border-none`}>
                      {table.tableJobType}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded max-w-xs truncate">
                      {table.tableLocation}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={table.isActive}
                      onCheckedChange={() => handleToggle(table.id, table.isActive)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingTable(table)}
                        className="text-gray-400 hover:text-blue-600"
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(table.id)}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      <AddIcebergTableDialog
        open={isAddDialogOpen || !!editingTable}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddDialogOpen(false);
            setEditingTable(null);
          }
        }}
        editingTable={editingTable}
      />
    </div>
  );
}
