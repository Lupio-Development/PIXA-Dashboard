import React, { useState } from "react";

export default function Table(props: any) {
  const {
    data,
    checkBoxShow,
    mapData,
    Page,
    PerPage,
    type,
    style,
    onChildValue,
    selectAllChecked,
    handleSelectAll,
    isSpacing
  } = props;

  const [sortColumn, setSortColumn] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("asc");
  const [checkBox, setCheckBox] = useState<any>();

  const sortedData =
    data?.length > 0
      ? [...data].sort((a: any, b: any) => {
        const valueA = a[sortColumn];
        const valueB = b[sortColumn];

        if (valueA < valueB) {
          return sortOrder === "asc" ? -1 : 1;
        }
        if (valueA > valueB) {
          return sortOrder === "asc" ? 1 : -1;
        }
        return 0;
      })
      : data;

  const startIndex = (Page - 1) * PerPage;
  const endIndex = startIndex + PerPage;

  const currentPageData = Array.isArray(data)
    ? data.slice(startIndex, endIndex)
    : [];

  return (
    <>
      <div
        className="primeMain table-custom p-0"
        style={{
          border: "1px solid #eee",
          // paddingLeft : isSpacing ? 
        }}
      >
        <table
          width="100%"
          className="primeTable text-center"
          style={{ ...style }}
        >
          <thead
            className=""
            style={{ zIndex: "1", position: "sticky", top: "0" }}
          >
            <tr>
              {mapData?.map((res: any) => (
                <th className="fw-bold text-nowrap" key={res.Header}>
                  <div className="table-head">
                    {res?.Header === "checkBox" ? (
                      <input
                        type="checkbox"
                        checked={selectAllChecked}
                        onChange={handleSelectAll}
                      />
                    ) : (
                      `${" "}${res?.Header}`
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {type === "server" && (
            <tbody style={{ maxHeight: "600px" }}>
              {sortedData?.length > 0 ? (
                <>
                  {(PerPage > 0
                    ? sortedData.slice(Page * PerPage, Page * PerPage + PerPage)
                    : sortedData
                  ).map((i: any, k: any) => (
                    <tr key={k}>
                      {mapData.map((res: any) => (
                        <td key={res.body} style={{ border: "1px solid #eee" }}>
                          {res.Cell ? (
                            <res.Cell row={i} index={k} />
                          ) : (
                            <span className={res?.class}>{i[res?.body]}</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}

                  {/* Fill remaining rows to reach 10 */}
                  {[...Array(Math.max(0, 9 - sortedData?.length))].map((_, index) => (
                    <tr key={`empty-${index}`} style={{ height: "62px" }}>
                      {mapData.map((res: any, colIndex: any) => (
                        <td key={`empty-cell-${colIndex}`} style={{ border: "1px solid #eee" }} />
                      ))}
                    </tr>
                  ))}
                </>
              ) : (
               <>
        {[...Array(9)].map((_, rowIndex) => (
          <tr key={`nodata-${rowIndex}`} style={{ height: "62px" }}>
            {rowIndex === 4 ? ( // Center it in the middle row (row 5 of 9)
              <td
                colSpan={mapData.length}
                className="text-center"
                style={{
                  borderBottom: "none",
                  border: "none",
                  padding: "20px 0",
                }}
              >
                No Data Found!
              </td>
            ) : (
              mapData.map((res: any, colIndex: any) => (
                <td key={`empty-cell-${colIndex}`} style={{ border: "1px solid #eee" }} />
              ))
            )}
          </tr>
        ))}
      </>
              )}
            </tbody>
          )}



          {type === "client" && (
            <tbody style={{ maxHeight: "600px" }}>
              {currentPageData?.length > 0 ? (
                <>
                  {currentPageData.map((i: any, k: any) => (
                    <tr key={k}>
                      {mapData.map((res: any) => (
                        <td key={res?.body} style={{ border: "1px solid #eee" }}>
                          {res?.Cell ? (
                            <res.Cell row={i} index={k} />
                          ) : (
                            <span className={res?.class}>{i[res?.body]}</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}

                  {/* Fill remaining rows to reach 10 */}
                  {[...Array(Math.max(0, 9 - currentPageData?.length))].map((_, index) => (
                    <tr key={`empty-${index}`} style={{ height: "60px" }}>
                      {mapData.map((res: any, colIndex: any) => (
                        <td key={`empty-cell-${colIndex}`} style={{ border: "1px solid #eee" }} />
                      ))}
                    </tr>
                  ))}
                </>
              ) : (
                <>
                {[...Array(9)].map((_, rowIndex) => (
                  <tr key={`nodata-${rowIndex}`} style={{ height: "62px" }}>
                    {rowIndex === 4 ? ( // Center it in the middle row (row 5 of 9)
                      <td
                        colSpan={mapData.length}
                        className="text-center"
                        style={{
                          borderBottom: "none",
                          border: "none",
                          padding: "20px 0",
                        }}
                      >
                        No Data Found!
                      </td>
                    ) : (
                      mapData.map((res: any, colIndex: any) => (
                        <td key={`empty-cell-${colIndex}`} style={{ border: "1px solid #eee" }} />
                      ))
                    )}
                  </tr>
                ))}
              </>
              )}
            </tbody>
          )}

        </table>
      </div>
    </>
  );
}
