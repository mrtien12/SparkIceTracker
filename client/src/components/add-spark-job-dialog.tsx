import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { insertSparkJobSchema, type InsertSparkJob, type SparkJob } from "@shared/schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface AddSparkJobDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingJob?: SparkJob | null;
}

export default function AddSparkJobDialog({ open, onOpenChange, editingJob }: AddSparkJobDialogProps) {
  const { toast } = useToast();
  
  const form = useForm<InsertSparkJob>({
    resolver: zodResolver(insertSparkJobSchema),
    defaultValues: {
      userEmail: "",
      applicationName: "",
      chatId: "",
      jobRam: 1,
      jobCore: 1,
      jobExecutor: 1,
      isActive: false,
    },
  });

  useEffect(() => {
    if (editingJob) {
      form.reset({
        userEmail: editingJob.userEmail,
        applicationName: editingJob.applicationName,
        chatId: editingJob.chatId,
        jobRam: editingJob.jobRam,
        jobCore: editingJob.jobCore,
        jobExecutor: editingJob.jobExecutor,
        isActive: editingJob.isActive,
      });
    } else {
      form.reset({
        userEmail: "",
        applicationName: "",
        chatId: "",
        jobRam: 1,
        jobCore: 1,
        jobExecutor: 1,
        isActive: false,
      });
    }
  }, [editingJob, form]);

  const createSparkJobMutation = useMutation({
    mutationFn: (data: InsertSparkJob) => apiRequest("POST", "/api/spark-jobs", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/spark-jobs"] });
      toast({ title: "Success", description: "Spark job created successfully" });
      onOpenChange(false);
      form.reset();
    },
    onError: (error: any) => {
      const message = error?.message || "Failed to create spark job";
      if (message.includes("already exists")) {
        form.setError("applicationName", { message: "Application name already exists" });
      } else {
        toast({ title: "Error", description: message, variant: "destructive" });
      }
    },
  });

  const updateSparkJobMutation = useMutation({
    mutationFn: (data: Partial<SparkJob>) => apiRequest("PUT", `/api/spark-jobs/${editingJob!.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/spark-jobs"] });
      toast({ title: "Success", description: "Spark job updated successfully" });
      onOpenChange(false);
      form.reset();
    },
    onError: (error: any) => {
      const message = error?.message || "Failed to update spark job";
      if (message.includes("already exists")) {
        form.setError("applicationName", { message: "Application name already exists" });
      } else {
        toast({ title: "Error", description: message, variant: "destructive" });
      }
    },
  });

  const onSubmit = (data: InsertSparkJob) => {
    if (editingJob) {
      updateSparkJobMutation.mutate(data);
    } else {
      createSparkJobMutation.mutate(data);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editingJob ? "Edit Spark Job" : "Add New Spark Job"}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="applicationName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Application Name</FormLabel>
                    <FormControl>
                      <Input placeholder="ETL-Pipeline-001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="userEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User Email</FormLabel>
                    <FormControl>
                      <Input placeholder="user@vietinbank.vn" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="chatId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chat ID</FormLabel>
                    <FormControl>
                      <Input placeholder="12345678" maxLength={8} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="jobRam"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>RAM (GB)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="jobCore"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CPU Cores</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="jobExecutor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Executors</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      placeholder="2"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
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
                disabled={createSparkJobMutation.isPending || updateSparkJobMutation.isPending}
              >
                {editingJob ? "Update Job" : "Create Job"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
