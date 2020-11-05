const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mangoose = require("mongoose");
const keys = require("../config/keys");
const User = mangoose.model("users");

const option = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: keys.jwt
}

module.exports = passport => {
    passport.use(
        new JwtStrategy(option, async (payload, done) => {
            try {
                const user = await User.findById(payload.userId).select("email id");
                if (user) {
                    done(null, user);
                } else {
                    done(null, false);
                }
            } catch (error) {
                console.log(e);
            }
        })
    );
}