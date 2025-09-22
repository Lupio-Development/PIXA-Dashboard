import Button from "@/extra/Button";
import Input from "@/extra/Input";
import Pagination from "@/extra/Pagination";
import Table from "@/extra/Table";
import { getDefaultCurrency } from "@/store/currencySlice";
import { RootStore, useAppDispatch } from "@/store/store";
import {
  getwithdrawRequest,
  sellerWithdrawRequestAccept,
  sellerWithdrawRequestDecline,
  withdrawRequestAccept,
  withdrawRequestDecline,
} from "@/store/withdrawRequestSlice";
import { baseURL } from "@/util/config";
import { Box, Modal, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import accept from "@/assets/images/accept.svg";
import decline from "@/assets/images/decline.svg";
import infoImage from "@/assets/images/info.svg"
import { warningForAccept } from "@/util/Alert";
import male from "@/assets/images/male.png"

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
const PendingRequest = (props: any) => {
  const { sellerPendingWithdrawRequest, totalPendingData } = useSelector(
    (state: RootStore) => state.withdrawRequest
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
  const [personId, setPersonId] = useState();

  const [error, setError] = useState<ErrorState>({
    reason: "",
  });

  const [size, setSize] = useState(20);
  const [data, setData] = useState([]);
  const [defaultCurrency, setDefaultCurrency] = useState<any>({});

  useEffect(() => {
    let payload: any = {
      type: 1,
      start: page,
      limit: size,
      startDate: startDate,
      endDate: endDate,
      person: 2
    };
    dispatch(getwithdrawRequest(payload));
    dispatch(getDefaultCurrency());
  }, [dispatch, page, size, startDate, endDate]);

  useEffect(() => {
    setData(sellerPendingWithdrawRequest);
    setDefaultCurrency(currency);
  }, [sellerPendingWithdrawRequest, currency]);
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

  const ManageUserData = [
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
      Header: `User name`,
      body: "unique id",
      Cell: ({ row }) => (
        <span className="text-lowercase cursorPointer">{row?.sellerId?.sellerUsername || "-"}</span>
      ),
    },

    {
      Header: `Unique Id`,
      body: "unique id",
      Cell: ({ row }) => (
        <span className="text-lowercase cursorPointer">{row?.uniqueId}</span>
      ),
    },
    {
      Header: `Amount (${defaultCurrency?.symbol})`,
      body: "requestAmount",
      Cell: ({ row }) => (
        <span className="text-lowercase cursorPointer">{row?.amount}</span>
      ),
    },

    {
      Header: "Payment gateway",
      body: "paymentGateway",
      Cell: ({ row }) => <span>{row?.paymentGateway}</span>,
    },
    {
      Header: "Date",
      body: "createdAt",
      Cell: ({ row }) => <span>{row?.status === 1 ? row?.requestDate?.split(",")[0] : row?.acceptOrDeclineDate}</span>,
    },

    {
      Header: "Info",
      body: "",
      Cell: ({ row }) => (
        <img src={infoImage.src} alt="Info"
          onClick={() => handleOpenInfo(row)}
        />
      ),
    },

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
              onClick={() => handleDecline(row)}
            />
          </button>

        </div>
      ),
    },
  ];


  const handleEdit = (row: any, type: any) => {
    const data = warningForAccept("seller withdraw");
    data
      .then((res) => {
        if (res) {
          const payload = {
            requestId: row?._id,
            personId: row?.sellerId?._id
          }
          dispatch(sellerWithdrawRequestAccept(payload));;
        }
      })
      .catch((err) => console.log(err));
  }



  const handleCloseReason = () => {
    setOpenReason(false);
  };

  const handleDecline = (row: any) => {
    setOpenReason(true);
    setDeclinedId(row?._id);
    setPersonId(row?.sellerId?._id)
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
        withdrawRequestId: declinedId,
        reason: reasonData,
        personId: personId
      };
      dispatch(sellerWithdrawRequestDecline(payload));
      handleCloseReason();
    }
  };

  const handleAcceptRequest = () => {
    dispatch(withdrawRequestAccept(acceptId));
    handleIsAccept();
  };

  const handleIsAccept = () => {
    setIsAccept(false);
  };

  const handleCloseInfo = () => {
    setOpenInfo(false);
  };

  return (
    <>
      { }
      <div className="user-table real-user mb-3 border-0">
        <Table
          data={data}
          mapData={ManageUserData}
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
            Would you like to approve the withdraw request?
          </Typography>

          <div className="mt-3 d-flex justify-content-end">
            <Button
              onClick={handleIsAccept}
              btnName={"Close"}
              newClass={"close-model-btn"}
            />
            <Button
              onClick={handleAcceptRequest}
              btnName={"Pay"}
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

      <Modal
        open={openInfo}
        onClose={handleCloseReason}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="create-channel-model">
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Payment Details Info
          </Typography>
          <form style={{ padding: "15px", paddingTop: "0px" }}>
            <div className="row sound-add-box" style={{ overflowX: "hidden" }}>
              <div className="col-12 mt-2">
                <div className="col-12 mt-3 text-about">
                  <Input
                    type={"text"}
                    label={"Payment Gateway"}
                    name={"Payment Gateway"}
                    value={infoData?.paymentGateway}
                    newClass={`mt-3`}
                    readOnly
                  />
                </div>

                {infoData?.paymentDetails?.map((item) => {
                  return (
                    <div className="col-12 mt-1 text-about">
                      <Input
                        type={"text"}
                        label={item?.split(":")[0]}
                        name={"Payment Details"}
                        value={item?.split(":")[1]}
                        newClass={`mt-3`}
                        readOnly
                      />
                    </div>
                  );
                })}
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
      </Modal>
    </>
  );
};

export default PendingRequest;
