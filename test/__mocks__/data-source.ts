export const mockDataSource = {
  getOne: jest.fn(),
  getRepository: jest.fn(),
  createQueryBuilder: jest.fn(),
  leftJoinAndSelect: jest.fn(),
  leftJoin: jest.fn(),
  addOrderBy: jest.fn(),
  andWhere: jest.fn(),
  orWhere: jest.fn(),
  select: jest.fn(),
  addSelect: jest.fn(),
  where: jest.fn(),
};
