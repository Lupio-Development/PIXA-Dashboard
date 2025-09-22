import Table from "@/extra/Table";
import { getRecentOrder } from "@/store/dashSlice";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import male from "@/assets/images/male.png"
import { getDefaultCurrency } from "@/store/currencySlice";



const RecentOrder = (props) => {
    const { startDate, endDate } = props
    const {
        recentOrder
    } = useSelector((state: any) => state.dashboard);
    const { currency } = useSelector((state: any) => state.currency);
    const [page, setPage] = useState<any>(1);
    const [size, setSize] = useState(20);
    const [data, setData] = useState([]);
    const dispatch = useDispatch();
    const router = useRouter();

    useEffect(() => {
        const payload = {
            startDate,
            endDate
        }
        dispatch(getRecentOrder(payload))
        dispatch(getDefaultCurrency())
    }, [startDate, endDate])

    useEffect(() => {
        setData(recentOrder)
    }, [recentOrder])


    const handleRedirect = (id) => {
        router.push({
            pathname: "/OrderDetailPage",
            query: { id: id }, // Convert object to string
        });
        typeof window !== "undefined" && localStorage.setItem("orderId", id);

    };

    const orderTable = [
        {
            Header: "No",
            Cell: ({ index }: { index: any }) => (
                <span>{page * parseInt(index) + 1}</span>
            ),
        },
        {
            Header: "Order Id",
            Cell: ({ row }: { row, index }) => (
                <div
                    className="userProfile order-id-hover"
                    style={{
                        cursor: "pointer"
                    }}
                    onClick={() => handleRedirect(row?._id)}
                >
                    <span>{row?.orderId}</span>
                </div>
            ),
        },

        {
            Header: "Product",
            accessor: "product",
            Cell: ({ row }) => (
                <div className="d-flex flex-column justify-content-center align-items-center">
                    {row?.items?.map((item, index) => (
                        <div key={index} className="d-flex align-items-center mb-2">
                            {/* Image Section */}
                            <div style={{ width: "60px", textAlign: "center" }}>
                                <img
                                    src={item?.productId?.mainImage || male.src}
                                    alt="Product"
                                    width="40"
                                    height="40"
                                    style={{ borderRadius: "5px", objectFit: "cover" }}
                                />
                            </div>

                            {/* Product Name */}
                            <div style={{ width: "200px", textAlign: "start" }}>
                                <span className="text-capitalize ms-3 cursorPointer text-nowrap">
                                    {item?.productId?.productName}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            ),
        },

        {
            Header: "User",
            body: "user",
            Cell: ({ row, index }) => (
                <div className="d-flex justify-content-center align-items-center">
                    {/* Image Section */}
                    <div

                        style={{ width: "50px", textAlign: "end" }}
                    >
                        <img
                            src={row?.userId?.image || male.src}
                            alt={row.productName || "Product Image"}
                            width="40"
                            height="40"
                            style={{ borderRadius: "5px", objectFit: "cover" }}
                        />
                    </div>

                    {/* Product Name */}
                    <div style={{ width: "100px", textAlign: "start" }}>
                        <span className="text-capitalize ms-3  cursorPointer text-nowrap">
                            {row?.userId?.name}
                        </span>
                    </div>
                </div>
            ),
        },



        {
            Header: "User Name",
            Cell: ({ row }: { row, index }) => (
                <div className="userProfile">
                    <span>{row?.userId?.userName || "-"}</span>
                </div>
            ),
        },

        {
            Header: "Payment Gateway",
            Cell: ({ row }: { row, index }) => (
                <div className="userProfile">
                    <span>{row?.paymentGateway || "-"}</span>
                </div>
            ),
        },


        {
            Header: `Total (${currency?.symbol})`,
            Cell: ({ row }: { row, index }) => (
                <div className="userProfile">
                    <span>{row?.finalTotal || 0}</span>
                </div>
            ),
        },

        {
            Header: `Date`,
            Cell: ({ row }: { row, index }) => (
                <div className="userProfile">
                    <span>{row?.date?.split(",")[0] || "-"}</span>
                </div>
            ),
        },

    ];

    return (
        <div className="dashboard-analytics recent-order "
        >
            <div className="row bg-white ">
                <Table data={data} PerPage={size}
                    Page={page} mapData={orderTable} type={"client"} />
            </div>
        </div>
    )
}

export default RecentOrder