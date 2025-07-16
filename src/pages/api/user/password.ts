import type { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { authMiddleware } from '@/lib/auth';
import bcrypt from 'bcryptjs';

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
    const { currentPassword, newPassword } = req.body;
    
    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    
    // Update password
    user.password = newPassword;
    await user.save();
    
    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (error: any) {
    console.error('Password update error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
}