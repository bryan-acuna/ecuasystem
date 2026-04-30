import type { Request, Response } from 'express';
import asyncHandler from '../middleware/asyncHandler.js';
import prisma from '../config/database.js';

interface OrderItemInput {
  id: string;
  name: string;
  image: string;
  price: number;
  qty: number;
  countInStock?: number;
}

interface ShippingAddressInput {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

interface CreateOrderBody {
  orderItems: OrderItemInput[];
  shippingAddress: ShippingAddressInput;
  paymentMethod: string;
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
}

interface PayOrderBody {
  id?: string;
  status?: string;
  update_time?: string;
  email_address?: string;
}

const addOrderItems = asyncHandler(async (req: Request, res: Response) => {
  const body = req.body as CreateOrderBody;

  if (!body.orderItems || body.orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  }

  const order = await prisma.order.create({
    data: {
      userId: req.user!.id,
      orderItems: body.orderItems.map(({ id, countInStock: _countInStock, ...rest }) => ({
        ...rest,
        productId: id,
      })),
      shippingAddress: body.shippingAddress,
      paymentMethod: body.paymentMethod,
      itemsPrice: body.itemsPrice,
      taxPrice: body.taxPrice,
      shippingPrice: body.shippingPrice,
      totalPrice: body.totalPrice,
    },
  });

  res.status(201).json(order);
});

const getMyOrders = asyncHandler(async (req: Request, res: Response) => {
  const orders = await prisma.order.findMany({
    where: { userId: req.user!.id },
    orderBy: { createdAt: 'desc' },
  });
  res.json(orders);
});

const getOrderById = asyncHandler(async (req: Request, res: Response) => {
  const order = await prisma.order.findUnique({
    where: { id: req.params.id as string },
    include: {
      user: { select: { name: true, email: true } },
    },
  });

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (order.userId !== req.user!.id && !req.user!.isAdmin) {
    res.status(403);
    throw new Error('Not authorized');
  }

  res.json(order);
});

const updateOrderToPaid = asyncHandler(async (req: Request, res: Response) => {
  const order = await prisma.order.findUnique({ where: { id: req.params.id as string } });

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (order.userId !== req.user!.id && !req.user!.isAdmin) {
    res.status(403);
    throw new Error('Not authorized');
  }

  const body = req.body as PayOrderBody;

  const updatedOrder = await prisma.order.update({
    where: { id: req.params.id as string },
    data: {
      isPaid: true,
      paidAt: new Date(),
      paymentResult: {
        id: body.id,
        status: body.status,
        update_time: body.update_time,
        email_address: body.email_address,
      },
    },
  });

  res.json(updatedOrder);
});

const updateOrderToDelivered = asyncHandler(async (req: Request, res: Response) => {
  const order = await prisma.order.findUnique({ where: { id: req.params.id as string } });

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  const updatedOrder = await prisma.order.update({
    where: { id: req.params.id as string },
    data: { isDelivered: true, deliveredAt: new Date() },
  });

  res.json(updatedOrder);
});

const getOrders = asyncHandler(async (_req: Request, res: Response) => {
  const orders = await prisma.order.findMany({
    include: {
      user: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
  res.json(orders);
});

export {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders,
};
