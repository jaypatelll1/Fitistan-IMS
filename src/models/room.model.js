const db = require('../config/database');

class roomModel{
 static async findAll(){
    return db('rooms')
      .select('*')
      .where({ is_deleted: false });
  }

  static async findById(room_id) {
    return db('rooms').where({room_id, is_deleted :false}).first();
    }

    static async create(roomData) {
    const [room] = await db('rooms').insert(roomData).returning('*');
    return room;
  }

    static async update(room_id, roomData) {
        const [updatedRoom] = await db('rooms').where({room_id}).update(roomData).returning("*");
        return updatedRoom;
    }

   static async delete(room_id){
    return await db("rooms").where({room_id}).update({is_deleted : true });

 }
}

module.export = roomModel;