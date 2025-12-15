const { del } = require('../config/database.js');
const Vendor = require('../models/vendor.model.js');
const bcrypt = require('bcryptjs');

class VendorController{

    //  Create new Vendor
    static async createVendor(req,res){
        try {
            const vendorData = req.validatedData;

            const emailExists = await Vendor.emailExists(vendorData.email);
            if(emailExists){
                return res.status(409).json({
                    success: false,
                    message: 'Email already exists'
                })
            }

            if(vendorData.password){
                const salt = await bcrypt.genSalt(10);
                vendorData.password = await bcrypt.hash(vendorData.password,salt);
            }

            // creating user
            const vendor = await Vendor.createVendor(vendorData);

            // remove the pass

            delete vendor.password;

            res.status(201).json({
                success:true,
                message: "Vendor Created Successfully",
                data: vendor
            });

        } catch (error) {
            console.error('Failed Creating Vendor : ',error);
            res.status(500).json({
                success: false,
                message: "Error Creating Vendor",
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

}