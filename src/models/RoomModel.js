const BaseModel = require("../models/libs/BaseModel");
const DatabaseError = require("../errorhandlers/DatabaseError");
const { TABLE_DEFAULTS } = require("../models/libs/dbConstants");

class RoomModel extends BaseModel {
  constructor(userId) {
    super(userId);
  }

  // GET ALL ROOMS
  async   getAllRooms() {
    try {
      const qb = await this.getQueryBuilder();
      return qb("rooms")
        .select("*")
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

      const room = await qb("rooms")
        .select("*")
        .where(this.whereStatement({ room_id }))
        .first();

      return room || null;
    } catch (e) {
      throw new DatabaseError(e);
    }
  }


// CREATE ROOM
async createRoom(roomData) {
  try {
    const qb = await this.getQueryBuilder();

    // 1️⃣ Check if room already exists in same warehouse
    const existingRoom = await qb("rooms")
      .where({
        room_name: roomData.room_name,
        warehouse_id: roomData.warehouse_id
      })
      .first();

    // 2️⃣ If room exists but is deleted
    if (existingRoom && existingRoom.is_deleted) {
      throw new Error(
        "Room exists but is deleted. Please restore it instead of creating a new one."
      );
    }

    // 3️⃣ If room exists and active
    if (existingRoom && !existingRoom.is_deleted) {
      throw new Error("Room already exists in this warehouse");
    }

    // 4️⃣ Create new room
    const insertData = this.getDefinedObject({
      room_name: roomData.room_name,
      warehouse_id: roomData.warehouse_id
    });

    const [room] = await qb("rooms")
      .insert(insertData)
      .returning("*");

    return room;
  } catch (e) {
    throw new DatabaseError(e);
  }
}



  // UPDATE ROOM
  async updateRoom(room_id, roomData = {}) {
    try {
      const qb = await this.getQueryBuilder();

      const existingRoom = await qb("rooms")
        .where({ room_id })
        .first();

      if (!existingRoom || existingRoom.is_deleted) {
        return null;
      }

      const updateData = this.getDefinedObject({
        room_name: roomData.room_name,
        warehouse_id: roomData.warehouse_id,
        [TABLE_DEFAULTS.COLUMNS.UPDATED_AT.KEY]: qb.raw("CURRENT_TIMESTAMP")
      });

      if (!updateData || Object.keys(updateData).length === 0) {
        return null;
      }

      let updatedRoom;

      if (qb.client.config.client === "pg") {
        [updatedRoom] = await qb("rooms")
          .where({ room_id })
          .update(updateData)
          .returning("*");
      } else {
        await qb("rooms")
          .where({ room_id })
          .update(updateData);

        updatedRoom = await qb("rooms")
          .where({ room_id })
          .first();
      }

      return updatedRoom;
    } catch (e) {
      throw new DatabaseError(e);
    }
  }

  // SOFT DELETE ROOM
   async deleteRoom(room_id) {
    try {
      const qb = await this.getQueryBuilder();

      // 🔍 Check room exists & not already deleted
      const room = await qb("rooms")
        .where({ room_id })
        .first();

      if (!room || room.is_deleted) {
        return null;
      }

      // 🧹 SOFT DELETE ALL SHELVES INSIDE ROOM
      await qb("shelf")
        .where({
          room_id,
          [TABLE_DEFAULTS.COLUMNS.IS_DELETED.KEY]: false
        })
        .update({
          [TABLE_DEFAULTS.COLUMNS.IS_DELETED.KEY]: true,
          [TABLE_DEFAULTS.COLUMNS.UPDATED_AT.KEY]: qb.raw("CURRENT_TIMESTAMP")
        });

      // 🗑️ SOFT DELETE ROOM
      await qb("rooms")
        .where({ room_id })
        .update({
          [TABLE_DEFAULTS.COLUMNS.IS_DELETED.KEY]: true,
          [TABLE_DEFAULTS.COLUMNS.UPDATED_AT.KEY]: qb.raw("CURRENT_TIMESTAMP")
        });

      return true;
    } catch (e) {
      throw new DatabaseError(e);
    }
  }
}


module.exports = RoomModel;
