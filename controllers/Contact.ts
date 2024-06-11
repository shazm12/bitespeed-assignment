import { Request, Response } from "express";
import { Connection } from "mysql2/typings/mysql/lib/Connection";
import initDBConnection from "../helpers/db";
import { error } from "console";
import { QueryResult } from "mysql2";
import { ContactDetails } from "../interfaces/ContactDetails";

const getDBObj = async () => await initDBConnection().then((dbConn) => dbConn);

export const createContactDetail = async (req: Request, res: Response) => {
  const { email, phoneNumber } = req.body;

  const db = await getDBObj();

  const contactDetails = await getAllContactDetails();

  let linkedId = null;
  let error = null;
  contactDetails.forEach((elem) => {

    if(email == elem?.email && phoneNumber == elem?.phone_number ) {
      error = "Row already present!";
    }
    else if(email == elem?.email || phoneNumber == elem?.phone_number) {
      linkedId  = elem?.id;
    }

  });

  if(error) {
    res.status(400).send({ error });
    return;
  }


  await db
    .execute(
      `INSERT INTO CustContactDetials(email,linkedId,linkPrecedence,phone_number) VALUES  (?,?,'primary',?)`,
      [email, linkedId, phoneNumber]
    )
    .then((result: any) => {
      res.status(200).send({ success: "New Customer Contact Detail Created!" });
    })
    .catch((error: any) => {
      res.status(400).send({ error });
    })
};



const getAllContactDetails = async (): Promise<ContactDetails[]> => {
  const db = await getDBObj() ;
  const [contactDetails] = await db.query<ContactDetails[]>("SELECT * FROM CustContactDetials");
  return contactDetails;
};
