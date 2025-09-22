import useClearSessionStorageOnPopState from "@/extra/ClearStorage";
import Pagination from "@/extra/Pagination";
import Table from "@/extra/Table";
import { getDefaultCurrency } from "@/store/currencySlice";
import { getSellerRequest } from "@/store/sellerRequestSlice";
import { RootStore, useAppDispatch } from "@/store/store";
import { getwithdrawRequest } from "@/store/withdrawRequestSlice";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import male from "@/assets/images/male.png"
import Button from "@/extra/Button";
import infoImage from "@/assets/images/info.svg"

const DeclinedSellerRequest = (props) => {
  const { declinedData, totalAcceptedData } = useSelector(
    (state: RootStore) => state.sellerRequest
  );


  const { currency } = useSelector((state: RootStore) => state.currency);
    const router = useRouter()
  const dispatch = useAppDispatch();

  const { startDate, endDate } = props;

  const [page, setPage] = useState(1);
  const [showURLs, setShowURLs] = useState([]);

  const [size, setSize] = useState(20);
  const [data, setData] = useState([]);
  const [defaultCurrency, setDefaultCurrency] = useState<any>({});
  useClearSessionStorageOnPopState("multiButton");

  useEffect(() => {
     let payload: any = {
         status: 3,
         start: page,
         limit: size,
         startDate: startDate,  
         endDate: endDate,
       };
       dispatch(getSellerRequest(payload));
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

  
  const handleRedirect = (data) => {
    try {
      router.push('/SellerInfo')
      localStorage.setItem("sellerInfo", JSON.stringify(data))
    } catch (error) {
      console.log("error", error.message)
    }

  }

  const ManageSellerRequestData = [
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
        <div
          className="d-flex align-items-center justify-content-center"
          style={{ cursor: "pointer" }}
        >
          <img src={row?.image || male.src} width="40px" height="40px" />
          <span className="text-capitalize ms-3  cursorPointer text-nowrap">
            {row?.sellerFullName}
          </span>
        </div>
      ),
    },

    {
      Header: "User name",
      body: "username",
      Cell: ({ row }) => <span>{row?.sellerUsername || "-"}</span>,
    },

    {
      Header: "Business name",
      body: "businessname",
      Cell: ({ row }) => <span>{row?.businessName || "-"}</span>,
    },

    {
      Header: "Business Tag",
      body: "businesstag",
      Cell: ({ row }) => <span>{row?.businessTag || "-"}</span>,
    },

    {
      Header: "Document Type",
      body: "documenttype",
      Cell: ({ row }) => <span>{row?.documentType || "-"}</span>,
    },

    
    {
      Header: "Email",
      body: "email",
      Cell: ({ row }) => <span>{row?.email || "-"}</span>,
    },
   
    {
      Header: "Mobile Number",
      body: "mobilenumber",
      Cell: ({ row }) => <span>{row?.mobileNumber}</span>,
    },

    
    {
      Header: "Reason",
      body: "reason",
      Cell: ({ row }) => <span>{row?.reason || "-"}</span>,
    },
  
    {
      Header: "Date",
      body: "createdAt",
      Cell: ({ row }) => <span>{row?.date?.split(",")[0] || "-"}</span>,
    },

    {
      Header: "View",
      body: "view",
      Cell: ({ row }) =>
        // <Button
        //   btnName={`Info`}
        //   newClass={`fw-bolder text-white`}
        //   style={{ backgroundColor: "blue", borderRadius: "7px" }}
        //   onClick={() => handleRedirect(row)}
        // />

         <img src={infoImage.src} alt="Info"
         style={{
          cursor : "pointer"
         }}
         onClick={() => handleRedirect(row)}
        />
    },

  ];

  return (
    <>
      <div className="user-table real-user mb-3 border-0">
        <Table
          data={data}
          mapData={ManageSellerRequestData}
          serverPerPage={size}
          serverPage={page}
          type={"server"}
        />
        <Pagination
          type={"server"}
          activePage={page}
          rowsPerPage={size}
          userTotal={totalAcceptedData}
          setPage={setPage}
          handleRowsPerPage={handleRowsPerPage}
          handlePageChange={handlePageChange}
        />
      </div>
    </>
  );
};

export default DeclinedSellerRequest;
