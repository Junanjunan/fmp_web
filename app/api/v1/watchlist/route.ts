import { NextResponse } from "next/server";
import { getServerSession_ } from "@/lib/auth/session";
import { deleteSymbolFromWatchlist, getAllWatchlists, insertSymbolToWatchlist } from "@/lib/sql";


export async function GET() {
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
  const allWatchlists = await getAllWatchlists(email);
  return NextResponse.json({ allWatchlists });
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
    const { watchlistName, symbol } = await request.json();
    const sqlRes = await insertSymbolToWatchlist(email, watchlistName, symbol);
    if (!sqlRes.success) {
      return NextResponse.json(
        {
          success: false,
          message: sqlRes.message
        },
        { status: 500 }
      );
    }

    const allWatchlists = await getAllWatchlists(email);
    return NextResponse.json({ success: true, allWatchlists });
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

export async function DELETE(request: Request) {
  const session = await getServerSession_();
  if (!session) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  const { watchlistName, symbol } = await request.json();
  const sqlRes = await deleteSymbolFromWatchlist(session.user.email, watchlistName, symbol);
  if (!sqlRes.success) {
    return NextResponse.json({ success: false, message: sqlRes.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}