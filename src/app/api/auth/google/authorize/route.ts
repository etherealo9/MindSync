import { NextRequest, NextResponse } from 'next/server';
import { GoogleCalendarService } from '@/lib/google/calendar-service';

export async function GET(request: NextRequest) {
  try {
    // Create a new instance of the Google Calendar service
    const calendarService = new GoogleCalendarService();
    
    // Generate the authorization URL
    const authUrl = calendarService.getAuthUrl();
    
    // Return the authorization URL
    return NextResponse.json({ authUrl });
  } catch (error: any) {
    console.error('Error generating Google authorization URL:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate authorization URL' },
      { status: 500 }
    );
  }
} 