export interface DefaultUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: "ADMIN" | "USER";
  balance?: number | null;
}

export declare type ISODateString = string;
export interface DefaultSession {
  user?: {
    name?: string;
    email?: string;
    image?: string;
  };
  expires: ISODateString;
}
