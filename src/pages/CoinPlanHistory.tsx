import React, { useEffect, useState } from "react";
import NewTitle from "../extra/Title";
import Table from "../extra/Table";
import Pagination from "../extra/Pagination";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import { getAdminEarning } from "@/store/adminEarningSlice";
import RootLayout from "@/component/layout/Layout";
import { getDefaultCurrency } from "@/store/currencySlice";

const CoinPlanHistory = () => {
    const dispatch = useDispatch();
    const {currency} = useSelector((state : any) => state.currency);
    const [data, setData] = useState();
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(20);
    const [startDate, setStartDate] = useState("All");
    const [endDate, setEndDate] = useState("All");
    let adminEarningHistoryData = null;

    if (typeof window !== "undefined") {
      adminEarningHistoryData = JSON.parse(localStorage.getItem("adminEarningHistoryData")) || null;
    }
    

   useEffect(() => {
    dispatch(getDefaultCurrency())
   },[])

    const handlePageChange = (pageNumber) => {
        setPage(pageNumber);
    };

    const handleRowsPerPage = (value) => {
        setPage(1);
        setSize(value);
    };

    const earningTable = [
        {
            Header: "No",
            body: "no",
            Cell: ({ index }) => (
                <span className="text-nowrap">
                    {(page - 1) * size + parseInt(index) + 1}
                </span>
            ),
        },


        {
            Header: "UniqueId",
            body: "uniqueId",
            Cell: ({ row }) => (
                <span className="text-capitalize">{row?.uniqueId}</span>
            ),
        },
        {
            Header: "Coin",
            body: "coin",
            Cell: ({ row }) => (
                <span className="text-capitalize">
                    {row?.coin}
                </span>
            ),
        },

        {
            Header: `Amount (${currency?.symbol})`,
            body: "amount",
            Cell: ({ row }) => (
                <span className="text-capitalize">
                    {`${row?.amount} `}
                </span>
            ),
        },
        {
            Header: "Payment Gateway",
            body: "paymentGateway",
            Cell: ({ row }) => (
                <span className="text-capitalize">{row?.paymentGateway}</span>
            ),
        },

    
        {
            Header: "Created At",
            body: "createdAt",
            Cell: ({ row }) => (
                <span className="text-capitalize">
                    {dayjs(row.createdAt).format("MM/DD/YYYY")}
                </span>
            ),
        },

    ];

    return (
        <div className="userPage withdrawal-page pt-0">
            <div className="dashboardHeader primeHeader mb-3 p-0">
                <NewTitle
                    dayAnalyticsShow={false}
                    titleShow={true}
                    setEndDate={setEndDate}
                    setStartDate={setStartDate}
                    startDate={startDate}
                    endDate={endDate}
                    name={`Coin Plan Purchase History`}
                />
            </div>
            <div className="payment-setting-box user-table border-0">
                <div className="row align-items-center ml-1">
                    <div className="col-12 col-sm-6 col-md-6 col-lg-6 mt-2 m-sm-0 new-fake-btn d-flex justify-content-end">
                    </div>
                </div>
                <div className="mt-3">
                    <Table
                        data={adminEarningHistoryData?.coinPlanPurchase}
                        mapData={earningTable}
                        serverPerPage={size}
                        serverPage={page}
                        type={"server"}
                    />
                    <div className="mt-3">
                        <Pagination
                            type={"server"}
                            activePage={page}
                            actionShow={false}
                            rowsPerPage={size}
                            userTotal={adminEarningHistoryData?.coinPlanPurchase?.length}
                            setPage={setPage}
                            handleRowsPerPage={handleRowsPerPage}
                            handlePageChange={handlePageChange}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

CoinPlanHistory.getLayout = function getLayout(page: React.ReactNode) {
    return <RootLayout>{page}</RootLayout>;
};
export default CoinPlanHistory;
