import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import Table from "../../extra/Table";
import Button from "../../extra/Button";
import Title from "../../extra/Title";
import { connect, useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getOrder } from "../../store/order/order.action";

import Pagination from "../../extra/Pagination";
import Searching from "../../extra/Searching";
import { OPEN_DIALOGUE } from "../../store/dialogue/dialogue.type";
import EditOrder from "./EditOrder";
import Skeleton from "react-loading-skeleton";
import { colors } from "../../../util/SkeletonColor";
import "react-loading-skeleton/dist/skeleton.css";
import EditInfo from "../../../assets/images/Edit.png";
import { ReactComponent as Cancel } from "../../../assets/images/cancel.svg"
import { ReactComponent as Delievered } from "../../../assets/images/deliever.svg";
import { ReactComponent as Edit } from "../../../assets/images/edit.svg";



const Order = (props) => {
  const [size, setSize] = useState(10);
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filteredData, setFilteredData] = useState([]);
  const [sendStatus, setSendStatus] = useState("");

  const { order, totalOrder } = useSelector((state) => state.order);
  const { dialogue, dialogueType, dialogueData } = useSelector(
    (state) => state.dialogue
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { state } = useLocation();

  useEffect(() => {
    dispatch(getOrder(currentPage, size, status));
  }, [dispatch, currentPage, size, status]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500); // Adjust the delay time as needed

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setData(order);
  }, [order]);

  //  pagination
  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event), 10);
    setSize(parseInt(event), 10);
    setCurrentPage(1);
  };

  const handleOpen = (id) => {
    navigate("/admin/order/orderDetail", {
      state: id,
    });
  };
  // searching
  const handleFilterData = (filteredData) => {
    if (typeof filteredData === "string") {
      setSearch(filteredData);
    } else {
      setFilteredData(filteredData);
    }
  };

  let date;

  const editOpenDialog = (data, mapData) => {
    setSendStatus(data?.status);
    dispatch({
      type: OPEN_DIALOGUE,
      payload: {
        data: {
          data,
          mapData,
        },
        type: "order",
      },
    });
  };
  return (
    <>
      <div className="mainSellerTable">
        <div className="sellerTable">
          <div className="sellerHeader primeHeader">
            <div className="row">
              <div className="col-2">
                <div className="btn-group p-3 ms-2">
                  <button
                    type="button"
                    className="btn btnthemePrime dropdown-toggle"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {status ? (
                      <span className="caret text-dark">{status}</span>
                    ) : (
                      <span className="caret text-capitalize">Status</span>
                    )}
                  </button>
                  <ul className="dropdown-menu text-dark">
                    <li style={{ cursor: "pointer" }}>
                      <a
                        className="dropdown-item"
                        href={() => false}
                        onClick={() => setStatus("Pending")}
                      >
                        Pending
                      </a>
                    </li>
                    <li style={{ cursor: "pointer" }}>
                      <a
                        className="dropdown-item"
                        href={() => false}
                        onClick={() => setStatus("Confirmed")}
                      >
                        Confirmed
                      </a>
                    </li>
                    <li style={{ cursor: "pointer" }}>
                      <a
                        className="dropdown-item"
                        href={() => false}
                        onClick={() => setStatus("Out Of Delivery")}
                      >
                        Out Of Delivery
                      </a>
                    </li>
                    <li style={{ cursor: "pointer" }}>
                      <a
                        className="dropdown-item"
                        href={() => false}
                        onClick={() => setStatus("Delivered")}
                      >
                        Delivered
                      </a>
                    </li>
                    <li style={{ cursor: "pointer" }}>
                      <a
                        className="dropdown-item"
                        href={() => false}
                        onClick={() => setStatus("Cancelled")}
                      >
                        Cancelled
                      </a>
                    </li>
                    <li style={{ cursor: "pointer" }}>
                      <a
                        className="dropdown-item"
                        href={() => false}
                        onClick={() => setStatus("All")}
                      >
                        All
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="col-10 p-3">
                <Searching
                  type={`client`}
                  data={order}
                  setData={setData}
                  column={order}
                  onFilterData={handleFilterData}
                  serverSearching={handleFilterData}
                  button={true}
                  setSearchValue={setSearch}
                  searchValue={search}
                />
              </div>
            </div>
          </div>

          <div className="sellerMain">
            <div className="tableMain">
              <div className="primeMain">
                <table
                  width="100%"
                  border
                  className="primeTable text-center"
                  style={{ maxHeight: "680px" }}
                >
                  <thead
                    className="sticky-top"
                    style={{ top: "-1px", zIndex: "1" }}
                  >
                    <tr>
                      <th className="fw-bold py-3" style={{ width: "40px" }}>
                        No
                      </th>
                      <th className="fw-bold py-3" style={{ width: "330px" }}>
                        Order Id
                      </th>
                      <th className="fw-bold py-3" style={{ width: "330px" }}>
                        User Info
                      </th>
                      <th className="fw-bold py-3" style={{ width: "450px" }}>
                        Items
                      </th>
                      <th className="fw-bold py-3" style={{ width: "330px" }}>
                        Price
                      </th>
                      <th className="fw-bold py-3" style={{ width: "330px" }}>
                        Shipping Charge
                      </th>
                      <th className="fw-bold py-3" style={{ width: "330px" }}>
                        Status
                      </th>

                      <th className="fw-bold py-3" style={{ width: "330px" }}>
                        Edit
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.length > 0 ? (
                      <>
                        {data?.map((mapData, index) => {
                          return (
                            <>
                              <tr>
                                <td>
                                  <span className="text-white">{index + 1}</span>
                                </td>
                                <td width="160px" className="">
                                  <span className="tableBoldFont orderId">
                                    <b
                                      className="fw-normal text-white orderIdText"
                                      onClick={() => handleOpen(mapData)}
                                      style={{
                                        cursor: "pointer",
                                      }}
                                    >
                                      {mapData?.orderId}
                                    </b>
                                  </span>
                                </td>
                                <td style={{ width: "350px" }}>
                                  <div>
                                    <span className="tableBoldFont">
                                      <b className="fw-normal text-white">
                                        {mapData?.userId?.firstName
                                          ? mapData?.userId?.firstName + " "
                                          : "EraShop" + " "}
                                        {mapData?.userId?.lastName
                                          ? mapData?.userId?.lastName
                                          : "User"}
                                      </b>
                                    </span>
                                    <br />
                                    <span className="text-white fw-normal">
                                      {mapData?.userId?.uniqueId
                                        ? mapData?.userId?.uniqueId
                                        : "-"}
                                    </span>
                                  </div>
                                </td>
                                <td
                                  colSpan={6}
                                  style={{ width: "70%" }}
                                  className="py-0"
                                >
                                  {mapData?.items.map((data) => {
                                    return (
                                      <>
                                        <div className="">
                                          <table
                                            width="100%"
                                            border
                                            className=" text-center"
                                          >
                                            <tbody>
                                              <tr
                                                style={{
                                                  borderLeft:
                                                    "2px solid #f3f3f3",
                                                }}
                                              >
                                                <td
                                                  className="my-2"
                                                  style={{ width: "360px" }}
                                                >
                                                  <div className="">
                                                    <div className="d-flex">
                                                      {loading ? (
                                                        <>
                                                          <Skeleton
                                                            height={55}
                                                            width={55}
                                                            className="StripeElement "
                                                            baseColor={
                                                              colors?.baseColor
                                                            }
                                                            highlightColor={
                                                              colors?.highlightColor
                                                            }
                                                          />
                                                        </>
                                                      ) : (
                                                        <>
                                                          <img
                                                            src={
                                                              data.productId
                                                                ?.mainImage
                                                            }
                                                            width={55}
                                                            height={55}
                                                            style={{
                                                              borderRadius:
                                                                "10px",
                                                              margin: "5px",
                                                              objectFit:
                                                                "cover",
                                                            }}
                                                            alt=""
                                                            srcset=""
                                                          />
                                                        </>
                                                      )}
                                                      <div className="ms-3 text-start">
                                                        <b className="fs-6 text-white">
                                                          {
                                                            data.productId
                                                              ?.productName
                                                          }
                                                        </b>
                                                        <br />
                                                        <span
                                                          style={{
                                                            fontSize: "13px",
                                                            color: "#FFF"
                                                          }}
                                                        >
                                                          <b className="text-white">
                                                            Quantity
                                                          </b>
                                                          :
                                                          {
                                                            data?.productQuantity
                                                          }
                                                        </span>
                                                        <br />
                                                        <span
                                                          style={{
                                                            fontSize: "13px",
                                                            color: "#FFF"
                                                          }}
                                                        >
                                                          <b className="text-white">
                                                            Price
                                                          </b>
                                                          :
                                                          {
                                                            data?.purchasedTimeProductPrice
                                                          }
                                                          $
                                                        </span>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </td>
                                                <td
                                                  className="my-2"
                                                  style={{ width: "350px" }}
                                                >
                                                  <div className="">
                                                    <b className="fs-6 text-white">
                                                      {data?.purchasedTimeProductPrice *
                                                        data?.productQuantity}
                                                      $
                                                    </b>
                                                  </div>
                                                </td>
                                                <td
                                                  className="my-2"
                                                  style={{ width: "350px" }}
                                                >
                                                  <div className="">
                                                    <b className="fs-6 text-white">
                                                      {
                                                        data?.purchasedTimeShippingCharges
                                                      }
                                                      $
                                                    </b>
                                                  </div>
                                                </td>
                                                <td
                                                  className="my-2"
                                                  style={{ width: "350px" }}
                                                >
                                                  <div className="boxCenter">
                                                    {(data?.status ===
                                                      "Pending" && (
                                                        <span className="badge badge-danger p-2">
                                                          Pending
                                                        </span>
                                                      )) ||
                                                      (data?.status ===
                                                        "Confirmed" && (
                                                          <span className="badge badge-success p-2">
                                                            Confirmed
                                                          </span>
                                                        )) ||
                                                      (data?.status ===
                                                        "Cancelled" && (
                                                          <span className="badge badge-danger p-2">
                                                            Cancelled
                                                          </span>
                                                        )) ||
                                                      (data?.status ===
                                                        "Out Of Delivery" && (
                                                          <span className="badge badge-warning p-2">
                                                            Out Of Delivery
                                                          </span>
                                                        )) ||
                                                      (data?.status ===
                                                        "Delivered" && (
                                                          <span className="badge badge-info p-2">
                                                            Delivered
                                                          </span>
                                                        ))}
                                                  </div>
                                                </td>
                                                <td
                                                  className="my-2"
                                                  style={{ width: "280px" }}
                                                >
                                                  <span className="d-flex justify-content-center">
                                                    {data?.status === "Cancelled" ? (
                                                      // Show cancel icon when data?.status is "Cancelled"
                                                      <Button
                                                        newClass={`themeFont boxCenter userBtn fs-5`}
                                                        btnIcon={`fa fa-times`}
                                                        style={{
                                                          borderRadius: "5px",
                                                          margin: "auto",
                                                          width: "40px",
                                                          backgroundColor: "#fff",
                                                          color: "#160d98",
                                                        }}

                                                      />

                                                    ) : data?.status === "Delivered" ? (
                                                      // Show delivered icon when status is "Delivered"
                                                      <Button
                                                        newClass={`themeFont boxCenter userBtn fs-5`}
                                                        btnIcon={`fas fa-shipping-fast`}
                                                        style={{
                                                          borderRadius: "5px",
                                                          margin: "auto",
                                                          width: "40px",
                                                          backgroundColor: "#FFF",
                                                          color: "#160d98",
                                                        }}

                                                      />

                                                    )

                                                      : (
                                                        // Show edit button for other statuses
                                                        <Button
                                                          newClass={`themeFont boxCenter userBtn fs-5`}
                                                          btnIcon={EditInfo}
                                                          style={{
                                                            borderRadius: "8px",
                                                            margin: "auto",
                                                            height: "45px",
                                                            width: "45px",
                                                            color: "#160d98",
                                                            background: "#C7E2FF"

                                                          }}
                                                          isImage={true}
                                                          onClick={() =>
                                                            editOpenDialog(
                                                              data,
                                                              mapData
                                                            )
                                                          }

                                                        />


                                                      )}
                                                  </span>
                                                  {/* <div className="">
                                                    <Button
                                                      newClass={`themeFont boxCenter userBtn fs-5`}
                                                      btnIcon={`far fa-edit`}
                                                      style={{
                                                        borderRadius: "5px",
                                                        margin: "auto",
                                                        width: "40px",
                                                        backgroundColor: "#fff",
                                                        color: "#160d98",
                                                      }}
                                                      onClick={() =>
                                                        editOpenDialog(
                                                          data,
                                                          mapData
                                                        )
                                                      }
                                                    />
                                                  </div> */}
                                                </td>
                                              </tr>
                                            </tbody>
                                          </table>
                                        </div>
                                      </>
                                    );
                                  })}
                                </td>
                              </tr>
                            </>
                          );
                        })}
                      </>
                    ) : (
                      <tr>
                        <td colSpan="25" className="text-center text-white">
                          No Data Found !
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <Pagination
                component="div"
                count={totalOrder}
                totalData={totalOrder}
                type={"server"}
                onPageChange={handleChangePage}
                serverPerPage={rowsPerPage}
                serverPage={currentPage}
                setCurrentPage={setCurrentPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
              {dialogue && dialogueType === "order" && (
                <EditOrder statusData={sendStatus} />
              )}
            </div>
          </div>
          <div className="sellerFooter primeFooter"></div>
        </div>
      </div>
    </>
  );
};

export default connect(null, { getOrder })(Order);
// export default Seller;
