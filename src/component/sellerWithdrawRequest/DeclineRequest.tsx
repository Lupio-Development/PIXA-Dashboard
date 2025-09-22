import useClearSessionStorageOnPopState from "@/extra/ClearStorage";
import Pagination from "@/extra/Pagination";
import Table from "@/extra/Table";
import { getDefaultCurrency } from "@/store/currencySlice";
import { RootStore, useAppDispatch } from "@/store/store";
import { getwithdrawRequest } from "@/store/withdrawRequestSlice";
import { baseURL } from "@/util/config";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import userImage from "../../assets/images/8.jpg";
import infoImage from "@/assets/images/info.svg";
import male from "@/assets/images/male.png"


const DeclineRequest = (props: any) => {
  const { declinedData, totalDeclinedData } = useSelector(
    (state: RootStore) => state.withdrawRequest
  );

  const { currency } = useSelector((state: RootStore) => state.currency);
  useClearSessionStorageOnPopState("multiButton");

  const dispatch = useAppDispatch();

  const { startDate, endDate } = props;

  const [page, setPage] = useState(1);

  const [size, setSize] = useState(20);
  const [data, setData] = useState([]);
  const [openInfo, setOpenInfo] = useState(false);
  const [infoData, setInfodata] = useState<any>();
  const [defaultCurrency, setDefaultCurrency] = useState<any>({});

  useEffect(() => {
    let payload: any = {
      type: 3,
      start: page,
      limit: size,
      startDate: startDate,
      endDate: endDate,
      person: 2
    };
    dispatch(getwithdrawRequest(payload));
    dispatch(getDefaultCurrency());
  }, [dispatch, page, size, startDate, endDate]);

  useEffect(() => {
    setData(declinedData);
    setDefaultCurrency(currency);
  }, [declinedData, currency]);

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  const handleRowsPerPage = (value) => {
    setPage(1);
    setSize(value);
  };

  const handleOpenInfo = (row) => {
    setOpenInfo(true);
    setInfodata(row);
  };

  const ManageUserData = [
    {
      Header: "No",
      body: "no",
      Cell: ({ index }) => (
        <span className="  text-nowrap">
          {(page - 1) * size + parseInt(index) + 1}
        </span>
      ),
    },

    {
      Header: "Seller Name",
      body: "sellerName",
      Cell: ({ row, index }) => (
        <div className="d-flex justify-content-center align-items-center">
          {/* Image Section */}
          <div

            style={{ width: "50px", textAlign: "end" }}
          >
            <img
              src={row?.seller?.image || male.src}
              alt={row.productName || "Product Image"}
              width="40"
              height="40"
              style={{ borderRadius: "5px", objectFit: "cover" }}
            />
          </div>

          {/* Product Name */}
          <div style={{ width: "100px", textAlign: "start" }}>
            <span className="text-capitalize ms-3  cursorPointer text-nowrap">
              {row?.seller?.sellerFullName}
            </span>
          </div>
        </div>
      ),
    },
    {
      Header: `User name`,
      body: "unique id",
      Cell: ({ row }) => (
        <span className="text-lowercase cursorPointer">{row?.sellerId?.sellerUsername || "-"}</span>
      ),
    },

    {
      Header: `Unique Id`,
      body: "unique id",
      Cell: ({ row }) => (
        <span className="text-lowercase cursorPointer">{row?.uniqueId}</span>
      ),
    },
    {
      Header: `Amount (${defaultCurrency?.symbol})`,
      body: "requestAmount",
      Cell: ({ row }) => (
        <span className="text-lowercase cursorPointer">{row?.amount}</span>
      ),
    },
    {
      Header: "Payment gateway",
      body: "paymentGateway",
      Cell: ({ row }) => <span>{row?.paymentGateway}</span>,
    },

    {
      Header: "Reason",
      body: "reason",
      Cell: ({ row }) => <span>{row?.reason}</span>,
    },

    {
      Header: "Date",
      body: "createdAt",
      Cell: ({ row }) => <span>{row?.status === 1 ? row?.requestDate?.split(",")[0] : row?.acceptOrDeclineDate}</span>,
    },



    // {
    //   Header: "Info",
    //   body: "",
    //   Cell: ({ row }) => (
    //     <img src={infoImage.src} alt="Info"
    //     style={{cursor : "pointer"}}
    //       onClick={() => handleOpenInfo(row)}
    //     />
    //   ),
    // },


  ];

  return (
    <>
      <div className="user-table real-user mb-3 border-0">

        <Table
          data={data}
          mapData={ManageUserData}
          serverPerPage={size}
          serverPage={page}
          type={"server"}
        />
        <Pagination
          type={"server"}
          activePage={page}
          rowsPerPage={size}
          userTotal={totalDeclinedData}
          setPage={setPage}
          handleRowsPerPage={handleRowsPerPage}
          handlePageChange={handlePageChange}
        />
      </div>


    </>
  );
};

export default DeclineRequest;
