const knex = require("../../config/database.js");
const { PUBLIC_SCHEMA, TABLE_DEFAULTS } = require("./dbConstants.js");

const { CREATED_BY, LAST_MODIFIED_BY, IS_DELETED, CREATED_AT, UPDATED_AT } = TABLE_DEFAULTS.COLUMNS;

class BaseModel {

    constructor(userId = null){

        if(userId === null && (typeof userId !== 'string' || userId.trim() === '' )){
            throw new Error('userId must be a non-empty string or null');
        }

        this.userId = userId;
        this.schema = PUBLIC_SCHEMA;
    }

    // Query Builder
    async getQueryBuilder(trxProvider = undefined){
        try {
        if(trxProvider){
            return trxProvider;
        }
        return knex.withSchema(this.schema);    
        } catch (error) {
            throw new Error(`Failed to get query builder: ${error.message}`);
        }
        
    }

    // Default Whre Clause
    whereStatement(extraFilters = {}){

         if (typeof extraFilters !== 'object' ||  Array.isArray(extraFilters)) {
            throw new Error('extraFilters must be a valid object');
        }

        const baseFilters = {
            IS_DELETED:false,
        };
        return {
            ...baseFilters,
            ...extraFilters,
        };
    }

    // remove undefined key Values
    getDefinedObject(data = {}){

        if (typeof data !== 'object' || data === null || Array.isArray(data)) {
            throw new Error('data must be a valid object');
        }
        const cleaned = {};
        Object.keys(data).forEach(key => {
            if(data[key] !== undefined){
                cleaned[key] = data[key];
            }
        });
        return cleaned;
    }

    // add default fields 
    addDefaultFields(data = {},isUpdate = false){

        if (typeof data !== 'object' || data === null || Array.isArray(data)) {
            throw new Error('data must be a valid object');
        }

        const now = new Date();
        // for update 
        if(isUpdate){
            return {
                ...data,
                UPDATED_AT: now,
                ...( this.userId && {LAST_MODIFIED_BY : this.userId})
            }
        }
        // for create
        return {
            ...data,
            CREATED_AT : now,
            UPDATED_AT : now,
            ...(this.userId && { CREATED_BY : this.userId , LAST_MODIFIED_BY : this.userId }),
        };
    }

    // Helper function to Create and Update

    buildUpdateData(updateData = {}) {
        const defined = this.getDefinedObject(updateData);
        return this.addDefaultFields(defined, true);
    }

    buildCreateData(createData = {}) {
        const defined = this.getDefinedObject(createData);
        return this.addDefaultFields(defined, false);
    }

}