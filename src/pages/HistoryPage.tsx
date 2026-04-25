import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ResultBadge } from '@/components/ResultBadge';
import { Shield, ArrowLeft, Trash2, Video, Mic, FileText, Image as ImageIcon } from 'lucide-react';
import { fetchHistory, deleteHistoryRecord } from '@/services/historyService';
import type { HistoryRecord } from '@/types/types';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

export default function HistoryPage() {
  const navigate = useNavigate();
  const [records, setRecords] = useState<HistoryRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const pageSize = 10;

  const totalPages = Math.ceil(totalRecords / pageSize);

  useEffect(() => {
    loadHistory();
  }, [currentPage]);

  const loadHistory = async () => {
    setIsLoading(true);
    try {
      const response = await fetchHistory(currentPage, pageSize);
      if (response.error) {
        toast.error(response.error);
      } else {
        setRecords(response.data);
        setTotalRecords(response.total);
      }
    } catch (error) {
      toast.error('Failed to load history');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const response = await deleteHistoryRecord(deleteId);
      if (response.success) {
        toast.success('Record deleted successfully');
        loadHistory();
      } else {
        toast.error(response.error || 'Failed to delete record');
      }
    } catch (error) {
      toast.error('Failed to delete record');
    } finally {
      setDeleteId(null);
    }
  };

  const getMediaIcon = (mediaType: string) => {
    switch (mediaType) {
      case 'image':
        return <ImageIcon className="w-5 h-5 text-primary" />;
      case 'video':
        return <Video className="w-5 h-5 text-primary" />;
      case 'audio':
        return <Mic className="w-5 h-5 text-primary" />;
      case 'text':
        return <FileText className="w-5 h-5 text-primary" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">Detection History</h1>
            </div>
            <Button onClick={() => navigate('/')} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Analysis History</CardTitle>
              <CardDescription>
                View and manage your previous forensic detection analyses
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full bg-muted" />
                  ))}
                </div>
              ) : records.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">No detection history found</p>
                  <Button onClick={() => navigate('/detection')}>
                    Start Your First Detection
                  </Button>
                </div>
              ) : (
                <>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px]">Type</TableHead>
                          <TableHead>Content</TableHead>
                          <TableHead>Result</TableHead>
                          <TableHead className="text-right">Confidence</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead className="w-[80px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {records.map((record) => (
                          <TableRow key={record.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {getMediaIcon(record.media_type)}
                                <span className="capitalize text-sm">{record.media_type}</span>
                              </div>
                            </TableCell>
                            <TableCell className="max-w-xs truncate">
                              {record.file_name || record.content_preview || 'N/A'}
                            </TableCell>
                            <TableCell>
                              <ResultBadge 
                                result={record.result} 
                                confidence={record.confidence}
                                showIcon={false}
                              />
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {record.confidence}%
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {formatDate(record.created_at)}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setDeleteId(record.id)}
                              >
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-6">
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious
                              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                              className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                            />
                          </PaginationItem>
                          {[...Array(totalPages)].map((_, i) => (
                            <PaginationItem key={i}>
                              <PaginationLink
                                onClick={() => setCurrentPage(i + 1)}
                                isActive={currentPage === i + 1}
                                className="cursor-pointer"
                              >
                                {i + 1}
                              </PaginationLink>
                            </PaginationItem>
                          ))}
                          <PaginationItem>
                            <PaginationNext
                              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                              className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Record</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this detection record? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
