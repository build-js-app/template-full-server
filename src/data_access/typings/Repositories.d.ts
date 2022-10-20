interface CategoryRepository {
  getCategoryById(id: string): Promise<CategoryDto>;
  getCategories(userId: string): Promise<CategoryDto[]>;
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

interface UserRepository {
  getUserByEmail(email: string): Promise<UserDto>;
  getLocalUserByEmail(email: string): Promise<UserDto>;
  saveLocalAccount(user: UserDto, userData: any): Promise<UserDto>;
  getUserById(id: string): Promise<UserDto>;
  getUsers(): Promise<UserDto[]>;
  getUserByActivationToken(token: string): Promise<UserDto>;
  refreshActivationToken(token: string): Promise<UserDto>;
  activateUser(userId: string): Promise<UserDto>;
  updateUser(userData: any): Promise<UserDto>;
  removeUser(id: string): Promise<void>;
  resetPassword(userId: string): Promise<UserDto>;
  updateUserPassword(userId: string, password: string): Promise<UserDto>;
  getUserByResetToken(token: string): Promise<UserDto>;
  refreshResetToken(userId): Promise<UserDto>;
}
