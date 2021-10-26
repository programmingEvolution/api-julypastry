import Express from 'express';
import {
  consultarOCrearUsuario,
  consultarUsuario,
  createUser,
  deleteUser,
  editUser,
  getAllUsers,
} from '../../controllers/users/usuarioController.js';

const rutasUsuario = Express.Router();

const genericCallback = (res) => (err, result) => {
  if (err) {
    res.status(500).send(err);
  } else {
    res.json(result);
  }
};

rutasUsuario.route('/usuarios').get((req, res) => {
  getAllUsers(genericCallback(res));
});

rutasUsuario.route('/usuarios').post((req, res) => {
  createUser(req.body, genericCallback(res));
});

rutasUsuario.route('/usuarios/self').get((req, res) => {
  console.log('alguien hizo get en la ruta /self');
  consultarOCrearUsuario(req, genericCallback(res));
  // consultarUsuario(, genercCallback(res));
});


rutasUsuario.route('/usuarios/:id').get((req, res) => {
  console.log('alguien hizo get en la ruta /usuarios');
  consultarUsuario(req.params.id, genericCallback(res));
});

rutasUsuario.route('/usuarios/:id').patch((req, res) => {
  editUser(req.params.id, req.body, genericCallback(res));
});

rutasUsuario.route('/usuarios/:id').delete((req, res) => {
  deleteUser(req.params.id, genericCallback(res));
});

export default rutasUsuario;