import { createContext, useState } from "react";

interface AppContextProps {
  navOpen: boolean;
  setNavOpen: (value: boolean) => void;
}

const AppContext = createContext<AppContextProps | null>(null);

export default function AppProvider({ children }: any) {
  const [navOpen, setNavOpen] = useState(false);
  const value = { navOpen, setNavOpen };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
