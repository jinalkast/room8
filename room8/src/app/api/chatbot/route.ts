import { NextRequest, NextResponse } from 'next/server';
import { Twilio } from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const senderPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;

// Initialize Twilio client
const client = new Twilio(accountSid, authToken);

export async function POST(req: NextRequest) {
  try {
    const response = await req.json();
    const participants = response.participants;

    if (!Array.isArray(participants) || participants.length === 0) {
      return NextResponse.json(
        { message: 'Participants array is required' },
        { status: 400 }
      );
    }

    // Step 1: Create a Conversation
    const conversation = await client.conversations.v1.conversations.create({
      messagingServiceSid: messagingServiceSid,
      friendlyName: 'Group Chat',
    });

    // Step 2: Add Participants to the Conversation
    await Promise.all(
      participants.map((participant: string) =>
        client.conversations.v1.conversations(conversation.sid)
          .participants.create({ 'messagingBinding.address': participant })
      )
    );

    // Step 3: Add Chatbot (Twilio Phone Number) to the Conversation
    await client.conversations.v1.conversations(conversation.sid)
        .participants.create({  identity: 'Chatbot', 'messagingBinding.projectedAddress': senderPhoneNumber });

    // Step 4: Send the initial message in the Conversation
    const messageResponse = await client.conversations.v1
      .conversations(conversation.sid)
      .messages.create({ 
        author: 'Chatbot',
        body: 'Hello World from Room8! This is an MMS Group Chat.', });

    return NextResponse.json(
      {
        message: 'Group MMS sent successfully',
        conversationSid: conversation.sid,
        initialMessageSid: messageResponse.sid,
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