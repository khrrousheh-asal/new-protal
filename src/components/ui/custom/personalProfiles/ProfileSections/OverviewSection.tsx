import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import {
  CalendarCheck2,
  Eye,
  HeartPulse,
  MoreHorizontal,
  Search,
  Trash2,
} from "lucide-react";

import RequestForm, {
  type RequestFormValues,
} from "@/components/ui/custom/personalProfiles/RequestForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type {
  UserLeaveBalance,
  UserRequest,
  UserRequestStatus,
  UserRequestType,
} from "@/types/users";

interface OverviewSectionProps {
  employeeId: string;
  leaveBalances: UserLeaveBalance[];
  requests: UserRequest[];
}

type LogFilter = "all" | UserRequestType | UserRequestStatus;

const REQUEST_TYPE_LABELS: Record<UserRequestType, string> = {
  "annual-vacation": "Annual Vacation",
  "sick-leave": "Sick Leave",
};

const REQUEST_STATUS_LABELS: Record<UserRequestStatus, string> = {
  approved: "Approved",
  pending: "Pending",
  rejected: "Rejected",
};

const REQUEST_STATUS_VARIANTS: Record<
  UserRequestStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  approved: "default",
  pending: "secondary",
  rejected: "destructive",
};

const formatDate = (isoDate: string) =>
  new Date(`${isoDate}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const formatDateRange = (request: UserRequest) =>
  request.endDate
    ? `${formatDate(request.issueDate)} - ${formatDate(request.endDate)}`
    : formatDate(request.issueDate);

const formatRequestId = () =>
  `REQ-${Date.now().toString().slice(-6)}`;

export default function OverviewSection({
  employeeId,
  leaveBalances,
  requests: initialRequests,
}: OverviewSectionProps) {
  const [requests, setRequests] = React.useState<UserRequest[]>(initialRequests);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [selectedRequest, setSelectedRequest] =
    React.useState<UserRequest | null>(null);
  const [search, setSearch] = React.useState("");
  const [logFilter, setLogFilter] = React.useState<LogFilter>("all");

  React.useEffect(() => {
    setRequests(initialRequests);
    setSelectedRequest(null);
  }, [initialRequests]);

  const handleView = React.useCallback((request: UserRequest) => {
    setSelectedRequest(request);
    setDialogOpen(true);
  }, []);

  const handleDelete = React.useCallback((requestId: string) => {
    setRequests((currentRequests) =>
      currentRequests.filter((request) => request.id !== requestId)
    );
    setSelectedRequest((currentRequest) =>
      currentRequest?.id === requestId ? null : currentRequest
    );
  }, []);

  const handleAddRequest = React.useCallback(
    (values: RequestFormValues) => {
      const nextRequest: UserRequest = {
        id: formatRequestId(),
        employeeId,
        request: `${REQUEST_TYPE_LABELS[values.type]} Request`,
        type: values.type,
        submitDate: new Date().toISOString().slice(0, 10),
        issueDate: values.issueDate,
        endDate: values.endDate,
        status: "pending",
        notes: values.notes,
      };

      setRequests((currentRequests) => [nextRequest, ...currentRequests]);
      setSelectedRequest(nextRequest);
    },
    [employeeId]
  );

  const columns = React.useMemo<ColumnDef<UserRequest>[]>(
    () => [
      {
        id: "request",
        header: "Requests",
        cell: ({ row }) => {
          const request = row.original;

          return (
            <div className="flex min-w-48 flex-col gap-1">
              <span className="font-medium">{request.request}</span>
              <span className="flex flex-wrap gap-1.5">
                <Badge variant="outline">
                  {REQUEST_TYPE_LABELS[request.type]}
                </Badge>
                <Badge variant={REQUEST_STATUS_VARIANTS[request.status]}>
                  {REQUEST_STATUS_LABELS[request.status]}
                </Badge>
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: "submitDate",
        header: "Submit Date",
        cell: ({ row }) => formatDate(row.original.submitDate),
      },
      {
        id: "issueDate",
        header: "Issue Date",
        cell: ({ row }) => formatDateRange(row.original),
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => {
          const request = row.original;

          return (
            <div className="flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon-sm" aria-label="Actions">
                    <MoreHorizontal />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    className="gap-2"
                    onSelect={() => handleView(request)}
                  >
                    <Eye />
                    View
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="gap-2 text-destructive focus:text-destructive"
                    onSelect={() => handleDelete(request.id)}
                  >
                    <Trash2 />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ],
    [handleDelete, handleView]
  );

  const table = useReactTable({
    data: requests,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const filteredRequests = React.useMemo(() => {
    const query = search.trim().toLowerCase();

    return requests.filter((request) => {
      const matchesSearch =
        query.length === 0 ||
        request.request.toLowerCase().includes(query) ||
        request.notes.toLowerCase().includes(query) ||
        request.id.toLowerCase().includes(query);
      const matchesFilter =
        logFilter === "all" ||
        request.type === logFilter ||
        request.status === logFilter;

      return matchesSearch && matchesFilter;
    });
  }, [logFilter, requests, search]);

  return (
    <section className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        {leaveBalances.length > 0 ? (
          leaveBalances.map((balance) => {
            const Icon =
              balance.type === "sick-leave" ? HeartPulse : CalendarCheck2;

            return (
              <Card key={balance.type} className="border-border/80">
                <CardHeader className="flex flex-row items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-base">{balance.label}</CardTitle>
                    <CardDescription>{balance.note}</CardDescription>
                  </div>
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-primary/20 text-foreground">
                    <Icon className="size-5" />
                  </span>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-semibold tracking-tight">
                    {balance.taken}/{balance.have}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    You have over the year {balance.yearlyAllowance}.
                  </p>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <div className="rounded-2xl border border-dashed border-border p-6 text-sm text-muted-foreground md:col-span-2">
            No vacation balances are available for this profile.
          </div>
        )}
      </div>

      <Card className="border-border/80">
        <CardHeader>
          <CardTitle>Requests</CardTitle>
          <CardDescription>
            Current sick leave and annual vacation requests.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No requests found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] max-w-5xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Request Log</DialogTitle>
            <DialogDescription>
              Review request history, filter records, and add a new profile
              request.
            </DialogDescription>
          </DialogHeader>

          {selectedRequest ? (
            <div className="rounded-2xl border border-border/80 bg-muted/30 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline">{selectedRequest.id}</Badge>
                <Badge variant="outline">
                  {REQUEST_TYPE_LABELS[selectedRequest.type]}
                </Badge>
                <Badge
                  variant={REQUEST_STATUS_VARIANTS[selectedRequest.status]}
                >
                  {REQUEST_STATUS_LABELS[selectedRequest.status]}
                </Badge>
              </div>
              <p className="mt-3 font-medium">{selectedRequest.request}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {formatDateRange(selectedRequest)}
              </p>
              <p className="mt-3 text-sm">{selectedRequest.notes}</p>
            </div>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                placeholder="Search requests"
                className="pl-9"
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <Select
              value={logFilter}
              onValueChange={(value) => setLogFilter(value as LogFilter)}
            >
              <SelectTrigger className="w-full sm:w-56">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Requests</SelectItem>
                <SelectItem value="annual-vacation">
                  Annual Vacation
                </SelectItem>
                <SelectItem value="sick-leave">Sick Leave</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request</TableHead>
                <TableHead>Submit Date</TableHead>
                <TableHead>Issue Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.length > 0 ? (
                filteredRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span className="font-medium">{request.request}</span>
                        <span className="text-xs text-muted-foreground">
                          {request.id}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(request.submitDate)}</TableCell>
                    <TableCell>{formatDateRange(request)}</TableCell>
                    <TableCell>
                      <Badge variant={REQUEST_STATUS_VARIANTS[request.status]}>
                        {REQUEST_STATUS_LABELS[request.status]}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="h-20 text-center text-muted-foreground"
                  >
                    No request logs match the current filter.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <div className="rounded-2xl border border-border/80 p-4">
            <h3 className="mb-4 text-sm font-semibold">Add New</h3>
            <RequestForm onSubmit={handleAddRequest} />
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
