const User = require('../models/User');
const Admin =require('../models/Admin');
const Language = require('../models/Language');
const CoinPackage = require('../models/CoinPackage')
const FreeCoin = require('../models/FreeCoin');
const CoinConversion =require('../models/CoinConversion');
const Wallpaper = require('../models/Wallpaper');
const Frame = require('../models/Frame');
const Gift = require('../models/GiftList');
const Avatar = require('../models/Avatar');
const Category = require('../models/Category');
const Banner =  require('../models/Banner');
const Mood = require('../models/Mood');
const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const crypto = require('crypto');
var sha256 = require('sha256');
var uniqid = require('uniqid');
const path = require('path');
const ms = require('ms');
const sharp = require('sharp'); 
const fs = require('fs-extra');
const { RtcTokenBuilder, RtcRole } = require('agora-access-token');



const APP_ID = 'd742dcece1d14193a708b6e41ef2c336';
const APP_CERTIFICATE = 'e38cfd43cedd4ca1b84589ef98aa979b';
//const path = require('path');

const editJsonFile    = require('edit-json-file');
const formidable = require('formidable');

const WallpaperPath = '/etc/ec/data';
const URLpathI = 'wallpapers';
const framePath = '/etc/ec/data';
const URLpathF = 'frames';
const giftPath ='/etc/ec/data';
const URLpathG = 'gifts';
const bannerPath = '/etc/ec/data'; // Adjust the path as necessary
const URLpathB = 'banners'; // Adjust the path as necessar
const moodPath = '/etc/ec/data';
const URLpathM = 'moods';
const AvatarPath = '/etc/ec/data'; // Update with your directory path
const URLpathA = 'avatar'; // Update with your URL path



require("dotenv").config();

exports.getToken = async (req,res)=>{
  try{
const { channelName, uid } = req.body;

  if (!channelName || !uid) {
    return res.status(400).json({ message: 'channelName and uid are required' });
  }

  const role = RtcRole.PUBLISHER;
  const expirationTimeInSeconds = 3600;
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

  const token = RtcTokenBuilder.buildTokenWithUid(APP_ID, APP_CERTIFICATE, channelName, uid, role, privilegeExpiredTs);

  res.json({ token });
}catch(error){
  res.status(500).json('Internal server Error',error)
}
};

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
      const { language, status, code } = req.body;

      // Validate input
      if (!language || !status) {
          return res.status(400).json({ error: 'Language and status are required' });
      }

      // Create a new language document
      const newLanguage = new Language({
          language,
          status,
          code
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

/*
exports.userRequestOTP = async (req, res) => {
  try {
    const { mobileNumber } = req.body;
    let user = await User.findOne({ mobileNumber });

    if (!user) {
      user = new User({ mobileNumber, username: `user_${mobileNumber}` });
    }

    const response = await axios.get(`http://2factor.in/API/V1/9e880f4a-7dc5-11ec-b9b5-0200cd936042/SMS/${mobileNumber}/AUTOGEN2`);
    console.log("response----------", response.data);
    const otp = response.data.Details; // Assuming the OTP is in the 'Details' field of the response

    // Update the user's OTP fields
    user.otp = {
      code: parseInt(otp, 10), // Ensure OTP is stored as a number
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
    console.log("otp--------",otp)

    // Find user by mobile number
    const user = await User.findOne({ mobileNumber: mobileNumber });
    console.log("user-------", user)

    if (!user) {
      return res.status(404).json({ message: 'Mobile number not found' });
    }

    // Log OTP details
    console.log("Stored OTP code:", user.otp.code);
    console.log("Stored OTP expiresAt:", user.otp.expiresAt);
    console.log("Current time:", new Date());
    console.log("Provided OTP:", otp);

    // Use the verifyOTP method
    const isOTPValid = user.verifyOTP(otp);
    console.log("user.verifyOTP(otp)----------outside the condition", isOTPValid);

    if (isOTPValid) {
      return res.status(200).json({ message: 'OTP verified successfully' });
    } else {
      return res.status(400).json({ message: 'Invalid OTP or expired' });
  
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ message: 'Internal server error',error });
  }
};
*/

exports.userRequestOTP = async (req, res) => {
  try {
    const { mobileNumber } = req.body;
console.log("mobileNumber----------",req.body);
//return
    let user = await User.findOne({ mobileNumber });
    let isExistingUser = false; // Flag to indicate existing user
    if (user) {
	isExistingUser = true; // Set the flag if user exists
    }else{
      // Provide a default username
      user = new User({ mobileNumber, username: `user_${mobileNumber}` });
    }

    // Make the request to the OTP service
    const response = await axios.get(`http://2factor.in/API/V1/9e880f4a-7dc5-11ec-b9b5-0200cd936042/SMS/${mobileNumber}/AUTOGEN2`);
    console.log("response----------", response.data);
    
    // Extract the OTP from the response and convert it to a number
    const otp = parseInt(response.data.OTP, 10); // Ensure OTP is a number

    // Update the user's OTP fields
    user.otp = {
      code: otp,
      expiresAt: new Date(Date.now() + 1 * 60 * 1000) // OTP valid for 1 minute
    };

    await user.save();

    res.status(200).send({ message: 'OTP sent successfully',isExistingUser });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: error.message });
  }
};

