import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { UserRequestType } from "@/types/users";

export interface RequestFormValues {
  type: UserRequestType;
  issueDate: string;
  endDate?: string;
  notes: string;
}

interface RequestFormProps {
  onSubmit: (values: RequestFormValues) => void;
}

export default function RequestForm({ onSubmit }: RequestFormProps) {
  const [type, setType] = useState<UserRequestType>("annual-vacation");
  const [issueDate, setIssueDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [notes, setNotes] = useState("");

  const canSubmit = issueDate.length > 0 && notes.trim().length > 0;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    onSubmit({
      type,
      issueDate,
      endDate: endDate || undefined,
      notes: notes.trim(),
    });

    setType("annual-vacation");
    setIssueDate("");
    setEndDate("");
    setNotes("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <FieldGroup className="gap-4">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field>
            <FieldLabel htmlFor="request-type">Request type</FieldLabel>
            <Select
              value={type}
              onValueChange={(value) => setType(value as UserRequestType)}
            >
              <SelectTrigger id="request-type" className="w-full">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="annual-vacation">Annual Vacation</SelectItem>
                <SelectItem value="sick-leave">Sick Leave</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <FieldLabel htmlFor="issue-date">Issue date</FieldLabel>
            <Input
              id="issue-date"
              type="date"
              value={issueDate}
              onChange={(event) => setIssueDate(event.target.value)}
              required
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="end-date">End date</FieldLabel>
            <Input
              id="end-date"
              type="date"
              min={issueDate || undefined}
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
            />
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="request-notes">Reason / notes</FieldLabel>
          <Textarea
            id="request-notes"
            value={notes}
            placeholder="Add context for this request"
            onChange={(event) => setNotes(event.target.value)}
            required
          />
        </Field>

        <div className="flex justify-end">
          <Button type="submit" disabled={!canSubmit}>
            Add new
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
