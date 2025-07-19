import { createContext, ReactNode, useContext, useState } from "react";
import { IProduct } from "./AppContext";
import { showToast } from "@/components/general/Toast";
import { generalService } from "@/services/general.service";
import { ISEARCH } from "@/interfaces/general";

interface IMeta {
  next_page_url: string;
}

export interface ISearchContextProps {
  searchResult: IProduct[];
  searchPageCount: number;
  setSearchPageCount: (value: number | ((value: number) => number)) => void;
  loadingSearch: boolean;
  setLoadingSearch: (value: boolean) => void;
  setSearchResult: (value: IProduct[]) => void;
  search: string | undefined;
  setSearch: (value: string | undefined) => void;
  state: string;
  setState: (value: string) => void;
  handleSearch: () => void;
  meta: IMeta;
  setMeta: (value: IMeta) => void;
}

const SearchContext = createContext<ISearchContextProps | null>(null);

export const useSearch = () => useContext(SearchContext);

export default function SearchContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [searchResult, setSearchResult] = useState<IProduct[]>([]);
  const [searchPageCount, setSearchPageCount] = useState<number>(1);
  const [meta, setMeta] = useState<IMeta>({
    next_page_url: "",
  });
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [search, setSearch] = useState<string | undefined>(undefined);
  const [state, setState] = useState<string>("Any");

  const handleSearch = async () => {
    setLoadingSearch(true);
    const existingIds = new Set(searchResult?.map((res) => res?.id));

    if (!search || search.length < 3) {
      setLoadingSearch(false);
      return;
    }

    const payload = {
      search,
      state: state === "Any" ? "" : state,
    };

    const res = await generalService.searchProducts(
      payload as ISEARCH,
      searchPageCount
    );

    if (res instanceof Error) {
      showToast({
        type: "error",
        text1: "Failed to search",
        text2: res.message,
      });

      setLoadingSearch(false);
      return;
    }

    if (res?.data.length == 0) {
      showToast({
        type: "error",
        text1: "No products",
        text2: "No products found",
      });
    }
    setMeta(res?.meta);

    const newFilter = res?.data?.filter((res) => !existingIds?.has(res?.id));

    setSearchResult([...searchResult, ...newFilter]);

    setLoadingSearch(false);
  };

  const values = {
    searchResult,
    setSearchResult,
    searchPageCount,
    setSearchPageCount,
    meta,
    setMeta,
    loadingSearch,
    setLoadingSearch,
    search,
    setSearch,
    state,
    setState,
    handleSearch,
  };

  return (
    <SearchContext.Provider value={values}>{children}</SearchContext.Provider>
  );
}
