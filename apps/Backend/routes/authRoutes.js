const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");

async function mailer(reciveremail, code) {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,

    secure: false,
    requireTLS: true,
    auth: {
      user: process.env.NodeMailer_email,
      pass: process.env.NodeMailer_password,
    },
  });

  let info = await transporter.sendMail({
    from: "GeekChat",
    to: `${reciveremail}`,
    subject: "Email Verification",
    text: `Your Verification Code is ${code}`,
    html: `<b>Your Verification Code is ${code}</b>`,
  });
  console.log("Message Sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

router.post("/verify", (req, res) => {
  console.log("sent by client", req.body);
  const { email } = req.body;

  if (!email) {
    return res.status(422).json({ error: "Please add all fields" });
  }
  User.findOne({ email: email }).then(async (savedUser) => {
    if (savedUser) {
      return res.status(422).json({ error: "Invalid Credentials" });
    }
    try {
      let verificationCode = Math.floor(100000 + Math.random() * 900000);
      await mailer(email, verificationCode);
      console.log("Verification Code", verificationCode);
      res.send({
        message: "Verification code sent to your Email",
        verificationCode,
        email,
      });
    } catch (err) {
      console.log(err);
    }
  });
});

router.post("/signup", async (req, res) => {
  const { username, password, email } = req.body;
  if (!username || !password || !email) {
    return res.status(422).json({ error: "Please add all the fields" });
  } else {
    const user = new User({
      username,
      email,
      password,
    });

    try {
      await user.save();
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
      return res
        .status(200)
        .json({ message: "User Registered Successfully", token });
    } catch (err) {
      console.log(err);
      return res.status(422).json({ error: "User Not Registered" });
    }
  }
});

router.post("/verifyfp", (req, res) => {
  console.log("sent by client", req.body);
  const { email } = req.body;

  if (!email) {
    return res.status(422).json({ error: "Please add all the fields" });
  }

  User.findOne({ email: email }).then(async (savedUser) => {
    if (savedUser) {
      try {
        let VerificationCode = Math.floor(100000 + Math.random() * 900000);
        await mailer(email, VerificationCode);
        console.log("Verification Code", VerificationCode);
        res.send({
          message: "Verification Code Sent to your Email",
          VerificationCode,
          email,
        });
      } catch (err) {
        console.log(err);
      }
    } else {
      return res.status(422).json({ error: "Invalid Credentials" });
    }
  });
});

router.post("/resetpass", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ error: "Please Enter Required Fields!!!!" });
  } else {
    User.findOne({ email: email }).then(async (savedUser) => {
      if (savedUser) {
        savedUser.password = password;
        savedUser
          .save()
          .then((user) => {
            res.json({ message: "Password Updated Succefully!!!!" });
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        res.status(422).json({ error: "Invalid Credential" });
      }
    });
  }
});

router.post("/changeusername", (req, res) => {
  const { username, email } = req.body;

  User.find({ username }).then((savedUser) => {
    if (savedUser.length > 0) {
      return res.status(422).json({ error: "Username Already Exist" });
    } else {
      return res
        .status(200)
        .json({ message: "Username Available", username, email });
    }
  });
});

router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ error: "Please add all the fields" });
  } else {
    User.findOne({ email: email })
      .then((savedUser) => {
        if (!savedUser) {
          return res.status(422).json({ error: "Invalid Credentials" });
        } else {
          console.log(savedUser);
          bcrypt.compare(password, savedUser.password).then((doMatch) => {
            if (doMatch) {
              const token = jwt.sign(
                { _id: savedUser._id },
                process.env.JWT_SECRET
              );

              const { _id, username, email } = savedUser;

              res.json({
                message: "Successfully Signed In",
                token,
                user: { _id, username, email },
              });
            } else {
              return res.status(422).json({ error: "Invalid Credentials" });
            }
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

module.exports = router;