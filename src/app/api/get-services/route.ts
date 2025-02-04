import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../mongoClient";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const month = searchParams.get("month");

    const collection = await connectDB();

    const serviceData = await collection.findOne({ month });

    return NextResponse.json(
      { services: serviceData?.services || [] },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { message: "Erro ao buscar viagens.", error: e.message },
      { status: 500 }
    );
  }
}
