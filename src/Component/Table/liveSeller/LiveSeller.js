import { Link, Navigate, useNavigate } from "react-router-dom";
import Table from "../../extra/Table";
import Button from "../../extra/Button";
import Title from "../../extra/Title";
import { connect, useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getLiveSeller } from "../../store/seller/seller.action";
import ToggleSwitch from "../../extra/ToggleSwitch";
import dayjs from "dayjs";
import Pagination from "../../extra/Pagination";
import Searching from "../../extra/Searching";
import Skeleton from "react-loading-skeleton";
import { colors } from "../../../util/SkeletonColor";
import "react-loading-skeleton/dist/skeleton.css";
import Info from "../../../assets/images/Info.svg"

const LiveSeller = (props) => {
  const [size, setSize] = useState(10);
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState("");

  const { liveSeller } = useSelector((state) => state.seller);

  const navigate = useNavigate();
  const dispatch = useDispatch();



  useEffect(() => {
    dispatch(getLiveSeller(currentPage, size));
  }, [dispatch, currentPage, size]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500); // Adjust the delay time as needed

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setData(liveSeller);
  }, [liveSeller]);

  // // pagination
  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event), 10);
    setSize(parseInt(event), 10);
    setCurrentPage(1);
  };

  const handleOpen = (id) => {
    navigate("/admin/liveSellerProduct", {
      state: {
        id: id,
      },
    })
  };

  // searching

  const handleFilterData = (filteredData) => {
    if (typeof filteredData === "string") {
      setSearch(filteredData);
    } else {
      setData(filteredData);
    }
  };

  const mapData = [
    {
      Header: "No",
      width: "20px",
      Cell: ({ index }) => <span className="text-white">{index + 1}</span>,
    },
    {
      Header: "Seller",
      body: "firstName",
      Cell: ({ row }) => (
        <div className="d-flex">
          <div className="position-relative">
            {loading ? (
              <>
                <Skeleton
                  height={80}
                  width={80}
                  className="StripeElement "
                  baseColor={colors?.baseColor}
                  highlightColor={colors?.highlightColor}
                />
              </>
            ) : (
              <>
                <img
                  src={row?.image}
                  style={{ borderRadius: "10px" }}
                  height={80}
                  width={80}
                  alt=""
                />
                <div
                  className="ping"
                  style={{
                    position: "absolute",
                    bottom: "0px",
                    left: "0px",
                  }}
                >
                  .
                </div>
              </>
            )}
          </div>
          <span className="boxCenter text-start ms-3">
            <b className="fw-normal text-white">{row?.firstName + " " + row?.lastName}</b>
          </span>
        </div>
      ),
      sorting: true,
    },

    {
      Header: "Email",
      body: "email",
      Cell: ({ row }) => (
        <div className="">
          <p className="mb-0 fw-normal text-white">
            {row.email ? row.email : "Tango@gmail.com"}
          </p>
        </div>
      ),
      sorting: true,
    },
    {
      Header: "Contect",
      body: "contect",
      Cell: ({ row }) => (
        <div className="">
          <p className="mb-0 text-white fw-normal">{row.mobileNumber ? row.mobileNumber : "-"}</p>
        </div>
      ),
    },
    {
      Header: "Business Name", body: "businessName",

      Cell: ({ row }) => (
        <>
          <span className="text-white fw-normal">
            {row.businessName}
          </span>
        </>
      ),
    },
    {
      Header: "Business Tag", body: "businessTag",

      Cell: ({ row }) => (
        <>
          <span className="text-white fw-normal">
            {row.businessTag}
          </span>
        </>
      ),
    },
    {
      Header: "View", body: "view",

      Cell: ({ row }) => (
        <>
          <span className="text-white fw-normal">
            {row.view}
          </span>
        </>
      ),
    },

    {
      Header: "View Product",
      body: "",
      Cell: ({ row }) => (

        <Button
          newClass={`themeFont boxCenter userBtn fs-5`}
          btnIcon={Info}
          style={{
            borderRadius: "8px",
            margin: "auto",
            height: "45px",
            width: "45px",
            color: "#160d98",
            background: "#C4F3FF",
            padding: "0px"
          }}
          isImage={true}
          isDeleted={true}
          disabled={row.isFake === true ? true : false}
          onClick={() => handleOpen(row?._id)}

        />
        // <Button
        //   newClass={`${
        //     row.isFake === true ? "grayText" : "themeFont"
        //   } boxCenter userBtn fs-4`}
        //   btnColor={``}

        //   btnIcon={`bi bi-info-circle`}
        //   onClick={() => handleOpen(row?._id)}
        //   disabled={row.isFake === true ? true : false}
        //   style={{
        //     borderRadius: "5px",
        //     margin: "auto",
        //     width: "40px",
        //     backgroundColor: "#fff",
        //   }}
        // />
      ),
    },

    // add more columns as needed
  ];
  return (
    <>
      <div className="mainSellerTable">
        <div className="sellerTable">
          <div className="sellerHeader primeHeader">
            <div className="row">
              <div className="col-2">

              </div>
              <div className="col-10 text-end">
                <Searching
                  type={`client`}
                  data={liveSeller}
                  setData={setData}
                  column={data}
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
            <div className="tableMain mt-2">
              <Table
                data={data}
                mapData={mapData}
                serverPerPage={rowsPerPage}
                serverPage={page}
                type={"server"}
              />
              <Pagination
                component="div"
                count={liveSeller?.length}
                type={"server"}
                onPageChange={handleChangePage}
                serverPerPage={rowsPerPage}
                totalData={liveSeller?.length}
                serverPage={currentPage}
                setCurrentPage={setCurrentPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </div>
          </div>
          <div className="sellerFooter primeFooter"></div>
        </div>
      </div>
    </>
  );
};

export default connect(null, { getLiveSeller })(LiveSeller);
// export default LiveSeller;
