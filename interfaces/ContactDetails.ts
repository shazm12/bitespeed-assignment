import { RowDataPacket } from "mysql2";

export interface ContactDetails extends RowDataPacket {
    id: number;
    linkedId: number;
    linkedPrecedence: string;
    email: string;
    phone_number: string;
  }