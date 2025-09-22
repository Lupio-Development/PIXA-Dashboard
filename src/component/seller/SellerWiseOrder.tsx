import Pagination from "@/extra/Pagination";
import Table from "@/extra/Table";
import { RootStore, useAppDispatch, useAppSelector } from "@/store/store";
import dayjs from "dayjs";
import NewTitle from "../../extra/Title";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getSellerWiseOrder, getSellerWiseProduct } from "@/store/sellerSlice";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import Button from "@/extra/Button";
import { useRouter } from "next/router";
import male from "@/assets/images/male.png";

const SellerWiseOrder = (props) => {
    const {startDate , endDate} = props;
    const { sellerWiseOrder, total } = useSelector((state: RootStore) => state.seller);
    const router = useRouter();


    const sellerData = typeof window !== "undefined"
        && JSON.parse(localStorage.getItem("sellerInfo"))

    const dispatch = useAppDispatch();
    const [type, setType] = useState<any>("All");
    const [data, setData] = useState<any>([]);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(20);

    useEffect(() => {
        const payload = {
            sellerId: sellerData?._id,
            start: page,
            limit: size,
            status: type,
            startDate: startDate,
            endDate: endDate,

        }
        dispatch(getSellerWiseOrder(payload));
    }, [dispatch, page, size, type, startDate, endDate]);

    useEffect(() => {
        setData(sellerWiseOrder);
    }, [sellerWiseOrder]);

    const getStatusClass = (status) => {
        switch (status) {
            case 1: return "badge-primary"; // Pending
            case 2: return "badge-success"; // Confirmed
            case 3: return "bg-warning text-dark"; // Out Of Delivery
            case 4: return "bg-info text-white"; // Delivered
            case 5: return "bg-danger text-white"; // Cancelled
            default: return "bg-secondary text-white"; // Unknown
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 1: return "Pending";
            case 2: return "Confirmed";
            case 3: return "Out Of Delivery";
            case 4: return "Delivered";
            case 5: return "Cancelled";
            default: return "Unknown";
        }
    }

    const handleRedirect = (id) => {


        router.push({
            pathname: "/OrderDetailPage",
            query: { id: id }, // Convert object to string
        });

        typeof window !== "undefined" && localStorage.setItem("orderId", id);

    };


    const contactUsTable = [
        {
            Header: "NO",
            body: "name",
            Cell: ({ index }) => <span>{index + 1}</span>,
        },

        {
            Header: "Order Id",
            body: "name",
            Cell: ({ row }) => (
                <div style={{
                    cursor: "pointer"
                }}
                    onClick={() => handleRedirect(row?._id)}
                >
                    <span className="text-capitalize order-id-hover">
                        {row?.orderId}
                    </span>
                </div>
            )
            ,
        },

        {
            Header: "User",
            body: "user",
            Cell: ({ row }) => <span className="text-capitalize">{row?.user?.name}</span>,
        },
        {
            Header: "Product",
            body: "product",
            Cell: ({ row }) => (
                <div className="d-flex justify-content-center align-items-center">
                    {row?.items?.map((item, index) => (
                        <div key={index} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            {/* Product Image */}
                            <div style={{ width: "60px", textAlign: "center" }}>
                                <img
                                    src={item.mainImage || male.src}
                                    alt="Image"
                                    width="40"
                                    height="40"
                                    style={{ borderRadius: "5px", objectFit: "cover" }}
                                />
                            </div>

                            {/* Product Name */}
                            <div style={{ width: "200px", textAlign: "start" }}>
                                <span className="text-capitalize ms-3 cursorPointer text-nowrap">
                                    {item.productName || row?.sellerFullName}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            ),
        },

        {
            Header: "Status",
            body: "status",
            Cell: ({ row }) => (
                <div>
                    {row?.items?.map((data, index) => (
                       data?.status === 1 ?
                       <button className="btnpending">
                           Pending
                       </button> : data?.status === 2 ?
                           <button className="btn1">
                               Confirmed
                           </button> : data?.status === 3 ?
                               <button className="btn2">
                                   Out Of Delivery
                               </button> : data?.status === 4 ?
                                <button className="btn3">
                                Delivered
                            </button>  : data?.status === 5 ?
                            <button className="btn4">
                            Cancel
                        </button> : ""
                    ))}
                </div>
            ),
        },


        {
            Header: "Payment Gateway",
            body: "payment gateway",
            Cell: ({ row }) => (
                <span className="text-capitalize">{row?.paymentGateway || "-"}</span>
            ),
        },

        {
            Header: "Date",
            body: "createdAt",
            Cell: ({ row }) => (
                <span className="text-capitalize">
                    {row?.createdAt ? row?.createdAt?.split("T")[0] : ""}
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

    const selectType = (type: number) => {
        let payload: any = {
            startDate: "All",
            endDate: "All",
            type: type,
        };
        setType(type);
    };


    return (
        <>

            <div className="dashboardHeader primeHeader p-0 mt-3">
                <div className="d-flex justify-content-between align-items-center gap-3">
                    <div className="userPage withdrawal-page">

                        {/* Dropdown */}
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
                                <MenuItem value="All" key="All">All</MenuItem>
                                <MenuItem value={1} key="Pending">Pending</MenuItem>
                                <MenuItem value={2} key="Confirmed">Confirmed</MenuItem>
                                <MenuItem value={3} key="OUT_OF_DELIVERY">Out of Delivery</MenuItem>
                                <MenuItem value={4} key="DELIVERED">Delivered</MenuItem>
                                <MenuItem value={5} key="CANCELLED">Cancelled</MenuItem>
                            </Select>
                        </FormControl>
                        {/* NewTitle beside the dropdown */}
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
                            mapData={contactUsTable}
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

export default SellerWiseOrder;
