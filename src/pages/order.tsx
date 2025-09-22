import Pagination from "@/extra/Pagination";
import Table from "@/extra/Table";
import { RootStore, useAppDispatch, useAppSelector } from "@/store/store";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getSellerWiseOrder, getSellerWiseProduct, getStatusWiseOrder } from "@/store/sellerSlice";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import Button from "@/extra/Button";
import { useRouter } from "next/router";
import RootLayout from "@/component/layout/Layout";
import NewTitle from "../extra/Title";
import male from "@/assets/images/male.png"
import { openDialog } from "@/store/dialogSlice";
import Image from "next/image";
import EditIcon from "../assets/icons/EditBtn.svg";
import EditOrder from "@/component/order/EditOrder";
import Delievered from "@/assets/images/dellievred.svg";
import Cancel from "@/assets/images/cancel.svg";
import { AnyMxRecord } from "dns";
import { getDefaultCurrency } from "@/store/currencySlice";

const Order = (props) => {

    const { dialogueType } = useSelector(
        (state: RootStore) => state.dialogue
    );
    const { currency } = useSelector((state: any) => state.currency)
    const { statusWiseOrder, total } = useSelector((state: RootStore) => state.seller);
    const [startDate, setStartDate] = useState<string | Date>("All"); // Updated type
    const [endDate, setEndDate] = useState<string | Date>("All"); // Updated type
    const router = useRouter();

    const dispatch = useAppDispatch();
    const [type, setType] = useState<any>("All");
    const [data, setData] = useState<any>([]);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(20);

   typeof window !== "undefined" && localStorage.setItem("type" , type);

    const orderData = statusWiseOrder?.map((item: any) => item?.items).flat();
    const orderIds = statusWiseOrder?.map(order => order.orderId);

    useEffect(() => {
        dispatch(getDefaultCurrency())
    }, [])

    useEffect(() => {
        setData(orderData)
    }, [])


    useEffect(() => {
        const payload = {
            start: page,
            limit: size,
            status: type,
            startDate : startDate,
            endDate : endDate

        }
        dispatch(getStatusWiseOrder(payload));
    }, [dispatch, page, size, type, startDate, endDate]);


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

    const handleRedirect = (id) => {
        router.push({
            pathname: "/OrderDetailPage",
            query: { id: id }, // Convert object to string
        });
        typeof window !== "undefined" && localStorage.setItem("orderId", id);
    };
    return (
        <>
            {dialogueType === "order" && <EditOrder />}



            <div className="dashboardHeader primeHeader mt-3">
                <div className="gap-3 d-flex justify-content-between">

                    {/* <h5 style={{
                        marginLeft : "10px"
                    }}>Order</h5> */}
                    <div className="userPage withdrawal-page p-0">

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

                        <NewTitle
                            dayAnalyticsShow={true}
                            setEndDate={setEndDate}
                            setStartDate={setStartDate}
                            startDate={startDate}
                            endDate={endDate}
                            titleShow={false}
                            name={`Profile`}
                        />
                    </div>
                </div>

                <div className="payment-setting-box user-table border-0">
                    <div className="mt-3 primeMain table-custom">
                        <div className="table-responsive">
                            <table width="100%" className="primeTable text-center table-container" >
                                <thead className="sticky-top">
                                    <tr>
                                        <th className="fw-bold py-3">No</th>
                                        <th className="fw-bold py-3"
                                        >Order Id</th>
                                        <th className="fw-bold py-3">User Info</th>
                                        <th className="fw-bold py-3">Items</th>
                                        <th className="fw-bold py-3">{`Price (${currency?.symbol})`}</th>
                                        <th className="fw-bold py-3">{`Shipping Charge (${currency?.symbol})`}</th>
                                        <th className="fw-bold py-3">{`Admin Commission (${currency?.symbol})`}</th>
                                        <th className="fw-bold py-3">Status</th>
                                        <th className="fw-bold py-3">Edit</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {statusWiseOrder?.map((mapData, index) => {
                                        return mapData?.items?.map((data, itemIndex) => {
                                            const payload = {
                                                orderId: mapData?._id,
                                                userId: mapData?.userId?._id,
                                                itemId: data?._id,
                                                status: data?.status
                                            };

                                            return (
                                                <tr key={data?.productId?._id || itemIndex} className="border-bottom">
                                                    {itemIndex === 0 && (
                                                        <>
                                                            <td rowSpan={mapData.items.length}>
                                                                <span className="text-dark">{index + 1}</span>
                                                            </td>
                                                            <td className="order-id-hover" onClick={() => handleRedirect(mapData?._id)} rowSpan={mapData.items.length}>
                                                                <p className="fw-normal text-dark orderIdText " style={{ cursor: "pointer" }}>
                                                                    {mapData?.orderId}
                                                                </p>
                                                            </td>
                                                            <td rowSpan={mapData.items.length}>
                                                                <p className="fw-normal text-dark mb-0">
                                                                    {mapData?.userId?.firstName ?? "Shortie"} {mapData?.userId?.lastName ?? "User"}
                                                                </p>
                                                                <p>{mapData?.userId?.uniqueId ?? "-"}</p>
                                                            </td>
                                                        </>
                                                    )}
                                                    <td>
                                                        <div className="d-flex align-items-center">
                                                            <img
                                                                src={data.productId?.mainImage}
                                                                width={55}
                                                                height={55}
                                                                style={{ borderRadius: "10px", objectFit: "cover" }}
                                                                alt=""
                                                            />
                                                            <div className="ms-3 text-start">
                                                                <p className="fs-6 text-dark mb-1">{data.productId?.productName}</p>
                                                                <p className="text-dark small mb-1">Quantity: {data?.productQuantity}</p>
                                                                <p className="text-dark small">Unit Price: {data?.purchasedTimeProductPrice}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>{data?.purchasedTimeProductPrice * data?.productQuantity}</td>
                                                    <td>{data?.purchasedTimeShippingCharges}</td>
                                                    <td>{data?.commissionPerProductQuantity.toFixed(2) || 0}</td>
                                                    <td>

                                                        {
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
                                                        }

                                                       
                                                    </td>
                                                    <td>
                                                        {
                                                            data?.status === 4 ?
                                                                <img
                                                                    src={Delievered.src}
                                                                    height={28}
                                                                    width={28}
                                                                /> :
                                                                data?.status === 5 ?
                                                                    // <Button
                                                                    //     newClass={`themeFont boxCenter userBtn fs-5`}
                                                                    //     btnIcon={`fas fa-shipping-fast`}
                                                                    //     style={{
                                                                    //         borderRadius: "5px",
                                                                    //         margin: "auto",
                                                                    //         width: "40px",
                                                                    //         backgroundColor: "#FFF",
                                                                    //         color: "#160d98",
                                                                    //     }}
                                                                    // /> 
                                                                    <img
                                                                        src={Cancel.src}
                                                                        height={28}
                                                                        width={28}
                                                                    />
                                                                    :
                                                                    <Button
                                                                        newClass="themeFont boxCenter userBtn fs-5"
                                                                        btnIcon={<Image src={EditIcon} alt="EditIcon" height={25} width={25} />}
                                                                        onClick={() => {
                                                                            dispatch(openDialog({ type: "order", data: payload }));
                                                                        }}
                                                                    />
                                                        }
                                                    </td>
                                                </tr>
                                            );
                                        });
                                    })}
                                </tbody>
                            </table>
                        </div>

                    </div>

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

        </>
    );
};

Order.getLayout = function getLayout(page) {
    return <RootLayout>{page}</RootLayout>;
};


export default Order;
