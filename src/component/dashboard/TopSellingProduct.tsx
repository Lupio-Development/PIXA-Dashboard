import Table from "@/extra/Table";
import { getTopSellingProduct } from "@/store/dashSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import male from "@/assets/images/male.png"
import { Rating } from "@mui/material";

const TopSellingProduct = (props) => {
  const { startDate, endDate } = props;
  const {
    topSellingProduct
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
    dispatch(getTopSellingProduct(payload))
  }, [startDate, endDate])

  useEffect(() => {
    setData(topSellingProduct)
  }, [topSellingProduct])

  const sellingTable = [
    {
      Header: "No",
      Cell: ({ index }: { index: any }) => (
        <span>{page * parseInt(index) + 1}</span>
      ),
    },

    {
      Header: "Product Code",
      Cell: ({ row }: { row, index }) => (
        <div className="userProfile">
          <span>{row?.productCode || "-"}</span>
        </div>
      ),
    },


    {
      Header: "Product",
      accessor: "product",
      Cell: ({ row }) => (
        <div className="d-flex justify-content-center align-items-center">
          {/* Image Section */}
          <div

            style={{ width: "60px", textAlign: "center" }}
          >
            <img
              src={row.mainImage || male.src}
              alt={"Image"}
              width="40"
              height="40"
              style={{ borderRadius: "5px", objectFit: "cover" }} // Styling for better appearance
            />
          </div>

          {/* Product Name */}
          <div style={{ width: "200px", textAlign: "start" }}>
            <span className="text-capitalize ms-3  cursorPointer text-nowrap">
              {row?.productName}
            </span>
          </div>
        </div>
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
              src={row?.seller?.image || male?.src}
              alt={"Image"}
              width="40"
              height="40"
              style={{ borderRadius: "5px", objectFit: "cover" }} // Styling for better appearance
            />
          </div>

          {/* Product Name */}
          <div style={{ width: "200px", textAlign: "start" }}>
            <span className="text-capitalize ms-3  cursorPointer text-nowrap">
              {row?.seller?.sellerFullName || "-"}
            </span>
          </div>
        </div>
      ),
    },

    {
      Header: "Business name",
      Cell: ({ row }: { row, index }) => (
        <div className="userProfile">
          <span>{row?.seller?.businessName || "-"}</span>
        </div>
      ),
    },

    {
      Header: "Sold",
      Cell: ({ row }: { row, index }) => (
        <div className="userProfile">
          <span>{row?.sold || 0}</span>
        </div>
      ),
    },


    {
      Header: "Rating",
      Cell: ({ row }: { row, index }) => (
        <Rating className="me-3" value={row?.rating || 0}
          style={{ pointerEvents: "none" }} // Prevent interaction
        />
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
        <Table data={data} mapData={sellingTable}
          PerPage={size}
          Page={page}
          isSpacing={false}
          type={"client"} />
      </div>
    </div>
  )
}

export default TopSellingProduct