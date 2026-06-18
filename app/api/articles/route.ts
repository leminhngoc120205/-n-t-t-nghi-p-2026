import { connectDB } from '@/lib/mongodb';
import { Article } from '@/models/article';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const status = request.nextUrl.searchParams.get('status');
    const author = request.nextUrl.searchParams.get('author');
    const page = parseInt(request.nextUrl.searchParams.get('page') || '1');
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '10');

    let query: any = {};
    if (status) query.status = status;
    if (author) query.author = author;

    const skip = (page - 1) * limit;
    const articles = await Article.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Article.countDocuments(query);

    return NextResponse.json(
      { success: true, data: articles, pagination: { total, page, limit } },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch articles' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    
    // Generate slug from title
    const slug = body.title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '');

    body.slug = slug;

    const article = await Article.create(body);

    return NextResponse.json(
      { success: true, data: article },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating article:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create article' },
      { status: 400 }
    );
  }
}
