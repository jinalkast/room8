import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();

        return NextResponse.json(
        {
            reply: 'You said: ' + data.message,
            message: 'Successfully received message'
        },
        { status: 200 }
        );
    } catch (error) {
        console.error('Error in POST /chatbot:', error);
        return NextResponse.json(
        {
            reply: null,
            message: (error as Error).message
        },
        { status: 500 }
        );
    }
}