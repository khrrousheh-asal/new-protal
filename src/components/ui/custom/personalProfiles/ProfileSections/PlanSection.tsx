import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { ExternalLink } from "lucide-react";

import { Badge } from "@/components/ui/badge";
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
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import userService from "@/services/userService";
import type { UserPlanItem } from "@/types/users";

interface PlanSectionProps {
  planItems: UserPlanItem[];
}

export default function PlanSection({ planItems }: PlanSectionProps) {
  const [selectedPlan, setSelectedPlan] = React.useState<UserPlanItem | null>(
    null
  );

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
          <div className="flex max-w-full flex-wrap gap-1.5">
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
          <div className="min-w-0 space-y-1.5">
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

  const selectedPlanTasks = React.useMemo(
    () =>
      selectedPlan
        ? userService.getPlanTodoTasksByPlanId(selectedPlan.id)
        : [],
    [selectedPlan]
  );

  return (
    <section className="min-w-0">
      <Card className="min-w-0 overflow-hidden border-border/80">
        <CardHeader>
          <CardTitle>Development Plan</CardTitle>
          <CardDescription>
            Active growth plans, advisors, target skills, and progress. Select a
            row to view the task list.
          </CardDescription>
        </CardHeader>
        <CardContent className="min-w-0 overflow-hidden">
          <Table className="table-fixed">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="whitespace-normal break-words px-2"
                    >
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
                  <TableRow
                    key={row.id}
                    role="button"
                    tabIndex={0}
                    className="cursor-pointer focus-visible:bg-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
                    aria-label={`Open ${row.original.name} task list`}
                    onClick={() => setSelectedPlan(row.original)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setSelectedPlan(row.original);
                      }
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="whitespace-normal break-words px-2 align-top"
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

      <Dialog
        open={selectedPlan !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedPlan(null);
          }
        }}
      >
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedPlan?.name ?? "Plan Tasks"}</DialogTitle>
            <DialogDescription>
              Todo list tasks, descriptions, and reference links for this
              development plan.
            </DialogDescription>
          </DialogHeader>

          <Table className="table-fixed">
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/4 whitespace-normal break-words px-2">
                  Todo Task
                </TableHead>
                <TableHead className="w-2/5 whitespace-normal break-words px-2">
                  Description
                </TableHead>
                <TableHead className="whitespace-normal break-words px-2">
                  References
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedPlanTasks.length > 0 ? (
                selectedPlanTasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell className="whitespace-normal break-words px-2 align-top font-medium">
                      {task.task}
                    </TableCell>
                    <TableCell className="whitespace-normal break-words px-2 align-top">
                      {task.description}
                    </TableCell>
                    <TableCell className="whitespace-normal break-words px-2 align-top">
                      {task.references.length > 0 ? (
                        <div className="flex flex-col gap-2">
                          {task.references.map((reference) => (
                            <a
                              key={reference.url}
                              href={reference.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex min-w-0 items-center gap-1 text-sm font-medium text-primary underline-offset-4 hover:underline"
                            >
                              <span className="min-w-0 break-all">
                                {reference.label}
                              </span>
                              <ExternalLink className="size-3.5 shrink-0" />
                            </a>
                          ))}
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          No references
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="h-20 text-center text-muted-foreground"
                  >
                    No todo tasks are available for this plan.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>
    </section>
  );
}
