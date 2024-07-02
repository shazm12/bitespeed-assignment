import { Request, Response } from "express";
import initDBConnection from "../helpers/db";
import { ContactDetails } from "../interfaces/ContactDetails";
import { IdentifyContactDetailsResponse } from "../interfaces/IdentifyContactDetailsResponse";

const getDBObj = async () => await initDBConnection().then((dbConn) => dbConn);

const createContactDetail = async (email: string, phoneNumber: string, linkedId: any, linkPrecedence: string) => {

  const db = await getDBObj();

  return await db
    .execute(
      `INSERT INTO CustContactDetails(email,linkedId,linkPrecedence,phone_number) VALUES  (?,?,?,?)`,
      [email, linkedId, linkPrecedence, phoneNumber]
    );
    
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
  let primaryContatctId: any = null;
  let linkPrecedence = "primary";
  let IsEmailPresent = false;
  let isPhoneNumberPresent = false;
  
  let linkedContacts: ContactDetails[] = [];
  contactDetails.forEach((elem) => {
    const emailMatch = email === elem.email;
    const phoneMatch = phoneNumber === elem.phone_number;
  
    if (emailMatch || phoneMatch) {
      if (emailMatch) IsEmailPresent = true;
      if (phoneMatch) isPhoneNumberPresent = true;
  
      if (elem.linkPrecedence === "primary") {
        primaryContatctId = elem.id;
        linkPrecedence = "secondary";
      }
  
      linkedContacts.push(elem);
    }
  });


    //sort linked Contact Details By createAt Timestamp
    linkedContacts.sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  
    // The first linked contact Detail created is always primary
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


  // If both email and phone number are not present then create Contact Row and return
  if((!IsEmailPresent || !isPhoneNumberPresent) && (email !== null && phoneNumber !== null) ) {
    createContactDetail(email,phoneNumber, primaryContatctId, linkPrecedence)
    .then((data:any) => {
      const contact: IdentifyContactDetailsResponse = {
        primaryContatctId: primaryContatctId,
        emails: Array.from(emails.add(email)),
        phoneNumbers: Array.from(phoneNumbers.add(phoneNumber)),
        secondaryContactIds: Array.from(secondaryContactIds),
      };
      res.status(200).send({contact });
    })
    .catch((error:any) => {
      res.status(400).send({ "error": "Error while creating Contact row: "+error });
    })

    return;
    
  }


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
  primaryLinkedId: any,
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
