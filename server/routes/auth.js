const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/User");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
    },

    async function(accessToken, refreshToken, profile, done) {
      //   User.findOrCreate({ googleId: profile.id }, function(err, user) {
      //     return cb(err, user);
      //   });
      //   console.log(profile);

      const newUser = {
        googleId: profile.id,
        displayName: profile.displayName,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        profileImage: profile.photos[0].value,
      };

      try {
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          done(null, user);
        } else {
          user = await User.create(newUser);
          done(null, user);
        }
      } catch (error) {
        console.log(error);
      }
    }
  )
);

//Google Login Route
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

//Retrieve user Data
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/",
    successRedirect: "/dashboard",
  })
);

// optional route if something goes wrong

// app.use('/redirect-page', (req, res) =>{
//     res.redirect(req.('/redirect-page'));
// })

//Destroy user session
router.get("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      // req.logout();
      console.log("error logging out");
    } else {
      res.redirect("/");
    }
  });
});

//retrieve user after successful authentication
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

//retrieve user data from session
// passport.deserializeUser(function(id, done) {
//   User.findById(id, function(err, user) {
//     done(err, user);
//   });
// });

passport.deserializeUser(async function(id, done) {
  try {
    const user = await User.findById(id);
    done(null, user); // No error, pass the user to `done()`
  } catch (err) {
    done(err); // Pass the error to `done()`
  }
});

module.exports = router;
