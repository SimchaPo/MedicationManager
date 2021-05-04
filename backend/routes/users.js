module.exports = function (passport) {
  const router = require("express").Router();
  //const passport = require("passport");
  let User = require("../models/user.model");

  router.route("/").get((req, res) => {
    User.find()
      .then((users) => res.json(users))
      .catch((err) => res.status(400).json("Error: " + err));
  });

  router.route("/adduser").post(async (req, res) => {
    try {
      console.log("add user:", req.body);
      new User(req.body)
        .save()
        .then(() => res.json("user added!"))
        .catch((err) => res.status(400).json("Error: " + err));
    } catch {
      (err) => res.status(400).json("Error: " + err);
    }
  });

  router.route("/getuserbyid/:id").get((req, res) => {
    User.findById(req.params.id)
      .then((user) => res.json(user))
      .catch((err) => res.status(400).json("Error: " + err));
  });
  router.route("/getuserbyemail/:email").get((req, res) => {
    User.findOne({ email: req.params.email }).then((user) =>
      console.log(user.email)
    );
    User.findOne({ email: req.params.email })
      .then((user) => res.json(user))
      .catch((err) => res.status(400).json("Error: " + err));
  });

  router.route("/delete/:id").delete((req, res) => {
    //console.log("user to delete:", id);
    User.findByIdAndDelete(req.params.id)
      .then((user) => res.json("user deleted."))
      .catch((err) => res.status(400).json("Error: " + err));
  });

  router.route("/update/:id").post((req, res) => {
    User.findById(req.params.id)
      .then((user) => {
        user.userName = req.body.userName;
        user.email = req.body.email;
        user.password = req.body.password;

        user
          .save()
          .then(() => res.json("user updated!"))
          .catch((err) => res.status(400).json("Error: " + err));
      })
      .catch((err) => res.status(400).json("Error: " + err));
  });
  const {
    checkNotAuthenticated,
    checkAuthenticated,
  } = require("../middleware/auth");
  const { render } = require("@testing-library/react");

  router.route("/loggedin").get(checkAuthenticated, (req, res) => {
    console.log("logged");
  });

  router.route("/notloggedin").get(checkNotAuthenticated, (req, res) => {
    console.log("notlogged");
  });

  router.route("/login").post((req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) throw err;
      if (!user) res.send("No User Exists");
      else {
        req.logIn(user, (err) => {
          if (err) throw err;
          res.send("Successfully Authenticated");
        });
      }
    })(req, res, next);
  });

  router.route("/getcuruser").get((req, res) => {
    res.send(req.user); // The req.user stores the entire user that has been authenticated inside of it.
  });
  //router.route("/login").post(
  //  checkNotAuthenticated,
  //  passport.authenticate("local", {
  //    successRedirect: "users/yes",
  //    failureRedirect: "users/no",
  //    failureFlash: true,
  //  })
  //);

  router.route("/yes").get((req, res) => {
    console.log("yes");
  });
  router.route("/no").get((req, res) => {
    console.log("yes");
  });

  router.route("/logout").delete((req, res) => {
    req.logOut();
    res.redirect("/login");
  });

  return router;
};
