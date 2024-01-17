const {Router} = require("express");

const NoteController = require("../controllers/NoteController");

const noteController = new NoteController();

const noteRoutes = Router();

noteRoutes.get("/", noteController.index);
noteRoutes.post("/:user_id", noteController.create);
noteRoutes.get("/:id", noteController.show);
noteRoutes.delete("/:id", noteController.delete);

module.exports = noteRoutes;