// src/app/api/speech-to-text/route.ts
import { NextRequest, NextResponse } from "next/server";
import { SpeechClient, protos } from "@google-cloud/speech";

// Initialize the Speech client
const speechClient = new SpeechClient({
  credentials: JSON.parse(
    process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON || "{}"
  ),
});

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();
    const audioFile = data.get("audio") as File;

    if (!audioFile) {
      return NextResponse.json(
        { error: "No audio file provided" },
        { status: 400 }
      );
    }

    // Convert the File to a Buffer
    const audioBuffer = Buffer.from(await audioFile.arrayBuffer());

    // Configure the request to Google Speech-to-Text
    const audio = {
      content: audioBuffer.toString("base64"),
    };

    // Use the proper enum value from the protos
    const config = {
      encoding:
        protos.google.cloud.speech.v1.RecognitionConfig.AudioEncoding.LINEAR16,
      sampleRateHertz: 48000,
      languageCode: "en-US",
    };

    const request = {
      audio: audio,
      config: config,
    };

    // Make the request
    const response = await speechClient.recognize(request);
    const results = response[0];

    // Get and return the transcription
    const transcription = results.results
      ?.map((result) => result.alternatives?.[0]?.transcript)
      .filter(Boolean)
      .join("\n");

    return NextResponse.json({ transcription });
  } catch (error) {
    console.error("Speech-to-text error:", error);
    return NextResponse.json(
      { error: "Failed to process speech to text" },
      { status: 500 }
    );
  }
}
