
export type BugEnvironment =
  | "Development"
  | "Staging"
  | "Production"
  | "Testing";

export interface BugReportInput {
  title: string;
  description: string;
  environment: BugEnvironment;
  expectedBehavior: string;
  actualBehavior: string;
  logs: string;
}

export type BugSeverity = "Critical" | "High" | "Medium" | "Low";

export type BugStatus =
  | "Open"
  | "Investigating"
  | "Resolved";

export interface BugReport extends BugReportInput {
  id: string;
  severity: BugSeverity;
  status: BugStatus;
  createdAt: string;
}
