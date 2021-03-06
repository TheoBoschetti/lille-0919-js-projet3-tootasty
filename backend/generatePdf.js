const PdfPrinter = require("pdfmake");
const moment = require("moment");
const sendMail = require("sendmail")({ silent: true });

function generatePdf(userInfo) {
  const fonts = {
    Roboto: {
      normal: "fonts/TimesNewRoman.ttf",
      bold: "fonts/TimesNewRomanGras.ttf"
    }
  };
  const printer = new PdfPrinter(fonts);

  const pdf = {
    content: [
      {
        image: "../frontend/public/img/meexBlueLogo.png",
        width: 100,
        alignment: "left"
      },
      {
        text: "270 rue des Arts",
        alignment: "right",
        fontSize: 14,
        margin: [0, -35, 0, 0]
      },
      {
        text: "Paris",
        alignment: "right",
        fontSize: 14
      },
      {
        text: "75000",
        alignment: "right",
        fontSize: 14
      },
      {
        text: "RECU FISCAL POUR DON",
        alignment: "center",
        fontSize: 18,
        margin: [0, 70, 0, 0],
        bold: true
      },
      {
        text: "(Article 200 du Code Général des Impôts)",
        alignment: "center",
        fontSize: 10,
        bold: true
      },
      {
        text: "Donateur :",
        alignment: "left",
        margin: [0, 50, 0, 0],
        bold: true,
        fontSize: 14
      },
      {
        text: `Email : ${userInfo.email}`,
        alignment: "left",
        margin: [0, 5, 0, 2]
      },
      {
        text: `Tel : ${userInfo.phone_number}`,
        alignment: "left",
        margin: [0, 2]
      },
      {
        text: `Valeur du don : ${userInfo.donation_value} €`,
        alignment: "left",
        margin: [0, 2]
      },
      {
        text: `Nom de l'association : ${userInfo.associationName}`,
        alignment: "left",
        margin: [0, 2]
      },
      {
        text: `Date du don : ${moment(userInfo.date).format("L")}  ${moment(
          userInfo.date
        ).format("LTS")}`,
        alignment: "left",
        margin: [0, 2]
      },
      {
        text:
          "Le bénéficiaire certifie sur l'honneur que les dons et versements qu'il reçoit ouvrent droit à la réduction d'impôt prèvue à l'article 200 du Code Général des Impôts.",
        alignment: "justify",
        margin: [0, 50, 0, 0],
        fontSize: 12
      },
      {
        text:
          "Particulier : vous pouvez dèduire 66% de votre don dans la limite de 20% de votre revenu imposable.",
        alignment: "justify",
        fontSize: 12
      },
      {
        text: `A Lille, le ${moment(Date.now()).format("L")}`,
        alignment: "right",
        fontSize: 12,
        margin: [0, 60, 0, 10]
      },
      {
        image: "../frontend/public/img/signature.png",
        width: 120,
        alignment: "right"
      }
    ]
  };
  const pdfDoc = printer.createPdfKitDocument(pdf);
  userInfo.donation_value > 0
    ? sendMail({
        from: "NoReply@meex.com",
        to: userInfo.email,
        subject: "Merci pour votre don !",
        html: `Vous venez de donner ${userInfo.donation_value}€ et en faisant cela, vous avez participé à un monde meilleur ! Merci beaucoup ! L'équipe Meex`,
        attachments: [
          {
            filename: "recuDeDon.pdf",
            content: pdfDoc
          }
        ]
      })
    : sendMail({
        from: "NoReply@meex.com",
        to: userInfo.email,
        subject: "Merci pour votre don !",
        html: "Merci pour votre participation ! L'équipe Meex"
      });
  pdfDoc.end();
  return;
}

module.exports = {
  generatePdf: generatePdf
};
