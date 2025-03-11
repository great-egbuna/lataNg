export interface IUSER {
  email?: string;
  role?: string;
  [key: string]: any;
}

export interface IAUTH {
  isLoggedIn: boolean;
  setIsLoggedIn: (prev: boolean) => void;
  checkAuth: () => void;
  user?: IUSER | null;
  setUser?: (value: IUSER | null) => void;
}
