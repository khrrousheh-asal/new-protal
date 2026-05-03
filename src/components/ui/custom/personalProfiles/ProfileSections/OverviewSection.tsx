import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { CalendarCheck2, HeartPulse } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
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
  leaveBalances: UserLeaveBalance[];
  requests: UserRequest[];
}

const REQUESTS_PAGE_SIZE = 4;

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

const getPageNumbers = (pageCount: number) =>
  Array.from({ length: pageCount }, (_, index) => index);

export default function OverviewSection({
  leaveBalances,
  requests,
}: OverviewSectionProps) {
  const [pageIndex, setPageIndex] = React.useState(0);

  React.useEffect(() => {
    setPageIndex(0);
  }, [requests]);

  const pageCount = Math.max(
    1,
    Math.ceil(requests.length / REQUESTS_PAGE_SIZE)
  );
  const currentPageIndex = Math.min(pageIndex, pageCount - 1);
  const canPreviousPage = currentPageIndex > 0;
  const canNextPage = currentPageIndex < pageCount - 1;

  const paginatedRequests = React.useMemo(() => {
    const start = currentPageIndex * REQUESTS_PAGE_SIZE;

    return requests.slice(start, start + REQUESTS_PAGE_SIZE);
  }, [currentPageIndex, requests]);

  const columns = React.useMemo<ColumnDef<UserRequest>[]>(
    () => [
      {
        id: "request",
        header: "Requests",
        cell: ({ row }) => {
          const request = row.original;

          return (
            <div className="flex min-w-0 flex-col gap-1">
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
    ],
    []
  );

  const table = useReactTable({
    data: paginatedRequests,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

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
        <CardContent className="space-y-4">
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

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Page {currentPageIndex + 1} of {pageCount}
            </p>
            <Pagination className="mx-0 w-auto justify-start sm:justify-end">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    aria-disabled={!canPreviousPage}
                    tabIndex={canPreviousPage ? undefined : -1}
                    className={
                      canPreviousPage ? undefined : "pointer-events-none opacity-50"
                    }
                    onClick={(event) => {
                      event.preventDefault();
                      setPageIndex((current) => Math.max(0, current - 1));
                    }}
                  />
                </PaginationItem>
                {getPageNumbers(pageCount).map((pageNumber) => (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      href="#"
                      isActive={pageNumber === currentPageIndex}
                      onClick={(event) => {
                        event.preventDefault();
                        setPageIndex(pageNumber);
                      }}
                    >
                      {pageNumber + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    aria-disabled={!canNextPage}
                    tabIndex={canNextPage ? undefined : -1}
                    className={
                      canNextPage ? undefined : "pointer-events-none opacity-50"
                    }
                    onClick={(event) => {
                      event.preventDefault();
                      setPageIndex((current) =>
                        Math.min(pageCount - 1, current + 1)
                      );
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
