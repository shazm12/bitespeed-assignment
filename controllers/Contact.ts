import { Request, Response } from "express";
import { Connection } from "mysql2/typings/mysql/lib/Connection";

export const createContactDetail = async (
  req: Request,
  res: Response,
  dbConn: any
) => {
  
  const { email, phoneNumber } = req.body;
  
  let db = await dbConn.then((db:any) => db);

  const [contactDetails] =  await db.query("SELECT * FROM CustContactDetials");

  res.send(contactDetails);


  // await dbConn.execute(
  //   `INSERT INTO CustContactDetials(email,linkedId,linkPrecedence,phone_number) VALUES  (?,NULL,'primary',?)`,
  //   [email, phoneNumber],
  //   (_err: any, result: any) => {
  //     if (_err) {
  //       console.log(_err);
  //       res.status(400).send({ error: _err });
  //       return;
  //     }
  //     res.status(200).send({ success: "New Customer Contact Detail Created!"});
  //   }
  // );
};

