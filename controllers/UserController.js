const User = require("../models/user");
const Post = require("../models/post");

const transporter = require("../config/nodemailer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const UserController = {
  //Endpoint register user
  async register(req, res, next) {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      let imgPath;
      if (req.file) {
        imgPath = req.file.path;
      }
      const user = await User.create({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        img: imgPath, // Agrega el campo de imagen a la base de datos
      });

      const emailToken = jwt.sign(
        { email: req.body.email },
        process.env.JWT_SECRET,
        { expiresIn: "48h" }
      );
      const url = "http://localhost:8080/users/confirm/" + emailToken;

      await transporter.sendMail({
        to: req.body.email,
        subject: "Confirm your registration",
        html: `<h3>Welcome, you're one step away from registering</h3>
                   <a href="${url}">Click to confirm your registration</a>
                  `,
      });

      res.status(201).send({
        message: "We have sent you an email to confirm your registration",
        user,
      });
    } catch (error) {
      next(error);
    }
  },

  // Update a user
  async update(req, res, next) {
    try {
      const authenticatedUserId = req.user._id;
      const userToUpdateId = req.params._id;

      if (authenticatedUserId != userToUpdateId) {
        return res
          .status(403)
          .send({ message: "You do not have permission to update this user" });
      }

      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      let imgPath;
      if (req.file) {
        imgPath = req.file.path;
      }

      const user = await User.findByIdAndUpdate(
        userToUpdateId,
        {
          username: req.body.username,
          email: req.body.email,
          password: hashedPassword,
          img: imgPath,
        },
        { new: true }
      );

      res.send({ message: "User successfully updated", user });
    } catch (error) {
      next(error);
    }
  },

  // confirm register mail
  async confirm(req, res) {
    try {
      const token = req.params.emailToken;
      const payload = jwt.verify(token, process.env.JWT_SECRET);

      await User.updateOne({ email: payload.email }, { confirmed: true });

      res.status(201).send("User successfully confirmed");
    } catch (error) {
      console.error(error);
    }
  },

  // Endpoint login user with token
  async login(req, res) {
    try {
      const user = await User.findOne({
        email: req.body.email,
      });

      if (!user) {
        return res.status(400).send({ message: "Invalid email or password" });
      }
      
      if (!user.confirmed) {
        return res
          .status(401)
          .send({ message: "It is necessary to confirm your email" });
      }

      
      const passwordMatch = await bcrypt.compare(
        req.body.password,
        user.password
      );

      if (!passwordMatch) {
        return res.status(400).send({ message: "Invalid email or password" });
      }

      // Agregar lógica para verificar contraseña y generar token de acceso

      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

      if (user.tokens.length > 4) user.tokens.shift();
      user.tokens.push(token);
      await user.save();

      res.status(200).send({ message: "Welcome " + user.username, token });
    } catch (error) {
      console.error(error);
    }
  },

  // Endpoint logout user
  async logout(req, res) {
    try {
      await User.findByIdAndUpdate(req.user._id, {
        $pull: { tokens: req.headers.authorization },
      });

      res.send({ message: `Logged out successfully ${req.user.username}` });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "There was a problem trying to log out the user",
      });
    }
  },

  // Endpoint get authenticated user
  async getUser(req, res) {
    try {
      const user = {
        email: req.user.email,
        username: req.user.username,
        password: req.user.password,
      };
      res.send(user);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ error: "An error occurred while getting user information" });
    }
  },

  // get user by Id
  async getById(req, res, next) {
    try {
      const user = await User.findById(req.params._id);
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }
      res.send(user);
    } catch (error) {
      next(error);
    }
  },

  // get user by Username
  async getByUsername(req, res, next) {
    try {
      const users = await User.find({
        username: { $regex: req.params.username, $options: "i" },
      });
      if (!users || users.length === 0) {
        return res.status(404).send({ message: "User not found" });
      }
      res.send(users);
    } catch (error) {
      next(error);
    }
  },

  //To follow a user
  async follow(req, res) {
    try {
      const user = await User.findById(req.params._id);

      if (user.followers.includes(req.user._id)) {
        return res
          .status(400)
          .send({ message: "You already follow this user" });
      }

      user.followers.push(req.user._id);
      await user.save();

      await User.findByIdAndUpdate(
        req.user._id,
        { $push: { following: req.params._id } },
        { new: true }
      );

      res
        .status(200)
        .send({ message: `Now you are following ${user.username}`, user });
    } catch (error) {
      console.error(error);

      res.status(500).send({ message: "There was a problem with your follow" });
    }
  },

  // Remove follow from user, only remove own follow
  async unfollow(req, res) {
    try {
      const user = await User.findById(req.params._id);

      if (!user.followers.includes(req.user._id)) {
        return res
          .status(400)
          .send({ message: "You are not following this user" });
      }

      user.followers = user.followers.filter(
        (follower) => follower.toString() !== req.user._id.toString()
      );
      await user.save();

      await User.findByIdAndUpdate(
        req.user._id,
        { $pull: { following: req.params._id } },
        { new: true }
      );

      res
        .status(200)
        .send({ message: `Now you are not following ${user.username}`, user });
    } catch (error) {
      console.error(error);

      res
        .status(500)
        .send({ message: "There was a problem unfollowing the user" });
    }
  },

  // get loged user with post and followers and number of both
  async getUserFollowers(req, res) {
    try {
      const user = await User.findById(req.user._id);
      const posts = await Post.find({ author: req.user._id });
      const followers = user.followers.length;

      res.status(200).json({ user, posts, followers });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "There was a problem getting the current user" });
    }
  },

  async getUserFollowersInfo(req, res) {
    try {
      const user = await User.findById(req.user._id).populate(
        "followers",
        "username"
      );
      const posts = await Post.find({ author: req.user._id });
      const followers = user.followers.length;
      const followerNames = user.followers.map((follower) => follower.username);

      res.status(200).json({ user, posts, followers, followerNames });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "There was a problem getting the user info" });
    }
  },

  async recoverPassword(req, res) {
    try {
      const recoverToken = jwt.sign(
        { email: req.params.email },
        process.env.JWT_SECRET,
        {
          expiresIn: "48h",
        }
      );
      const url = "http://localhost:8080/users/resetPassword/" + recoverToken;
      await transporter.sendMail({
        to: req.params.email,
        subject: "Recover Password",
        html: `<h3> Recover Password </h3>
      <a href="${url}">Recover Password</a>
      The link will expire in 48 hours`,
      });
      res.send({
        message: "A recovery email was sent to your email address",
      });
    } catch (error) {
      console.error(error);
    }
  },

  async resetPassword(req, res) {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const recoverToken = req.params.recoverToken;
      const payload = jwt.verify(recoverToken, process.env.JWT_SECRET);
      await User.findOneAndUpdate(
        { email: payload.email },
        { password: hashedPassword }
      );
      res.send({ message: "Password changed successfully" });
    } catch (error) {
      console.error(error);
    }
  },
};

module.exports = UserController;
