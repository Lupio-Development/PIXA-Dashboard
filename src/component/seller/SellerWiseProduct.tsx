import Pagination from "@/extra/Pagination";
import Table from "@/extra/Table";
import { RootStore, useAppDispatch } from "@/store/store";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getSellerWiseProduct } from "@/store/sellerSlice";
import male from "@/assets/images/male.png"
import { getDefaultCurrency } from "@/store/currencySlice";

const SellerWiseProduct = (props) => {
    const {startDate , endDate} = props
    const { sellerWiseProduct, total } = useSelector((state: RootStore) => state.seller);
    const {currency} = useSelector((state : any) => state.currency)
    const sellerData = typeof window !== "undefined"
        && JSON.parse(localStorage.getItem("sellerInfo"))
    const dispatch = useAppDispatch();
    const [data, setData] = useState<any>([]);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(20);

    useEffect(() => {
        const payload = {
            sellerId: sellerData?._id,
            start: page,
            limit: size,
            startDate: startDate,
            endDate: endDate
        }
        dispatch(getSellerWiseProduct(payload));
    }, [dispatch, page, size, startDate, endDate]);

    useEffect(() => {
        dispatch(getDefaultCurrency())
    },[])

    useEffect(() => {
        setData(sellerWiseProduct);
    }, [sellerWiseProduct]);


    const contactUsTable = [
        {
            Header: "NO",
            body: "name",
            Cell: ({ index }) => <span>{index + 1}</span>,
        },

        {
            Header: "Product code",
            body: "productCode",
            Cell: ({ row }) => (
                <span className="text-capitalize">{row?.productCode}</span>
            ),
        },

        {
            Header: "Category",
            body: "name",
            Cell: ({ row }) => <span className="text-capitalize">{row?.category?.name}</span>,
        },

        {
            Header: "SubCategory",
            body: "name",
            Cell: ({ row }) => <span className="text-capitalize">{row?.subCategory?.name}</span>,
        },

        {
            Header: "Product",
            accessor: "mainImage", 
            Cell: ({ row }) => (
              <div className="d-flex justify-content-center align-items-center">
                {/* Image Section */}
                <div
                  
                  style={{ width: "50px" , textAlign : "center" }}
                >
                  <img
                    src={row.mainImage || male.src}
                    alt={row.productName || "Product Image"}
                    width="40"
                    height="40"
                    style={{ borderRadius: "5px", objectFit: "cover" }} // Styling for better appearance
                  />
                </div>
          
                {/* Product Name */}
                <div style={{ width: "200px", marginLeft: "20px" , textAlign : "start" }}>
                  <span className="text-capitalize">
                    {row.productName || "-"}
                  </span>
                </div>
              </div>
            ),
          },

          {
            Header: `Price (${currency?.symbol})`,
            body: "price",
            Cell: ({ row }) => <span className="text-capitalize">{`${row?.price}`}</span>,
        },

        {
            Header: `Shipping Charges (${currency?.symbol})`,
            body: "shippingCharges",
            Cell: ({ row }) => <span className="text-capitalize">{row?.shippingCharges}</span>,
        },

       

        {
            Header: "Status",
            body: "createStatus",
            Cell: ({ row }) => {
                let statusText = "Unknown";  
                let badgeClass = "badge-secondary"; 

                if (row?.productCreateStage === 2) {
                    statusText = "Accepted";
                    badgeClass = "badge-success";
                } else if (row?.productCreateStage === 3) {
                    statusText = "Declined";
                    badgeClass = "badge-danger";
                } else if (row?.productCreateStage === 1) {
                    statusText = "Pending";
                    badgeClass = "badge-primary";
                }

                return (
                    <div
                        className="boxCenter"
                        style={{ display: "flex", justifyContent: "center" }}
                    >
                        <span
                            className={`badge ${badgeClass}`}
                            style={{
                                display: "inline-block",
                                padding: "7px 0px",
                                width: "115px",
                                textAlign: "center",
                            }}
                        >
                            {statusText}
                        </span>
                    </div>
                );
            },
        },

        {
            Header: "Created date",
            body: "createdAt",
            Cell: ({ row }) => (
                <span className="text-capitalize">
                    {row?.date?.split(",")[0]}
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
            <div className="userPage withdrawal-page pt-0">
                <div className="payment-setting-box user-table border-0">
                    <div className="mt-3">
                        <Table
                            data={sellerWiseProduct}
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

export default SellerWiseProduct;
