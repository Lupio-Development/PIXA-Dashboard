import Table from "@/extra/Table";
import { getTopBuyer } from "@/store/dashSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import male from "@/assets/images/male.png";
import isVerfied from "@/assets/images/verified.png";

const TopBuyer = (props) => {
  const { startDate, endDate } = props;
  const {
    topBuyer
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
    dispatch(getTopBuyer(payload))
  }, [startDate, endDate])

  useEffect(() => {
    setData(topBuyer)
  }, [topBuyer])

  const sellingTable = [
    {
      Header: "No",
      Cell: ({ index }: { index: any }) => (
        <span>{page * parseInt(index) + 1}</span>
      ),
    },

    {
      Header: "Buyer",
      accessor: "buyer",
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
              {row?.name || "-"}
              {
                row?.isVerified == true ?
                  <img
                    src={isVerfied.src}
                    alt={"Image"}
                    width="25"
                    height="25"
                    style={{ borderRadius: "5px", objectFit: "cover", marginLeft: "10px" }} // Styling for better appearance
                  /> : ""
              }
            </span>
          </div>
        </div>
      ),
    },

    {
      Header: "Country",
      Cell: ({ row }: { row, index }) => (
        <span>{row?.country || "-"}</span>
      ),
    },


    {
      Header: "Total Coin",
      Cell: ({ row }: { row, index }) => (
        <span>{row?.coin || "-"}</span>
      ),
    },


    {
      Header: "Total Order",
      Cell: ({ row }: { row, index }) => (
        <div className="userProfile">
          <span>{row?.orderCount || 0}</span>
        </div>
      ),
    },

  ];

  return (
    <div className="dashboard-analytics recent-order p-0">
      <div className="row bg-white">
        <Table data={data} mapData={sellingTable}
          PerPage={size}
          Page={page}
          type={"client"} />
      </div>
    </div>
  )
}

export default TopBuyer