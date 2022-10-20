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
interface UserDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profile: any;
}
