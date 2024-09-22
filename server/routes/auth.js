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
        googgleId: profile.id,
        displayName: profile.displayName,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        profileImage: profile.photos[0].value,
      };

      try {
        let user = await findOne({ googleId: profile.id });

        if (user) {
          done(null, user);
        } else {
          user.create = await User.create(newUser);
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
passport.serializeUser(function(req, res) {
  document(null, user.id);
});

//retrieve user data from session
passport.deserializeUser(function(req, res) {
  User.FindById(id, function(err, user) {
    done(err, user);
  });
});

module.exports = router;
