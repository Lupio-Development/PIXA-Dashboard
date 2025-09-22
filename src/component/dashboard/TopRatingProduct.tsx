import Table from "@/extra/Table";
import { getTopRatingProduct } from "@/store/dashSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import male from "@/assets/images/male.png"
import { Rating } from "@mui/material";

const TopRatingProduct = (props) => {
  const {startDate , endDate} = props;
    const {
        topRatingProduct
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
        dispatch(getTopRatingProduct(payload))
    }, [startDate , endDate])

    useEffect(() => {
        setData(topRatingProduct)
    }, [topRatingProduct])

    const ratingTable = [
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
                  <div
                    
                    style={{ width: "60px" , textAlign : "center" }}
                  >
                    <img
                      src={row.mainImage || male.src}
                      alt={"Image"}
                      width="40"
                      height="40"
                      style={{ borderRadius: "5px", objectFit: "cover" }} // Styling for better appearance
                    />
                  </div>
            
                  <div style={{ width: "200px" ,textAlign : "start" }}>
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
                    
                    style={{ width: "60px" , textAlign : "center" }}
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
                  <div style={{ width: "200px" ,textAlign : "start" }}>
                  <span className="text-capitalize ms-3  cursorPointer text-nowrap">
                    {row?.sellerFullName || "-"}
                  </span>
                  </div>
                </div>
              ),
            },

            {
              Header: "Business Name",
              Cell: ({ row }: { row, index }) => (
                  <div className="userProfile">
                  <span>{row?.businessName || "-"}</span>
                </div>
              ),
          },

            
            {
                Header: "Category",
                Cell: ({ row }: { row, index }) => (
                    <div className="userProfile">
                    <span>{row?.categoryName || "-"}</span>
                  </div>
                ),
            },

            {
              Header: "Sub Category",
              Cell: ({ row }: { row, index }) => (
                  <div className="userProfile">
                  <span>{row?.subCategoryName || "-"}</span>
                </div>
              ),
          },

            {
              Header: "Review",
              Cell: ({ row }: { row, index }) => (
                <div className="userProfile">
                <span>{row?.review || "-"}</span>
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
                <Table data={data} mapData={ratingTable} 
                    PerPage={size}
                    Page={page}
                    type={"client"} />
            </div>
        </div>
    )
}

export default TopRatingProduct