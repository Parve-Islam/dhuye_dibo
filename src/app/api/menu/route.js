import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import Review from '@/models/Review';
import Order from '@/models/Order';
import LaundryShop from '@/models/LaundryShop';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { orderId, rating, comment } = await request.json();

    await dbConnect();

    // Get order details to get laundryShopId
    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Create review
    const review = await Review.create({
      userId: session.user.id,
      orderId,
      laundryShopId: order.laundryShopId,
      rating,
      comment
    });

    // Update laundry shop ratings
    const laundryShop = await LaundryShop.findById(order.laundryShopId);
    if (laundryShop) {
      laundryShop.ratings.push(rating);
      await laundryShop.save();
    }

    return NextResponse.json({ review }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');
    
    await dbConnect();

    const reviews = await Review.find({ 
      orderId 
    }).populate('userId', 'name');

    return NextResponse.json({ reviews });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}