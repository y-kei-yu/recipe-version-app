export type Recipe = {
  id: number;
  title: string;
  description: string | null;
  latestVersionNumber: number;
  updatedAt: Date;
};
