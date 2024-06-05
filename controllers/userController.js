const User = require('../models/User');
const Admin =require('../models/Admin');
const Language = require('../models/Language');
const jwt = require('jsonwebtoken');
const axios = require('axios');




exports.registerAdmin = async (req, res) => {
  try{
    const { email, password } = req.body;
    console.log("email-------",email);
    const admin = new Admin({ email, password });
    await admin.save();
    console.log('Admin registered:', admin);
    res.status(200).json({message:'Admin registered Sucessfully'})
  }catch(error){
    res.status(500).json({message:'Internal Server Error'})
  }
};

exports.registerSubAdmin = async (req, res) => {
  try{
    const { email, password } = req.body;
    console.log("email-------",email);
    const admin = new Admin({ email, password, role:'subAdmin' });
    await admin.save();
    console.log('Admin registered:', admin);
    res.status(200).json({message:'Admin registered Sucessfully'})
  }catch(error){
    res.status(500).json({message:'Internal Server Error'})
  }
};

exports.loginAdmin = async (req, res) => {
  try{
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });
  if (!admin) {
    throw new Error('Admin not found');
  }
  const isMatch = await admin.comparePassword(password);
  if (!isMatch) {
    throw new Error('Invalid password');
  }
  res.status(200).json({message:'Login successfully',isMatch})
}catch(error){
  res.status(500).json({message:'Internal Server Error'})
}
};


exports.createlanguage = async (req, res) => {
  try {
      const { language, status } = req.body;

      // Validate input
      if (!language || !status) {
          return res.status(400).json({ error: 'Language and status are required' });
      }

      // Create a new language document
      const newLanguage = new Language({
          language,
          status
      });

      // Save the language document to the database
      await newLanguage.save();

      // Return a success response
      res.status(201).json({ message: 'Language created successfully', language: newLanguage });
  } catch (error) {
      console.error('Error creating language:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getAllLanguages = async (req, res) => {
  try {
      const languages = await Language.find();
      res.status(200).json(languages);
  } catch (error) {
      console.error('Error retrieving languages:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateLanguageById = async (req, res) => {
  try {
      const { id } = req.params;
      const { language, status } = req.body;

      if (!language || typeof status !== 'boolean') {
          return res.status(400).json({ error: 'Language is required and status must be a boolean' });
      }

      const updatedLanguage = await Language.findByIdAndUpdate(
          id,
          { language, status },
          { new: true, runValidators: true }
      );

      if (!updatedLanguage) {
          return res.status(404).json({ error: 'Language not found' });
      }

      res.status(200).json({ message: 'Language updated successfully', language: updatedLanguage });
  } catch (error) {
      console.error('Error updating language:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteLanguageById = async (req, res) => {
  try {
      const { id } = req.params;

      const deletedLanguage = await Language.findByIdAndDelete(id);

      if (!deletedLanguage) {
          return res.status(404).json({ error: 'Language not found' });
      }

      res.status(200).json({ message: 'Language deleted successfully' });
  } catch (error) {
      console.error('Error deleting language:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
};

exports.userRequestOTP = async (req, res) => {
  try {
    const { mobileNumber } = req.body;
    let user = await User.findOne({ mobileNumber });

    if (!user) {
      // Provide a default username
      user = new User({ mobileNumber, username: `user_${mobileNumber}` });
    }

    const response = await axios.get(`http://2factor.in/API/V1/9e880f4a-7dc5-11ec-b9b5-0200cd936042/SMS/${mobileNumber}/AUTOGEN2`);
    console.log("response----------", response.data);
    const otp = response.data.OTP; // Assuming the OTP is in the 'Details' field of the response

    // Update the user's OTP fields
    user.otp = {
      code: otp,
      expiresAt: new Date(Date.now() + 1 * 60 * 1000) // OTP valid for 1 minute
    };

    await user.save();

    res.status(200).send({ message: 'OTP sent successfully' });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: error.message });
  }
};

exports.userVerifyOTP = async (req, res) => {
  console.log("req.body-------",req.body)
  try {
    const { mobileNumber, otp } = req.body;
    const user = await User.findOne({ mobileNumber });
    console.log("user-------",user);
   

    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }

    if (!user.verifyOTP(otp)) {
      return res.status(401).send({ error: 'Invalid or expired OTP' });
    }

    //const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '1h' });

    res.status(200).send({ message: 'OTP verified successfully',user });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: error.message });
  }
};

exports.createUser = async (req,res) => {
  console.log("------------------",req.body)
 try{
  const id=req.params.userId;
  const { username, dateOfBirth, language, place, gender, avatar } = req.body;

  const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    existingUser.username = username;
    existingUser.profile.dateOfBirth = dateOfBirth;
    existingUser.profile.language = language;
    existingUser.profile.place = place;
    existingUser.profile.gender = gender;
    existingUser.profile.avatar = avatar;

    await existingUser.save();
  res.status(200).json({message:'user details created Successfully'})
 }catch(error){
  res.status(500).json({message:'Internal Server Error'})
 } 
}

exports.updateUser = async (req, res) => {
  try {
    const id = req.params.userId;
    const { username, dateOfBirth, language, place, gender, avatar } = req.body;

    // Check if user exists
    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user details
    if (username) existingUser.profile.username = username;
    if (dateOfBirth) existingUser.profile.dateOfBirth = dateOfBirth;
    if (language) existingUser.profile.language = language;
    if (place) existingUser.profile.place = place;
    if (gender) existingUser.profile.gender = gender;
    if (avatar) existingUser.profile.avatar = avatar;

    // Save updated user details
    await existingUser.save();

    res.status(200).json({ message: 'User details updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getUsers =async(req,res)=>{
  try{
    const user = await User.find();
    res.status(200).json(user);
  }catch(error){
    console.log("error------",error)
    res.status(500).json({message:'Internal Server Error'})
  }
}

exports.searchByUsername = async (req, res) => {
  try {
    const username = req.query.username; // Get the username from query parameters

    // Query the database to find users with username containing the input
    const users = await User.find({ username: { $regex: username, $options: 'i' } });

    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};





// exports.getProfile = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.userId).select('-password');
//     res.send(user);
//   } catch (error) {
//     console.log("error------",error)
//     res.status(400).send({ error: error.message });
//   }
// };

// exports.updateProfile = async (req, res) => {
//   try {
//     const user = await User.findByIdAndUpdate(req.user.userId, req.body, { new: true }).select('-password');
//     res.send(user);
//   } catch (error) {
//     res.status(400).send({ error: error.message });
//   }
// };
