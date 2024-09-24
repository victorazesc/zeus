import { uploadFileToS3 } from "@/actions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	try {

		const formData = await request.formData();
		const file = formData.get("asset") as File;

		if(!file) {
			return NextResponse.json( { error: "File is required."}, { status: 400 } );
		} 

		const buffer = Buffer.from(await file.arrayBuffer());
		const response = await uploadFileToS3(buffer, file.name);

		return NextResponse.json(response);
	} catch (error) {
		return NextResponse.json({ error });
	}
}