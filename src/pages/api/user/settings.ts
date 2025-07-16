import type { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { authMiddleware } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Verify authentication
    const auth = await authMiddleware(req, res);
    if (!auth.success) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    await connectToDatabase();
    const { userId } = auth.data;
    const { notifications, privacy } = req.body;
    
    // Update settings
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 
        notifications: notifications || undefined,
        privacy: privacy || undefined,
      },
      { new: true }
    ).select('-password');
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    return res.status(200).json({
      message: 'Settings updated successfully',
      user: updatedUser,
    });
  } catch (error: any) {
    console.error('Settings update error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
}