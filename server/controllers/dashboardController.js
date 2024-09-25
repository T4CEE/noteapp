const Note = require("../models/Notes");
const mongoose = require("mongoose");

exports.dashboard = async (req, res) => {
  let perPage = 12;
  let page = req.query.page || 1;

  const locals = {
    title: "Dashboard",
    description: "My Note App",
  };

  try {
    const notes = await Note.aggregate([
      { $sort: { updatedAt: -1 } },
      { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },
      {
        $project: {
          title: { $substr: ["$title", 0, 30] },
          body: { $substr: ["$body", 0, 100] },
        },
      },
    ])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();

    const count = await Note.countDocuments();

    res.render("dashboard/index", {
      userName: req.user.firstName,
      locals,
      notes,
      layout: "../views/layouts/dashboard",
      current: page,
      pages: Math.ceil(count / perPage),
    });
  } catch (error) {
    console.log(error);
  }
};

// GET SPECIFIC NOTE

exports.dashboardViewNote = async (req, res) => {
  const note = await Note.findById({ _id: req.params.id })
    .where({ user: req.user.id })
    .lean();

  if (!note) {
    throw new CastError("ObjectId", req.user.id, "_id", "Note not found", this);
  }

  res.render("dashboard/view-note", {
    noteID: req.params.id,
    note,
    layout: "../views/layouts/dashboard",
  });
};

// GET UPDATE NOTE

exports.dashboardUpdateNote = async (req, res) => {
  try {
    await Note.findOneAndUpdate(
      { _id: req.params.id },
      { title: req.body.title, body: req.body.body, updatedAt: Date.now() }
    ).where({ user: req.user.id });
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
};

//DELETE NOTE
exports.dashboardDeleteNote = async (req, res) => {
  try {
    await Note.findByIdAndDelete({ _id: req.params.id }).where({
      user: req.user.id,
    });
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
};

// CREATE NOTE
exports.dashboardAddNote = async (req, res) => {
  res.render("dashboard/add", {
    layout: "../views/layouts/dashboard",
  });
};

// POST CREATE NOTE
exports.dashboardAddNoteSubmit = async (req, res) => {
  try {
    req.body.user = req.user.id;
    await Note.create(req.body);
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
};
//OPTION 2: CREATE NOTE
// exports.dashboardCreateNote = async (req, res) => {
//   const newNote = new Note({
//     title: req.body.title,
//     body: req.body.body,
//     user: req.user.id,
//   });

//   try {
//     await newNote.save();
//     res.redirect("/dashboard");
//   } catch (error) {
//     console.log(error);
//   }
// };
