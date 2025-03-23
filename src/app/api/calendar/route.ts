import { NextRequest, NextResponse } from 'next/server';
import { GoogleCalendarService } from '@/lib/google/calendar-service';
import { GoogleCalendarAPI } from '@/lib/supabase/database';
import { createSupabaseServerClient } from '@/lib/supabase/cookies-helper';

// Helper to get the authenticated user
async function getAuthenticatedUser() {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// Helper to get calendar service with user's tokens
async function getCalendarService(userId: string) {
  const tokens = await GoogleCalendarAPI.getTokens(userId);
  if (!tokens) {
    throw new Error('No Google Calendar tokens found for user');
  }

  return new GoogleCalendarService({
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    expiry_date: tokens.expiry_date,
  });
}

// GET endpoint to list calendar events
export async function GET(request: NextRequest) {
  try {
    // Get authenticated user
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check if calendar is connected
    const isConnected = await GoogleCalendarAPI.isConnected(user.id);
    if (!isConnected) {
      return NextResponse.json(
        { error: 'Google Calendar not connected', auth_url: new GoogleCalendarService().getAuthUrl() },
        { status: 403 }
      );
    }

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const timeMin = searchParams.get('timeMin') || new Date().toISOString();
    const timeMax = searchParams.get('timeMax') || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    const maxResults = parseInt(searchParams.get('maxResults') || '10', 10);

    // Get calendar service with user's tokens
    const calendarService = await getCalendarService(user.id);

    // List events
    const events = await calendarService.listEvents(timeMin, timeMax, maxResults);

    return NextResponse.json({ events });
  } catch (error: any) {
    console.error('Error fetching calendar events:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch calendar events' },
      { status: 500 }
    );
  }
}

// POST endpoint to create calendar events
export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check if calendar is connected
    const isConnected = await GoogleCalendarAPI.isConnected(user.id);
    if (!isConnected) {
      return NextResponse.json(
        { error: 'Google Calendar not connected' },
        { status: 403 }
      );
    }

    // Parse request body
    const eventData = await request.json();

    // Validate required fields
    if (!eventData.summary || !eventData.start || !eventData.end) {
      return NextResponse.json(
        { error: 'Missing required fields (summary, start, end)' },
        { status: 400 }
      );
    }

    // Get calendar service with user's tokens
    const calendarService = await getCalendarService(user.id);

    // Create event
    const event = await calendarService.createEvent(eventData);

    return NextResponse.json({ event }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating calendar event:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create calendar event' },
      { status: 500 }
    );
  }
} 