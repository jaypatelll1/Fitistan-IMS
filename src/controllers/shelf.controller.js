const {ShelfModel} = require("../models/shelf.models.js");

exports.createShelf = async (req, res) => {
  const shelf = await ShelfModel.create({
    shelf_name: req.body.shelf_name,
    warehouse_id: req.body.warehouse_id,
    room_id: req.body.room_id,
    capacity: req.body.capacity,
    created_by: req.user?.id || null,
  });

  res.status(201).json(shelf);
};

exports.getAllShelves = async (req, res) => {
  const shelves = await ShelfModel.getAll();
  res.json(shelves);
};

exports.getShelfById = async (req, res) => {
  const shelf = await ShelfModel.getById(req.params.id);
  if (!shelf) return res.status(404).json({ message: "Shelf not found" });
  res.json(shelf);
};

exports.getShelvesByWarehouse = async (req, res) => {
  const shelves = await ShelfModel.getByWarehouse(req.params.warehouseId);
  res.json(shelves);
};

exports.getShelvesByRoom = async (req, res) => {
  const shelves = await ShelfModel.getByRoom(req.params.roomId);
  res.json(shelves);
};

exports.updateShelf = async (req, res) => {
  const shelf = await ShelfModel.update(
    req.params.id,
    req.body,
    req.user?.id || null
  );

  res.json(shelf);
};

exports.deleteShelf = async (req, res) => {
  await ShelfModel.softDelete(req.params.id, req.user?.id || null);
  res.json({ message: "Shelf deleted successfully" });
};
