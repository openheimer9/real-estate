import type { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { authMiddleware } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Verify authentication
    const auth = await authMiddleware(req, res);
    if (!auth.success) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    await connectToDatabase();
    const { userId } = auth.data;
    
    if (req.method === 'GET') {
      // Get user profile
      const user = await User.findById(userId).select('-password');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      return res.status(200).json({ user });
    } 
    else if (req.method === 'PUT') {
      // Update user profile
      const { name, phone, bio } = req.body;
      
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { name, phone, bio },
        { new: true }
      ).select('-password');
      
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      return res.status(200).json({
        message: 'Profile updated successfully',
        user: updatedUser,
      });
    } 
    else {
      return res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error: any) {
    console.error('Profile error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
}