const Vendor = require('../models/vendor.model.js');

class VendorController {

  // =========================
  // Create Vendor
  // =========================
  static async createVendor(req, res) {
    try {
      const vendorData = req.validatedData;

      // Check email uniqueness
      const emailExists = await Vendor.emailExists(vendorData.email);
      if (emailExists) {
        return res.status(409).json({
          success: false,
          message: 'Email already exists'
        });
      }

      const vendor = await Vendor.createVendor(vendorData);

      res.status(201).json({
        success: true,
        message: 'Vendor created successfully',
        data: vendor
      });

    } catch (error) {
      console.error('Create vendor error:', error);
      res.status(500).json({
        success: false,
        message: 'Error creating vendor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // =========================
  // Get All Vendors
  // =========================
  static async getAllVendors(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const result = await Vendor.findAll(page, limit);

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

  // =========================
  // Get Vendor by ID
  // =========================
  static async getVendorById(req, res) {
    try {
      const vendorId = parseInt( req.params.id)
      

      const vendor = await Vendor.findVendorById(vendorId);
      if (!vendor) {
        return res.status(404).json({
          success: false,
          message: 'Vendor not found'
        });
      }

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

  // =========================
  // Update Vendor
  // =========================
  static async updateVendor(req, res) {
    try {
      const vendorId = req.params.id;
      const updateData = req.validatedData;

      const existingVendor = await Vendor.findVendorById(vendorId);
      if (!existingVendor) {
        return res.status(404).json({
          success: false,
          message: 'Vendor not found'
        });
      }

      // Email uniqueness check
      if (
        updateData.email &&
        updateData.email !== existingVendor.email
      ) {
        const emailExists = await Vendor.emailExists(updateData.email);
        if (emailExists) {
          return res.status(409).json({
            success: false,
            message: 'Email already exists'
          });
        }
      }

      const updatedVendor = await Vendor.updateVendor(vendorId, updateData);

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

  // =========================
  // Delete Vendor (Hard Delete)
  // =========================
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

      await Vendor.deleteVendor(vendorId);

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
