const express = require("express");
const { expressjwt: jwt } = require("express-jwt");
const { RES_LOCALS } = require("./constant");
const Router = express.Router();
const openRouter = express.Router();
const AccessPermissionError = require("../../errorhandlers/AccessPermissionError");
const UserModel = require("../../models/UserModel");
const AuthenticationError = require("../../errorhandlers/AuthenticationError");



// openRouter 
const authenticationRouter = require("../controllers/authenticationRouter")

const shelf = require("../controllers/shelfRouter")


class RouteMap {
    static setupRoutesAndAuth(app) {


        app.use(
            "/api",
             ...RouteMap._setupAuth(),
            RouteMap._addUserInformation,
           
            Router
        );
        // router.use("/common_registration", commonRegistrationRouter);
        // Router.use("/shelf", shelf );

    

        app.get('/meow', (req, res) => {
            res.json({ 'meow': 'meow' });
        });

      

        app.use("/open/api", openRouter);

        openRouter.use("/authentication", authenticationRouter);
         openRouter.use("/shelf", shelf );


        app.use((req, res, next) => {
            const referer = req.headers['referer'] ? req.headers['referer'] : "-";
            console.error(`Invalid route accessed: ${req.originalUrl} ${referer}`);
            res.status(404).json({
                error: 'Specified path not found',
            });
        });
    }

    static _setupAuth() {
        const attachLocals = (req, res, next) => {
            req._locals = res.locals;
            next();
        };

        const getDynamicSecret = (req, payload, done) => {
            try {
                const locals = req._locals || {};
                // Example: choose secret based on a value in res.locals
                let secret = process.env.JWT_SECRET_KEY;
                if (locals && locals.userInfo && locals.userInfo.roles && locals.userInfo.roles.length) {
                    secret = process.env.JWT_SECRET_KEY_1;
                }
                done(null, secret);
            } catch (err) {
                done(err);
            }
        };
        const authJwt = jwt({
            secret: getDynamicSecret,
            algorithms: ["HS256"],
            getToken: (req) => {
                if (req.headers["authorization"]) {
                    const authorizationHeader = req.headers["authorization"];
                    return authorizationHeader.split(" ")[1];
                }
            }
        });
        // return authJwt.unless({ path: [] })
        // next();

        
        return [
            attachLocals,
            authJwt.unless({ path: [] }),
            (err, req, res, next) => {
                if (err.name === "UnauthorizedError") {
                    return res.status(401).json({ error: "Invalid or missing token" });
                }
                next();
            }
        ]
    }

    static async _addUserInformation(req, res, next) {
        let jwtToken;
        if (req.headers["authorization"]) {
            jwtToken = req.headers["authorization"].split(" ")[1];
        } else {
            next(new AccessPermissionError());
            return;
        }
        console.log("this is a jet token ",jwtToken)

        const userModel = new UserModel() ;
        let secret = process.env.JWT_SECRET_KEY;
        let userRoles;

        try {
            const decodedPayload = JwtUtilities.decodeJWT(jwtToken);
            console.log(jwtToken)
            console.log(decodedPayload)
            userRoles = decodedPayload && decodedPayload['user'] && decodedPayload['user']['user_id'] ? await userModel.getUserRoleById({ userId: decodedPayload['user']['user_id'] }) : null;
conso;le.log("user roles",userRoles)
            if (userRoles && userRoles.length) {
                console.log("different secret used");
                secret = process.env.JWT_SECRET_KEY_1;
            }
        } catch (err) {
            console.error("Error decoding JWT:", err);
        }

        try {
            let payload;
            try {
                payload = JwtUtilities.verifyJWT(jwtToken, secret);
            } catch (err) {
                next(new AuthenticationError("Invalid Token"));
            }

            const payloadUser = payload["user"];
            const userId = payloadUser["user_id"];


            const userInformation = await userModel.getDetailedUserById({ userId });

            if (!userInformation) {
                next(new AccessPermissionError());
                return;
            }

            const user = {
                "user_id": userInformation["user_id"],
                "name": userInformation["user_name"],
                "email_id": userInformation["email_id"],
                "mobile_number": userInformation["mobile_number"]
            };




            res.locals[RES_LOCALS.USER_INFO.KEY] = { user, roles: userRoles, organization, organizations: userOrganizations };
            next();
        } catch (err) {
            console.error("JWT Verification Error:", err);
            next(new AccessPermissionError());
        }
    }


}

module.exports = RouteMap;
