import React, { useEffect, useState } from "react";
import Button from "../../extra/Button";
import { useDispatch, useSelector } from "react-redux";
import Input from "../../extra/Input";
import { closeDialog } from "@/store/dialogSlice";
import { RootStore } from "@/store/store";
import Selector from "../../extra/Selector";
import { Box, Modal, Typography } from "@mui/material";
import { orderUpdate } from "@/store/sellerSlice";

interface EditOrderProps {
  orderUpdate: (
    userId: string,
    orderId: string,
    status: string,
    itemId: string,
    data?: Record<string, string>
  ) => void;
  statusData: string;
}

interface DialogueData {
  data?: {
    _id?: string;
    deliveredServiceName?: string;
    trackingId?: string;
    trackingLink?: string;
    status?: string;
  };
  state?: {
    userId?: { _id: string };
    _id?: string;
  };
  mapData?: {
    userId?: { _id: string };
    _id?: string;
  };
  row?: { _id: string };
}

const style: React.CSSProperties = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  backgroundColor: "#fff",
  borderRadius: "13px",
  border: "1px solid #C9C9C9",
  boxShadow: "24px",
  padding: "19px",
};

const EditOrder: any = ({ statusData }) => {
  const { dialogueData, dialogue } = useSelector((state: RootStore) => state.dialogue);
  const dispatch = useDispatch();
  const [addCurrencyOpen, setAddCurrencyOpen] = useState(false);
  const [mongoId, setMongoId] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<string>("");
  const [deliveredServiceName, setDeliveredServiceName] = useState<string>("");
  const [trackingId, setTrackingId] = useState<string>("");
  const [trackingLink, setTrackingLink] = useState<string>("");
  const [error, setError] = useState({
    deliveredServiceName: "",
    trackingId: "",
    trackingLink: "",
    status: "",
  });


  const type = localStorage.getItem("type");



  useEffect(() => {
    setMongoId(dialogueData?.data?._id);
    setDeliveredServiceName(dialogueData?.data?.deliveredServiceName || "");
    setTrackingId(dialogueData?.data?.trackingId || "");
    setTrackingLink(dialogueData?.data?.trackingLink || "");
    setStatus(statusData);
  }, [dialogueData, statusData]);

  useEffect(() => {
    if (dialogue) {
      setAddCurrencyOpen(dialogue);
    }
  }, [dialogue]);

  const orderType = [
    { name: "Pending", value: "Pending" },
    { name: "Confirmed", value: "Confirmed" },
    { name: "Out Of Delivery", value: "Out Of Delivery" },
    { name: "Delivered", value: "Delivered" },
    { name: "Cancelled", value: "Cancelled" },
  ];

  const filteredOrderType = orderType.filter((option) => {
    const currentStatus = dialogueData?.status;

    if (currentStatus === 1) {
      return option.value === "Confirmed" ; // Show only Confirmed
    }
    if (currentStatus === 2) {
      return option.value === "Out Of Delivery"|| option.value === "Cancelled";  // Move to Out Of Delivery
    }
    if (currentStatus === 3) {
      return option.value === "Delivered" || option.value === "Cancelled"; // Final states
    }
    return false; // Hide all other cases
  });



  const userId = dialogueData?.state?.userId?._id || dialogueData?.mapData?.userId?._id;
  const orderId = dialogueData?.state?._id || dialogueData?.mapData?._id;
  const itemId = dialogueData?.row?._id || dialogueData?.data?._id;

  const handleSubmit = () => {
    let errors = {
      deliveredServiceName: "",
      trackingId: "",
      trackingLink: "",
      status: "",
    };

    if (!status) {
      errors.status = "Status is Required!";
    }

    if (status === "Out Of Delivery") {
      if (!deliveredServiceName) errors.deliveredServiceName = "Delivered Service Name is Required!";
      if (!trackingId) errors.trackingId = "Tracking Id is Required!";
      if (!trackingLink) {
        errors.trackingLink = "Tracking Link is Required!";
      } else {
        const httpsRegex = /^https:\/\/.+/;
        if (!httpsRegex.test(trackingLink)) {
          errors.trackingLink = "Tracking Link must start with https://";
        }
      }
    }

    setError(errors);

    // If any error exists, stop submission
    if (Object.values(errors).some((err) => err)) return;

    // Convert status to numeric values
    const statusMap: Record<string, number> = {
      Pending: 1,
      Confirmed: 2,
      "Out Of Delivery": 3,
      Delivered: 4,
      Cancelled: 5,
    };

    const data = {
      deliveredServiceName,
      trackingId,
      trackingLink,
      userId: dialogueData?.userId,
      orderId: dialogueData?.orderId,
      itemId: dialogueData?.itemId,
      status: statusMap[status] || "",
    };

    // Call orderUpdate with proper arguments
    dispatch(orderUpdate(data))

    dispatch(closeDialog());
  };


  const handleCloseAddCurrency = () => {
    dispatch(closeDialog());
  };

  return (
    <Modal
      open={addCurrencyOpen}
      onClose={handleCloseAddCurrency}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style} className="create-channel-model">
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Edit Order
        </Typography>
        <form>
          <Selector
            label="Edit Order"
            selectValue={status}
            placeholder="Select status..."
            selectData={filteredOrderType}
            selectId={true}
            disabled={!!mongoId}
            errorMessage={error.status}
            onChange={(e) => {
              setStatus(e.target.value);
              setError({ ...error, status: e.target.value ? "" : "Status Is Required" });
            }}
          />
          {status === "Out Of Delivery" && (
            <div className="row mt-2">
              <div className="col-6">
                <Input
                  label="Delivered Service Name"
                  value={deliveredServiceName}
                  errorMessage={error.deliveredServiceName}
                  onChange={(e) => {
                    const value = e.target.value;
                    setDeliveredServiceName(value);

                    // Validate input
                    setError((prev) => ({
                      ...prev,
                      deliveredServiceName: value.trim() ? "" : "Delivered Service Name is Required!",
                    }));
                  }}
                />
              </div>
              <div className="col-6">
                <Input
                  label="Tracking Id"
                  value={trackingId}
                  errorMessage={error.trackingId}
                  onChange={(e) => {
                    const value = e.target.value;
                    setTrackingId(value);

                    // Validate input
                    setError((prev) => ({
                      ...prev,
                      trackingId: value.trim() ? "" : "Tracking Id is Required!",
                    }));
                  }}
                />
              </div>
              <div className="col-6">
                <Input
                  label="Tracking Link"
                  value={trackingLink}
                  errorMessage={error.trackingLink}
                  onChange={(e) => {
                    const value = e.target.value;
                    setTrackingLink(value);

                    // Ensure trackingLink starts with 'https://'
                    const httpsRegex = /^https:\/\/.+/;
                    if (!httpsRegex.test(value)) {
                      setError((prev) => ({
                        ...prev,
                        trackingLink: "Tracking Link must start with https://",
                      }));
                    } else {
                      setError((prev) => ({
                        ...prev,
                        trackingLink: "",
                      }));
                    }
                  }}
                />
              </div>
            </div>
          )}

          <div className="dialogueFooter">
            <Button onClick={handleCloseAddCurrency} btnName="Close" newClass="close-model-btn" />
            <Button
              onClick={handleSubmit}
              btnName="Update"
              type="button"
              newClass="submit-btn"
              style={{
                borderRadius: "0.5rem",
                width: "80px",
                marginLeft: "10px",
              }}
            />
          </div>
        </form>
      </Box>
    </Modal>
  );
};

export default EditOrder;
