export interface Workflow {
  id: string;
  name: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  archived?: boolean;
  isArchived?: boolean;
  nodes?: any[];
  connections?: any;
  settings?: any;
  staticData?: any | null;
  tags?: any[];
}
