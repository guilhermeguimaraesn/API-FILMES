const { hash, compare } = require("bcryptjs");

const AppError = require("../utils/appError.js");

const sqliteConnectioin = require("../database/sqlite");

class UserController {
  async create(request, response) {
    const { name, email, password } = request.body;

    const database = await sqliteConnectioin();
    const checkUserExists = await database.get(
      "SELECT * FROM users WHERE email = (?)",
      [email]
    );

    if (checkUserExists) {
      throw new AppError("Este email já está em uso.");
    }

    const hashedPassword = await hash(password, 8);

    await database.run(
      "INSERT INTO users (name, email, password) VAlUES (?,?,?)",
      [name, email, hashedPassword]
    );

    return response.status(201).json("criado");
  }

  async update(request, response) {
    const { name, email, password, old_password } = request.body;
    const { id } = request.params;

    const database = await sqliteConnectioin();
    const user = await database.get("SELECT * FROM users WHERE id = (?)", [id]);

    if (!user) {
      throw new AppError("USUÁRIO NÃO ENCONTRADO");
    }

    const userWithUpdatedEmail = await database.get(
      "SELECT * FROM users WHERE email = (?)", [email],
      [email]
    );

    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
      throw new AppError("Este email já está em uso.");
    }

    user.name = name ?? user.name;
    user.email = email ?? user.email;

    if (password && !old_password){
      throw new AppError("Informe a senha antiga")
    }

    if (!password && old_password){
      throw new AppError("Informe a senha nova")
    }

   

    if (password && old_password){
      const checkOldPassword = await compare(old_password, user.password);

      if (!checkOldPassword){
        throw new AppError("A senha antiga está incorreta")
      }

      user.password = await hash(password, 8)
    }
    console.log(user.password)
    await database.run(
      `
    UPDATE users SET 
    name = ?,
    email = ?,
    password = ?,
    updated_at = DATETIME('now')
    WHERE id = ?`,
      [user.name, user.email, user.password, id]
    );

      return response.status(200).json("ATUALIZAÇÃO REALIZADA")
  }
}

module.exports = UserController;
