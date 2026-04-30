import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { UserPlanItem } from "@/types/users";

interface PlanSectionProps {
  planItems: UserPlanItem[];
}

export default function PlanSection({ planItems }: PlanSectionProps) {
  const columns = React.useMemo<ColumnDef<UserPlanItem>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
          <span className="font-medium">{row.original.name}</span>
        ),
      },
      {
        accessorKey: "advisor",
        header: "Advisor",
      },
      {
        id: "skills",
        header: "Skills",
        cell: ({ row }) => (
          <div className="flex min-w-52 flex-wrap gap-1.5">
            {row.original.skills.map((skill) => (
              <Badge key={skill} variant="outline">
                {skill}
              </Badge>
            ))}
          </div>
        ),
      },
      {
        accessorKey: "description",
        header: "Description",
      },
      {
        accessorKey: "progress",
        header: "Progress",
        cell: ({ row }) => (
          <div className="min-w-36 space-y-1.5">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span>{row.original.progress}%</span>
            </div>
            <Progress value={row.original.progress} />
          </div>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: planItems,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <section>
      <Card className="border-border/80">
        <CardHeader>
          <CardTitle>Development Plan</CardTitle>
          <CardDescription>
            Active growth plans, advisors, target skills, and progress.
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
                      <TableCell
                        key={cell.id}
                        className={
                          cell.column.id === "description"
                            ? "min-w-72 whitespace-normal"
                            : undefined
                        }
                      >
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
                    No plan items are available for this profile.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </section>
  );
}
