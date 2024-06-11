import { Request, Response } from "express";
import { Connection } from "mysql2/typings/mysql/lib/Connection";
import initDBConnection from "../helpers/db";
import { error } from "console";
import { QueryResult } from "mysql2";
import { ContactDetails } from "../interfaces/ContactDetails";
import { IdentifyContactDetailsResponse } from "../interfaces/IdentifyContactDetailsResponse";

const getDBObj = async () => await initDBConnection().then((dbConn) => dbConn);

export const createContactDetail = async (req: Request, res: Response) => {
  const { email, phoneNumber } = req.body;

  const db = await getDBObj();

  const contactDetails = await getAllContactDetails();

  let linkedId = null;
  let linkPrecedence = "primary";
  let error = null;
  contactDetails.forEach((elem) => {

    if(email == elem.email && phoneNumber == elem.phone_number ) {
      error = "Row already present!";
    }
    else if(email == elem.email || phoneNumber == elem.phone_number) {
      linkedId  = elem.id;
      linkPrecedence = "secondary";
    }

  });

  if(error) {
    res.status(400).send({ error });
    return;
  }


  await db
    .execute(
      `INSERT INTO CustContactDetials(email,linkedId,linkPrecedence,phone_number) VALUES  (?,?,?,?)`,
      [email, linkedId, linkPrecedence, phoneNumber]
    )
    .then((result: any) => {
      res.status(200).send({ success: "New Customer Contact Detail Created!" });
    })
    .catch((error: any) => {
      res.status(400).send({ error });
    })
};


export const identifyContactDetails = async(req: Request, res: Response) => {

  const { email, phoneNumber } = req.body;

  const contactDetails = await getAllContactDetails();
  let primaryContatctId = null;
  const emails = new Set<string>();
  const phoneNumbers = new Set<string>();
  const secondaryContactIds = new Set<number>();
  contactDetails.forEach((elem) => {

    if(email === elem.email) {
      emails.add(elem.email);
      phoneNumbers.add(elem.phone_number);
      if(elem.linkPrecedence === "primary") {
        primaryContatctId = elem.id;
      }
      else {
        secondaryContactIds.add(elem.id);
      }
    }

    if(phoneNumber === elem.phone_number) {
      phoneNumbers.add(elem.phone_number);
      emails.add(elem.email);
      if(elem.linkPrecedence === "primary") {
        primaryContatctId = elem.id;
      }
      else {
        secondaryContactIds.add(elem.id);
      }
    }
  })

  const contact: IdentifyContactDetailsResponse = {
      primaryContatctId: primaryContatctId,
      emails: Array.from(emails),
      phoneNumbers: Array.from(phoneNumbers),
      secondaryContactIds: Array.from(secondaryContactIds)
  }

  res.status(200).send({ contact });


}



const getAllContactDetails = async (): Promise<ContactDetails[]> => {
  const db = await getDBObj() ;
  const [contactDetails] = await db.query<ContactDetails[]>("SELECT * FROM CustContactDetials");
  return contactDetails;
};
