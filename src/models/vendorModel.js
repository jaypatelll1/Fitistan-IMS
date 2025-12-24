const { func } = require('joi');
const knex = require('../config/database.js');
const { PUBLIC_SCHEMA,TABLE_DEFAULTS } = require('./libs/dbConstants.js');

const { CREATED_BY, LAST_MODIFIED_BY, IS_DELETED, CREATED_AT, UPDATED_AT } = TABLE_DEFAULTS.COLUMNS;

class Vendor{

    static get tableName() {
        return "vendors";
    }

    static get schema(){
        return PUBLIC_SCHEMA;
    }

    // Create new Vendor
    static async createVendor(vendorData){
        const [vendor] = await knex(this.tableName)
        .withSchema(this.schema)
        .insert(vendorData)
        .returning('*');
    
    return vendor;
    }

    // Find Vendor by id
    static async findVendorById(vendorId){
        return await knex(this.tableName)
        .withSchema(this.schema)
        .where({vendor_id: vendorId , is_active : true})
        .first();
    }

    // Find Vendor by email
    static async findVendorByEmail(vendorEmail){
        return await knex(this.tableName)
        .withSchema(this.schema)
        .where({email: vendorEmail , is_active : true})
        .first();
    }

    static async findAll(page = 1,limit = 10 , filters={} ){
        const offset = (page-1)*limit;

        let query = knex(this.tableName)
        .withSchema(this.schema)
        .where({ is_active: true});

        // apply filters
        if(filters.search){
            query = query.where(function(){
                this.where('vendor_name', 'ilike', `%${filters.search}%`)
                .orWhere('email', 'ilike', `%${filters.search}%`);
            });
        }

        const vendors = await query
             .orderBy(filters.field,filters.order)
             .limit(limit)
             .offset(offset);

        const [{count}] = await knex(this.tableName)
        .withSchema(this.schema)
        .where({ is_active : true})
        .count('vendor_id as count');
        
        return {
            data : vendors,
            pagination: {
                page,
                limit,
                total:parseInt(count),
                totalPage:Math.ceil(count/limit),
            }
        };

    }

    // Update Vendor

    static async updateVendor(vendorId,updatedData){
        const [updated] = await knex(this.tableName)
        .withSchema(this.schema)
        .where({vendor_id: vendorId})
        .update({
            ...updatedData,
            UPDATED_AT:knex.fn.now()
        })
        .returning('*');
    
        return updated;
    }

    // Soft delete
    static async softDeleteVendor(vendorId){
        return await this.updateVendor(vendorId,{ is_active:false});
    }

    // Check if email exists
    static async emailExists(email){
        let query = knex(this.tableName)
        .withSchema(this.schema)
        .where({email});
        const vendor = await query.first();
        return !!vendor;
    }
}