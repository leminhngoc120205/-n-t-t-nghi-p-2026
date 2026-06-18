import { connectDB } from '@/lib/mongodb';
import { Template } from '@/models/template';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const category = request.nextUrl.searchParams.get('category');
    let query = {};

    if (category) {
      query = { category };
    }

    const templates = await Template.find(query).sort({ createdAt: -1 });

    return NextResponse.json(
      { success: true, data: templates },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching templates:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch templates' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const template = await Template.create(body);

    return NextResponse.json(
      { success: true, data: template },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating template:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create template' },
      { status: 400 }
    );
  }
}
