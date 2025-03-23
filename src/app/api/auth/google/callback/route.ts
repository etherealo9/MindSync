import { NextRequest, NextResponse } from 'next/server';
import { GoogleCalendarService } from '@/lib/google/calendar-service';
import { GoogleCalendarAPI } from '@/lib/supabase/database';
import { createSupabaseServerClient } from '@/lib/supabase/cookies-helper';

export async function GET(request: NextRequest) {
  try {
    // Get query parameters from the URL
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    // Handle error or missing code
    if (error || !code) {
      console.error('Error in OAuth callback:', error || 'No code provided');
      return NextResponse.redirect(new URL('/dashboard?error=auth_failed', request.url));
    }

    // Create a Supabase client
    const supabase = createSupabaseServerClient();

    // Get the authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('No authenticated user found');
      return NextResponse.redirect(new URL('/auth/sign-in?error=auth_required', request.url));
    }

    // Exchange the authorization code for tokens
    const calendarService = new GoogleCalendarService();
    const tokens = await calendarService.getTokensFromCode(code);

    // Save the tokens to the database
    await GoogleCalendarAPI.saveTokens(user.id, {
      access_token: tokens.access_token!,
      refresh_token: tokens.refresh_token!,
      token_type: tokens.token_type!,
      expiry_date: tokens.expiry_date!,
    });

    // Redirect to the dashboard
    return NextResponse.redirect(new URL('/dashboard?calendar_connected=true', request.url));
  } catch (error) {
    console.error('Error processing Google OAuth callback:', error);
    return NextResponse.redirect(new URL('/dashboard?error=oauth_error', request.url));
  }
} 