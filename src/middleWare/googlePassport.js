import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";
import dotenv from "dotenv";
import serviceFactory from "../Factory/serviceFactory.js";
import { hashPassword, comparePlainAndHashed } from "../utils/hashAndCompare.js";
const userService = serviceFactory.getUserService();

dotenv.config();

const googleStrategyConfig = new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    scope: ["profile", "email"],
},
    async function (accessToken, refreshToken, profile, cb) {
        // fullname: profile.displayName;
        //userName: profile.emails[0].value+profile.id;
        //password: profile.id;
        // avatar: profile.photos[0].value;
        // email: profile.emails[0].value;
        if(await userService.isUserExistByEmail(profile.emails[0].value) && !await userService.isUserExistByUserName(profile.emails[0].value+profile.id)){
            return cb(null, null,{message:"Email already exists"});
        }
        if(await userService.isUserExistByUserName(profile.emails[0].value+profile.id)){
            const user=await userService.getUserByUserName(profile.emails[0].value+profile.id);
            if (user.status === "locked") {
                return cb(null, null);
            }
            return cb(null, user);
        };
        try {
            const newUserData={
                fullName: profile.displayName,
                userName: profile.emails[0].value+profile.id,
                password: await hashPassword(profile.id),
                avatar: profile.photos[0].value,
                email: profile.emails[0].value,
            };
            const newUser=await userService.createUser(newUserData);
            const user=await userService.saveUser(newUser);
            return cb(null, user);
        }
        catch (err) {
            return cb(err, null);
        }
    });

passport.use(googleStrategyConfig);

// Serialize user into the session
passport.serializeUser((user, done) => {
    done(null, user._id);
});

// Deserialize user from the session
passport.deserializeUser(async(id, done) => {
    const rawUser = await userService.getUserById(id);
    const user={
        _id:rawUser._id.toString(),
        fullName:rawUser.fullName,
        userName:rawUser.userName,
        avatar:rawUser.avatar,
        email:rawUser.email,
        role:rawUser.role,
    }
    done(null, user);
});


export default passport;