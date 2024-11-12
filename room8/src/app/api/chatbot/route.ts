import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import qs from 'qs';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

export async function POST(req: NextRequest) {
  try {
    // Parse request body for 'to' field
    const request = await req.json();

    if (!request.to) {
      return NextResponse.json(
        { message: 'Recipient number is required' },
        { status: 400 }
      );
    }

    // Twilio API endpoint
    const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;

    // Payload data
    const data = {
      Body: "Hello World from Room8!",
      From: twilioPhoneNumber,
      To: request.to,
    };

    // POST request to Twilio API
    const response = await axios.post(url, qs.stringify(data), {
      auth: {
        username: accountSid!,
        password: authToken!,
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return NextResponse.json(
      {
        reply: `SMS sent to ${request.to} successfully with SID: ${response.data.sid}`,
        message: 'SMS sent successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in POST /chatbot:', error);
    return NextResponse.json(
      {
        reply: null,
        message: (error as Error).message,
      },
      { status: 500 }
    );
  }
}