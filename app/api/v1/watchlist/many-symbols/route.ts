import { NextResponse } from "next/server";
import { getServerSession_ } from "@/lib/auth/session";
import { getAllWatchlists, insertManySymbolsToWatchlist } from "@/lib/sql";


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
    const { watchlistName, symbolWithExchangeArray } = await request.json();
    const sqlRes = await insertManySymbolsToWatchlist(
      email, watchlistName, symbolWithExchangeArray
    );
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