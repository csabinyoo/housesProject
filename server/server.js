require("dotenv").config();

const express = require("express");
const mysql = require("mysql");
const app = express();
const sanitizeHtml = require("sanitize-html");

const pool = require("./config/database.js");
const {
  sendingGet,
  sendingGetError,
  sendingGetById,
  sendingPost,
  sendingPut,
  sendingDelete,
  sendingInfo,
} = require("./config/sending.js");

//#region middlewares
app.use(express.json());
//#endregion middlewares

//#region houses
app.get("/houses", (req, res) => {
  pool.getConnection(function (error, connection) {
    if (error) {
      sendingInfo(res, 0, "server error", [], 403)
      return;
    }
    const sql = `
    select hs.ID, ss.Name Type, ts.Name Category, Settlement, cs.Name, hs.Rooms, hs.parcelNumber, hs.Area, hs.Price from houses hs
    inner join counties cs on hs.countyID = cs.id
    inner join types ts on hs.typeID = ts.id
    inner join sales ss on hs.saleID = ss.id
    order by hs.ID;
    `;
    connection.query(sql, (error, results, fields) => {
      sendingGet(res, error, results);
    });
    connection.release();
  });
});

app.get("/houses/:id", (req, res) => {
  const id = req.params.id;
  pool.getConnection(function (error, connection) {
    if (error) {
      sendingInfo(res, 0, "server error", [], 403)
      return;
    }
    const sql = `
    select hs.ID, ss.Name Type, ts.Name Category, Settlement, cs.Name, hs.Rooms, hs.parcelNumber, hs.Area, hs.Price from houses hs
    inner join counties cs on hs.countyID = cs.id
    inner join types ts on hs.typeID = ts.id
    inner join sales ss on hs.saleID = ss.id
    WHERE hs.ID = ?
    `;
    connection.query(sql, [id], (error, results, fields) => {
      sendingGetById(res, error, results, id)
    });
    connection.release();
  });
});

