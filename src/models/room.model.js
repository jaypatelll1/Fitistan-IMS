const BaseModel = require("../models/libs/BaseModel");
const DatabaseError = require("../errorhandlers/DatabaseError");
const { TABLE_DEFAULTS } = require("../models/libs/dbConstants");

class RoomModel extends BaseModel {
  constructor(userId) {
    super(userId);
    this.tableName = "rooms";
  }

  // GET ALL ROOMS
  async getAllRooms() {
    try {
      const qb = await this.getQueryBuilder();
      return qb
        .select("*")
        .from(this.tableName)
        .where(this.whereStatement())
        .orderBy("room_id", "asc");
    } catch (e) {
      throw new DatabaseError(e);
    }
  }

  // GET ROOM BY ID
  async getRoomById(room_id) {
    try {
      const qb = await this.getQueryBuilder();
      const room = await qb
        .select("*")
        .from(this.tableName)
        .where(this.whereStatement({ room_id }))
        .first();
      if (!room) {
        return {
          success: false,
          message: "Room not found"
        };
      }

      return room;
    } catch (e) {
      throw new DatabaseError(e);
    }
  }
  // CREATE ROOM
  async createRoom(roomData) {
    try {
      const qb = await this.getQueryBuilder();

      const data = this.insertStatement(
        this.getDefinedObject({
          room_name: roomData.room_name,
          warehouse_id: roomData.warehouse_id
        })
      );

      console.log("ROOM INSERT DATA:", data); // 🔥 DEBUG

      const [room] = await qb
        .table(this.tableName)
        .insert(data)
        .returning("*");

      return room;
    } catch (e) {
      console.error("CREATE ROOM ERROR:", e.message);
      console.error("DETAIL:", e.detail);
      throw new DatabaseError(e);
    }
  }

  // UPDATE ROOM
  async updateRoom(room_id, roomData) {
    try {
      const qb = await this.getQueryBuilder();

      const updateObj = this.getDefinedObject({
        room_name: roomData.room_name,
        warehouse_id: roomData.warehouse_id
      });

      const data = await this.updateStatement({ updateObj });

      const [updatedRoom] = await qb
        .table(this.tableName)
        .where({ room_id })
        .update(data)
        .returning("*");

      return updatedRoom;
    } catch (e) {
      throw new DatabaseError(e);
    }
  }

  
  // SOFT DELETE ROOM
  async deleteRoom(room_id) {
    try {
      const qb = await this.getQueryBuilder();

      // 1️⃣ Fetch room first
      const room = await qb
        .select("*")
        .from(this.tableName)
        .where({ room_id })
        .first();

      if (!room) {
        return { success: false, message: "Room not found" };
      }

      if (room[TABLE_DEFAULTS.COLUMNS.IS_DELETED.KEY]) {
        return { success: false, message: "Room is already deleted" };
      }

      // 2️⃣ Perform soft delete
      await qb
        .table(this.tableName)
        .where({ room_id })
        .update({
          [TABLE_DEFAULTS.COLUMNS.IS_DELETED.KEY]: true,
          [TABLE_DEFAULTS.COLUMNS.UPDATED_AT.KEY]: qb.raw("CURRENT_TIMESTAMP")
        });

      return { success: true, message: "Room deleted successfully" };
    } catch (e) {
      console.error("DELETE ROOM ERROR:", e.message);
      console.error("DETAIL:", e.detail);
      throw new DatabaseError(e);
    }
  }


}
module.exports = RoomModel;
