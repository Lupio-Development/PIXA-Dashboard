import RootLayout from "@/component/layout/Layout";
import Pagination from "@/extra/Pagination";
import Table from "@/extra/Table";
import { RootStore, useAppDispatch } from "@/store/store";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getAdminEarningHistory } from "@/store/adminEarningSlice";
import NewTitle from "../extra/Title";
import dayjs from "dayjs";
import male from "@/assets/images/male.png";
import { getDefaultCurrency } from "@/store/currencySlice";
import { useRouter } from "next/router";

interface BannerData {
    _id: string;
    image: string;
    isActive: false;
}

const AdminEarningHistory = (props) => {
    const { startDate, endDate } = props
    const { adminEarningHistory, total, totalAdminEarning } = useSelector((state: RootStore) => state.adminEarning);
    const { currency } = useSelector((state: any) => state.currency)

    const dispatch = useAppDispatch();

    const [data, setData] = useState<any[]>([]);
    const [rowsPerPage, setRowsPerPage] = useState<number>(20);
    const [page, setPage] = useState<any>(1);
    const [size, setSize] = useState(20);
    const router = useRouter();

    useEffect(() => {
        const payload = {
            startDate,
            endDate,
            page,
            size
        }
        dispatch(getAdminEarningHistory(payload));
    }, [dispatch, startDate, endDate, page, size]);

    useEffect(() => {
        setData(adminEarningHistory);
    }, [adminEarningHistory]);

    useEffect(() => {
        dispatch(getDefaultCurrency())
    }, [])

    const handleRedirect = (id) => {
        router.push({
            pathname: "/OrderDetailPage",
            query: { id: id }, // Convert object to string
        });
        typeof window !== "undefined" && localStorage.setItem("orderId", id);
    };

    const earningTable = [
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
            Header: "Order Id",
            body: "Orderid",
            Cell: ({ row }) => (
                <span className="text-capitalize order-id-hover"
                    onClick={() => handleRedirect(row?._id)}
                    style={{ cursor: "pointer" }}
                >{row?.orderId || "-"}</span>
            ),
        },

        {
            Header: "Seller",
            accessor: "seller",
            Cell: ({ row }) => (
                <div className="d-flex justify-content-end align-items-center">
                    {/* Image Section */}
                    <div

                        style={{ width: "60px", textAlign: "center" }}
                    >
                        <img
                            src={row.productImage || male.src}
                            alt={"Image"}
                            width="40"
                            height="40"
                            style={{ borderRadius: "5px", objectFit: "cover" }} // Styling for better appearance
                        />
                    </div>

                    {/* Product Name */}
                    <div style={{ width: "200px", textAlign: "start" }}>
                        <span className="text-capitalize ms-3  cursorPointer text-nowrap">
                            {row?.productName || "-"}
                        </span>
                    </div>
                </div>
            ),
        },

        {
            Header: `Seller Earning (${currency?.symbol})`,
            body: "totalPlansPurchased",
            Cell: ({ row }) => (
                <span className="text-capitalize">{row?.totalAmount?.toFixed(2)}</span>
            ),
        },

        {
            Header: `Admin Earning (${currency?.symbol})`,
            body: "totalAmountSpent",
            Cell: ({ row }) => (
                <span className="text-capitalize">{row?.commissionPerUnit?.toFixed(2)}</span>
            ),
        },
        {
            Header: "Date and Time",
            body: "date",
            Cell: ({ row }) => (
                <span className="text-capitalize">
                    {row.transactionDate}
                </span>
            ),
        },


    ];

    const handlePageChange = (pageNumber: number) => {
        setPage(pageNumber);
    };

    const handleRowsPerPage = (value: number) => {
        setPage(1);
        setSize(value);
    };

    return (
        <>
            <div className={`userTable pt-0`} style={{ padding: "20px" }}>
                <div className="dashboardHeader primeHeader mb-3 p-0">
                    <NewTitle
                        dayAnalyticsShow={false}
                        startDate={startDate}
                        endDate={endDate}
                        titleShow={true}
                        name={`Total Admin Earning : ${totalAdminEarning.toFixed(2)}`}
                    />
                </div>

                <div className="mt-3 user-table border-0">

                    <Table
                        data={data}
                        mapData={earningTable}
                        serverPerPage={size}
                        serverPage={page}
                        type={"server"}
                    />
                    <div className="mt-3">
                        <Pagination
                            type={"server"}
                            activePage={page}
                            rowsPerPage={size}
                            userTotal={total}
                            setPage={setPage}
                            handleRowsPerPage={handleRowsPerPage}
                            handlePageChange={handlePageChange}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};
AdminEarningHistory.getLayout = function getLayout(page: React.ReactNode) {
    return <RootLayout>{page}</RootLayout>;
};
export default AdminEarningHistory;
