export interface IREGISTER {
  email: string;
  password: string;
  name: string;
  role: string;
  aboutBusiness: string;
  avatar: string;
  googleIntegration?: string;
}

export interface ILOGIN {
  email: string;
  password: string;
}

export interface ICALLBACK {
  publicToken: any;
}

export interface IFORGOTPASSWORD {
  email: string;
}

export interface IVERIFYOPT {
  token: string;
}

export interface IRESENDOPT {
  email: string;
  type: string;
}

export interface ICHANGEPASSWORD {
  password: string;
}

export interface IVERIFYEMAIL {
  email: string;
  emailVerification: boolean;
}

export interface IGOOGLE {
  role: string;
  accessToken: string;
}
