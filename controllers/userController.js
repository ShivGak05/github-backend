const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { MongoClient, ObjectId } = require("mongodb");
const dotenv = require("dotenv");
const User=require("../models/UserModel.js");
dotenv.config();

let client;
const mongo_url = process.env.MONGO_URL;

async function ConnectClient() {
  if (!client) {
    client = new MongoClient(mongo_url); // Removed deprecated options
    await client.connect();
  }
}

// ------------------ Get All Users ------------------ //
const getAllUsers = async (req, res) => {
  try {
    await ConnectClient();
    const db = client.db("githubclone");
    const usersCollection = db.collection("users");
    const users = await usersCollection.find({}).toArray();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ------------------ Signup ------------------ //
const signup = async (req, res) => {
  const { username, password, email } = req.body;
  if (!username || !email || !password) {
  return res.status(400).json({ message: "Missing fields" });
}

  try {
    await ConnectClient();
    const db = client.db("githubclone");
    const usersCollection = db.collection("users"); // ✅ FIXED
    const user = await usersCollection.findOne({ username });

    if (user) {
      return res.status(400).json({ message: "User already exists!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      username,
      password: hashedPassword,
      email,
      repositories: [],
      followedUsers: [],
      starRepos: [],
    };

    const result = await usersCollection.insertOne(newUser);

    const token = jwt.sign(
      { id: result.insertedId },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.json({ token, userId: result.insertedId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ------------------ Login ------------------ //
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    await ConnectClient();
    const db = client.db("githubclone");
    const usersCollection = db.collection("users"); // ✅ FIXED

    const user = await usersCollection.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.json({ token, userId: user._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ------------------ Update User Profile ------------------ //
const updateUserProfile = async (req, res) => {
  const id = req.params.id;
  const { email, password, oldPassword } = req.body;

  try {
    await ConnectClient();
    const db = client.db("githubclone");
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ _id: new ObjectId(id) });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // If password change is requested, verify oldPassword
    if (password) {
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Old password is incorrect" });
      }
    }

    const updateFields = { email };
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updateFields.password = hashedPassword;
    }

    const result = await usersCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateFields },
      { returnDocument: "after" }
    );

    res.json({
      message: "Profile updated successfully",
      user: result.value,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// ------------------ Delete User Profile ------------------ //
const deleteUserProfile = async (req, res) => {
  const currentId = req.params.id;
  try {
    await ConnectClient();
    const db = client.db("githubclone");
    const usersCollection = db.collection("users");

    const result = await usersCollection.deleteOne({ _id: new ObjectId(currentId) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ------------------ Get User Profile ------------------ //
const getUserProfile = async (req, res) => {
  const { id } = req.params; // ✅ extract id string

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    await ConnectClient();
    const db = client.db("githubclone");
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ _id: new ObjectId(id) }); // ✅ correct type

    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    res.status(200).json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

//-------------------------handleFollow------------------------//
const handleFollow = async (req, res) => {
  const { id, userId } = req.params;

  if (!id || !userId) {
    return res.status(400).json({ message: "Invalid request parameters" });
  }

  try {
    await ConnectClient();
    const db = client.db("githubclone");
    const usersCollection = db.collection("users");

    const currentUser = await usersCollection.findOne({ _id: new ObjectId(id) });
    if (!currentUser) {
      return res.status(404).json({ message: "Current user not found" });
    }

    const isFollowing = currentUser.followedUsers?.includes(userId);

    let update;
    if (isFollowing) {
      // Unfollow
      update = await usersCollection.updateOne(
        { _id: new ObjectId(id) },
        { $pull: { followedUsers: userId } }
      );
    } else {

      update = await usersCollection.updateOne(
        { _id: new ObjectId(id) },
        { $addToSet: { followedUsers: userId } }
      );
    }

    if (update.modifiedCount === 0) {
      return res.status(500).json({ message: "Failed to update follow status" });
    }

    res.json({
      message: isFollowing ? "User unfollowed successfully" : "User followed successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
/////////////////////////following///////////////////////
const followUser=async(req,res)=>{
  try {
    const user = await User.findById(req.params.id).populate("followedUsers", "username _id");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.followedUsers);
  } catch (err) {
    console.error("Error fetching following users:", err);
    res.status(500).json({ message: "Server error" });
  }
}
module.exports = {
  getAllUsers,
  login,
  signup,
  deleteUserProfile,
  updateUserProfile,
  getUserProfile,
  handleFollow,
  followUser
};
