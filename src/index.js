const express = require("express");
const app = express();
const port = 4000;
const morgan = require("morgan");
const { mysqlConn } = require("./database-MySQL");

//AÑADIDA
//Para aceptar todos los orígenes de donde provengan las peticiones / solución rápida cross origin err
const cors = require("cors");

//Middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

//Routes
app.use(require("./routes/routes"));

//Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor en puerto ${port}`);
});
