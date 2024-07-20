import { Test, TestingModule } from '@nestjs/testing';
import { IUserRepository } from '~/contracts/repositories/user-repository.interface';
import { IUserService } from '~/contracts/services/user-service.interface';
import { User } from '~/models/user.model';
import { UserService } from '~/services/user.service';

describe('UserService', () => {
  let service: IUserService;

  const user: Partial<User> = {
    id: 'id',
    email: 'test@gmail.com',
    displayName: 'displayName',
    userName: 'userName',
    password: '123456',
  };

  const mockUserRepository = {
    findByCondition: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: IUserService,
          useClass: UserService,
        },
        {
          provide: IUserRepository,
          useValue: mockUserRepository,
        },
      ],
    })
      .useMocker((token) => {
        return jest.fn();
      })
      .compile();

    service = module.get<IUserService>(IUserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('getUserByConditions should return null', async () => {
    // arrange
    mockUserRepository.findByCondition.mockResolvedValue(null);

    // act
    const result = await service.getUserByConditions({ email: 'email' });

    // assert
    expect(result).toEqual(null);
  });

  it('getUserByConditions should return User', async () => {
    // arrange
    mockUserRepository.findByCondition.mockResolvedValue(user);

    // act
    const result = await service.getUserByConditions({ email: 'email' });

    // assert
    expect(result).toEqual(user);
  });

  it('existsByCredentials should return false', async () => {
    // arrange
    mockUserRepository.findByCondition.mockResolvedValue(null);

    // act
    const result = await service.existsByCredentials({ email: 'email' });

    // assert
    expect(result).toEqual(false);
  });

  it('existsByCredentials should return true', async () => {
    // arrange
    mockUserRepository.findByCondition.mockResolvedValue(user);

    // act
    const result = await service.existsByCredentials({ email: 'email' });

    // assert
    expect(result).toEqual(true);
  });

  it('createUser should return user without password', async () => {
    // arrange
    mockUserRepository.create.mockReturnValue(user);
    mockUserRepository.save.mockResolvedValue(user);

    // act
    const result = await service.createUser({ email: 'email' });

    // assert
    expect(result).toEqual({
      id: 'id',
      email: 'test@gmail.com',
      displayName: 'displayName',
      userName: 'userName',
    });
    // @ts-ignore
    expect(result?.password).toBeUndefined();
  });
});
