const express = require("express");
const { successResponseAppWrapper, appWrapper } = require("../routeWrapper");
const { ACCESS_ROLES } = require("../../businesslogic/accessmanagement/roleConstants");

const router = express.Router({ mergeParams: true });


router.post("/", appWrapper(async (req, res) => {
       
    
    }, [ACCESS_ROLES.ALL])
);

module.exports = router;

