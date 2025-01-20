import { NextResponse } from "next/server";
import { getServerSession_ } from "@/lib/auth/session";
import { insertWatchlist, deleteWatchlist } from "@/lib/sql";


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
    const { watchlistName } = await request.json();
    const sqlRes = await insertWatchlist(email, watchlistName);
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

export async function DELETE(request: Request) {
  const session = await getServerSession_();
  if (!session) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  const { watchlistName } = await request.json();
  const sqlRes = await deleteWatchlist(session.user.email, watchlistName);
  if (!sqlRes.success) {
    return NextResponse.json({ success: false, message: sqlRes.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}