app.post("/houses", (req, res) => {
  const newR = {
    ID: +mySanitizeHtml(req.body.ID),
    saleID: +mySanitizeHtml(req.body.saleID),
    typeID: +mySanitizeHtml(req.body.typeID),
    Settlement: mySanitizeHtml(req.body.Settlement),
    countyID: +mySanitizeHtml(req.body.countyID),
    Rooms: +mySanitizeHtml(req.body.Rooms),
    parcelNumber: mySanitizeHtml(req.body.parcelNumber),
    Area: +mySanitizeHtml(req.body.Area),
    Price: +mySanitizeHtml(req.body.Price)
  };

  pool.getConnection(function (error, connection) {
    if (error) {
      sendingInfo(res, 0, "server error", [], 403);
      return;
    }
    const sql = `
    INSERT INTO houses
      (ID, saleID, typeID, Settlement, countyID, Rooms, parcelNumber, Area, Price)
      VALUES
      (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    connection.query(
      sql,
      [newR.ID, newR.saleID, newR.typeID, newR.Settlement, newR.countyID, newR.Rooms, newR.parcelNumber, newR.Area, newR.Price],
      (error, results, fields) => {
        sendingPost(res, error, results, newR);
      }
    );
    connection.release();
  });
});

app.put("/houses/:id", (req, res) => {
  const id = req.params.id;
  const newR = {
    saleID: +mySanitizeHtml(req.body.saleID),
    typeID: +mySanitizeHtml(req.body.typeID),
    Settlement: mySanitizeHtml(req.body.Settlement),
    countyID: +mySanitizeHtml(req.body.countyID),
    Rooms: +mySanitizeHtml(req.body.Rooms),
    parcelNumber: mySanitizeHtml(req.body.parcelNumber),
    Area: +mySanitizeHtml(req.body.Area),
    Price: +mySanitizeHtml(req.body.Price)
  };
  pool.getConnection(function (error, connection) {
    if (error) {
      sendingInfo(res, 0, "server error", [], 403);
      return;
    }

    const sql = `
    UPDATE houses SET
    saleID = ?, 
    typeID = ?, 
    Settlement = ?, 
    countyID = ?, 
    Rooms = ?, 
    parcelNumber = ?, 
    Area = ?, 
    Price = ?
    WHERE id = ?
  `;
    connection.query(
      sql,
      [newR.saleID, newR.typeID, newR.Settlement, newR.countyID, newR.Rooms, newR.parcelNumber, newR.Area, newR.Price, id],
      (error, results, fields) => {
        sendingPut(res, error, results, id, newR)
      }
    );
    connection.release();
  });
});

app.delete("/houses/:id", (req, res) => {
  const id = req.params.id;
  pool.getConnection(function (error, connection) {
    if (error) {
      sendingInfo(res, 0, "server error", [], 403);
      return;
    }

    const sql = `
    DELETE from houses
    WHERE id = ?
  `;
    connection.query(sql, [id], (error, results, fields) => {
      sendingDelete(res, error, results, id)
    });
    connection.release();
  });
});
//#endregion houses

//#region counties
app.get("/counties", (req, res) => {
  pool.getConnection(function (error, connection) {
    if (error) {
      sendingInfo(res, 0, "server error", [], 403)
      return;
    }
    const sql = "SELECT * FROM counties";
    connection.query(sql, (error, results, fields) => {
      sendingGet(res, error, results);
    });
    connection.release();
  });
});

app.get("/counties/:id", (req, res) => {
  const id = req.params.id;
  pool.getConnection(function (error, connection) {
    if (error) {
      sendingInfo(res, 0, "server error", [], 403)
      return;
    }
    const sql = `
    SELECT * FROM counties
    WHERE id = ?
  `;
    connection.query(sql, [id], (error, results, fields) => {
      sendingGetById(res, error, results, id)
    });
    connection.release();
  });
});

app.post("/counties", (req, res) => {
  const newR = {
    ID: +mySanitizeHtml(req.body.ID),
    Name: mySanitizeHtml(req.body.Name)
  };

  pool.getConnection(function (error, connection) {
    if (error) {
      sendingInfo(res, 0, "server error", [], 403);
      return;
    }
    const sql = `
    INSERT INTO counties
      (ID, Name)
      VALUES
      (?, ?)
    `;
    connection.query(
      sql,
      [newR.ID, newR.Name],
      (error, results, fields) => {
        sendingPost(res, error, results, newR);
      }
    );
    connection.release();
  });
});

app.put("/counties/:id", (req, res) => {
  const id = req.params.id;
  const newR = {
    Name: mySanitizeHtml(req.body.Name)
  };
  pool.getConnection(function (error, connection) {
    if (error) {
      sendingInfo(res, 0, "server error", [], 403);
      return;
    }

    const sql = `
    UPDATE counties SET
    Name = ?
    WHERE id = ?
  `;
    connection.query(
      sql,
      [newR.Name, id],
      (error, results, fields) => {
        sendingPut(res, error, results, id, newR)
      }
    );
    connection.release();
  });
});

app.delete("/counties/:id", (req, res) => {
  const id = req.params.id;
  pool.getConnection(function (error, connection) {
    if (error) {
      sendingInfo(res, 0, "server error", [], 403);
      return;
    }

    const sql = `
    DELETE from counties
    WHERE id = ?
  `;
    connection.query(sql, [id], (error, results, fields) => {
      sendingDelete(res, error, results, id)
    });
    connection.release();
  });
});
//#endregion counties

//#region types
app.get("/types", (req, res) => {
  pool.getConnection(function (error, connection) {
    if (error) {
      sendingInfo(res, 0, "server error", [], 403)
      return;
    }
    const sql = "SELECT * FROM types";
    connection.query(sql, (error, results, fields) => {
      sendingGet(res, error, results);
    });
    connection.release();
  });
});

app.get("/types/:id", (req, res) => {
  const id = req.params.id;
  pool.getConnection(function (error, connection) {
    if (error) {
      sendingInfo(res, 0, "server error", [], 403)
      return;
    }
    const sql = `
    SELECT * FROM types
    WHERE id = ?
  `;
    connection.query(sql, [id], (error, results, fields) => {
      sendingGetById(res, error, results, id)
    });
    connection.release();
  });
});

app.post("/types", (req, res) => {
  const newR = {
    ID: +mySanitizeHtml(req.body.ID),
    Name: mySanitizeHtml(req.body.Name)
  };

  pool.getConnection(function (error, connection) {
    if (error) {
      sendingInfo(res, 0, "server error", [], 403);
      return;
    }
    const sql = `
    INSERT INTO types
      (ID, Name)
      VALUES
      (?, ?)
    `;
    connection.query(
      sql,
      [newR.ID, newR.Name],
      (error, results, fields) => {
        sendingPost(res, error, results, newR);
      }
    );
    connection.release();
  });
});

app.put("/types/:id", (req, res) => {
  const id = req.params.id;
  const newR = {
    Name: mySanitizeHtml(req.body.Name)
  };
  pool.getConnection(function (error, connection) {
    if (error) {
      sendingInfo(res, 0, "server error", [], 403);
      return;
    }

    const sql = `
    UPDATE types SET
    Name = ?
    WHERE id = ?
  `;
    connection.query(
      sql,
      [newR.Name, id],
      (error, results, fields) => {
        sendingPut(res, error, results, id, newR)
      }
    );
    connection.release();
  });
});

app.delete("/types/:id", (req, res) => {
  const id = req.params.id;
  pool.getConnection(function (error, connection) {
    if (error) {
      sendingInfo(res, 0, "server error", [], 403);
      return;
    }

    const sql = `
    DELETE from types
    WHERE id = ?
  `;
    connection.query(sql, [id], (error, results, fields) => {
      sendingDelete(res, error, results, id)
    });
    connection.release();
  });
});
//#endregion types

function mySanitizeHtml(data) {
  return sanitizeHtml(data, {
    allowedTags: [],
    allowedAttributes: {},
  });
}

app.listen(process.env.APP_PORT, () => {
  console.log(`Data server, listen port: ${process.env.APP_PORT}`);
});
