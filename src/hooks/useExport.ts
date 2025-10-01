import { useToast } from '@/hooks/use-toast';

export const useExport = () => {
  const { toast } = useToast();

  const exportToCSV = (data: any[], filename: string) => {
    try {
      if (!data || data.length === 0) {
        toast({
          title: 'No data to export',
          description: 'There is no data available to export.',
          variant: 'destructive',
        });
        return;
      }

      // Get headers from first object
      const headers = Object.keys(data[0]);
      
      // Create CSV content
      const csvContent = [
        headers.join(','),
        ...data.map(row => 
          headers.map(header => {
            const value = row[header];
            // Handle values that might contain commas
            if (typeof value === 'string' && value.includes(',')) {
              return `"${value}"`;
            }
            return value;
          }).join(',')
        )
      ].join('\n');

      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `${filename}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: 'Export successful',
        description: `${filename}.csv has been downloaded.`,
      });
    } catch (error) {
      toast({
        title: 'Export failed',
        description: 'An error occurred while exporting data.',
        variant: 'destructive',
      });
    }
  };

  const exportTasksToCSV = (tasks: any[]) => {
    const exportData = tasks.map(task => ({
      'Task ID': task.task_id,
      'Title': task.title,
      'Status': task.status,
      'Priority': task.priority,
      'Assignee': task.assignee?.full_name || 'Unassigned',
      'Assigner': task.assigner?.full_name || 'Unknown',
      'Due Date': task.due_date || 'No due date',
      'Created At': new Date(task.created_at).toLocaleString(),
      'Completed At': task.completed_at ? new Date(task.completed_at).toLocaleString() : 'Not completed',
    }));

    exportToCSV(exportData, `tasks-${new Date().toISOString().split('T')[0]}`);
  };

  const exportActivityLogsToCSV = (logs: any[]) => {
    const exportData = logs.map(log => ({
      'User': log.user?.full_name || 'Unknown',
      'Action': log.action_type,
      'Task': log.task?.task_id || 'N/A',
      'Details': JSON.stringify(log.details),
      'Timestamp': new Date(log.created_at).toLocaleString(),
    }));

    exportToCSV(exportData, `activity-logs-${new Date().toISOString().split('T')[0]}`);
  };

  return {
    exportToCSV,
    exportTasksToCSV,
    exportActivityLogsToCSV,
  };
};
