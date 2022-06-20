interface CategoryDto {
  id: string;
  title: string;
  description: string;
  userId: string;
}

interface RecordDto {
  id: string;
  date: Date;
  cost: number;
  note: string;
  categoryId: string;
  userId: string;
}
