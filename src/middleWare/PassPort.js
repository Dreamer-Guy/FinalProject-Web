import userService from "../User/mockService.js";
import { Strategy } from "passport-local";
import { hashPassword, comparePlainAndHashed } from "../utils/hashAndCompare.js";
import passport from "passport";
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
    console.log("serializeUser", user);
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        console.log("deserializeUser\n\n\n\n", id);
        const user = await userService.getUserById(id);
        const populatedUser={
            _id:user._id,
            fullName:user.fullName,
            userName:user.userName,
            role:user.role,
        }
        done(null, user);
    } catch (err) {
        done(err);
    }
});
export default passport;