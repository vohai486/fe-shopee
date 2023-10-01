import React, { ReactNode, createContext, useContext } from "react";

const TableContext = createContext<{ columns: string }>({ columns: "" });

function Table({
  columns,
  children,
}: {
  columns: string;
  children: ReactNode;
}) {
  return (
    <TableContext.Provider value={{ columns }}>
      <div className="text-sm overflow-hidden" role="table">
        {children}
      </div>
    </TableContext.Provider>
  );
}
function Header({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const { columns } = useContext(TableContext);
  return (
    <div
      role="row"
      style={{
        gridTemplateColumns: columns,
      }}
      className={`grid gap-6 items-center px-6 py-4  bg-box border-box rounded-md text-blue-50 border ${className}`}
    >
      {children}
    </div>
  );
}
function Row({ children }: { children: ReactNode }) {
  const { columns } = useContext(TableContext);
  return (
    <div
      role="row"
      style={{
        gridTemplateColumns: columns,
      }}
      className={`grid text-black-100 dark:text-grey-300 gap-6 items-center py-3 px-6 [&:not(:last-child)]:border-b border-box`}
    >
      {children}
    </div>
  );
}

function Body<T>({
  data,
  render,
  isLoading,
}: {
  data: T[];
  render: (arg0: T) => ReactNode;
  isLoading: boolean;
}) {
  if (!data?.length && !isLoading)
    return (
      <div className="border py-4 mt-4 text-red-100 text-base px-6 rounded-md flex items-center justify-center border-red-100 text-title">
        Không có dữ liệu
      </div>
    );

  return <section>{data.map(render)}</section>;
}
function Footer({ children }: { children: ReactNode }) {
  return (
    <footer className="bg-box border border-box rounded-md flex justify-center p-3">
      {children}
    </footer>
  );
}

Table.Header = Header;
Table.Body = Body;
Table.Row = Row;
Table.Footer = Footer;
export default Table;
