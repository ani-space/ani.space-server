import { Test, TestingModule } from "@nestjs/testing";
import { mockDataSource } from "../__mocks__/data-source";
import { DataSource } from "typeorm";
import { IUserRepository } from "~/contracts/repositories/user-repository.interface";
import { SocialProvider, SocialProviderTypes } from "~/models/social-provider.model";
import { User } from "~/models/user.model";
import { UserRepository } from "~/repositories/user.repository";

describe('StudioRepository', () => {
  let repository: IUserRepository;

  const user: Partial<User> = {
    id: 'id',
    email: 'test@gmail.com',
    displayName: 'displayName',
    userName: 'userName',
    password: '123456',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: IUserRepository,
          useClass: UserRepository,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    })
      .useMocker((token) => {
        return jest.fn();
      })
      .compile();

    repository = module.get<IUserRepository>(IUserRepository);
    mockDataSource.getRepository.mockReturnValue(mockDataSource);
    mockDataSource.createQueryBuilder.mockReturnValue(mockDataSource);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('saveProviderAndUser should return User', async () => {
    // arrange
    const userParam: Partial<User> = {
      id: 'id',
      email: 'email',
      userName: 'userName'
    }
    const provider: Partial<SocialProvider> = {
      provider: SocialProviderTypes.GOOGLE
    }
    mockDataSource.manager.transaction.mockResolvedValue(user);

    // act
    const result = await repository.saveProviderAndUser(userParam, provider);

    // assert
    expect(result).toEqual(user);
  })
})