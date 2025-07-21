import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Pencil, Trash2, Plus, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AddSparkJobDialog from "./add-spark-job-dialog";
import type { SparkJob } from "@shared/schema";

export default function SparkJobsTable() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<SparkJob | null>(null);
  const { toast } = useToast();

  const { data: sparkJobs = [], isLoading } = useQuery<SparkJob[]>({
    queryKey: ["/api/spark-jobs"],
  });

  const deleteJobMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/spark-jobs/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/spark-jobs"] });
      toast({ title: "Success", description: "Spark job deleted successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete spark job", variant: "destructive" });
    },
  });

  const toggleJobMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
      apiRequest("PUT", `/api/spark-jobs/${id}`, { isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/spark-jobs"] });
      toast({ title: "Success", description: "Spark job status updated" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update spark job status", variant: "destructive" });
    },
  });

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this spark job?")) {
      deleteJobMutation.mutate(id);
    }
  };

  const handleToggle = (id: number, currentStatus: boolean) => {
    toggleJobMutation.mutate({ id, isActive: !currentStatus });
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="text-center">Loading spark jobs...</div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Spark Jobs</h2>
        <Button onClick={() => setIsAddDialogOpen(true)} className="bg-vietinblue-600 hover:bg-vietinblue-700">
          <Plus className="mr-2 h-4 w-4" />
          Add Spark Job
        </Button>
      </div>

      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Application</TableHead>
              <TableHead>User Email</TableHead>
              <TableHead>Chat ID</TableHead>
              <TableHead>Resources</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sparkJobs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No spark jobs found. Add your first spark job to get started.
                </TableCell>
              </TableRow>
            ) : (
              sparkJobs.map((job) => (
                <TableRow key={job.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-vietinblue-100 rounded-lg flex items-center justify-center mr-3">
                        <Zap className="text-vietinblue-600" size={16} />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{job.applicationName}</div>
                        <div className="text-sm text-gray-500">Production</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-900">{job.userEmail}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">
                      {job.chatId}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-900">
                      {job.jobRam}GB RAM, {job.jobCore} Cores
                    </div>
                    <div className="text-sm text-gray-500">{job.jobExecutor} Executors</div>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={job.isActive}
                      onCheckedChange={() => handleToggle(job.id, job.isActive)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingJob(job)}
                        className="text-gray-400 hover:text-vietinblue-600"
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(job.id)}
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

      <AddSparkJobDialog
        open={isAddDialogOpen || !!editingJob}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddDialogOpen(false);
            setEditingJob(null);
          }
        }}
        editingJob={editingJob}
      />
    </div>
  );
}
