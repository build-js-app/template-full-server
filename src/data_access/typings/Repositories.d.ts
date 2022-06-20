interface CategoryRepository {
  getCategoryById(id: string): Promise<CategoryDto>;
  getCategories(userId: string): Promise<Categories[]>;
  addCategory(userId: string, categoryData: Partial<CategoryDto>): Promise<CategoryDto>;
  updateCategory(categoryData: CategoryDto): Promise<CategoryDto>;
  removeCategory(id: string): Promise<void>;
}

interface RecordRepository {
  getRecords(userId: string, searchQuery: any): Promise<RecordDto[]>;
  getRecordById(id: string): Promise<RecordDto>;
  addRecord(userId: string, recordData: Partial<RecordDto>);
  updateRecord(recordData: RecordDto): Promise<RecordDto>;
  removeRecord(id: string): Promise<void>;
  getRecordsByCategoryId(categoryId: string): Promise<RecordDto[]>;
}
