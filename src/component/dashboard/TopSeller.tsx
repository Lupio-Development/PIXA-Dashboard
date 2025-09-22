import Table from "@/extra/Table";
import { getTopSeller } from "@/store/dashSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import male from "@/assets/images/male.png"

const TopSeller = (props) => {
    const { startDate, endDate } = props
    const {
        topSeller
    } = useSelector((state: any) => state.dashboard);
    const [page, setPage] = useState<any>(1);
    const [size, setSize] = useState(20);
    const [data, setData] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        const payload = {
            startDate,
            endDate
        }
        dispatch(getTopSeller(payload))
    }, [startDate, endDate])

    useEffect(() => {
        setData(topSeller)
    }, [topSeller])

    const sellingTable = [
        {
            Header: "No",
            Cell: ({ index }: { index: any }) => (
                <span>{page * parseInt(index) + 1}</span>
            ),
        },
        {
            Header: "Seller",
            accessor: "seller",
            Cell: ({ row }) => (
                <div className="d-flex justify-content-center align-items-center">
                    {/* Image Section */}
                    <div

                        style={{ width: "60px", textAlign: "center" }}
                    >
                        <img
                            src={row.image || male.src}
                            alt={"Image"}
                            width="40"
                            height="40"
                            style={{ borderRadius: "5px", objectFit: "cover" }} // Styling for better appearance
                        />
                    </div>

                    {/* Product Name */}
                    <div style={{ width: "200px", textAlign: "start" }}>
                        <span className="text-capitalize ms-3  cursorPointer text-nowrap">
                            {row?.sellerFullName || "-"}
                        </span>
                    </div>
                </div>
            ),
        },

        {
            Header: "User name",
            Cell: ({ row }: { row, index }) => (
                <div className="userProfile">
                    <span>{row?.sellerUsername || "-"}</span>
                </div>
            ),
        },

        {
            Header: "Business name",
            Cell: ({ row }: { row, index }) => (
                <div className="userProfile">
                    <span>{row?.businessName || "-"}</span>
                </div>
            ),
        },

        {
            Header: "Total Product",
            Cell: ({ row }: { row, index }) => (
                <div className="userProfile">
                    <span>{row?.totalProduct || 0}</span>
                </div>
            ),
        },

        {
            Header: "Total Sold Product",
            Cell: ({ row }: { row, index }) => (
                <div className="userProfile">
                    <span>{row?.totalProductsSold || 0}</span>
                </div>
            ),
        },

    ];

    return (
        <div className="dashboard-analytics recent-order"
            style={{
                paddingLeft: "16px",
                paddingRight: "10px",
            }}
        >
            <div className="row bg-white">
                <Table
                    data={data}
                    mapData={sellingTable}
                    PerPage={size}
                    Page={page}
                    type={"client"} />
            </div>
        </div>
    )
}

export default TopSeller