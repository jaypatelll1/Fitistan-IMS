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

  // Get all vendors with pagination
  static async getAllVendors(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search || '';

      const result = await Vendor.findAll(page, limit, { search });

      res.status(200).json({
        success: true,
        ...result
      });
    } catch (error) {
      console.error('Get vendors error:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching vendors',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

   // Get vendor by ID
  static async getVendorById(req, res) {
    try {
      const vendorId = req.params.id;
      const vendor = await Vendor.findVendorById(vendorId);

      if (!vendor) {
        return res.status(404).json({
          success: false,
          message: 'Vendor not found'
        });
      }

      // Remove password from response
      delete vendor.password;

      res.status(200).json({
        success: true,
        data: vendor
      });
    } catch (error) {
      console.error('Get vendor error:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching vendor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

    // Update vendor
  static async updateVendor(req, res) {
    try {
      const vendorId = req.params.id;
      const updateData = req.validatedData;

      // Check if vendor exists
      const existingVendor = await Vendor.findVendorById(vendorId);
      if (!existingVendor) {
        return res.status(404).json({
          success: false,
          message: 'Vendor not found'
        });
      }

      // Check email uniqueness if email is being updated
      if (updateData.email && updateData.email !== existingVendor.email) {
        const emailExists = await Vendor.emailExists(updateData.email, vendorId);
        if (emailExists) {
          return res.status(409).json({
            success: false,
            message: 'Email already exists'
          });
        }
      }

      const updatedVendor = await Vendor.updateVendor(vendorId, updateData);
      delete updatedVendor.password;

      res.status(200).json({
        success: true,
        message: 'Vendor updated successfully',
        data: updatedVendor
      });
    } catch (error) {
      console.error('Update vendor error:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating vendor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Delete vendor (soft delete)
  static async deleteVendor(req, res) {
    try {
      const vendorId = req.params.id;

      const vendor = await Vendor.findVendorById(vendorId);
      if (!vendor) {
        return res.status(404).json({
          success: false,
          message: 'Vendor not found'
        });
      }

      await Vendor.softDeleteVendor(vendorId);

      res.status(200).json({
        success: true,
        message: 'Vendor deleted successfully'
      });
    } catch (error) {
      console.error('Delete vendor error:', error);
      res.status(500).json({
        success: false,
        message: 'Error deleting vendor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = VendorController;