exports.userVerifyOTP = async (req, res) => {
  console.log("req.body-------", req.body);
  try {
    const { mobileNumber, otp } = req.body;

    // Check if the user exists
    const user = await User.findOne({ mobileNumber });

    if (!user) {
      return res.status(404).json({ message: 'Mobile number not found' });
    }

    console.log("Stored OTP code:", user.otp.code);
    console.log("Stored OTP expiresAt:", user.otp.expiresAt);
    console.log("Current time:", new Date());
    console.log("Provided OTP:", otp);

    // Verify the OTP
    const isOTPValid = user.verifyOTP(otp);
    console.log("user.verifyOTP(otp)----------outside the condition", isOTPValid);

    // Determine if the user is already registered based on mobileNumber existence
    const isExistingUser = user.mobileNumber ? true : false;

    if (isOTPValid) {
      return res.status(200).json({ message: 'OTP verified successfully', isExistingUser, user });
    } else {
      return res.status(400).json({ message: 'Invalid OTP or expired' });
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ message: 'Internal server error' });
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
    const { username, dateOfBirth, language, place, gender, avatar, coin, blocklist, myMood } = req.body;

    console.log("-----------",myMood)

    // Check if user exists
    const existingUser = await User.findById(id);
    console.log("existingUser-------",existingUser)
    console.log("id---------",id)
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
    if (coin) existingUser.profile.coin = coin;
    if (myMood) {
      try {
        const mood = await Mood.findById(myMood);
        if (!mood) {
          return res.status(404).json({ message: 'Mood Not Found' });
        }
        existingUser.profile.myMood = mood.moodName;
      } catch (error) {
        return res.status(500).json({ message: 'Error fetching mood', error });
      }
    }
    if (blocklist) existingUser.profile.blocklist =blocklist
    //existingUser.

    // Save updated user details
    await existingUser.save();

    res.status(200).json({ message: 'User details updated successfully',existingUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

/*
exports.getUsers =async(req,res)=>{
  try{
    const user = await User.find();
    res.status(200).json(user);
  }catch(error){
    console.log("error------",error)
    res.status(500).json({message:'Internal Server Error'})
  }
}
*/

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();

    // Remove the otp field from each user object
    const sanitizedUsers = users.map(user => {
      const { otp, ...sanitizedUser } = user.toObject();
      return sanitizedUser;
    });

    res.status(200).json(sanitizedUsers);
  } catch (error) {
    console.log("error------", error);
    res.status(500).json({ message: 'Internal Server Error' });
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


exports.createCoinPackage = async (req, res) => {
  try {
    const { coin, rateInInr, text, status } = req.body; // Get coin package data from request body

    // Create a new coin package document
    const newCoinPackage = await CoinPackage.create({ coin, rateInInr, text, status });

    res.status(201).json({message:'Package Created Successfully',newCoinPackage});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.updateCoinPackage = async (req, res) => {
  try {
    const coinPackageId = req.params.id;
    const updates = req.body;

    // Constructing the update object to only include the fields that are present in the request body
    const updateFields = {};
    for (const key in updates) {
      updateFields[key] = updates[key];
    }

    // Update the document with the specified ID, including only the fields present in the updateFields object
    const updatedCoinPackage = await CoinPackage.findByIdAndUpdate(coinPackageId, updateFields, { new: true });

    res.status(200).json({message:'update Successfully',updatedCoinPackage});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getAllCoinPackages = async (req, res) => {
  try {
    const coinPackages = await CoinPackage.find();

    res.status(200).json(coinPackages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.deleteCoinPackage = async (req, res) => {
  try {
    const coinPackageId = req.params.id;

    await CoinPackage.findByIdAndDelete(coinPackageId);

    res.status(204).end();
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


exports.newPayment = async (req, res) => {
   const merchant_id = 'PGTESTPAYUAT';
 const salt_key = '099eb0cd-02cf-4e2a-8aca-3e6c6aff0399';
 const PHONE_PE_HOST_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox"
  try {
      const { name, merchantTransactionId, merchantUserId, amount } = req.body

      const data = {
          merchantId: merchant_id,
          merchantTransactionId,
          merchantUserId,
          name,
          amount: amount * 100,
         // redirectUrl: `http://localhost:5174/${merchantTransactionId}`,
          redirectMode: 'POST',
          paymentInstrument: {
              type: 'PAY_PAGE'
          }
      };
      console.log("data---",data)
      const payload = JSON.stringify(data);
      console.log("payload--------",payload);
      const bufferObj = await Buffer.from(JSON.stringify(payload), "utf8");
      const base64String =bufferObj.toString("base64");
      console.log("base64String--------",base64String);



      // const payloadMain = Buffer.from(payload).toString('base64');
      // console.log("payloadMain-------",payloadMain)
      const keyIndex = 1;
      const string = base64String + '/pg/v1/pay' + salt_key;
      console.log("string------",string);
      // const sha256 = crypto.createHash('sha256').update(string).digest('hex');
      const sha256val = sha256(string);
      const checksum = sha256val + '###' + keyIndex;

      console.log("checksum------",checksum);
      
      axios.post(
        `${PHONE_PE_HOST_URL}/pg/v1/pay`,
        { request: base64String },{
  headers:{
    'Content-Type':'application/json',
    'X-VERIFY':checksum,
    'accept':'application/json'
  }
}).then( (setdata)=>{
  console.log("--------------enter the console.-------")
res.redirect(responce.data)
})

//       //const prod_URL = "https://api.phonepe.com/apis/hermes/pg/v1/pay"
//        const testUrl = 'https://api-preprod.phonepe.com/apis/pg-sandbox'
//        console.log("testUrl--------",testUrl)
//       const options = {
//           method: 'POST',
//           url: testUrl,
//           headers: {
//               accept: 'application/json',
//               'Content-Type': 'application/json',
//               'X-VERIFY': testUrl
//           },
//           data: {
//               request: payloadMain
//           }
//       };
// console.log("options------",options)
//       // axios.request(options).then(function (response) {
//       //     console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^",response)
//       //     return res.redirect(response.data.data.instrumentResponse.redirectInfo.url)
//       // })
//       axios
//   .request(options)
//       .then(function (response) {
//       console.log("^^^^^^^^^^^^^^()^^^^^^",response.data);
//   })
//           .catch(function (error) {
//             console.log("-----------error1")
//               console.error(error);
//           });

  }catch (error) {
    console.log("---------------error2")
      res.status(200).send({
          message: error.message,
          success: false
      })
  } 
  
};



exports.FreeCoin = async (req, res) => {
  const { freeCoinforNewUser, expireAfter, status } = req.body;

  try {
    const freeCoin = new FreeCoin({
      freeCoinforNewUser,
      expireAfter, // Store expireAfter directly as days
      status
    });

    await freeCoin.save();

    res.status(200).json({ message: 'Free coins granted!', freeCoin });
  } catch (error) {
    res.status(500).json({ message: 'Error granting free coins', error });
  }
};

exports.getFreeCoin = async (req, res) => {
  try {
    const freeCoins = await FreeCoin.find();
    res.status(200).json(freeCoins);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving free coins', error });
  }
};

exports.updateFreeCoin = async (req, res) => {
  const { freeCoinforNewUser, expireAfter, status } = req.body;
  console.log("status",status)
  try {
    const freeCoin = await FreeCoin.findByIdAndUpdate(req.params.id, {
      freeCoinforNewUser,
      expireAfter,
      status
    }, { new: true });

    if (!freeCoin) {
      return res.status(404).json({ message: 'Free coin not found' });
    }

    res.status(200).json({ message: 'Free coin updated!', freeCoin });
  } catch (error) {
    res.status(500).json({ message: 'Error updating free coin', error });
  }
};


exports.deleteFreeCoin = async (req, res) => {
  try {
    const freeCoin = await FreeCoin.findByIdAndDelete(req.params.id);
    if (!freeCoin) {
      return res.status(404).json({ message: 'Free coin not found' });
    }
    res.status(200).json({ message: 'Free coin deleted!' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting free coin', error });
  }
};




// // Function to check and update expired coins' status
// exports.checkExpiry = async (req, res) => {
//   try {
//     const now = new Date();
//     const expiredCoins = await FreeCoin.updateMany(
//       {
//         status: true,
//         createdAt: { $lt: new Date(now - req.body.expireAfter * 24 * 60 * 60 * 1000) }
//       },
//       { status: false }
//     );

//     res.status(200).json({ message: 'Expired coins status updated', expiredCoins });
//   } catch (error) {
//     res.status(500).json({ message: 'Error checking expired coins', error });
//   }
// };


// Create CoinConversion Entry
exports.createCoinConversion = async (req, res) => {
  console.log(req.body);
  const { coinHeartConversionFactor, heartConversionFactor, referrals } = req.body;

  console.log("1",coinHeartConversionFactor);
  console.log("2",heartConversionFactor);
  console.log("3",referrals);

  try {
    // Create CoinConversion object with nested schema data
    const coinConversion = new CoinConversion({
      coinHeartConversionFactor,
      heartConversionFactor,
      referrals
    });

    await coinConversion.save();

    res.status(200).json({ message: 'Coin conversion data created!', coinConversion });
  } catch (error) {
    console.log("error------".error);
    res.status(500).json({ message: 'Error creating coin conversion data', error });
  }
};


exports.getCoinConversion = async (req, res) => {
  try {
    const coinConversionData = await CoinConversion.findOne();
    if (!coinConversionData) {
      return res.status(404).json({ message: 'Coin conversion data not found' });
    }
    res.status(200).json({ message: 'Coin conversion data retrieved successfully', coinConversionData });
  } catch (error) {
    console.log("error------", error);
    res.status(500).json({ message: 'Error retrieving coin conversion data', error });
  }
};

exports.updateCoinConversion =async (req, res) =>{
  const { coinHeartConversionFactor, heartConversionFactor, referrals } = req.body;
  try {
    const coinConversionData = await CoinConversion.findOne();
    if (!coinConversionData) {
      return res.status(404).json({ message: 'Coin conversion data not found' });
    }
    coinConversionData.coinHeartConversionFactor = coinHeartConversionFactor;
    coinConversionData.heartConversionFactor = heartConversionFactor;
    coinConversionData.referrals = referrals;

    await coinConversionData.save();
    res.status(200).json({ message: 'Coin conversion data updated successfully', coinConversionData });
  } catch (error) {
    console.log("error------", error);
    res.status(500).json({ message: 'Error updating coin conversion data', error });
  }
}
exports.wallpaper = async(req,res) =>{
  try {
    console.log("req.body==============",req.body);
    console.log("req.files=============",req.files);
  
    const { name, oldPrice, newPrice, viewOrder, status } = req.body;
  
    if (!req.files || !req.files.image) {
       return res.status(400).json({ message: 'No file uploaded' });
    }
  
    const image = req.files.image;
    const finalName = name.replace(/\s+/g, '_');
    const desImageDir = `${WallpaperPath}/${URLpathI}/${finalName}`;
  
    if (!fs.existsSync(desImageDir)) {
        fs.mkdirSync(desImageDir, { recursive: true });
    }
  
    const imageName = image.name.replace(/ /g, '_');
    const originalImagePath = `${desImageDir}/${imageName}`;
    fs.writeFileSync(originalImagePath, image.data);
  
    // Create thumbnails directory if it doesn't exist
    const thumbnailDir = `${WallpaperPath}/thumbnails`;
    if (!fs.existsSync(thumbnailDir)) {
        fs.mkdirSync(thumbnailDir, { recursive: true });
    }
  
    // Determine file extension and resize accordingly
    const extension = path.extname(image.name).toLowerCase();
    const thumbnailImagePath = `${thumbnailDir}/${path.basename(imageName, extension)}.webp`;
    let pipeline;
  
    if (extension === '.png' || extension === '.jpg' || extension === '.jpeg') {
        pipeline = sharp(originalImagePath)
            .resize({ width: 200, height: 200 })
            .toFormat('webp')
            .webp({ quality: 80 })
            .toFile(thumbnailImagePath);
    } else {
        throw new Error('Unsupported file format');
    }
  
    await pipeline;
    const destinationImgUrl = `https://salesman.aindriya.co.in/${URLpathI}/${finalName}/${imageName}`;
    const thumbnailImgUrl = `https://salesman.aindriya.co.in/${URLpathI}/thumbnails/${path.basename(imageName, extension)}.webp`;
  console.log("destinationImgUrl--------",destinationImgUrl);
  console.log("thumbnailImgUrl------",thumbnailImgUrl)
  
    const wallpaper = new Wallpaper({
        name,
        oldPrice,
        newPrice,
        viewOrder,
        status,
        image: destinationImgUrl,
        thumbnail: thumbnailImgUrl
    });
  
    await wallpaper.save();
  
    res.status(201).json({ message: "Wallpaper created successfully", wallpaper });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
  };
  

  exports.updateWallpaper = async (req, res) => {
    try {
      const { name, oldPrice, newPrice, viewOrder, status } = req.body;
      const wallpaperId = req.params.id;
  
      // Check if the wallpaper exists
      const wallpaper = await Wallpaper.findById(wallpaperId);
      if (!wallpaper) {
        return res.status(404).json({ message: 'Wallpaper not found' });
      }
  
      // Update the wallpaper fields
      wallpaper.name = name || wallpaper.name; // Update name if provided, otherwise keep the existing name
      wallpaper.oldPrice = oldPrice || wallpaper.oldPrice;
      wallpaper.newPrice = newPrice || wallpaper.newPrice;
      wallpaper.viewOrder = viewOrder || wallpaper.viewOrder;
      wallpaper.status = status || wallpaper.status;
  
      // Update the image field if a new image is provided
     /* if (req.files && req.files.image) {
        const image = req.files.image;
        const imageName = image.name.replace(/ /g, '_');
        const imagePath = `${WallpaperPath}/${wallpaper.name}/${imageName}`;
  
        // Save the new image
        fs.writeFileSync(imagePath, image.data);
        wallpaper.image = `https://salesman.aindriya.co.in/${URLpathI}/${wallpaper.name}/${imageName}`;
      }*/
  if (req.files && req.files.image) {
    const image = req.files.image;
    const imageName = image.name.replace(/ /g, '_');
    const imagePath = `${WallpaperPath}/${URLpathI}/${wallpaper.name}/${imageName}`;
    const imageDir = path.dirname(imagePath);
  
    // Create the directory path if it doesn't exist
    if (!fs.existsSync(imageDir)) {
      fs.mkdirSync(imageDir, { recursive: true });
    }
  
    // Save the new image
    fs.writeFileSync(imagePath, image.data);
    wallpaper.image = `https://salesman.aindriya.co.in/${URLpathI}/${wallpaper.name}/${imageName}`;
  }
  
      // Save the updated wallpaper
      await wallpaper.save();
  
      res.status(200).json({ message: 'Wallpaper updated successfully', wallpaper });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
exports.getWallpaper = async (req, res) => {
  try {
    const wallpaperId = req.params.id;

    // Find the wallpaper by ID
    const wallpaper = await Wallpaper.findById(wallpaperId);
    if (!wallpaper) {
      return res.status(404).json({ message: 'Wallpaper not found' });
    }

    // Return the wallpaper
    res.status(200).json({ wallpaper });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getAllWallpaper = async (req, res) => {
  try {
    // Fetch all wallpapers sorted by viewOrder in ascending order
    const AllWallpaper = await Wallpaper.find().sort({ viewOrder: 1 });
    res.status(200).json(AllWallpaper);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.deleteWallpaper = async (req, res) => {
  try {
    const wallpaperId = req.params.id;

    // Find the wallpaper by ID
    const wallpaper = await Wallpaper.findById(wallpaperId);
    if (!wallpaper) {
      return res.status(404).json({ message: 'Wallpaper not found' });
    }

    // Delete the wallpaper
    await Wallpaper.deleteOne({ _id: wallpaperId });

    // Delete the associated image files (if any)
    const imageDir = `${WallpaperPath}/${wallpaper.name}`;
    if (fs.existsSync(imageDir)) {
      fs.rmdirSync(imageDir, { recursive: true });
    }

    // Return success response
    res.status(200).json({ message: 'Wallpaper deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.createframe = async(req,res) =>{
  try {
    console.log("req.body==============",req.body);
    console.log("req.files=============",req.files);
    
    const { name, oldPrice, newPrice, viewOrder, status } = req.body;
  
    if (!req.files || !req.files.image) {
       return res.status(400).json({ message: 'No file uploaded' });
    }
  
    const image = req.files.image;
    const finalName = name.replace(/\s+/g, '_');
    const desImageDir = `${framePath}/${finalName}`;
  
    if (!fs.existsSync(desImageDir)) {
        fs.mkdirSync(desImageDir, { recursive: true });
    }
  
    const imageName = image.name.replace(/ /g, '_');
    const originalImagePath = `${desImageDir}/${imageName}`;
    fs.writeFileSync(originalImagePath, image.data);
  
    // Create thumbnails directory if it doesn't exist
    const thumbnailDir = `${framePath}/thumbnails`;
    if (!fs.existsSync(thumbnailDir)) {
        fs.mkdirSync(thumbnailDir, { recursive: true });
    }
  
    // Determine file extension and resize accordingly
    const extension = path.extname(image.name).toLowerCase();
    const thumbnailImagePath = `${thumbnailDir}/${path.basename(imageName, extension)}.webp`;
    let pipeline;
  
    if (extension === '.png' || extension === '.jpg' || extension === '.jpeg') {
        pipeline = sharp(originalImagePath)
            .resize({ width: 200, height: 200 })
            .toFormat('webp')
            .webp({ quality: 80 })
            .toFile(thumbnailImagePath);
    } else {
        throw new Error('Unsupported file format');
    }
  
    await pipeline;
  
    const destinationImgUrl = `https://salesman.aindriya.co.in/${URLpathF}/${finalName}/${imageName}`;
    const thumbnailImgUrl = `https://salesman.aindriya.co.in/${URLpathF}/thumbnails/${path.basename(imageName, extension)}.webp`;
  console.log("destinationImgUrl--------",destinationImgUrl);
  console.log("thumbnailImgUrl------",thumbnailImgUrl)
    
    const frame = new Frame({
        name,
        oldPrice,
        newPrice,
        viewOrder,
        status,
        image: destinationImgUrl,
        thumbnail: thumbnailImgUrl
    });
  
    await frame.save();
  
    res.status(201).json({ message: "Frame created successfully", frame });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
  };

  exports.updateFrame = async (req, res) => {
    try {
      const { name, oldPrice, newPrice, viewOrder, status } = req.body;
      const frameId = req.params.id;
  
      // Check if the frame exists
      const frame = await Frame.findById(frameId);
      if (!frame) {
        return res.status(404).json({ message: 'frame not found' });
      }
  
      // Update the frame fields
      frame.name = name || frame.name; // Update name if provided, otherwise keep the existing name
      frame.oldPrice = oldPrice || frame.oldPrice;
      frame.newPrice = newPrice || frame.newPrice;
      frame.viewOrder = viewOrder || frame.viewOrder;
      frame.status = status || frame.status;
  
      // Update the image field if a new image is provided
      if (req.files && req.files.image) {
        const image = req.files.image;
        const imageName = image.name.replace(/ /g, '_');
        const imagePath = `${framePath}/${wallpaper.name}/${imageName}`;
  
        // Save the new image
        fs.writeFileSync(imagePath, image.data);
        frame.image = `https://salesman.aindriya.co.in/${URLpathF}/${frame.name}/${imageName}`;
      }
  
      // Save the updated wallpaper
      await frame.save();
  
      res.status(200).json({ message: 'Frame updated successfully', frame });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  exports.getFrame = async (req, res) => {
    try {
      const frameId = req.params.id;
  
      // Find the wallpaper by ID
      const frame = await Frame.findById(frameId);
      if (!frame) {
        return res.status(404).json({ message: 'Frame not found' });
      }
  
      // Return the wallpaper
      res.status(200).json({ frame });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  exports.getAllFrame = async (req, res) => {
    try {
      // Fetch all wallpapers sorted by viewOrder in ascending order
      const AllFrame = await Frame.find().sort({ viewOrder: 1 });
      res.status(200).json(AllFrame);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  
  exports.deleteFrame = async (req, res) => {
    try {
      const frameId = req.params.id;
  
      // Find the frame by ID
      const frame = await Wallpaper.findById(frameId);
      if (!frame) {
        return res.status(404).json({ message: 'Frame not found' });
      }
  
      // Delete the frame
      await Frame.deleteOne({ _id: frameId });
  
      // Delete the associated image files (if any)
      const imageDir = `${framePath}/${frame.name}`;
      if (fs.existsSync(imageDir)) {
        fs.rmdirSync(imageDir, { recursive: true });
      }
  
      // Return success response
      res.status(200).json({ message: 'Frame deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  


  exports.createGift =async(req,res) =>{
    try {
      console.log("req.body==============",req.body);
      console.log("req.files=============",req.files);


      const { giftName, oldPrice, newPrice, viewOrder, status } = req.body;

      if (!req.files || !req.files.image) {
         return res.status(400).json({ message: 'No file uploaded' });
      }

      const image = req.files.image;
      const finalName = giftName.replace(/\s+/g, '_');
      const desImageDir = `${giftPath}/${URLpathG}/${finalName}`;

      if (!fs.existsSync(desImageDir)) {
          fs.mkdirSync(desImageDir, { recursive: true });
      }

      const imageName = image.name.replace(/ /g, '_');
      const originalImagePath = `${desImageDir}/${imageName}`;
      fs.writeFileSync(originalImagePath, image.data);

      // Create thumbnails directory if it doesn't exist
      const thumbnailDir = `${giftPath}/thumbnails`;
      if (!fs.existsSync(thumbnailDir)) {
          fs.mkdirSync(thumbnailDir, { recursive: true });
      }

      // Determine file extension and resize accordingly
      const extension = path.extname(image.name).toLowerCase();
      const thumbnailImagePath = `${thumbnailDir}/${path.basename(imageName, extension)}.webp`;
      let pipeline;

      if (extension === '.png' || extension === '.jpg' || extension === '.jpeg') {
          pipeline = sharp(originalImagePath)
              .resize({ width: 200, height: 200 })
              .toFormat('webp')
              .webp({ quality: 80 })
              .toFile(thumbnailImagePath);
      } else {
          throw new Error('Unsupported file format');
      }
      await pipeline;

      const destinationImgUrl = `https://salesman.aindriya.co.in/${URLpathG}/${finalName}/${imageName}`;
      const thumbnailImgUrl = `https://salesman.aindriya.co.in/${URLpathG}/thumbnails/${path.basename(imageName, extension)}.webp`;
    console.log("destinationImgUrl--------",destinationImgUrl);
    console.log("thumbnailImgUrl------",thumbnailImgUrl)

      const gift = new Gift({
          giftName,
          oldPrice,
          newPrice,
          viewOrder,
          status,
          image: destinationImgUrl,
          thumbnail: thumbnailImgUrl
      });

      console.log("gift------",gift)
      // return

      await gift.save();

      res.status(201).json({ message: "Gift created successfully", gift });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
    };
  
    exports.updateGift = async (req, res) => {
      try {
        const { giftName, oldPrice, newPrice, viewOrder, status } = req.body;
        const giftId = req.params.id;
    
        // Check if the frame exists
        const gift = await Gift.findById(frameId);
        if (!gift) {
          return res.status(404).json({ message: 'gift not found' });
        }
    
        // Update the frame fields
        gift.giftName = giftName || gift.giftName; // Update name if provided, otherwise keep the existing name
        gift.oldPrice = oldPrice || gift.oldPrice;
        gift.newPrice = newPrice || gift.newPrice;
        gift.viewOrder = viewOrder || gift.viewOrder;
        gift.status = status || gift.status;
    
        // Update the image field if a new image is provided
        if (req.files && req.files.image) {
          const image = req.files.image;
          const imageName = image.name.replace(/ /g, '_');
          const imagePath = `${giftPath}/${gift.giftName}/${imageName}`;
    
          // Save the new image
          fs.writeFileSync(imagePath, image.data);
          gift.image = `https://salesman.aindriya.co.in/${URLpathG}/${gift.giftName}/${imageName}`;
        }
    
        // Save the updated wallpaper
        await gift.save();
    
        res.status(200).json({ message: 'gift updated successfully', gift });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }
    };
  


    exports.getGifts = async (req, res) => {
      try {
        const GiftId = req.params.id;
    
        // Find the wallpaper by ID
        const gift = await Gift.findById(frameId);
        if (!gift) {
          return res.status(404).json({ message: 'Frame not found' });
        }
    
        // Return the wallpaper
        res.status(200).json({ gift });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }
    };
    
    exports.getAllGifts = async (req, res) => {
      try {
        // Fetch all wallpapers sorted by viewOrder in ascending order
        const AllGifts = await Gift.find().sort({ viewOrder: 1 });
        res.status(200).json(AllGifts);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
    };



/*exports.createAvatar = async (req, res) => {
    try {
	if (!req.files || !req.files.image) {
     return res.status(400).json({ message: 'No file uploaded' });
  }

  const image = req.files.image;
console.log("image--------",image)
  const finalName = image.name.replace(/\s+/g, '_');
  const desImageDir = `${AvatarPath}/${finalName}`;

  if (!fs.existsSync(desImageDir)) {
      fs.mkdirSync(desImageDir, { recursive: true });
  }

  const imageName = image.name.replace(/ /g, '_');
console.log("imageName-------",imageName)
  const originalImagePath = `${desImageDir}/${imageName}`;
  fs.writeFileSync(originalImagePath, image.data);
console.log("originImagePath---------",originalImagePath);
  // Create thumbnails directory if it doesn't exist
  const thumbnailDir = `${AvatarPath}/thumbnails`;
  if (!fs.existsSync(thumbnailDir)) {
      fs.mkdirSync(thumbnailDir, { recursive: true });
  }

console.log("image----------",image)

  // Determine file extension and resize accordingly
  const extension = path.extname(image.name).toLowerCase();
console.log("extension--------",extension)
  const thumbnailImagePath = `${thumbnailDir}/${path.basename(imageName, extension)}.webp`;
  let pipeline;
  if (extension === '.png' || extension === '.jpg' || extension === '.jpeg') {
      pipeline = sharp(originalImagePath)
          .resize({ width: 200, height: 200 })
          .toFormat('webp')
          .webp({ quality: 80 })
          .toFile(thumbnailImagePath);
  } else {
      throw new Error('Unsupported file format');
  }

  await pipeline;

  const destinationImgUrl = `https://salesman.aindriya.co.in/${URLpathA}/original/${imageName}`;
  const thumbnailImgUrl = `https://salesman.aindriya.co.in/${URLpathA}/thumbnails/${path.basename(imageName, extension)}.webp`;
console.log("destinationImgUrl--------",destinationImgUrl);
console.log("thumbnailImgUrl------",thumbnailImgUrl)
	const avatar = new Avatar({ image:destinationImgUrl, thumbnailImg:thumbnailImgUrl})
	await avatar.save();

  res.status(201).json({ message: "Wallpaper created successfully", avatar });


    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
*/

/*exports.createAvatar = async (req, res) => {
    try {
        if (!req.files || !req.files.image) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const image = req.files.image;
        const finalName = image.name.replace(/\s+/g, '_');

        // Directory for original images
        const originalDir = `${AvatarPath}/original`;
        if (!fs.existsSync(originalDir)) {
            fs.mkdirSync(originalDir, { recursive: true });
        }

        // Save original image
        const originalImagePath = `${originalDir}/${finalName}`;
        fs.writeFileSync(originalImagePath, image.data);

        // Directory for thumbnails
        const thumbnailDir = `${AvatarPath}/thumbnails`;
        if (!fs.existsSync(thumbnailDir)) {
            fs.mkdirSync(thumbnailDir, { recursive: true });
        }

        // Determine file extension
        const extension = path.extname(finalName).toLowerCase();

        // Resize and save thumbnail image
        const thumbnailImagePath = `${thumbnailDir}/${path.basename(finalName, extension)}.webp`;
        await sharp(originalImagePath)
            .resize({ width: 200, height: 200 })
            .toFormat('webp')
            .webp({ quality: 80 })
            .toFile(thumbnailImagePath);

        // Image URLs
        const destinationImgUrl = `https://salesman.aindriya.co.in/URLpathA/original/${finalName}`;
        const thumbnailImgUrl = `https://salesman.aindriya.co.in/URLpathA/thumbnails/${path.basename(finalName, extension)}.webp`;

        // Save avatar data to database
        const avatar = new Avatar({ image: destinationImgUrl, thumbnailImg: thumbnailImgUrl });
        await avatar.save();

        res.status(201).json({ message: "Avatar created successfully", avatar });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};*/

exports.createAvatar = async (req, res) => {
    try {
        if (!req.files || !req.files.image) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const image = req.files.image;
        const finalName = image.name.replace(/\s+/g, '_');

        // Directory for avatar images
        const avatarDir = `${AvatarPath}/avatar`;
        if (!fs.existsSync(avatarDir)) {
            fs.mkdirSync(avatarDir, { recursive: true });
        }

        // Directory for original images
        const originalDir = `${avatarDir}/original`;
        if (!fs.existsSync(originalDir)) {
            fs.mkdirSync(originalDir, { recursive: true });
        }

        // Save original image
        const originalImagePath = `${originalDir}/${finalName}`;
        fs.writeFileSync(originalImagePath, image.data);

        // Directory for thumbnails
        const thumbnailDir = `${avatarDir}/thumbnails`;
        if (!fs.existsSync(thumbnailDir)) {
            fs.mkdirSync(thumbnailDir, { recursive: true });
        }

        // Determine file extension
        const extension = path.extname(finalName).toLowerCase();

        // Resize and save thumbnail image
        const thumbnailImagePath = `${thumbnailDir}/${path.basename(finalName, extension)}.webp`;
        await sharp(originalImagePath)
            .resize({ width: 200, height: 200 })
            .toFormat('webp')
            .webp({ quality: 80 })
            .toFile(thumbnailImagePath);

        // Image URLs
        const destinationImgUrl = `https://salesman.aindriya.co.in/avatar/original/${finalName}`;
        const thumbnailImgUrl = `https://salesman.aindriya.co.in/avatar/thumbnails/${path.basename(finalName, extension)}.webp`;

        // Save avatar data to database
        const avatar = new Avatar({ image: destinationImgUrl, thumbnailImg: thumbnailImgUrl });
        await avatar.save();

        res.status(201).json({ message: "Avatar created successfully", avatar });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};



exports.getAvatar = async (req, res) => {
    try {
        const avatars = await Avatar.find();
        res.status(200).json(avatars);
    } catch (error) {
        console.error("Error fetching avatars:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


exports.getAvatarById = async (req, res) => {
    try {
        const avatarId = req.params.id; // Assuming the ID is passed as a route parameter
        const avatar = await Avatar.findById(avatarId);
        
        if (!avatar) {
            return res.status(404).json({ message: 'Avatar not found' });
        }
        
        res.status(200).json(avatar);
    } catch (error) {
        console.error("Error fetching avatar by ID:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


exports.createCategory = async (req, res) => {
  console.log("req.body-------", req.body);
  try {
    const { name } = req.body;
    const category = new Category({ name });
    console.log("category----", category);
    await category.save();
    res.status(201).json({ message: 'Category created successfully', category });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Other CRUD operations
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.deleteCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getProfile =async (req,res)=>{
try {
    const userId = req.params.id;

    // Validate the user ID format
 //   if (!mongoose.Types.ObjectId.isValid(userId)) {
   //   return res.status(400).json({ message: 'Invalid user ID format' });
    //}

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Respond with the user profile
    res.status(200).json({ userProfile: user.profile });
  } catch (error) {
    console.error('Error retrieving user profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

exports.createBanner = async(req,res)=>{
try {
    console.log("req.body==============",req.body);
    console.log("req.files=============",req.files);
    
    const { viewingOrder, status } = req.body;
  
    if (!req.files || !req.files.image) {
       return res.status(400).json({ message: 'No file uploaded' });
    }
  
    const image = req.files.image;
    const name = 'banner';
    const finalName = name.replace(/\s+/g, '_');
    const desImageDir = `${framePath}/${finalName}`;
  
    if (!fs.existsSync(desImageDir)) {
        fs.mkdirSync(desImageDir, { recursive: true });
    }
  
    const imageName = image.name.replace(/ /g, '_');
    const originalImagePath = `${desImageDir}/${imageName}`;
    fs.writeFileSync(originalImagePath, image.data);
  
    // Create thumbnails directory if it doesn't exist
    const thumbnailDir = `${framePath}/thumbnails`;
    if (!fs.existsSync(thumbnailDir)) {
        fs.mkdirSync(thumbnailDir, { recursive: true });
    }
  
    // Determine file extension and resize accordingly
    const extension = path.extname(image.name).toLowerCase();
    const thumbnailImagePath = `${thumbnailDir}/${path.basename(imageName, extension)}.webp`;
    let pipeline;
  
    if (extension === '.png' || extension === '.jpg' || extension === '.jpeg') {
        pipeline = sharp(originalImagePath)
            .resize({ width: 200, height: 200 })
            .toFormat('webp')
            .webp({ quality: 80 })
            .toFile(thumbnailImagePath);
    } else {
        throw new Error('Unsupported file format');
    }
  
    await pipeline;
  
    const destinationImgUrl = `https://salesman.aindriya.co.in/${finalName}/${imageName}`;
    const thumbnailImgUrl = `https://salesman.aindriya.co.in/${URLpathB}/thumbnails/${path.basename(imageName, extension)}.webp`;
  console.log("destinationImgUrl--------",destinationImgUrl);
  console.log("thumbnailImgUrl------",thumbnailImgUrl)
    
    const banner = new Banner({
        viewingOrder,
        status,
        image: destinationImgUrl,
       // thumbnail: thumbnailImgUrl
    });
  
    await banner.save();
  
    res.status(201).json({ message: "Banner created successfully", banner });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}



 exports.getAllBanner = async (req, res) => {
    try {
      // Fetch all wallpapers sorted by viewOrder in ascending order
      const AllBanner = await Banner.find().sort({ viewingOrder: 1 });
      res.status(200).json(AllBanner);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };

exports.getBannerById = async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await Banner.findById(id);
    if (!banner) {
      return res.status(404).json({ message: 'Banner  not found' });
    }
    res.status(200).json(banner);
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.createMood = async (req, res) => {
  try {
    console.log("req.body==============", req.body);
    console.log("req.files=============", req.files);

    const { moodName, order, status } = req.body;

    if (!req.files || !req.files.image) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const image = req.files.image;
    const finalName = moodName.replace(/\s+/g, '_');

    // Directory for the mood images
    const desImageDir = `${moodPath}/${URLpathM}/${finalName}`;
    if (!fs.existsSync(desImageDir)) {
      fs.mkdirSync(desImageDir, { recursive: true });
      console.log(`Mood directory created: ${desImageDir}`);
    }

    // Save original image
    const imageName = image.name.replace(/ /g, '_');
    const originalImagePath = `${desImageDir}/${imageName}`;
    fs.writeFileSync(originalImagePath, image.data);
    console.log(`Original image saved: ${originalImagePath}`);

    // Directory for thumbnails
    const thumbnailDir = `${desImageDir}/thumbnails`;
    if (!fs.existsSync(thumbnailDir)) {
      fs.mkdirSync(thumbnailDir, { recursive: true });
      console.log(`Thumbnail directory created: ${thumbnailDir}`);
    }

    // Determine file extension
    const extension = path.extname(imageName).toLowerCase();

    // Resize and save thumbnail image
    const thumbnailImagePath = `${thumbnailDir}/${path.basename(imageName, extension)}.webp`;
    await sharp(originalImagePath)
      .resize({ width: 200, height: 200 })
      .toFormat('webp')
      .webp({ quality: 80 })
      .toFile(thumbnailImagePath);
    console.log(`Thumbnail image saved: ${thumbnailImagePath}`);

    // URLs for accessing the images
    const destinationImgUrl = `https://salesman.aindriya.co.in/${URLpathM}/${finalName}/${imageName}`;
    //const thumbnailImgUrl = `https://salesman.aindriya.co.in/${URLpathM}/${finalName}/thumbnails/${path.basename(imageName, extension)}.webp`;

    console.log("destinationImgUrl--------", destinationImgUrl);
    //console.log("thumbnailImgUrl------", thumbnailImgUrl);

    // Save mood data to the database
    const mood = new Mood({
      moodName,
      order,
      status,
      image: destinationImgUrl,
  //    thumbnail: thumbnailImgUrl
    });

    await mood.save();

    res.status(201).json({ message: "Mood created successfully", mood });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


 exports.getAllMood = async (req, res) => {
    try {
      // Fetch all wallpapers sorted by viewOrder in ascending order
      const Allmood = await Mood.find().sort({ order: 1 });
      res.status(200).json(Allmood);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };

exports.getMoodById = async (req, res) => {
	try {
    const { id } = req.params;
    const mood = await Mood.findById(id);
    if (!mood) {
      return res.status(404).json({ message: 'mood  not found' });
    }
    res.status(200).json(mood);
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.createWallet =async (req,res)=>{
  try {
    const { userId } = req.body;

    // Check if the user already has a wallet
    const existingWallet = await Wallet.findOne({ userId });
    if (existingWallet) {
        return res.status(400).json({ message: 'Wallet already exists for this user.' });
    }

    const wallet = new Wallet({ userId });
    await wallet.save();
    res.status(201).json(wallet);
} catch (error) {
    res.status(500).json({ message: 'Error creating wallet', error });
}
}

exports.getWallet= async (req,res)=>{
  try {
    const { userId } = req.params;
    const wallet = await Wallet.findOne({ userId });
    if (!wallet) {
        return res.status(404).json({ message: 'Wallet not found.' });
    }
    res.status(200).json(wallet);
} catch (error) {
    res.status(500).json({ message: 'Error fetching wallet', error });
}
}

exports.addFunds = async (req,res)=>{
  try {
    const { userId, amount } = req.body;

    const wallet = await Wallet.findOne({ userId });
    if (!wallet) {
        return res.status(404).json({ message: 'Wallet not found.' });
    }

    wallet.balance += amount;
    wallet.updatedAt = Date.now();
    await wallet.save();

    const transaction = new Transaction({
        userId,
        type: 'credit',
        amount,
        balanceAfter: wallet.balance
    });
    await transaction.save();

    res.status(200).json(wallet);
} catch (error) {
    res.status(500).json({ message: 'Error adding funds', error });
}
}

exports.deductFunds = async (req,res)=>{
  try {
    const { userId, amount } = req.body;

    const wallet = await Wallet.findOne({ userId });
    if (!wallet) {
        return res.status(404).json({ message: 'Wallet not found.' });
    }

    if (wallet.balance < amount) {
        return res.status(400).json({ message: 'Insufficient balance.' });
    }

    wallet.balance -= amount;
    wallet.updatedAt = Date.now();
    await wallet.save();

    const transaction = new Transaction({
        userId,
        type: 'debit',
        amount,
        balanceAfter: wallet.balance
    });
    await transaction.save();

    res.status(200).json(wallet);
} catch (error) {
    res.status(500).json({ message: 'Error deducting funds', error });
}
}

exports.getTransactionHistory= async (req,res)=>{
  try {
    const { userId } = req.params;
    const transactions = await Transaction.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(transactions);
} catch (error) {
    res.status(500).json({ message: 'Error fetching transaction history', error });
}
}
