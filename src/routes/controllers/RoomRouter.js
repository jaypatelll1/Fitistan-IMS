const RoomManager = require("../../businesslogic/managers/RoomManager");
const DatabaseError = require("../../errorhandlers/DatabaseError");

class RoomController {

    // CREATE ROOM
    static async create(req) {
        try {
            return await RoomManager.createRoom(
                req.validatedData || req.body,
                req.user?.user_id
            );
        } catch (err) {
            throw err instanceof DatabaseError ? err : new DatabaseError(err);
        }
    }

    // LIST ALL ROOMS
    static async list(req) {
        try {
            return await RoomManager.getAllRooms(req.user?.user_id);
        } catch (err) {
            throw err instanceof DatabaseError ? err : new DatabaseError(err);
        }
    }

    // GET ROOM BY ID
    static async get(req) {
        try {
            return await RoomManager.getRoomById(
                req.validatedData?.id || req.params.id,
                req.user?.user_id
            );
        } catch (err) {
            throw err instanceof DatabaseError ? err : new DatabaseError(err);
        }
    }

    // UPDATE ROOM
    static async update(req) {
        try {
            const id = req.validatedData?.id || req.params.id;
            const updateData = req.validatedData?.updateBody || req.body;

            if (!updateData || Object.keys(updateData).length === 0) {
                return {
                    success: false,
                    message: "No fields provided to update"
                };
            }

            const updatedRoom = await RoomManager.updateRoom(
                id,
                updateData,
                req.user?.user_id
            );

            if (!updatedRoom) {
                return {
                    success: false,
                    message: "Room not found"
                };
            }

            return {
                success: true,
                message: "Room updated successfully",
                data: updatedRoom
            };
        } catch (err) {
            throw err instanceof DatabaseError ? err : new DatabaseError(err);
        }
    }

    // DELETE ROOM (SOFT DELETE)
    static async remove(req) {
        const room_id = req.validatedData?.id || req.params.id;

        if (!room_id) {
            return {
                success: false,
                message: "Room id is required"
            };
        }

        return await RoomManager.deleteRoom(
            room_id,
            req.user?.user_id
        );
    }

}

module.exports = RoomController;
