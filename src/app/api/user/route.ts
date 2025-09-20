import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import EmotionEvent from '@/models/EmotionEvent';
import { authenticateUser, AuthenticatedUser } from '@/lib/auth';

// GET /api/user - Get user profile and settings
export async function GET(request: NextRequest) {
  try {
    let user: any = null;
    let userId: string | null = null;

    // Try Auth0 authentication first
    const session = await getSession();
    if (session?.user) {
      await dbConnect();
      user = await User.findOne({ auth0Id: session.user.sub });
      if (!user) {
        // Create user if doesn't exist
        user = await User.create({
          auth0Id: session.user.sub,
          email: session.user.email,
          name: session.user.name || session.user.email,
        });
      }
      userId = user._id.toString();
    } else {
      // Try JWT authentication
      const jwtUser = await authenticateUser(request);
      if (jwtUser) {
        user = jwtUser;
        userId = jwtUser.id;
      }
    }

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({ user }, {
      headers: {
        'Cache-Control': 'private, max-age=60', // Cache for 1 minute
        'X-Response-Time': Date.now().toString()
      }
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/user - Update user settings
export async function PUT(request: NextRequest) {
  try {
    let user: any = null;
    let userId: string | null = null;

    // Try Auth0 authentication first
    const session = await getSession();
    if (session?.user) {
      await dbConnect();
      user = await User.findOne({ auth0Id: session.user.sub });
      if (user) {
        userId = user._id.toString();
      }
    } else {
      // Try JWT authentication
      const jwtUser = await authenticateUser(request);
      if (jwtUser) {
        await dbConnect();
        user = await User.findById(jwtUser.id);
        if (user) {
          userId = jwtUser.id;
        }
      }
    }

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { settings } = await request.json();

    if (settings) {
      user.settings = { ...user.settings, ...settings };
      await user.save();
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/user - Delete user account and all associated data
export async function DELETE(request: NextRequest) {
  try {
    let user: any = null;
    let userId: string | null = null;

    // Try Auth0 authentication first
    const session = await getSession();
    if (session?.user) {
      await dbConnect();
      user = await User.findOne({ auth0Id: session.user.sub });
      if (user) {
        userId = user._id.toString();
      }
    } else {
      // Try JWT authentication
      const jwtUser = await authenticateUser(request);
      if (jwtUser) {
        await dbConnect();
        user = await User.findById(jwtUser.id);
        if (user) {
          userId = jwtUser.id;
        }
      }
    }

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Delete all emotion events associated with this user
    await EmotionEvent.deleteMany({ userId: user._id });

    // Delete the user account
    await User.findByIdAndDelete(user._id);

    return NextResponse.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
