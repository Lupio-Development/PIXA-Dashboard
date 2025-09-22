import Pagination from "@/extra/Pagination";
import Table from "@/extra/Table";
import { RootStore, useAppDispatch, useAppSelector } from "@/store/store";
import dayjs from "dayjs";
import NewTitle from "../../extra/Title";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getSellerWiseOrder, getSellerWiseProduct, getSellerWiseTransaction } from "@/store/sellerSlice";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import Button from "@/extra/Button";
import { useRouter } from "next/router";
import { getDefaultCurrency } from "@/store/currencySlice";

const SellerWiseTransaction = (props) => {
    const { startDate, endDate } = props;
    const { sellerWiseTransaction, total } = useSelector((state: RootStore) => state.seller);
    const { currency } = useSelector((state: any) => state.currency)
    const hasPermission = useAppSelector(
        (state: RootStore) => state.admin.admin.flag
    );

    const router = useRouter();


    const sellerData = typeof window !== "undefined"
        && JSON.parse(localStorage.getItem("sellerInfo"))


    const dispatch = useAppDispatch();
    const [type, setType] = useState<any>(1);
    const [data, setData] = useState<any>([]);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(20);


    useEffect(() => {
        const payload = {
            sellerId: sellerData?._id,
            start: page,
            limit: size,
            status: type,
            startDate,
            endDate

        }
        dispatch(getSellerWiseTransaction(payload));
        dispatch(getDefaultCurrency())
    }, [dispatch, page, size, type, startDate, endDate]);

    useEffect(() => {
        setData(sellerWiseTransaction);
    }, [sellerWiseTransaction]);


    const transactionTable = [
        {
            Header: "No",
            body: "name",
            Cell: ({ index }) => <span>{index + 1}</span>,
        },

        {
            Header: "Order Id",
            body: "Order id",
            Cell: ({ row }) => <span className="text-capitalize">{row?.orderId || "-"}</span>,
        },

        {
            Header: "Seller name",
            body: "Seller name",
            Cell: ({ row }) => <span className="text-capitalize">{row?.sellerName || "-"}</span>,
        },

        {
            Header: "Buyer name",
            body: "buyer name",
            Cell: ({ row }) => <span className="text-capitalize">{row?.buyerName || "-"}</span>,
        },

        {
            Header: "Product name",
            body: "buyer name",
            Cell: ({ row }) => <span className="text-capitalize">{row?.productName || "-"}</span>,
        },

        {
            Header: "Transaction Type",
            body: "transactionType",
            Cell: ({ row }) =>
                row.transactionType === 1 ? (
                    <button className="btnCredit">Credit</button>
                ) : (
                    <button className="btnDebit">Debit</button>

                )
        },


        {
            Header: `Seller Earning (${currency?.symbol})`,
            body: "buyer name",
            Cell: ({ row }) => <span className="text-capitalize">{row?.sellerEarning.toFixed(2) || "-"}</span>,
        },

        {
            Header: `Admin Earning (${(currency?.symbol)})`,
            body: "buyer name",
            Cell: ({ row }) => <span className="text-capitalize">{row?.adminEarning.toFixed(2) || "-"}</span>,
        },

        {
            Header: `Order Amount (${currency?.symbol})`,
            body: "buyer name",
            Cell: ({ row }) => <span className="text-capitalize">{row?.orderAmount.toFixed(2) || "-"}</span>,
        },

        {
            Header: `Date`,
            body: "date",
            Cell: ({ row }) => <span className="text-capitalize">{row?.transactionDate?.split(",")[0]}</span>,
        },
    ];


    const handlePageChange = (pageNumber: number) => {
        setPage(pageNumber);
    };

    const handleRowsPerPage = (value: number) => {
        setPage(1);
        setSize(value);
    };

    const selectType = (type: number) => {

        setType(type);
    };


    return (
        <>
            <div className="userPage withdrawal-page border-0">
                <div className="d-flex justify-content-between align-items-center">


                    <div >
                        <FormControl sx={{ width: "200px" }}>
                            <InputLabel
                                id="demo-simple-select-label"
                                style={{
                                    fontWeight: "500",
                                    fontSize: "17px",
                                    marginBottom: "10px",
                                }}
                            >
                                Type
                            </InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={type}
                                label="Type"
                                onChange={(e) => selectType(e.target.value as number)}
                            >


                                <MenuItem value={1} key="Pending">
                                    Earning
                                </MenuItem>
                                <MenuItem value={2} key="Confirmed">
                                    Withdrawal
                                </MenuItem>

                            </Select>
                        </FormControl>
                    </div>

                    <div className="col-6">

                        {/* <NewTitle
                                            dayAnalyticsShow={true}
                                            setEndDate={setEndDate}
                                            setStartDate={setStartDate}
                                            startDate={startDate}
                                            endDate={endDate}
                                            titleShow={false}
                                            name={`Profile`}
                                        /> */}
                    </div>


                </div>
                <div className="payment-setting-box user-table border-0">

                    <div className="mt-3">
                        <Table
                            data={data}
                            mapData={transactionTable}
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
            </div>
        </>
    );
};

export default SellerWiseTransaction;
