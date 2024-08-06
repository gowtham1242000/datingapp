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
const Follow = require('../models/Follow');
const Block = require('../models/BlockUser');
const InitialCoin = require('../models/InitialCoin')
const UserOneVsOneList = require('../models/userOneVsOneList');
const UserCall = require('../models/UserCall');
const HeartCost = require('../models/HeartCost');
const HeartConversionHistory = require('../models/HeartConversionHistory');
const CallHeartCost = require('../models/CallHeartCost');
const GiftTransactionHistory = require('../models/GiftTransactionHistory'); 
const UserGift = require('../models/UserGift');
const CoinOfferBanner = require('../models/CoinOfferBanner');
const CoinPurchaseTransaction = require('../models/CoinPurchaseTransaction');
const CoinTransactionHistory = require('../models/CoinTransactionHistory');

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
const { v4: uuidv4 } = require('uuid');


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
const LanguagePath = '/etc/ec/data'; // Adjust the path as necessary
const URLpathL = 'Language'; 


require("dotenv").config();



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

/*
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
*/
exports.createlanguage = async (req, res) => {
    try {
        const { language, status, code } = req.body;

        // Validate input
        if (!language || !status || !code) {
            return res.status(400).json({ error: 'Language, status, and code are required' });
        }

        let avatarPath = '';

        // Handle avatar image upload
        if (req.files && req.files.image) {
            const image = req.files.image;
console.log("image----",image);
            const name = 'avatar';
            const finalName = name.replace(/\s+/g, '_');
            const desImageDir = `${LanguagePath}/${finalName}`;

            if (!fs.existsSync(desImageDir)) {
                fs.mkdirSync(desImageDir, { recursive: true });
            }

            const imageName = image.name.replace(/ /g, '_');
            const originalImagePath = `${desImageDir}/${imageName}`;
            fs.writeFileSync(originalImagePath, image.data);

            const thumbnailDir = `${LanguagePath}/thumbnails`;
            if (!fs.existsSync(thumbnailDir)) {
                fs.mkdirSync(thumbnailDir, { recursive: true });
            }

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

            avatarPath = `https://salesman.aindriya.co.in/${finalName}/${imageName}`;
        }

        // Create a new language document
        const newLanguage = new Language({
            language,
            status,
            code,
            avatar: avatarPath
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

/*
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
*/

exports.userRequestOTP = async (req, res) => {
   /* try {
        const { mobileNumber } = req.body;
        console.log("mobileNumber----------", req.body);

        // Fetch the initial coin amount from the database
        let initialCoin = 0; // Default to 0 if no InitialCoin document exists
        const initialCoinDoc = await InitialCoin.findOne();
        if (initialCoinDoc) {
            initialCoin = initialCoinDoc.coin;
        }

        let user = await User.findOne({ mobileNumber });
        let isExistingUser = false; // Flag to indicate existing user

        if (user) {
            isExistingUser = true; // Set the flag if user exists
        } else {
            // Create a new user with the default username
            user = new User({ mobileNumber, username: `user_${mobileNumber}` });

            // Create a wallet for the new user with the initial amount
            const wallet = new Wallet({ userId: user._id, balance: initialCoin });
            await wallet.save();

            // Set the initial coin balance in the user's profile
            user.profile.coin = initialCoin;
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

        res.status(200).send({ message: 'OTP sent successfully', isExistingUser });
    } catch (error) {
        console.log(error);
        res.status(400).send({ error: error.message });
    }*/
try {
        const { mobileNumber } = req.body;
        console.log("mobileNumber----------", req.body);

        // Fetch the initial coin amount from the database
        let initialCoin = 0; // Default to 0 if no InitialCoin document exists
        const initialCoinDoc = await InitialCoin.findOne();
        if (initialCoinDoc) {
            initialCoin = initialCoinDoc.coin;
        }

        let user = await User.findOne({ mobileNumber });
        let newUser = false; // Flag to indicate new user

        if (user) {
            console.log('Existing user found:', user);
            user.newUser = false; // Set the flag to false for existing users
        } else {
            // Create a new user with the default username
            user = new User({ mobileNumber, username: `user_${mobileNumber}`, newUser: true });
            newUser = true; // Set the flag if new user is created

            // Create a wallet for the new user with the initial amount
            const wallet = new Wallet({ userId: user._id, balance: initialCoin });
            await wallet.save();

            // Set the initial coin balance in the user's profile
            user.profile.coin = initialCoin;
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

        res.status(200).send({ message: 'OTP sent successfully', newUser });
    } catch (err) {
        console.error('An error occurred while sending the OTP:', err);
        res.status(500).send({ error: 'An error occurred while sending the OTP' });
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
console.log("req.body-------------",req.body);
  try {
    const id = req.params.userId;
console.log("req.params.userId-------------",req.params.userId)
    const { username, dateOfBirth, language, place, gender, avatar, coin, blocklist, myMood } = req.body;


console.log("req.body-------",req.body.myMood)
    //console.log("-----------",myMood)
console.log("id-------------",id)
    // Check if user exists
    const existingUser = await User.findById(id);
    console.log("existingUser-------",existingUser)
    console.log("id---------",id)
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user details
    if (username){ existingUser.username = username;}
    if (dateOfBirth) {existingUser.profile.dateOfBirth = dateOfBirth;}
    if (language) {existingUser.profile.language = language;}
    if (place) {existingUser.profile.place = place;}
    if (gender) {existingUser.profile.gender = gender;}
    //if (avatar) existingUser.profile.avatar = avatar;
    if (coin) {existingUser.profile.coin = coin;}
   if (avatar) {
      try {
        const avatarRecord = await Avatar.findById(avatar);
        if (!avatarRecord) {
          return res.status(404).json({ message: 'Avatar not found' });
        }
        existingUser.profile.avatar = avatarRecord.image;
      } catch (error) {
        return res.status(500).json({ message: 'Error fetching avatar', error });
      }
    }

    if (myMood) {
console.log("-------------entering the flow  ----")
      try {
        const mood = await Mood.findById(myMood);
console.log("mood---------",mood)
        if (!mood) {
          return res.status(404).json({ message: 'Mood Not Found' });
        }
console.log("mood.image----------",mood.image)
console.log("mood.mood--------",mood.moodName)
        existingUser.profile.myMood = mood.image;
        existingUser.profile.moodName = mood.moodName;
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
    console.error("--------------error---------",error);
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
/*try {
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
  }*/

try {
    const userId = req.params.id;

    // Validate the user ID format
//    if (!mongoose.Types.ObjectId.isValid(userId)) {
  //    return res.status(400).json({ message: 'Invalid user ID format' });
   // }

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Count the number of followers and followings
    const followersCount = await Follow.countDocuments({ followingId: userId });
    const followingsCount = await Follow.countDocuments({ followerId: userId });

    // Respond with the user profile and follow counts
    res.status(200).json({
      userName: user.username,
      userId:user._id,
      userProfile: user.profile,
      followersCount,
      followingsCount
    });
  } catch (error) {
    console.error('Error retrieving user profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

/*
exports.getUserCoinDetails = async (req, res) => {
  const userId = req.params; // Assuming userId is passed as a URL parameter

  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }

  try {
    // Fetch the user details by userId
console.log('userId---------',userId)
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Extract coin details from user profile
    const { coin } = user.profile;

    res.status(200).json({ userId, coin });
  } catch (err) {
    console.error('An error occurred while fetching user coin details:', err);
    res.status(500).json({ error: 'An error occurred while fetching user coin details' });
  }
};
*/

/*exports.getUserCoinDetails = async (req, res) => {
    const userId = req.params.userId;
console.log("------------",userId)
//    if (!mongoose.Types.ObjectId.isValid(userId)) {
  //      return res.status(400).json({ error: 'Invalid userId format' });
   // }

    try {
        const user = await User.findById(userId).select('profile.coin');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({
            userId: user._id,
            coins: user.profile.coin
        });
    } catch (err) {
        console.error('An error occurred while fetching user coin details:', err);
        res.status(500).json({ error: 'An error occurred while fetching user coin details' });
    }
};*/

exports.getUserCoinDetails = async (req, res) => {
    let userId = req.params.userId;
    console.log("------------", userId);

    try {
        // Ensure the userId is a string and then parse it back to avoid potential issues
        userId = JSON.stringify(userId).replace(/^"|"$/g, '');

        // Validate the userId
/*        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: 'Invalid userId format' });
        }*/

        const user = await User.findById(userId).select('profile.coin');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({
            userId: user._id,
            coins: user.profile.coin
        });
    } catch (err) {
        console.error('An error occurred while fetching user coin details:', err);
        res.status(500).json({ error: 'An error occurred while fetching user coin details' });
    }
};

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

exports.followUser = async (req, res) => {
  try {
      const { followerId, followingId } = req.body;
console.log("req.body--------",req.body);
      // Check if the follow relationship already exists
      const existingFollow = await Follow.findOne({ followerId, followingId });
console.log("existingFollow---------",existingFollow)
      if (existingFollow) {
          return res.status(400).json({ message: 'You are already following this user.' });
      }

      const follow = new Follow({ followerId, followingId });
console.log("follow---------",follow);
      await follow.save();
      res.status(201).json({ message:'User Followed successfully',follow});
  } catch (error) {
    console.log("error------",error);
      res.status(500).json({ message: 'Error following user', error });
  }
};

// Unfollow a user
exports.unfollowUser = async (req, res) => {
  try {
      const { followerId, followingId } = req.body;

      // Check if the follow relationship exists
      const follow = await Follow.findOne({ followerId, followingId });
      if (!follow) {
          return res.status(400).json({ message: 'You are not following this user.' });
      }

      await Follow.deleteOne({ followerId, followingId });
      res.status(200).json({ message: 'Successfully unfollowed the user.' });
  } catch (error) {
      res.status(500).json({ message: 'Error unfollowing user', error });
  }
};
exports.getFollowers = async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch the followers with their user IDs
    const follows = await Follow.find({ followingId: userId }).select('followerId');

    // Extract the follower IDs from the result
    const followerIds = follows.map(follow => follow.followerId);

    // Fetch detailed information for each follower from the User table
    const users = await User.find({ _id: { $in: followerIds } }).select('username profile.avatar');

    // Get the logged-in user's followings
    const loggedInUserFollows = await Follow.find({ followerId: userId }).select('followingId');

    // Create a set of IDs that the logged-in user is following
    const followingIds = new Set(loggedInUserFollows.map(follow => follow.followingId.toString()));

    // Fetch the followers count for each follower
    const followersCountsPromises = followerIds.map(async (followerId) => {
      const count = await Follow.countDocuments({ followingId: followerId });
      return { followerId, count };
    });

    const followersCounts = await Promise.all(followersCountsPromises);

    // Add the `isFollowing` flag and followers count to each user
    const followersWithFlag = users.map(user => {
      const followerCount = followersCounts.find(count => count.followerId.toString() === user._id.toString()).count;
      return {
        username: user.username,
        avatarImage: user.profile.avatar,
        isFollowing: followingIds.has(user._id.toString()), // Check if the logged-in user follows this user
        followersCount: followerCount, // Add followers count for this follower
      };
    });

    // Count the total number of followers
    const followerCount = followersWithFlag.length;

    res.status(200).json({ followers: followersWithFlag, followerCount });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching followers', error });
  }
};

/*
// Get followers of a user
exports.getFollowers = async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch the followers with their user IDs
    const follows = await Follow.find({ followingId: userId }).select('followerId');

    // Extract the follower IDs from the result
    const followerIds = follows.map(follow => follow.followerId);

    // Fetch detailed information for each follower from the User table
    const users = await User.find({ _id: { $in: followerIds } }).select('username profile.avatar');

    // Get the logged-in user's followings
    const loggedInUserFollows = await Follow.find({ followerId: userId }).select('followingId');

    // Create a set of IDs that the logged-in user is following
    const followingIds = new Set(loggedInUserFollows.map(follow => follow.followingId.toString()));

    // Fetch the followers count for each follower
    const followersCountsPromises = followerIds.map(async (followerId) => {
      const count = await Follow.countDocuments({ followingId: followerId });
      return { followerId, count };
    });

    const followersCounts = await Promise.all(followersCountsPromises);

    // Add the `isFollowing` flag and followers count to each user
    const followersWithFlag = users.map(user => {
      const followerCount = followersCounts.find(count => count.followerId.toString() === user._id.toString()).count;
      return {
        username: user.username,
        avatarImage: user.profile.avatar,
        isFollowing: followingIds.has(user._id.toString()), // Check if the logged-in user follows this user
        followersCount: followerCount, // Add followers count for this follower
      };
    });

    // Count the total number of followers
    const followerCount = followersWithFlag.length;

    res.status(200).json({ followers: followersWithFlag, followerCount });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching followers', error });
  }

};*/

/*
// Get following of a user
exports.getFollowing = async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch the following list with their user IDs
    const follows = await Follow.find({ followerId: userId }).select('followingId');

    // Extract the following IDs from the result
    const followingIds = follows.map(follow => follow.followingId);

    // Fetch detailed information for each following user from the User table
    const users = await User.find({ _id: { $in: followingIds } }).select('username profile.avatar');

    // Get the logged-in user’s followings
    const loggedInUserFollows = await Follow.find({ followerId: userId }).select('followingId');

    // Create a set of IDs that the logged-in user is following
    const followingIdsSet = new Set(loggedInUserFollows.map(follow => follow.followingId.toString()));

    // Fetch the followers count for each user being followed
    const followersCountsPromises = followingIds.map(async (followingId) => {
      const count = await Follow.countDocuments({ followingId });
      return { followingId, count };
    });

    const followersCounts = await Promise.all(followersCountsPromises);

    // Add the `isFollowing` flag and followers count to each user
    const followingWithDetails = users.map(user => {
      const followersCount = followersCounts.find(count => count.followingId.toString() === user._id.toString()).count;
      return {
        username: user.username,
        avatarImage: user.profile.avatar,
        isFollowing: followingIdsSet.has(user._id.toString()), // Check if the logged-in user follows this user
        followersCount: followersCount, // Add followers count for this user
      };
    });

    // Count the total number of following
    const followingCount = followingWithDetails.length;

    res.status(200).json({ following: followingWithDetails, followingCount });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching following', error });
  }
};

*/
exports.getFollowing = async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch the following list with their user IDs
    const follows = await Follow.find({ followerId: userId }).select('followingId');

    // Extract the following IDs from the result
    const followingIds = follows.map(follow => follow.followingId);

    // Fetch detailed information for each following user from the User table
    const users = await User.find({ _id: { $in: followingIds } }).select('username profile.avatar');

    // Get the logged-in user's followings
    const loggedInUserFollows = await Follow.find({ followerId: userId }).select('followingId');

    // Create a set of IDs that the logged-in user is following
    const followingIdsSet = new Set(loggedInUserFollows.map(follow => follow.followingId.toString()));

    // Fetch the followers count for each user being followed
    const followersCountsPromises = followingIds.map(async (followingId) => {
      const count = await Follow.countDocuments({ followingId });
      return { followingId, count };
    });

    const followersCounts = await Promise.all(followersCountsPromises);

    // Add the `isFollowing` flag and followers count to each user
    const followingWithDetails = users.map(user => {
      const followersCount = followersCounts.find(count => count.followingId.toString() === user._id.toString()).count;
      return {
        username: user.username,
        avatarImage: user.profile.avatar,
        isFollowing: followingIdsSet.has(user._id.toString()), // Check if the logged-in user follows this user
        followersCount: followersCount, // Add followers count for this user
      };
    });

    // Count the total number of following
    const followingCount = followingWithDetails.length;

    res.status(200).json({ following: followingWithDetails, followingCount });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching following', error });
  }
};

/*
exports.userOneVsOneList = async(req,res)=>{
  /*const { userId, roomId, isHost, category } = req.body;

  if (!userId || !roomId || isHost === undefined || !category) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const userEntry = new UserOneVsOneList({ userId, roomId, isHost, category });
    await userEntry.save();
    res.status(201).json(userEntry);
  } catch (err) {
    res.status(500).json({ error: 'An error occurred while adding the user' });
  }
//
const { userId, roomId, isHost, category } = req.body;

  if (!userId || !roomId || isHost === undefined || !category) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Check if an entry with the same userId exists
    let userEntry = await UserOneVsOneList.findOne({ userId });

    if (userEntry) {
      // Update the existing entry
      userEntry.roomId = roomId;
      userEntry.isHost = isHost;
      userEntry.category = category;
    } else {
      // Create a new entry
      userEntry = new UserOneVsOneList({ userId, roomId, isHost, category });
    }

    // Save the entry (update or create)
    await userEntry.save();
    res.status(201).json(userEntry);
  } catch (err) {
    console.error('An error occurred while adding/updating the user:', err);
    res.status(500).json({ error: 'An error occurred while adding/updating the user' });
  }
}
*/

exports.userOneVsOneList = async (req, res) => {
  const { userId, roomId, isHost, category, callType } = req.body;

  if (!userId || isHost === undefined || !category || !callType) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    let channelName;
    let generatedRoomId = roomId || uuidv4(); // Generate a new roomId if not provided

    if (isHost) {
      channelName = `${generatedRoomId}-${category}`;

      // Create a token for the host
      const hostToken = RtcTokenBuilder.buildTokenWithUid(APP_ID, APP_CERTIFICATE, channelName, userId, RtcRole.PUBLISHER, Math.floor(Date.now() / 1000) + 3600);

      // Save host information
      const userEntry = new UserOneVsOneList({
        userId,
        roomId: generatedRoomId,
        isHost,
        category,
        callType,
        channelName
      });
      await userEntry.save();

      // Notify that the host has started the call
      res.status(201).json({ message: 'Host created the call', token: hostToken, channelName, roomId: generatedRoomId });
    } else {
      // Fetch host details
      const hostEntry = await UserOneVsOneList.findOne({ roomId: generatedRoomId, isHost: true, category });

      if (!hostEntry) {
        return res.status(404).json({ message: 'Host not found for the specified room and category' });
      }

      // Generate token for joiner
      const joinerToken = RtcTokenBuilder.buildTokenWithUid(APP_ID, APP_CERTIFICATE, hostEntry.channelName, userId, RtcRole.SUBSCRIBER, Math.floor(Date.now() / 1000) + 3600);

      // Save joiner information
      const userEntry = new UserOneVsOneList({
        userId,
        roomId: generatedRoomId,
        isHost,
        category,
        callType
      });
      await userEntry.save();

      // Save call details
      const newCall = new UserCall({
        hostId: hostEntry.userId,
        joinerId: userId,
        category,
        callType,
        roomId:generatedRoomId,
        channelName: hostEntry.channelName
      });
      await newCall.save();

      // Notify that the joiner joined the call
      res.status(201).json({ message: 'Joiner joined the call', token: joinerToken });
    }
  } catch (err) {
    console.error('An error occurred while adding/updating the user:', err);
    res.status(500).json({ error: 'An error occurred while adding/updating the user' });
  }
};

exports.endCall = async (req, res) => {
  const { hostId, joinerId, roomId } = req.body;

  if (!hostId || !joinerId || !roomId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Find and update the call entry
    const callEntry = await UserCall.findOneAndUpdate(
      { roomId, $or: [{ hostId }, { joinerId }] },
      { callEnded: true, callEndedAt: new Date() },
      { new: true }
    );

    if (!callEntry) {
      return res.status(404).json({ message: 'Call not found' });
    }

    // Notify the client
    res.status(200).json({ message: 'Call ended successfully', callEntry });
  } catch (err) {
    console.error('An error occurred while ending the call:', err);
    res.status(500).json({ error: 'An error occurred while ending the call' });
  }
};

//get
exports.getUserOneVsOneList = async (req,res)=>{
 const { category } = req.query;

  if (!category) {
    return res.status(400).json({ error: 'Category query parameter is required' });
  }

  try {
    const users = await UserOneVsOneList.find({ category })
      .populate({
        path: 'userId',
        select: '-otp' // Exclude the otp field
      });

    res.json(users);
  } catch (err) {
    console.error('An error occurred while fetching the users:', err);
    res.status(500).json({ error: 'An error occurred while fetching the users' });
  }
}



exports.getUserDetailById = async (req, res) => {
  console.log("req.params----", req.params);
  console.log("req.query-------", req.query);
  const userId = req.params.userId;  // Target user ID
  const { GetUserId } = req.query;    // Requesting user ID

  if (!userId || !GetUserId) {
    return res.status(400).json({ error: 'User ID and GetUserId are required' });
  }

  try {
    // Find the requesting user by ID
    const getUser = await User.findById(GetUserId).select('-otp');

    if (!getUser) {
      return res.status(404).json({ message: 'Requesting user not found' });
    }

    // Count the number of followers and followings for the requesting user
    const followersCount = await Follow.countDocuments({ followingId: GetUserId });
    const followingsCount = await Follow.countDocuments({ followerId: GetUserId });

    // Check if userId is following GetUserId
    const isFollowing = await Follow.exists({ followerId: userId, followingId: GetUserId });

    // Respond with the requesting user's profile and follow counts
    res.status(200).json({
     userId:getUser._id,
      userName: getUser.username,
      userProfile: getUser.profile,
      followersCount,
      followingsCount,
      isFollowing: !!isFollowing
    });
  } catch (error) {
    console.error('Error retrieving user profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.blockUser = async (req, res) => {
  const { userId, blockedUserId, reason, blockFlag } = req.body;

  if (!userId || !blockedUserId || !reason || blockFlag === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Check if the block entry already exists
    let blockEntry = await Block.findOne({ userId, blockedUserId });

    if (blockEntry) {
      // Update existing block entry
      blockEntry.reason = reason;
      blockEntry.blockFlag = blockFlag;
      blockEntry.blockedAt = Date.now();
      await blockEntry.save();
    } else {
      // Create a new block entry
      blockEntry = new Block({ userId, blockedUserId, reason, blockFlag });
      await blockEntry.save();
    }

    res.status(201).json(blockEntry);
  } catch (err) {
    console.error('Error blocking user:', err);
    res.status(500).json({ error: 'An error occurred while blocking the user' });
  }
};


exports.createInitialCoin = async (req, res) => {
  try {
      const { coin } = req.body;

      const initialCoin = new InitialCoin({ coin });
      await initialCoin.save();

      res.status(201).json(initialCoin);
  } catch (error) {
      res.status(500).json({ message: 'Error creating initial coin', error });
  }
};

exports.getInitialCoin = async (req, res) => {
  try {
      const initialCoin = await InitialCoin.findOne();

      if (!initialCoin) {
          return res.status(404).json({ message: 'Initial coin not found.' });
      }

      res.status(200).json(initialCoin);
  } catch (error) {
      res.status(500).json({ message: 'Error fetching initial coin', error });
  }
};

exports.updateInitialCoin = async (req, res) => {
  try {
      const { coin } = req.body;

      const initialCoin = await InitialCoin.findOne();
      if (!initialCoin) {
          return res.status(404).json({ message: 'Initial coin not found.' });
      }

      initialCoin.coin = coin;
      initialCoin.updatedAt = Date.now();
      await initialCoin.save();

      res.status(200).json(initialCoin);
  } catch (error) {
      res.status(500).json({ message: 'Error updating initial coin', error });
  }
};

exports.deleteInitialCoin = async (req, res) => {
  try {
      const initialCoin = await InitialCoin.findOneAndDelete();
      if (!initialCoin) {
          return res.status(404).json({ message: 'Initial coin not found.' });
      }

      res.status(200).json({ message: 'Initial coin deleted successfully.' });
  } catch (error) {
      res.status(500).json({ message: 'Error deleting initial coin', error });
  }
};


exports.createOrUpdateHeartCost = async (req, res) => {
  try {
    const { costPerHeart } = req.body;

    if (costPerHeart === undefined) {
      return res.status(400).json({ error: 'costPerHeart is required' });
    }

    let heartCost = await HeartCost.findOne();
    
    if (heartCost) {
      // Update existing heart cost
      heartCost.costPerHeart = costPerHeart;
      await heartCost.save();
    } else {
      // Create new heart cost
      heartCost = new HeartCost({ costPerHeart });
      await heartCost.save();
    }

    res.status(200).json(heartCost);
  } catch (err) {
    console.error('An error occurred while creating/updating heart cost:', err);
    res.status(500).json({ error: 'An error occurred while creating/updating heart cost' });
  }
};

exports.getHeartCost = async (req, res) => {
  try {
    const heartCost = await HeartCost.findOne();
    if (!heartCost) {
      return res.status(404).json({ error: 'Heart cost not found' });
    }
    res.status(200).json(heartCost);
  } catch (err) {
    console.error('An error occurred while fetching heart cost:', err);
    res.status(500).json({ error: 'An error occurred while fetching heart cost' });
  }
};

// Delete Heart Cost
exports.deleteHeartCost = async (req, res) => {
  try {
    await HeartCost.deleteOne({});
    res.status(200).json({ message: 'Heart cost deleted successfully' });
  } catch (err) {
    console.error('An error occurred while deleting heart cost:', err);
    res.status(500).json({ error: 'An error occurred while deleting heart cost' });
  }
};


exports.convertHeartsToAmount = async (req, res) => {
  const { userId, heartsToConvert } = req.body;
	if (!userId || heartsToConvert === undefined) {
    return res.status(400).json({ error: 'userId and heartsToConvert are required' });
  }

  try {
    // Fetch the cost per heart
    const heartCost = await HeartCost.findOne();
    if (!heartCost) {
      return res.status(404).json({ error: 'Heart cost not found' });
    }

    // Calculate the amount
    const amount = heartsToConvert * heartCost.costPerHeart;

    // Fetch the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the user has enough hearts
    if (user.hearts < heartsToConvert) {
      return res.status(400).json({ error: 'Not enough hearts' });
    }

    // Update user profile wallet balance
    await User.findByIdAndUpdate(userId, {
      $inc: { 'profile.walletBalance': amount, 'profile.heartBalance': -heartsToConvert }
    });

    // Update wallet collection balance
    const wallet = await Wallet.findOne({ userId });
    if (wallet) {
      wallet.balance += amount;
      await wallet.save();
    } else {
      const newWallet = new Wallet({ userId, balance: amount });
      await newWallet.save();
    }

    // Log the conversion history
    const conversionHistory = new HeartConversionHistory({
      userId,
      heartsConverted: heartsToConvert,
      amountReceived: amount
    });
    await conversionHistory.save();

    res.status(200).json({ message: 'Hearts converted to amount successfully', amount });
  } catch (err) {
    console.error('An error occurred during heart conversion:', err);
    res.status(500).json({ error: 'An error occurred during heart conversion' });
  }
};

exports.getConversionHistory = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }

  try {
    const history = await HeartConversionHistory.find({ userId }).sort({ timestamp: -1 });
    res.status(200).json(history);
  } catch (err) {
    console.error('An error occurred while retrieving conversion history:', err);
    res.status(500).json({ error: 'An error occurred while retrieving conversion history' });
  }
};


//CallHeartCost


exports.createOrUpdateHeartCost = async (req, res) => {
  const { callHeartCost } = req.body;

  if (callHeartCost === undefined) {
    return res.status(400).json({ error: 'callHeartCost is required' });
  }

  try {
    // Check if a heart cost record already exists
    let heartCost = await CallHeartCost.findOne();

    if (heartCost) {
      // Update the existing record
      heartCost.callHeartCost = callHeartCost;
    } else {
      // Create a new record
      heartCost = new CallHeartCost({ callHeartCost });
    }

    await heartCost.save();
    res.status(200).json({ message: 'Heart cost updated successfully', heartCost });
  } catch (err) {
    console.error('An error occurred while creating/updating heart cost:', err);
    res.status(500).json({ error: 'An error occurred while creating/updating heart cost' });
  }
};


exports.getCallHeartCost = async (req, res) => {
  try {
    const heartCost = await CallHeartCost.findOne();

    if (!heartCost) {
      return res.status(404).json({ message: 'Heart cost not found' });
    }

    res.status(200).json(heartCost);
  } catch (err) {
    console.error('An error occurred while fetching heart cost:', err);
    res.status(500).json({ error: 'An error occurred while fetching heart cost' });
  }
};

/*
exports.buyGift = async (req, res) => {
    const { userId, giftId } = req.body;

    if (!userId || !giftId) {
        return res.status(400).json({ error: 'userId and giftId are required' });
    }

    try {
        // Fetch user details
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Fetch gift details
        const gift = await Gift.findById(giftId);
        if (!gift) {
            return res.status(404).json({ error: 'Gift not found' });
        }

        // Check if user has enough coins
        if (user.profile.coin < gift.newPrice) {
            return res.status(400).json({ error: 'Insufficient coins' });
        }

        // Deduct coins from user's balance
        user.profile.coin -= gift.newPrice;

        // Save the updated user details
        await user.save();

        // Store transaction history
        const transaction = new GiftTransactionHistory({
            userId: user._id,
            giftId: gift._id,
            giftName: gift.giftName,
            amount: gift.newPrice,
            coinAmount: gift.newPrice
        });
        await transaction.save();

        // Check if the user already has a record for this gift
        let userGift = await UserGift.findOne({ userId: user._id, giftId: gift._id });

        if (userGift) {
            // Increment the gift count
            userGift.count += 1;
            userGift.transactionId = transaction._id;
            userGift.amount = gift.newPrice;
            userGift.coinAmount = gift.newPrice;
            userGift.date = transaction.date;
        } else {
            // Create a new user gift record
            userGift = new UserGift({
                userId: user._id,
                transactionId: transaction._id,
                giftId: gift._id,
                giftName: gift.giftName,
                amount: gift.newPrice,
                coinAmount: gift.newPrice,
                date: transaction.date,
                count: 1
            });
        }

        await userGift.save();

        res.status(200).json({
            message: 'Gift purchased successfully',
            user: {
                userId: user._id,
                coinsRemaining: user.profile.coin,
                walletBalance: user.profile.walletBalance
            },
            transaction: {
                transactionId: transaction._id,
                giftId: transaction.giftId,
                giftName: transaction.giftName,
                amount: transaction.amount,
                coinAmount: transaction.coinAmount,
                date: transaction.date
            },
            userGift: {
                userId: userGift.userId,
                transactionId: userGift.transactionId,
                giftId: userGift.giftId,
                giftName: userGift.giftName,
                amount: userGift.amount,
                coinAmount: userGift.coinAmount,
                date: userGift.date,
                count: userGift.count
            }
        });
    } catch (err) {
        console.error('An error occurred while buying the gift:', err);
        res.status(500).json({ error: 'An error occurred while buying the gift' });
    }
};
*/
exports.buyGift = async (req, res) => {
  const { userId, giftId } = req.body;

  if (!userId || !giftId) {
    return res.status(400).json({ error: 'userId and giftId are required' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const gift = await Gift.findById(giftId);
    if (!gift) {
      return res.status(404).json({ error: 'Gift not found' });
    }

    if (user.profile.coin < gift.newPrice) {
      return res.status(400).json({ error: 'Insufficient coins' });
    }

    user.profile.coin -= gift.newPrice;
    await user.save();

    const transaction = new CoinTransactionHistory({
      userId: user._id,
      type: 'spend',
      coins: gift.newPrice,
      amountInCurrency: gift.newPrice,
      description: `Purchased gift: ${gift.giftName}`,
      spendingType: 'gift_purchase'
    });
    await transaction.save();

    let userGift = await UserGift.findOne({ userId: user._id, giftId: gift._id });
    if (userGift) {
      userGift.count += 1;
      userGift.transactionId = transaction._id;
      userGift.amount = gift.newPrice;
      userGift.coinAmount = gift.newPrice;
      userGift.date = transaction.timestamp;
    } else {
      userGift = new UserGift({
        userId: user._id,
        transactionId: transaction._id,
        giftId: gift._id,
        giftName: gift.giftName,
        amount: gift.newPrice,
        coinAmount: gift.newPrice,
        date: transaction.timestamp,
        count: 1
      });
    }

    await userGift.save();

    res.status(200).json({
      message: 'Gift purchased successfully',
      user: {
        userId: user._id,
        coinsRemaining: user.profile.coin,
        walletBalance: user.profile.walletBalance
      },
      transaction: {
        transactionId: transaction._id,
        giftId: gift._id,
        giftName: gift.giftName,
        amount: gift.newPrice,
        coinAmount: gift.newPrice,
        date: transaction.timestamp
      },
      userGift: {
        userId: userGift.userId,
        transactionId: userGift.transactionId,
        giftId: userGift.giftId,
        giftName: userGift.giftName,
        amount: userGift.amount,
        coinAmount: userGift.coinAmount,
        date: userGift.date,
        count: userGift.count
      }
    });
  } catch (err) {
    console.error('An error occurred while buying the gift:', err);
    res.status(500).json({ error: 'An error occurred while buying the gift' });
  }
};

exports.getUserGift = async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({ error: 'userId is required' });
    }

    try {
        const userGifts = await UserGift.find({ userId });

        res.status(200).json({ userGifts });
    } catch (err) {
        console.error('An error occurred while fetching user gifts:', err);
        res.status(500).json({ error: 'An error occurred while fetching user gifts' });
    }
};

/*
exports.shareGift = async (req, res) => {
    const { fromUserId, toUserId, giftId, quantity } = req.body;

    if (!fromUserId || !toUserId || !giftId || !quantity) {
        return res.status(400).json({ error: 'fromUserId, toUserId, giftId, and quantity are required' });
    }

    try {
        // Fetch the gift from the userGift collection
        const userGift = await UserGift.findOne({ userId: fromUserId, giftId });
console.log("userGift------------",userGift);
        if (!userGift) {
            return res.status(404).json({ error: 'Gift not found in user\'s collection' });
        }

        if (userGift.count < quantity) {
            return res.status(400).json({ error: 'Insufficient gift quantity' });
        }

        // Deduct the quantity from the fromUserId
        userGift.count -= quantity;
        await userGift.save();

        // Add the gift to the toUserId's collection
        let recipientGift = await UserGift.findOne({ userId: toUserId, giftId });

        if (recipientGift) {
            // Increment the gift count
            recipientGift.count += quantity;
        } else {
            // Create a new user gift record for the recipient
            recipientGift = new UserGift({
                userId: toUserId,
                transactionId: userGift.transactionId,
                giftId: userGift.giftId,
                giftName: userGift.giftName,
                amount: userGift.amount,
                coinAmount: userGift.coinAmount,
                date: new Date(),
                count: quantity
            });
        }

        await recipientGift.save();

        // Store transaction history for the share action
        const transaction = new GiftTransactionHistory({
            fromUserId,
            toUserId,
            giftId,
            giftName: userGift.giftName,
            amount: userGift.amount,
            coinAmount: userGift.coinAmount,
            date: new Date(),
            quantity
        });
        await transaction.save();

        res.status(200).json({
            message: 'Gift shared successfully',
            fromUserId,
            toUserId,
            giftId,
            quantity
        });
    } catch (err) {
        console.error('An error occurred while sharing the gift:', err);
        res.status(500).json({ error: 'An error occurred while sharing the gift' });
    }
};
*/
exports.shareGift = async (req, res) => {
    const { fromUserId, toUserId, giftId, quantity } = req.body;

    if (!fromUserId || !toUserId || !giftId || !quantity) {
        return res.status(400).json({ error: 'fromUserId, toUserId, giftId, and quantity are required' });
    }

    try {
        // Fetch the gift from the userGift collection
        const userGift = await UserGift.findOne({ userId: fromUserId, giftId });
        if (!userGift) {
            return res.status(404).json({ error: 'Gift not found in user\'s collection' });
        }

        if (userGift.count < quantity) {
            return res.status(400).json({ error: 'Insufficient gift quantity' });
        }

        // Deduct the quantity from the fromUserId
        userGift.count -= quantity;
        await userGift.save();

        // Add the gift to the toUserId's collection
        let recipientGift = await UserGift.findOne({ userId: toUserId, giftId });

        if (recipientGift) {
            // Increment the gift count
            recipientGift.count += quantity;
        } else {
            // Create a new user gift record for the recipient
            recipientGift = new UserGift({
                userId: toUserId,
                transactionId: userGift.transactionId,
                giftId: userGift.giftId,
                giftName: userGift.giftName,
                amount: userGift.amount,
                coinAmount: userGift.coinAmount,
                date: new Date(),
                count: quantity
            });
        }

        await recipientGift.save();

        // Store transaction history for the share action
        const transaction = new CoinTransactionHistory({
            userId: fromUserId, // Ensure this is set
            fromUserId,
            toUserId,
            giftId,
            type: 'spend',
            coins: userGift.coinAmount * quantity,
            amountInCurrency: userGift.amount * quantity,
            description: `Shared gift: ${userGift.giftName}`,
            spendingType: 'gift_share',
            timestamp: new Date(),
            quantity
        });

        await transaction.save();

        res.status(200).json({
            message: 'Gift shared successfully',
            fromUserId,
            toUserId,
            giftId,
            quantity
        });
    } catch (err) {
        console.error('An error occurred while sharing the gift:', err);
        res.status(500).json({ error: 'An error occurred while sharing the gift' });
    }
};

exports.createOrUpdateCoinOfferBanner = async (req, res) => {
    const { coin, rateInInr, text, status, viewingOrder } = req.body;

    try {
        let bannerImagePath, thumbnailImagePath;

        if (req.files && req.files.image) {
            const image = req.files.image;
            const name = 'banner';
            const finalName = name.replace(/\s+/g, '_');
            const desImageDir = `${bannerPath}/${finalName}`;

            if (!fs.existsSync(desImageDir)) {
                fs.mkdirSync(desImageDir, { recursive: true });
            }

            const imageName = image.name.replace(/ /g, '_');
            const originalImagePath = `${desImageDir}/${imageName}`;
            fs.writeFileSync(originalImagePath, image.data);

            const thumbnailDir = `${bannerPath}/thumbnails`;
            if (!fs.existsSync(thumbnailDir)) {
                fs.mkdirSync(thumbnailDir, { recursive: true });
            }

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

            bannerImagePath = `https://salesman.aindriya.co.in/${finalName}/${imageName}`;
          //  thumbnailImagePath = `https://salesman.aindriya.co.in/${URLpathB}/thumbnails/${path.basename(imageName, extension)}.webp`;
        }

        let coinOfferBanner = await CoinOfferBanner.findOne({ viewingOrder });

        if (coinOfferBanner) {
            coinOfferBanner.coin = coin;
            coinOfferBanner.rateInInr = rateInInr;
            coinOfferBanner.text = text;
            coinOfferBanner.status = status;
            coinOfferBanner.viewingOrder = viewingOrder;
            if (bannerImagePath && thumbnailImagePath) {
                coinOfferBanner.bannerImage = bannerImagePath;
            //    coinOfferBanner.thumbnailImage = thumbnailImagePath;
            }
        } else {
            coinOfferBanner = new CoinOfferBanner({
                coin,
                rateInInr,
                text,
                status,
                viewingOrder,
                bannerImage: bannerImagePath,
              //  thumbnailImage: thumbnailImagePath
            });
        }

        await coinOfferBanner.save();
        res.status(200).json({ message: 'Coin offer banner created/updated successfully', coinOfferBanner });
    } catch (err) {
        console.error('An error occurred while creating/updating coin offer banner:', err);
        res.status(500).json({ error: 'An error occurred while creating/updating coin offer banner' });
    }
};

exports.getCoinOfferBanner = async (req,res)=>{
try{
 const coinOfferBanner = await CoinOfferBanner.find();
 res.status(200).json(coinOfferBanner);
}catch(err){
console.log("err--",err)
res.status(500).json({ error: 'An error occurred while fetching the coin offer banner' });
}
}

exports.getCoinOfferBannerById = async (req, res) => {
    const id= req.params.id;
    try {
        const coinOfferBanner = await CoinOfferBanner.findById(id);
        if (!coinOfferBanner) {
            return res.status(404).json({ error: 'Coin offer banner not found' });
        }
        res.status(200).json(coinOfferBanner);
    } catch (err) {
        console.error('An error occurred while fetching the coin offer banner:', err);
        res.status(500).json({ error: 'An error occurred while fetching the coin offer banner' });
    }
};


exports.recordCoinPurchase = async (req, res) => {
  const { userId, amount, coinsPurchased, transactionId, status } = req.body;

  if (!userId || !amount || !coinsPurchased || !transactionId || !status) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Record the transaction
    const transaction = new CoinPurchaseTransaction({
      userId,
      amount,
      coinsPurchased,
      transactionId,
      status
    });

    await transaction.save();

    // Update the user's coin balance
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Increment the user's coin balance
    user.profile.coin += coinsPurchased;
    await user.save();

    res.status(201).json({ message: 'Transaction recorded successfully', transaction });
  } catch (err) {
    console.error('An error occurred while recording the coin purchase:', err);
    res.status(500).json({ error: 'An error occurred while recording the coin purchase' });
  }
};


exports.getTransactionHistory = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    // Fetch transaction history for the user
    const transactions = await CoinPurchaseTransaction.find({ userId }).sort({ transactionDate: -1 });

    res.status(200).json({ transactions });
  } catch (err) {
    console.error('An error occurred while fetching the transaction history:', err);
    res.status(500).json({ error: 'An error occurred while fetching the transaction history' });
  }
};


exports.getCoinTransactionHistory = async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    try {
        // Fetch transaction history for the given userId
        const transactions = await CoinTransactionHistory.find({ userId })
            .sort({ timestamp: -1 }) // Optional: sort by latest transactions first
            .exec();

        if (!transactions.length) {
            return res.status(404).json({ message: 'No transaction history found for this user' });
        }

        res.status(200).json({
            userId,
            transactions
        });
    } catch (err) {
        console.error('An error occurred while fetching coin transaction history:', err);
        res.status(500).json({ error: 'An error occurred while fetching coin transaction history' });
    }
}

exports.buyCoinPackage = async (req, res) => {
  const { userId, packageId } = req.body;

  if (!userId || !packageId) {
    return res.status(400).json({ error: 'userId and packageId are required' });
  }

  try {
    // Fetch the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Fetch the coin package
    const coinPackage = await CoinPackage.findById(packageId);
    if (!coinPackage || !coinPackage.status) {
      return res.status(404).json({ error: 'Coin package not found or inactive' });
    }

    // Update the user's coin balance
    user.profile.coin += coinPackage.coin;
    await user.save();

    // Record the transaction in CoinTransactionHistory
    const transaction = new CoinTransactionHistory({
      userId: user._id,
      type: 'earn',
      coins: coinPackage.coin,
      amountInCurrency: coinPackage.rateInInr,
      description: `Purchased ${coinPackage.coin} coins for ₹${coinPackage.rateInInr}`,
      spendingType: 'coin_purchase'
    });
    await transaction.save();

    res.status(200).json({
      message: 'Coin package purchased successfully',
      user: {
        userId: user._id,
        coins: user.profile.coin,
  //      walletBalance: user.profile.walletBalance // If walletBalance is part of user profile
      },
      transaction: {
        transactionId: transaction._id,
        coins: transaction.coins,
        amountInCurrency: transaction.amountInCurrency,
        description: transaction.description,
        date: transaction.timestamp
      }
    });
  } catch (err) {
    console.error('An error occurred while purchasing the coin package:', err);
    res.status(500).json({ error: 'An error occurred while purchasing the coin package' });
  }
};
