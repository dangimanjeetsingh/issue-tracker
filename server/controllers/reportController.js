const Issue = require("../models/Issue");
const User = require("../models/User");

const getAdminOverview = async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).select("_id name email");
    const issues = await Issue.find().populate("assignedTo", "_id name email");

    const now = new Date();
    const totals = {
      totalIssues: issues.length,
      openIssues: 0,
      inProgressIssues: 0,
      closedIssues: 0,
      overdueIssues: 0,
      unassignedIssues: 0
    };

    const issuesByUser = {};
    users.forEach((user) => {
      issuesByUser[user._id.toString()] = {
        userId: user._id,
        name: user.name,
        email: user.email,
        totalAssigned: 0,
        open: 0,
        inProgress: 0,
        closed: 0,
        overdue: 0,
        progressPercent: 0
      };
    });

    for (const issue of issues) {
      if (issue.status === "open") {
        totals.openIssues += 1;
      } else if (issue.status === "in-progress") {
        totals.inProgressIssues += 1;
      } else if (issue.status === "closed") {
        totals.closedIssues += 1;
      }

      const isOverdue = issue.deadline && issue.deadline < now && issue.status !== "closed";
      if (isOverdue) {
        totals.overdueIssues += 1;
      }

      if (!issue.assignedTo) {
        totals.unassignedIssues += 1;
        continue;
      }

      const userKey = issue.assignedTo._id.toString();
      if (!issuesByUser[userKey]) {
        continue;
      }

      const bucket = issuesByUser[userKey];
      bucket.totalAssigned += 1;

      if (issue.status === "open") {
        bucket.open += 1;
      } else if (issue.status === "in-progress") {
        bucket.inProgress += 1;
      } else if (issue.status === "closed") {
        bucket.closed += 1;
      }

      if (isOverdue) {
        bucket.overdue += 1;
      }
    }

    const userProgress = Object.values(issuesByUser).map((row) => ({
      ...row,
      progressPercent:
        row.totalAssigned > 0 ? Math.round((row.closed / row.totalAssigned) * 100) : 0
    }));

    res.json({
      totals,
      userProgress
    });
  } catch (error) {
    res.status(500).json({ message: "Unable to fetch admin analytics.", error: error.message });
  }
};

module.exports = {
  getAdminOverview
};
