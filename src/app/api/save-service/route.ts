import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../mongoClient";

export async function POST(req: NextRequest) {
  try {
    const requestBody = await req.json();

    const collection = await connectDB();

    const { month, newService } = requestBody;

    await collection.updateOne(
      { month: month },
      { $push: { services: newService } },
      { upsert: true }
    );

    return NextResponse.json(
      { message: "Dados salvos com sucesso" },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { message: "Erro ao salvar os dados.", error: e.message },
      { status: 500 }
    );
  }
}
