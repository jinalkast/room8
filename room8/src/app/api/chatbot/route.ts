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

    // Step 1: Check if the conversation already exists
    const friendlyName = 'Group Chat';
    let conversation = null;
    const allConversations = await client.conversations.v1.conversations.list();
    conversation = allConversations.find(conv => conv.friendlyName === friendlyName);

    if (!conversation) {
      // Create a new conversation if it doesn't exist
      conversation = await client.conversations.v1.conversations.create({
        messagingServiceSid: messagingServiceSid,
        friendlyName,
      });
    }

    // Step 2: Add participants to the conversation if not already present
    const existingParticipants = await client.conversations.v1
      .conversations(conversation.sid)
      .participants.list();

    const existingParticipantAddresses = existingParticipants.map(
      (participant) => participant.messagingBinding?.address
    );

    await Promise.all(
      participants
        .filter((participant: string) => !existingParticipantAddresses.includes(participant))
        .map((participant: string) =>
          client.conversations.v1.conversations(conversation.sid)
            .participants.create({ 'messagingBinding.address': participant })
        )
    );

    // Step 3: Add Chatbot (Twilio Phone Number) as a participant if not already present
    if (!existingParticipantAddresses.includes(senderPhoneNumber)) {
      await client.conversations.v1.conversations(conversation.sid)
        .participants.create({ identity: 'Chatbot', 'messagingBinding.projectedAddress': senderPhoneNumber });
    }

    // Step 4: Send the initial message in the conversation
    const messageResponse = await client.conversations.v1
      .conversations(conversation.sid)
      .messages.create({
        author: 'Chatbot',
        body: 'Hello World from Room8! This is an MMS Group Chat. I can now get roommate phone numbers from Supabase 😎',
      });

    return NextResponse.json(
      {
        message: 'Message sent successfully to the group conversation',
        conversationSid: conversation.sid,
        messageSid: messageResponse.sid,
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