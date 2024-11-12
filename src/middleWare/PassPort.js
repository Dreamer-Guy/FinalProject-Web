import { Strategy } from "passport-local";
import { hashPassword, comparePlainAndHashed } from "../utils/hashAndCompare.js";
import serviceFactory from "../Factory/serviceFactory.js";
import passport from "passport";
import { raw } from "express";
const userService = serviceFactory.getUserService();
const localStrategy = new Strategy(async (username, password, done) => {
    try {
        const user = await userService.getUserByEmailOrUsername(username);
        if (!user) {
            return done(null, false, { message: 'User not found' });
        }
        const isMatch = await comparePlainAndHashed(password, user.password);
        if (!isMatch) {
            return done(null, false, { message: 'Invalid password' });
        }
        return done(null, user);
    } catch (err) {
        return done(err);
    }
});


passport.use(localStrategy);

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        //console.log("deserializeUser\n\n\n\n", id);
        const rawUser = await userService.getUserById(id);
        const user={
            _id:rawUser._id.toString(),
            fullName:rawUser.fullName,
            userName:rawUser.userName,
            role:rawUser.role,
        }
        done(null, user);
    } catch (err) {
        done(err);
    }
});
export default passport;