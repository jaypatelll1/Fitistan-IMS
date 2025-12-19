// const { func } = require('joi'); 
const knex = require('../config/database.js');
const { PUBLIC_SCHEMA, TABLE_DEFAULTS } = require('./libs/dbConstants.js');

const { UPDATED_AT } = TABLE_DEFAULTS.COLUMNS;

class Vendor {

  static get tableName() {
    return 'vendors';
  }

  static get schema() {
    return PUBLIC_SCHEMA;
  }

  
  // Create Vendor
  
  static async createVendor(vendorData) {
    const [vendor] = await knex(this.tableName)
      .withSchema(this.schema)
      .insert({
        vendor_name: vendorData.vendor_name,
        // contact_person: vendorData.contact_person,
        email: vendorData.email,
        phone: vendorData.phone,
        address: vendorData.address
      })
      .returning('*');

    return vendor;
  }

  
  // Find Vendor by ID

  static async findVendorById(vendorId) {
    return await knex(this.tableName)
      .withSchema(this.schema)
      .where({ vendor_id: vendorId ,
        is_deleted: false
      })
      .first();
  }

  
  // Find Vendor by Email
  
  static async findVendorByEmail(vendorEmail) {
    return await knex(this.tableName)
      .withSchema(this.schema)
      .where({ email: vendorEmail,is_deleted: false
        
       })
      .first();
  }

  
  // Get All Vendors
 
  static async findAll(page = 1, limit = 10, filters = {}) {
    const offset = (page - 1) * limit;

    let query = knex(this.tableName)
      .withSchema(this.schema);

    // Search filter
    // if (filters.search) {
    //   query.where(function () {
    //     this.where('vendor_name', 'ilike', `%${filters.search}%`)
    //       .orWhere('email', 'ilike', `%${filters.search}%`)
    //       .orWhere('contact_person', 'ilike', `%${filters.search}%`);
    //   });
    // }

    const vendors = await query
      .orderBy('created_at', 'desc')
      .limit(limit)
      .offset(offset);

    const [{ count }] = await knex(this.tableName)
      .withSchema(this.schema)
      .count('vendor_id as count');

    return {
      data: vendors,
      pagination: {
        page,
        limit,
        total: parseInt(count),
        totalPage: Math.ceil(count / limit)
      }
    };
  }

  
  // Update Vendor
 
  static async updateVendor(vendorId, updatedData) {
    const [updatedVendor] = await knex(this.tableName)
      .withSchema(this.schema)
      .where({ vendor_id: vendorId, is_deleted: false })
      .update({
        vendor_name: updatedData.vendor_name,
        // contact_person: updatedData.contact_person,
        email: updatedData.email,
        phone: updatedData.phone,
        address: updatedData.address,
        [UPDATED_AT]: knex.fn.now()
      })
      .returning('*');

    return updatedVendor;
  }

  
  // Delete Vendor (Hard Delete)
  
  static async deleteVendor(vendorId) {
    return await knex(this.tableName)
      .withSchema(this.schema)
      .where({ vendor_id: vendorId, is_deleted: false })
      .del();
  }

  
  // Check if Email Exists
  
  static async emailExists(email) {
    const vendor = await knex(this.tableName)
      .withSchema(this.schema)
      .where({ email, is_deleted: false })
      .first();

    return !!vendor;
  }
}

module.exports = Vendor;
