const mongoose = require("mongoose");
const Issue = require("../models/IssueModel.js");

// --------------------------- Create Issue --------------------------- //
const createissue = async (req, res) => {
  const { title, description } = req.body;
  const { id } = req.params; // repo id

  try {
    if (!title) {
      return res.status(400).json({ message: "Title is required!" });
    }

    const newIssue = new Issue({
      title,
      description,
      repository: id,
    });

    await newIssue.save();
    res.status(201).json(newIssue);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ------------------------ Update Issue by ID ------------------------ //
const updateissuebyid = async (req, res) => {
  const { id } = req.params; // issue id
  const { title, description, status } = req.body;

  try {
    const issue = await Issue.findById(id);
    if (!issue) {
      return res.status(404).json({ error: "Issue not found" });
    }

    if (title !== undefined) issue.title = title;
    if (description !== undefined) issue.description = description;
    if (status !== undefined) issue.status = status;

    await issue.save();
    res.json(issue);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ------------------------ Delete Issue by ID ------------------------ //
const deleteissuebyid = async (req, res) => {
  const { id } = req.params;

  try {
    const issue = await Issue.findByIdAndDelete(id);
    if (!issue) {
      return res.status(404).json({ error: "Issue not found for deletion" });
    }

    res.json({ message: "Issue deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ------------------------ Get All Issues for Repo ------------------------ //
const getallissues = async (req, res) => {
  const { id } = req.params; // repo id

  try {
    const issues = await Issue.find({ repository: id });

    // if (!issues || issues.length === 0) {
    //   return res.status(404).json({ message: "No issues found for this repo" });
    // }

    return res.json({issues});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ------------------------ Get Issue by ID ------------------------ //
const getissuebyid = async (req, res) => {
  const { id } = req.params; // issue id

  try {
    const issue = await Issue.findById(id);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    res.json({issue});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  createissue,
  deleteissuebyid,
  updateissuebyid,
  getissuebyid,
  getallissues,
};
