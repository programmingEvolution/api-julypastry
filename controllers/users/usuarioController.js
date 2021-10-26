import { getDB } from "../../db/db.js";
import { ObjectId } from "mongodb";
import jwt_decode from "jwt-decode";

const getAllUsers = async (callback) => {
  const baseDeDatos = getDB();
  await baseDeDatos.collection("usuario").find().limit(50).toArray(callback);
};

const createUser = async (datosUsuario, callback) => {
  const baseDeDatos = getDB();
  await baseDeDatos.collection("usuario").insertOne(datosUsuario, callback);
};

const consultarUsuario = async (id, callback) => {
  const baseDeDatos = getDB();
  await baseDeDatos
    .collection("usuario")
    .findOne({ _id: new ObjectId(id) }, callback);
};

const consultarOCrearUsuario = async (req, callback) => {
  // 6.1. obtener los datos del usuario desde el token
  const token = req.headers.authorization.split("Bearer ")[1];
  const user = jwt_decode(token)["http://localhost/userData"];
  console.log(user);

  // 6.2. con el correo del usuario o con el id de auth0, verificar si el usuario ya esta en la bd o no
  const baseDeDatos = getDB();
  await baseDeDatos
    .collection("usuario")
    .findOne({ email: user.email }, async (err, response) => {
      console.log("response consulta bd", response);
      if (response) {
        // 7.1. si el usuario ya esta en la BD, devuelve la info del usuario
        callback(err, response);
      } else {
        // 7.2. si el usuario no esta en la bd, lo crea y devuelve la info
        user.auth0ID = user._id;
        delete user._id;
        user.rolUsuario = "Sin asignar";
        user.estadoUsuario = "En espera";
        user.modificarProducto = false;
        user.modificarUsuario= false;
        user.añadirProducto= false;
        user.añadirUsuario = false;
        user.modificarVenta = false;
        await createUser(user, (err, respuesta) => callback(err, user));
      }
    });
};

const editUser = async (usuarioId, data, callback) => {
  const filtroUsuario = { _id: new ObjectId(usuarioId) };
  const operacion = {
    $set: data,
  };
  const baseDeDatos = getDB();
  await baseDeDatos
    .collection("usuario")
    .findOneAndUpdate(
      filtroUsuario,
      operacion,
      { upsert: true, returnOriginal: true },
      callback
    );
};

const deleteUser = async (usuarioId, callback) => {
  const filtroUsuario = { _id: new ObjectId(usuarioId) };
  const baseDeDatos = getDB();
  await baseDeDatos.collection("usuario").deleteOne(filtroUsuario, callback);
};

export {
  getAllUsers,
  createUser,
  editUser,
  deleteUser,
  consultarUsuario,
  consultarOCrearUsuario,
};
