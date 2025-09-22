import Button from "@/extra/Button";
import Input from "@/extra/Input";
import Pagination from "@/extra/Pagination";
import Table from "@/extra/Table";
import { getDefaultCurrency } from "@/store/currencySlice";
import { getSellerRequest, sellerRequestAcceptorDecline, sellerRequestDecline } from "@/store/sellerRequestSlice";
import { RootStore, useAppDispatch } from "@/store/store";
import {
  getwithdrawRequest,
  withdrawRequestAccept,
  withdrawRequestDecline,
} from "@/store/withdrawRequestSlice";
import { Box, Modal, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import male from "@/assets/images/male.png"
import { useRouter } from "next/router";
import accept from "@/assets/images/accept.svg";
import decline from "@/assets/images/decline.svg"
import { warningForAccept } from "@/util/Alert";
import infoImage from "@/assets/images/info.svg"

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
const PendingSellerRequest = (props: any) => {

  const router = useRouter()
  const { pendingData, totalPendingData } = useSelector(
    (state: RootStore) => state.sellerRequest
  );


  const hasPermission = useSelector(
    (state: RootStore) => state.admin.admin.flag
  );
  const { currency } = useSelector((state: RootStore) => state.currency);

  const dispatch = useAppDispatch();

  const { startDate, endDate } = props;

  const [page, setPage] = useState(1);
  const [showURLs, setShowURLs] = useState([]);
  const [reasonData, setReasonData] = useState("");
  const [openReason, setOpenReason] = useState(false);
  const [isAccept, setIsAccept] = useState(false);
  const [declinedId, setDeclinedId] = useState<string>();
  const [acceptId, setAcceptId] = useState<any>();
  const [openInfo, setOpenInfo] = useState(false);
  const [infoData, setInfodata] = useState<any>();


  const [error, setError] = useState<ErrorState>({
    reason: "",
  });

  const [size, setSize] = useState(20);
  const [data, setData] = useState([]);
  const [defaultCurrency, setDefaultCurrency] = useState<any>({});

  useEffect(() => {
    let payload: any = {
      status: 1,
      start: page,
      limit: size,
      startDate: startDate,
      endDate: endDate,
    };
    dispatch(getSellerRequest(payload));
    dispatch(getDefaultCurrency());
  }, [dispatch, page, size, startDate, endDate]);

  useEffect(() => {
    setData(pendingData);
    setDefaultCurrency(currency);
  }, [pendingData, currency]);
  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  const handleRowsPerPage = (value) => {
    setPage(1);
    setSize(value);
  };

  const handleOpenInfo = (row) => {
    setOpenInfo(true);
    setInfodata(row);
  };

  const handleRedirect = (data) => {
    try {
      router.push('/SellerInfo')
      localStorage.setItem("sellerInfo", JSON.stringify(data))
    } catch (error) {
      console.log("error", error.message)
    }

  }

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
      Header: "Seller Name",
      accessor: "seller name", 
      Cell: ({ row }) => (
        <div className="d-flex justify-content-end align-items-center">
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
            {row?.sellerFullName}
          </span>
          </div>
        </div>
      ),
    },

    {
      Header: "User name",
      body: "username",
      Cell: ({ row }) => <span>{row?.sellerUsername || "-"}</span>,
    },


    {
      Header: "Business name",
      body: "businessname",
      Cell: ({ row }) => <span>{row?.businessName || "-"}</span>,
    },

    {
      Header: "Business Tag",
      body: "businesstag",
      Cell: ({ row }) => <span>{row?.businessTag || "-"}</span>,
    },

    {
      Header: "Document Type",
      body: "documenttype",
      Cell: ({ row }) => <span>{row?.documentType}</span>,
    },



    {
      Header: "Email",
      body: "email",
      Cell: ({ row }) => <span>{row?.email || "-"}</span>,
    },

    {
      Header: "Mobile Number",
      body: "mobilenumber",
      Cell: ({ row }) => <span>{row?.mobileNumber}</span>,
    },

    

    {
      Header: "Date",
      body: "createdAt",
      Cell: ({ row }) => <span>{row?.date?.split(",")[0] || "-"}</span>,
    },

    {
      Header: "View",
      body: "view",
      Cell: ({ row }) =>
        // <Button
        //   btnName={`Info`}
        //   newClass={`fw-bolder text-white`}
        //   style={{ backgroundColor: "blue", borderRadius: "7px" }}
        //   onClick={() => handleRedirect(row)}
        // />

         <img src={infoImage.src} alt="Info"
         style={{cursor : "pointer"}}
         onClick={() => handleRedirect(row)}
        />
    },



    // {
    //   Header: "Info",
    //   body: "",
    //   Cell: ({ row }) => (
    //     <Button
    //       btnName={`Info`}
    //       newClass={`fw-bolder text-white`}
    //       style={{ backgroundColor: "blue", borderRadius: "7px" }}
    //       onClick={() => handleOpenInfo(row)}
    //     />
    //   ),
    // },

    {
      Header: "Action",
      body: "action",
      Cell: ({ row }) => (
        <div className="d-flex justify-content-center gap-2">
          <button className="accepted-button">
            <img
              src={accept.src}
              alt=""
              height={30}
              width={30}
              onClick={() => handleEdit(row, "pay")}
            />
          </button>

          <button className="declined-button">
            <img
              src={decline.src}
              alt=""
              height={30}
              width={30}
              onClick={() => handleDecline(row?._id)}
            />
          </button>

        </div>
      ),
    },
  ];

  // const handleEdit = (row: any, type: any) => {
  //   setIsAccept(true);
  //   setAcceptId(row?._id);
  // };

  const handleCloseReason = () => {
    setOpenReason(false);
  };

  const handleDecline = (id: any) => {
    setOpenReason(true);
    setDeclinedId(id);
  };

  const handleSubmit = () => {
    if (!reasonData) {
      let error = {} as ErrorState;
      if (!reasonData) error.reason = "Reason is required";
      return setError({ ...error });
    } else {
      const reason = {
        reason: reasonData,
      };
      const payload: any = {
        status: 3,
        sellerId: declinedId,
        reason: reasonData,
      };
      dispatch(sellerRequestDecline(payload));
      handleCloseReason();
    }
  };

  const handleAcceptRequest = () => {
    const payload = {
      status: 2,
      sellerId: acceptId
    }
    dispatch(sellerRequestAcceptorDecline(payload));
    handleIsAccept();
  };

  const handleIsAccept = () => {
    setIsAccept(false);
  };

  const handleCloseInfo = () => {
    setOpenInfo(false);
  };


  const handleEdit = (row: any, type: any) => {
    const data = warningForAccept("seller");
    data
      .then((res) => {
        if (res) {
          const payload = {
            status: 2,
            sellerId: row?._id
          }
          dispatch(sellerRequestAcceptorDecline(payload));
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      { }
      <div className="user-table border-0  real-user mb-3 pt-0">
     
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

      {/* For a Pending Decline a Withdraw request :-  */}
      <Modal
        open={openReason}
        onClose={handleCloseReason}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="create-channel-model">
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Reason
          </Typography>
          <form style={{ padding: "15px", paddingTop: "0px" }}>
            <div className="row sound-add-box" style={{ overflowX: "hidden" }}>
              <div className="col-12 mt-2">
                <div className="col-12 mt-3 text-about">
                  <label className="label-form">Reason</label>
                  <textarea
                    cols={6}
                    rows={4}
                    value={reasonData}
                    placeholder="Enter reason..."
                    onChange={(e) => {
                      setReasonData(e.target.value);
                      if (!e.target.value) {
                        return setError({
                          ...error,
                          reason: `Reason Is Required`,
                        });
                      } else {
                        return setError({
                          ...error,
                          reason: "",
                        });
                      }
                    }}
                  ></textarea>
                  {error.reason && (
                    <p className="errorMessage">
                      {error.reason && error.reason}
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-3 d-flex justify-content-end">
                <Button
                  onClick={handleCloseReason}
                  btnName={"Close"}
                  newClass={"close-model-btn"}
                />
                <Button
                  onClick={handleSubmit}
                  btnName={"Submit"}
                  type={"button"}
                  newClass={"submit-btn"}
                  style={{
                    borderRadius: "0.5rem",
                    width: "88px",
                    marginLeft: "10px",
                  }}
                />
              </div>
            </div>
          </form>
        </Box>
      </Modal>

      {/* For a accepted a Withdraw request :-  */}

      <Modal
        open={isAccept}
        onClose={handleIsAccept}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="create-channel-model">
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Would you like to approve the seller request?
          </Typography>

          <div className="mt-3 d-flex justify-content-end">
            <Button
              onClick={handleIsAccept}
              btnName={"Close"}
              newClass={"close-model-btn"}
            />
            <Button
              onClick={handleAcceptRequest}
              btnName={"Accept"}
              type={"button"}
              newClass={"submit-btn"}
              style={{
                borderRadius: "0.5rem",
                width: "88px",
                marginLeft: "10px",
              }}
            />
          </div>
        </Box>
      </Modal>

      {/* For a Info Dialog :- */}

      {/* <Modal
        open={openInfo}
        onClose={handleCloseReason}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="create-channel-model">
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Bank Details Info
          </Typography>
          <form style={{ padding: "15px", paddingTop: "0px" }}>
            <div className="row sound-add-box" style={{ overflowX: "hidden" }}>
              <div className="col-12 mt-2">

              <div className="col-12 mt-2 text-about">
                 
                </div>
                <div className="col-12 mt-2 text-about">
                  <Input
                    type={"text"}
                    label={"Bank Business name"}
                    name={"Bank Business name"}
                    value={infoData?.bankDetails?.bankBusinessName}
                    newClass={`mt-3`}
                    readOnly
                  />
                </div>

                <div className="col-12 mt-2 text-about">
                  <Input
                    type={"text"}
                    label={"Bank name"}
                    name={"Bank name"}
                    value={infoData?.bankDetails?.bankName}
                    newClass={`mt-1`}
                    readOnly
                  />
                </div>

                <Input
                    type={"text"}
                    label={"Branch name"}
                    name={"Branch name"}
                    value={infoData?.bankDetails?.branchName}
                    newClass={`mt-2`}
                    readOnly
                  />

                <div className="col-12 mt-3 text-about">
                  <Input
                    type={"text"}
                    label={"IFSC Code"}
                    name={"IFSC Code"}
                    value={infoData?.bankDetails?.IFSCCode}
                    newClass={`mt-2`}
                    readOnly
                  />
                </div>

               
               

                <div className="col-12 mt-2 text-about">
                  <Input
                    type={"number"}
                    label={"Account number"}
                    name={"Account number"}
                    value={infoData?.bankDetails?.accountNumber}
                    newClass={`mt-1`}
                    readOnly
                  />
                </div>

             
              </div>
              <div className="mt-3 d-flex justify-content-end">
                <Button
                  onClick={handleCloseInfo}
                  btnName={"Close"}
                  newClass={"close-model-btn"}
                />
              </div>
            </div>
          </form>
        </Box>
      </Modal> */}
    </>
  );
};

export default PendingSellerRequest;
