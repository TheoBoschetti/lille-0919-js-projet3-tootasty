const { connection, cloudinary } = require("../conf");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "/tmp/" });
const passport = require("passport");

//Get all campaigns in progress order by the most imminent campaign to finish
//Or all campaigns done order by their ending times
//Or all campaigns where an ambassador or an association has participed
//You can define a limit too
router.get("/", (req, res) => {
  let sql = `SELECT 
  campaign.id,
  campaign.name AS name, 
  campaign.img, 
  campaign.resume, 
  DATE_ADD(campaign.time_start, INTERVAL 1 HOUR) AS time_start, 
  DATE_ADD(campaign.time_end, INTERVAL 1 HOUR) AS time_end,
  campaign.date_event, 
  campaign.value1, 
  campaign.value2, 
  campaign.value3, 
  campaign.id_user, 
  campaign.id_ambassador, 
  campaign.id_association, 
  timediff(time_end,NOW()) AS timeDiff, 
  datediff(time_end,NOW()) AS dateDiff, 
  association.name AS associationName,
  (time_to_sec(timediff(time_end, NOW())))/60 AS minuteRemaining,
  SUM(donation.donation_value) AS totalDonation
    FROM campaign
    JOIN association ON campaign.id_association=association.id
    JOIN ambassador ON campaign.id_ambassador=ambassador.id
    LEFT JOIN donation ON campaign.id=donation.campaign_id`;
  let query = [];
  if (req.query.inProgress) {
    sql +=
      " WHERE NOW() < time_end GROUP BY campaign.id ORDER BY timediff(time_end,NOW()) ASC";
  } else if (req.query.done) {
    sql +=
      " WHERE NOW() > time_end GROUP BY campaign.id ORDER BY time_end DESC";
  } else if (req.query.ambassadorId) {
    sql += " WHERE id_ambassador = ? GROUP BY campaign.id";
    query.push(Number(req.query.ambassadorId));
  } else if (req.query.associationId) {
    sql += " WHERE id_association = ? GROUP BY campaign.id";
    query.push(Number(req.query.associationId));
  } else {
    sql += " GROUP BY campaign.id";
  }
  if (req.query.limit) {
    sql += " LIMIT ?";
    query.push(Number(req.query.limit));
  }
  connection.query(sql, query, (err, results) => {
    if (err)
      return res
        .status(500)
        .send("Error in obtaining campaign's infos !" + err);
    if (results.length === 0)
      return res
        .status(204)
        .send("There is no info corresponding to your research.");
    return res.status(200).json(results);
  });
});

//Get number of in progress and complete campaign
router.get("/total", (req, res) => {
  let sql = "SELECT COUNT(*) AS total FROM campaign";
  if (req.query.inProgress) {
    sql += " WHERE NOW() < time_end";
  }
  if (req.query.done) {
    sql += " WHERE NOW() > time_end";
  }
  connection.query(sql, (err, results) => {
    if (err)
      return res
        .status(500)
        .send("Error in obtaining total campaign's number !");
    return res.status(200).json(results);
  });
});

//Get campaign by id
router.get("/:id", (req, res) => {
  const id = req.params.id;
  connection.query(
    `SELECT 
  campaign.id,
  campaign.name AS name, 
  campaign.img, 
  campaign.resume, 
  DATE_ADD(campaign.time_start, INTERVAL 1 HOUR) AS time_start, 
  DATE_ADD(campaign.time_end, INTERVAL 1 HOUR) AS time_end,
  campaign.date_event, 
  campaign.value1, 
  campaign.value2, 
  campaign.value3, 
  campaign.id_user, 
  campaign.id_ambassador, 
  campaign.id_association, 
  timediff(time_end,NOW()) AS timeDiff, 
  datediff(time_end,NOW()) AS dateDiff, 
  association.name AS associationName,
  (time_to_sec(timediff(time_end, NOW())))/60 AS minuteRemaining,
  SUM(donation.donation_value) AS totalDonation
    FROM campaign
    JOIN association ON campaign.id_association=association.id
    JOIN ambassador ON campaign.id_ambassador=ambassador.id
    LEFT JOIN donation ON campaign.id=donation.campaign_id
    WHERE campaign.id = ?
    GROUP BY campaign.id`,
    [id],
    (err, results) => {
      if (err)
        return res.status(500).send("Error in obtaining campaign's info !");
      if (results.length === 0)
        return res
          .status(204)
          .send("There is no info corresponding to your research.");
      return res.status(200).json(results);
    }
  );
});

//-----------------------------------------------------------------------------Private routes

router.use((req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err) return res.status(500).send(err, info);
    if (!user) return res.status(401).send("Merci de vous connecter.");
    next();
  })(req, res);
});

//Post a new campaign
router.post("/", upload.single("img"), (req, res) => {
  cloudinary.v2.uploader.upload(
    req.file.path,
    { transformation: { width: 400, height: 300, crop: "fill" } },
    (err, result) => {
      if (err)
        return res
          .status(500)
          .send("Erreur lors de la création de la campagne.");
      req.body.img = result.url;
      connection.query(
        "INSERT INTO campaign SET ?",
        [req.body],
        (err, results) => {
          if (err)
            return res
              .status(500)
              .send("Erreur lors de la création de la campagne.");
          return res.status(201).send("Campagne créée");
        }
      );
    }
  );
});

//Modify a campaign by id
router.patch("/:id", upload.single("img"), async (req, res) => {
  if (req.file) {
    await cloudinary.v2.uploader.upload(
      req.file.path,
      { transformation: { width: 350, height: 350, crop: "fill" } },
      (err, result) => {
        if (err)
          return res
            .status(500)
            .send("Erreur lors de la modification de la campagne.");
        req.body.img = result.url;
      }
    );
  }
  const id = Number(req.params.id);
  connection.query(
    "UPDATE campaign SET ? WHERE id = ?",
    [req.body, id],
    (err, results) => {
      if (err)
        return res
          .status(500)
          .send("Erreur lors de la modification de la campagne.");
      return res.status(200).send("Campagne modifiée");
    }
  );
});

//Delete a campaign by id
router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  connection.query(
    "DELETE FROM campaign WHERE id = ?",
    [id],
    (err, results) => {
      if (err)
        return res
          .status(500)
          .send("Erreur lors de la suppression de la campagne.");
      return res.status(200).send("Campagne supprimée");
    }
  );
});

module.exports = router;
