import { Request, Response } from "express";
import initDBConnection from "../helpers/db";
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
    if (email == elem.email && phoneNumber == elem.phone_number) {
      error = "Row already present!";
    } else if (email == elem.email || phoneNumber == elem.phone_number) {
      linkedId = elem.id;
      linkPrecedence = "secondary";
    }
  });

  if (error) {
    res.status(400).send({ error });
    return;
  }

  await db
    .execute(
      `INSERT INTO CustContactDetails(email,linkedId,linkPrecedence,phone_number) VALUES  (?,?,?,?)`,
      [email, linkedId, linkPrecedence, phoneNumber]
    )
    .then((result: any) => {
      res.status(200).send({ success: "New Customer Contact Detail Created!" });
    })
    .catch((error: any) => {
      res.status(400).send({ error });
    });
};

const checkIfThereisOnlyOnePrimaryLinkedContact = (
  linkedContacts: ContactDetails[]
) : Boolean => {
  let primaryLinkedContactsCount = 0;
  linkedContacts.forEach((elem) => {
    if (elem.linkPrecedence === "primary") {
      primaryLinkedContactsCount++;
    }
  });
  return primaryLinkedContactsCount === 1 ? true: false;
};

export const identifyContactDetails = async (req: Request, res: Response) => {
  const { email, phoneNumber } = req.body;

  const contactDetails = await getAllContactDetails();

  let linkedContacts: ContactDetails[] = [];
  contactDetails.forEach((elem) => {
    if (email === elem.email) {
      linkedContacts.push(elem);
    } else if (phoneNumber === elem.phone_number) {
      linkedContacts.push(elem);
    }
  });

  //sort linked Contact Details By createAt Timestamp
  linkedContacts.sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  // The first linked contact Detail created is always primary
  const primaryContatctId = linkedContacts[0]?.id;
  const secondaryContactIds = new Set<number>(
    linkedContacts
      .filter((contactDetail) => contactDetail?.linkPrecedence === "secondary")
      .map((contactDetail) => contactDetail?.id)
  );
  const emails = new Set<string>(
    linkedContacts.map((contactDetail) => contactDetail?.email)
  );
  const phoneNumbers = new Set<string>(
    linkedContacts.map((contactDetail) => contactDetail?.phone_number)
  );

  const isThereOnlyOnePrimaryLinkedContact = checkIfThereisOnlyOnePrimaryLinkedContact(linkedContacts);
  if (!isThereOnlyOnePrimaryLinkedContact) {
    const linkedContactsToChange:ContactDetails[] = linkedContacts.slice(1).filter((contactDetail: ContactDetails) => contactDetail.linkPrecedence === "primary");
    linkedContactsToChange.forEach(async(linkedContact: ContactDetails) => {
      await changeLinkedContactFromPrimaryToSecondary(primaryContatctId,linkedContact);
    });
    linkedContactsToChange.forEach((linkedContact: ContactDetails) => {
      secondaryContactIds.add(linkedContact?.id);
    });
    
    
  }

  const contact: IdentifyContactDetailsResponse = {
    primaryContatctId: primaryContatctId,
    emails: Array.from(emails),
    phoneNumbers: Array.from(phoneNumbers),
    secondaryContactIds: Array.from(secondaryContactIds),
  };

  res.status(200).send({ contact });
};

const changeLinkedContactFromPrimaryToSecondary = async (
  primaryLinkedId: number,
  linkedContact: ContactDetails
): Promise<any> => {
  const db = await getDBObj();
  await db
    .execute(
      `UPDATE CustContactDetails
      SET linkPrecedence = 'secondary', linkedId = ?
      WHERE id = ?;`,
      [primaryLinkedId, linkedContact.id]
    )
    .then((result: any) => {
      return {
        success: "Successfully changed contact from primary to secondary!",
      };
    })
    .catch((error: any) => {
      return { error };
    });
};

const getAllContactDetails = async (): Promise<ContactDetails[]> => {
  const db = await getDBObj();
  const [contactDetails] = await db.query<ContactDetails[]>(
    "SELECT * FROM CustContactDetails"
  );
  return contactDetails;
};
