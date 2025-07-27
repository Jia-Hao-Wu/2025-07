import { Test, TestingModule } from '@nestjs/testing';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { Prisma } from '@prisma/client';

describe('AccountsController', () => {
  let controller: AccountsController;
  let service: AccountsService;

  const mockAccount = {
    id: 1,
    name: 'John Doe',
    address: '123 Main St',
    phoneNumber: '+1234567890',
    bankAccountNumber: 123456789,
  };

  const mockAccounts = [
    mockAccount,
    {
      id: 2,
      name: 'Jane Smith',
      address: '456 Oak Ave',
      phoneNumber: '+0987654321',
      bankAccountNumber: 987654321,
    },
  ];

  const mockAccountsService = {
    getAccounts: jest.fn(),
    getAccount: jest.fn(),
    createAccount: jest.fn(),
    updateAccount: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountsController],
      providers: [
        {
          provide: AccountsService,
          useValue: mockAccountsService,
        },
      ],
    }).compile();

    controller = module.get<AccountsController>(AccountsController);
    service = module.get<AccountsService>(AccountsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return an array of accounts', async () => {
      mockAccountsService.getAccounts.mockResolvedValue(mockAccounts);

      const result = await controller.getAll();

      expect(service.getAccounts).toHaveBeenCalledWith();
      expect(result).toEqual(mockAccounts);
    });

    it('should handle empty account list', async () => {
      mockAccountsService.getAccounts.mockResolvedValue([]);

      const result = await controller.getAll();

      expect(service.getAccounts).toHaveBeenCalledWith();
      expect(result).toEqual([]);
    });

    it('should handle service errors', async () => {
      const error = new Error('Database connection failed');
      mockAccountsService.getAccounts.mockRejectedValue(error);

      await expect(controller.getAll()).rejects.toThrow('Database connection failed');
      expect(service.getAccounts).toHaveBeenCalledWith();
    });
  });

  describe('get', () => {
    it('should return a single account by id', async () => {
      mockAccountsService.getAccount.mockResolvedValue(mockAccount);

      const result = await controller.get(1);

      expect(service.getAccount).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual(mockAccount);
    });

    it('should return null when account not found', async () => {
      mockAccountsService.getAccount.mockResolvedValue(null);

      const result = await controller.get(999);

      expect(service.getAccount).toHaveBeenCalledWith({ id: 999 });
      expect(result).toBeNull();
    });

    it('should handle service errors', async () => {
      const error = new Error('Account not found');
      mockAccountsService.getAccount.mockRejectedValue(error);

      await expect(controller.get(1)).rejects.toThrow('Account not found');
      expect(service.getAccount).toHaveBeenCalledWith({ id: 1 });
    });
  });

  describe('create', () => {
    const createAccountData: Prisma.AccountCreateInput = {
      name: 'New Account',
      address: '789 Pine St',
      phoneNumber: '+1122334455',
      bankAccountNumber: 555666777,
    };

    it('should create a new account', async () => {
      const createdAccount = { id: 3, ...createAccountData };
      mockAccountsService.createAccount.mockResolvedValue(createdAccount);

      const result = await controller.create(createAccountData);

      expect(service.createAccount).toHaveBeenCalledWith({ data: createAccountData });
      expect(result).toEqual(createdAccount);
    });

    it('should create account without optional bank account number', async () => {
      const dataWithoutBankAccount: Prisma.AccountCreateInput = {
        name: 'Account No Bank',
        address: '999 Elm St',
        phoneNumber: '+5544332211',
      };
      const createdAccount = { id: 4, ...dataWithoutBankAccount, bankAccountNumber: null };
      mockAccountsService.createAccount.mockResolvedValue(createdAccount);

      const result = await controller.create(dataWithoutBankAccount);

      expect(service.createAccount).toHaveBeenCalledWith({ data: dataWithoutBankAccount });
      expect(result).toEqual(createdAccount);
    });

    it('should handle validation errors', async () => {
      const error = new Error('Validation failed');
      mockAccountsService.createAccount.mockRejectedValue(error);

      await expect(controller.create(createAccountData)).rejects.toThrow('Validation failed');
      expect(service.createAccount).toHaveBeenCalledWith({ data: createAccountData });
    });
  });

  describe('update', () => {
    const updateAccountData: Prisma.AccountUpdateInput = {
      name: 'Updated Name',
      phoneNumber: '+9999999999',
    };

    it('should update an existing account', async () => {
      const updatedAccount = { ...mockAccount, ...updateAccountData };
      mockAccountsService.updateAccount.mockResolvedValue(updatedAccount);

      const result = await controller.update(1, updateAccountData);

      expect(service.updateAccount).toHaveBeenCalledWith({ 
        id: 1, 
        data: updateAccountData 
      });
      expect(result).toEqual(updatedAccount);
    });

    it('should update specific fields only', async () => {
      const partialUpdate: Prisma.AccountUpdateInput = {
        phoneNumber: '+1111111111',
      };
      const updatedAccount = { ...mockAccount, phoneNumber: '+1111111111' };
      mockAccountsService.updateAccount.mockResolvedValue(updatedAccount);

      const result = await controller.update(1, partialUpdate);

      expect(service.updateAccount).toHaveBeenCalledWith({ 
        id: 1, 
        data: partialUpdate 
      });
      expect(result).toEqual(updatedAccount);
    });

    it('should handle update errors for non-existent account', async () => {
      const error = new Error('Account not found');
      mockAccountsService.updateAccount.mockRejectedValue(error);

      await expect(controller.update(999, updateAccountData)).rejects.toThrow('Account not found');
      expect(service.updateAccount).toHaveBeenCalledWith({ 
        id: 999, 
        data: updateAccountData 
      });
    });

    it('should handle validation errors during update', async () => {
      const error = new Error('Invalid data provided');
      mockAccountsService.updateAccount.mockRejectedValue(error);

      await expect(controller.update(1, updateAccountData)).rejects.toThrow('Invalid data provided');
      expect(service.updateAccount).toHaveBeenCalledWith({ 
        id: 1, 
        data: updateAccountData 
      });
    });
  });

  describe('Parameter validation', () => {
    it('should handle ParseIntPipe validation for get method', async () => {
      mockAccountsService.getAccount.mockResolvedValue(mockAccount);

      const result = await controller.get(1);

      expect(service.getAccount).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual(mockAccount);
    });

    it('should handle ParseIntPipe validation for update method', async () => {
      const updateData: Prisma.AccountUpdateInput = { name: 'Updated' };
      const updatedAccount = { ...mockAccount, name: 'Updated' };
      mockAccountsService.updateAccount.mockResolvedValue(updatedAccount);

      const result = await controller.update(1, updateData);

      expect(service.updateAccount).toHaveBeenCalledWith({ 
        id: 1, 
        data: updateData 
      });
      expect(result).toEqual(updatedAccount);
    });
  });
});
