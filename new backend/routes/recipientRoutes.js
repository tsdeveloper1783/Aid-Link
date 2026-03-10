const path = require('path');
const fs = require('fs');

// ✅ Ensure upload directories exist
const ensureUploadDirs = () => {
  const dirs = [
    path.join(__dirname, '../uploads/profiles'),
    path.join(__dirname, '../public/uploads/profiles')
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`✅ Created directory: ${dir}`);
    }
  });
};

// Call this function when server starts
ensureUploadDirs();

// ✅ Get Recipient Profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const recipient = await Recipient.findById(req.user.id);
    if (!recipient) {
      return res.status(404).json({ message: 'Recipient not found' });
    }
    
    res.json({
      // Registration data
      fullName: recipient.fullName,
      email: recipient.email,
      phoneNumber: recipient.phoneNumber,
      address: recipient.address,
      profilePicture: recipient.profilePicture,
      
      // Additional profile data
      fatherName: recipient.fatherName,
      familyMembers: recipient.familyMembers,
      previousJob: recipient.previousJob,
      urgencyLevel: recipient.urgencyLevel,
      about: recipient.about,
      documents: recipient.documents,
      isVerified: recipient.isVerified
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ✅ Update Recipient Profile (IMPROVED)
router.put('/profile/update', authMiddleware, async (req, res) => {
  try {
    // Ensure directories exist
    ensureUploadDirs();
    
    const updates = {
      fullName: req.body.fullName,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      address: req.body.address,
      fatherName: req.body.fatherName,
      familyMembers: req.body.familyMembers,
      previousJob: req.body.previousJob,
      urgencyLevel: req.body.urgencyLevel,
      about: req.body.about
    };

    // Handle file upload for profile picture
    if (req.files && req.files.profilePicture) {
      const profilePic = req.files.profilePicture;
      
      // Generate unique filename
      const fileExtension = path.extname(profilePic.name);
      const fileName = `profile-${Date.now()}${fileExtension}`;
      const uploadPath = path.join(__dirname, '../uploads/profiles', fileName);
      const publicPath = `/uploads/profiles/${fileName}`;
      
      // Move file to uploads directory
      await profilePic.mv(uploadPath);
      
      // Update profile picture path
      updates.profilePicture = publicPath;
      
      console.log(`✅ Profile picture uploaded: ${fileName}`);
    }

    const updatedRecipient = await Recipient.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true, runValidators: true }
    );

    res.json(updatedRecipient);
    
  } catch (error) {
    console.error('❌ Profile update error:', error);
    res.status(500).json({ message: 'Update failed', error: error.message });
  }
});