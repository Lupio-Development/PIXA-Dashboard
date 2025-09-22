import Button from "@/extra/Button";
import Pagination from "@/extra/Pagination";
import Table from "@/extra/Table";
import { RootStore, useAppDispatch } from "@/store/store";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import male from "@/assets/images/male.png"
import { useRouter } from "next/router";
import { getProductRequest } from "@/store/productRequestSlice";


const style: React.CSSProperties = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    backgroundColor: "background.paper",
    borderRadius: "13px",
    border: "1px solid #C9C9C9",
    boxShadow: "24px",
    padding: "19px",
};
interface ErrorState {
    reason: string;
}
export const UpdateItem = (props: any) => {

    const { productUpdateItemData, totalPendingData } = useSelector(
        (state: RootStore) => state.productRequest);

    const { currency } = useSelector((state: RootStore) => state.currency);

    const dispatch = useAppDispatch();

    const { startDate, endDate } = props;
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(20);
    const [data, setData] = useState([]);

    useEffect(() => {
        let payload: any = {
            status: 2,
            start: page,
            limit: size,
            requestType: "update"
        };
        dispatch(getProductRequest(payload));
    }, [dispatch, page, size, startDate, endDate]);

    useEffect(() => {
        setData(productUpdateItemData);
    }, [productUpdateItemData, currency]);


    const handlePageChange = (pageNumber) => {
        setPage(pageNumber);
    };

    const handleRowsPerPage = (value) => {
        setPage(1);
        setSize(value);
    };


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
            Header: "Product Code",
            body: "businessname",
            Cell: ({ row }) => <span>{row?.productCode || "-"}</span>,
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
            Header: "Category",
            body: "category",
            Cell: ({ row }) => <span>{row?.category?.name || "-"}</span>,

        },

        {
            Header: "Sub Category",
            body: "subcategory",
            Cell: ({ row }) => <span>{row?.subCategory?.name || "-"}</span>,

        },


        {
            Header: "Product",
            accessor: "mainImage",
            Cell: ({ row }) => (
                <div className="d-flex justify-content-center align-items-center">
                    {/* Image Section */}
                    <div

                        style={{ width: "50px", textAlign: "center" }}
                    >
                        <img
                            src={row.mainImage || male.src}
                            alt={row.productName || "Product Image"}
                            width="40"
                            height="40"
                            style={{ borderRadius: "5px", objectFit: "cover" }}
                        />
                    </div>

                    {/* Product Name */}
                    <div style={{ width: "200px", marginLeft: "20px", textAlign: "start" }}>
                        <span className="text-capitalize">
                            {row.productName || "-"}
                        </span>
                    </div>
                </div>
            ),
        },

        {
            Header: "Status",
            body: "createStatus",
            Cell: ({ row }) => {


                return (
                    <div
                        className="boxCenter"
                        style={{ display: "flex", justifyContent: "center" }}
                    >
                        {
                            row?.productUpdateStage === 1 ?
                                <button className="btnproduct">
                                    Pending
                                </button> : row?.productUpdateStage === 2 ?
                                    <button className="btn1">
                                        Accepted
                                    </button> :
                                    <button className="btn4">
                                        Declined
                                    </button>
                        }
                    </div>
                );
            },
        },

        {
            Header: "Date",
            body: "createdAt",
            Cell: ({ row }) => <span>{row?.date?.split(",")[0] || "-"}</span>,
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
                    userTotal={totalPendingData}
                    setPage={setPage}
                    handleRowsPerPage={handleRowsPerPage}
                    handlePageChange={handlePageChange}
                />
            </div>
        </>
    );
};


