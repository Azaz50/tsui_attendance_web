const User = require('../models/userModel');
const { encrypt, decrypt } = require('../utils/cryptoUtils');

exports.updatePassword = async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;

  if (!email || !oldPassword || !newPassword) {
    return res.status(400).json({ message: 'Email, old password, and new password are required' });
  }

  if (oldPassword === newPassword) {
    return res.status(400).json({ message: 'New password must be different from old password' });
  }

  try {
    const user = await User.findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Decrypt stored password
    const decryptedPassword = decrypt(user.password);

    if (decryptedPassword !== oldPassword) {
      return res.status(401).json({ message: 'Old password is incorrect' });
    }

    // Encrypt the new password
    const encryptedNewPassword = encrypt(newPassword);

    // Update password in DB
    const result = await User.updatePassword(user.user_id, encryptedNewPassword);
    if (result.affectedRows === 0) {
      return res.status(500).json({ message: 'Password update failed' });
    }

    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Password update error:', err);
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};
