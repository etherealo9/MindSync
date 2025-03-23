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

// GET endpoint to retrieve a specific event
export async function GET(
  request: NextRequest,
  context: { params: { eventId: string } }
) {
  try {
    const { eventId } = context.params;

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

    // Get calendar service with user's tokens
    const calendarService = await getCalendarService(user.id);

    // Get event details
    const event = await calendarService.getEventDetails(eventId);

    return NextResponse.json({ event });
  } catch (error: any) {
    console.error('Error fetching calendar event:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch calendar event' },
      { status: 500 }
    );
  }
}

// PATCH endpoint to update a specific event
export async function PATCH(
  request: NextRequest,
  context: { params: { eventId: string } }
) {
  try {
    const { eventId } = context.params;

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
    const updateData = await request.json();

    // Get calendar service with user's tokens
    const calendarService = await getCalendarService(user.id);

    // Update event
    const updatedEvent = await calendarService.updateEvent(eventId, updateData);

    return NextResponse.json({ event: updatedEvent });
  } catch (error: any) {
    console.error('Error updating calendar event:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update calendar event' },
      { status: 500 }
    );
  }
}

// DELETE endpoint to remove a specific event
export async function DELETE(
  request: NextRequest,
  context: { params: { eventId: string } }
) {
  try {
    const { eventId } = context.params;

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

    // Get calendar service with user's tokens
    const calendarService = await getCalendarService(user.id);

    // Delete event
    await calendarService.deleteEvent(eventId);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('Error deleting calendar event:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete calendar event' },
      { status: 500 }
    );
  }
} 