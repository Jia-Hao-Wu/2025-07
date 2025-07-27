import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { Payment, PaymentStatus, Prisma } from '@prisma/client';

describe('PaymentsController', () => {
  let controller: PaymentsController;
  let service: PaymentsService;

  const mockPayment: Payment = {
    id: 1,
    amount: 100.50,
    notes: 'Test payment',
    accountId: 1,
    status: PaymentStatus.PENDING,
  };

  const mockPayments: Payment[] = [
    mockPayment,
    {
      id: 2,
      amount: 250.00,
      notes: 'Another payment',
      accountId: 2,
      status: PaymentStatus.APPROVED,
    },
  ];

  const mockPaymentsService = {
    getPayments: jest.fn(),
    getPayment: jest.fn(),
    createPayment: jest.fn(),
    updatePayment: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentsController],
      providers: [
        {
          provide: PaymentsService,
          useValue: mockPaymentsService,
        },
      ],
    }).compile();

    controller = module.get<PaymentsController>(PaymentsController);
    service = module.get<PaymentsService>(PaymentsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return an array of payments', async () => {
      mockPaymentsService.getPayments.mockResolvedValue(mockPayments);

      const result = await controller.getAll();

      expect(result).toEqual(mockPayments);
      expect(service.getPayments).toHaveBeenCalledTimes(1);
      expect(service.getPayments).toHaveBeenCalledWith();
    });

    it('should return empty array when no payments exist', async () => {
      mockPaymentsService.getPayments.mockResolvedValue([]);

      const result = await controller.getAll();

      expect(result).toEqual([]);
      expect(service.getPayments).toHaveBeenCalledTimes(1);
    });
  });

  describe('get', () => {
    it('should return a payment by id', async () => {
      mockPaymentsService.getPayment.mockResolvedValue(mockPayment);

      const result = await controller.get(1);

      expect(result).toEqual(mockPayment);
      expect(service.getPayment).toHaveBeenCalledTimes(1);
      expect(service.getPayment).toHaveBeenCalledWith({ id: 1 });
    });

    it('should return null when payment not found', async () => {
      mockPaymentsService.getPayment.mockResolvedValue(null);

      const result = await controller.get(999);

      expect(result).toBeNull();
      expect(service.getPayment).toHaveBeenCalledTimes(1);
      expect(service.getPayment).toHaveBeenCalledWith({ id: 999 });
    });
  });

  describe('create', () => {
    const createPaymentData: Prisma.PaymentCreateInput = {
      amount: 150.75,
      notes: 'New payment',
      status: PaymentStatus.PENDING,
      Account: {
        connect: { id: 1 }
      }
    };

    it('should create a new payment', async () => {
      const createdPayment = { ...mockPayment, amount: 150.75, notes: 'New payment' };
      mockPaymentsService.createPayment.mockResolvedValue(createdPayment);

      const result = await controller.create(1, createPaymentData);

      expect(result).toEqual(createdPayment);
      expect(service.createPayment).toHaveBeenCalledTimes(1);
      expect(service.createPayment).toHaveBeenCalledWith({
        accountId: 1,
        data: createPaymentData,
      });
    });

    it('should create a payment with minimal data', async () => {
      const minimalData: Prisma.PaymentCreateInput = {
        amount: 50.00,
        Account: {
          connect: { id: 2 }
        }
      };
      const createdPayment = { ...mockPayment, amount: 50.00, accountId: 2 };
      mockPaymentsService.createPayment.mockResolvedValue(createdPayment);

      const result = await controller.create(2, minimalData);

      expect(result).toEqual(createdPayment);
      expect(service.createPayment).toHaveBeenCalledTimes(1);
      expect(service.createPayment).toHaveBeenCalledWith({
        accountId: 2,
        data: minimalData,
      });
    });
  });

  describe('update', () => {
    const updatePaymentData: Prisma.PaymentUpdateInput = {
      amount: 200.00,
      notes: 'Updated payment',
      status: PaymentStatus.APPROVED,
    };

    it('should update an existing payment', async () => {
      const updatedPayment = { ...mockPayment, ...updatePaymentData };
      mockPaymentsService.updatePayment.mockResolvedValue(updatedPayment);

      const result = await controller.update(1, updatePaymentData);

      expect(result).toEqual(updatedPayment);
      expect(service.updatePayment).toHaveBeenCalledTimes(1);
      expect(service.updatePayment).toHaveBeenCalledWith({
        id: 1,
        data: updatePaymentData,
      });
    });

    it('should update payment with partial data', async () => {
      const partialData: Prisma.PaymentUpdateInput = {
        status: PaymentStatus.APPROVED,
      };
      const updatedPayment = { ...mockPayment, ...partialData };
      mockPaymentsService.updatePayment.mockResolvedValue(updatedPayment);

      const result = await controller.update(1, partialData);

      expect(result).toEqual(updatedPayment);
      expect(service.updatePayment).toHaveBeenCalledTimes(1);
      expect(service.updatePayment).toHaveBeenCalledWith({
        id: 1,
        data: partialData,
      });
    });
  });
});
