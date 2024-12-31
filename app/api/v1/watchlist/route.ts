import { NextResponse } from "next/server";
import { getServerSession_ } from "@/lib/auth/session";
import { getWatchList, insertWatchList } from "@/lib/sql";


export async function GET(request: Request) {
  const session = await getServerSession_();
  if (!session) {
    return NextResponse.json(
      {
        success: false,
        message: 'Unauthorized'
      },
      { status: 401 }
    );
  }

  const { email } = session.user;
  const watchlist = await getWatchList(email);
  return NextResponse.json({ watchlist });
}


export async function POST(request: Request) {
  try {
    const session = await getServerSession_();
    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized'
        },
        { status: 401 }
      );
    }
    const { email } = session.user;
    const { symbol } = await request.json();
    const sqlRes = await insertWatchList(email, symbol);
    if (!sqlRes.success) {
      return NextResponse.json(
        {
          success: false,
          message: sqlRes.message
        },
        { status: 500 }
      );
    }
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal Server Error'
      },
      { status: 500 }
    );
  }
}