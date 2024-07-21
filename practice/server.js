const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');  // For generating JSON Web Tokens

const app = express();
const port = 8000;

// MongoDB connection string for Kuruwa database
const mongoUri = 'mongodb://localhost:27017/Kuruwa';

mongoose.connect(mongoUri)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));

// Define a User schema and model
const userSchema = new mongoose.Schema({
    firstName: String,
    middleName: String,
    lastName: String,
    mobileNo: String,
    altContactNo: String,
    email: String,
    dobBs: Date,
    dobAd: Date,
    gender: String,
    nationality: String,
    citizenshipNo: String,
    citizenshipIssuedFrom: Date,
    citizenshipIssuedDateBs: Date,
    citizenshipIssuedDateAd: Date,
    citizenshipFrontPhoto: String,
    citizenshipBackPhoto: String,
    individualPhotoWithCitizenship: String,
    policeReport: String,
    password: String
});

const User = mongoose.model('User', userSchema);

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Create uploads directory if it does not exist
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Signup route
app.post('/signup', upload.fields([
    { name: 'citizenship-front-photo', maxCount: 1 },
    { name: 'citizenship-back-photo', maxCount: 1 },
    { name: 'individual-photo-with-citizenship', maxCount: 1 },
    { name: 'police-report', maxCount: 1 }
]), async (req, res) => {
    const {
        'first-name': firstName,
        'middle-name': middleName,
        'last-name': lastName,
        'mobile-no': mobileNo,
        'alt-contact-no': altContactNo,
        'email': email,
        'dob-bs': dobBs,
        'dob-ad': dobAd,
        'gender': gender,
        'nationality': nationality,
        'citizenship-no': citizenshipNo,
        'citizenship-issued-from': citizenshipIssuedFrom,
        'citizenship-issued-date-bs': citizenshipIssuedDateBs,
        'citizenship-issued-date-ad': citizenshipIssuedDateAd,
        'password': password,
        'confirm-password': confirmPassword
    } = req.body;

    const {
        'citizenship-front-photo': citizenshipFrontPhoto,
        'citizenship-back-photo': citizenshipBackPhoto,
        'individual-photo-with-citizenship': individualPhotoWithCitizenship,
        'police-report': policeReport
    } = req.files;

    if (!firstName || !lastName || !mobileNo || !email || !dobBs || !dobAd || !gender || !nationality || !citizenshipNo || !citizenshipIssuedFrom || !citizenshipIssuedDateBs || !citizenshipIssuedDateAd || !password || !confirmPassword) {
        return res.status(400).send('Required fields are missing');
    }

    if (password !== confirmPassword) {
        return res.status(400).send('Passwords do not match');
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            firstName,
            middleName,
            lastName,
            mobileNo,
            altContactNo,
            email,
            dobBs: new Date(dobBs),
            dobAd: new Date(dobAd),
            gender,
            nationality,
            citizenshipNo,
            citizenshipIssuedFrom: new Date(citizenshipIssuedFrom),
            citizenshipIssuedDateBs: new Date(citizenshipIssuedDateBs),
            citizenshipIssuedDateAd: new Date(citizenshipIssuedDateAd),
            citizenshipFrontPhoto: citizenshipFrontPhoto ? citizenshipFrontPhoto[0].filename : null,
            citizenshipBackPhoto: citizenshipBackPhoto ? citizenshipBackPhoto[0].filename : null,
            individualPhotoWithCitizenship: individualPhotoWithCitizenship ? individualPhotoWithCitizenship[0].filename : null,
            policeReport: policeReport ? policeReport[0].filename : null,
            password: hashedPassword
        });

        await newUser.save();
        res.send('Signup successful');
    } catch (error) {
        console.error('Error saving user:', error);
        res.status(500).send('Internal server error');
    }
});

// Login route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send('Email and password are required');
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).send('Invalid email');
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(401).send('Invalid password');
        }

        // Generate a JWT token
        const token = jwt.sign({ userId: user._id }, 'your_jwt_secret_key', { expiresIn: '1h' });

        // Redirect to a new page
        res.redirect('/index.html'); // Adjust this path as needed

    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).send('Internal server error');
    }
});


app.listen(port, () => {
    console.log(Server running at http://localhost:${port});
});
