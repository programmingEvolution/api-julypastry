// hacer el import de express tradicional
// const express = require('express');

// hacer el nuevo import
import dotenv from "dotenv";
import Express from "express";
import Cors from "cors";
import { connectServer } from "./db/db.js";
import jwt from "express-jwt";
import jwks from "jwks-rsa";

import rutasProducto from "./views/products/route.js";
import rutasUsuario from "./views/users/route.js";
import rutasVentas from "./views/sale/router.js";

dotenv.config({ path: "./config.env" });

const app = Express();

app.use(Express.json());
app.use(Cors());

var jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: "https://julypastry.us.auth0.com/.well-known/jwks.json",
  }),
  audience: "api-autenticacion-julyspastry",
  issuer: "https://julypastry.us.auth0.com/",
  algorithms: ["RS256"],
});

app.use(jwtCheck);

app.use(rutasProducto);
app.use(rutasUsuario);
app.use(rutasVentas);

const main = () => {
  return app.listen(process.env.PORT, () => {
    console.log(`Server is running on port: ${process.env.PORT}`);
  });
};

connectServer(main);
