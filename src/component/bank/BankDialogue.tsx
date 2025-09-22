import Button from "@/extra/Button";
import Input from "@/extra/Input";
import { createBank, getBanks, updateBank } from '@/store/bankSlice';
import { closeDialog } from "@/store/dialogSlice";
import { RootStore, useAppDispatch } from "@/store/store";
import { Box, Modal, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
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
  name: any;
}
const BankDialogue = () => {
  const { dialogue, dialogueData, dialogueType } = useSelector(
    (state: RootStore) => state.dialogue
  );
  useEffect(() => {
    dispatch(getBanks());
  }, []);

  const dispatch = useAppDispatch();
  const [name, setName] = useState<string>();
  const [mongoId, setMongoId] = useState<string>("");
  const [addCategoryOpen, setAddCategoryOpen] = useState(false);
  const [error, setError] = useState({
    name: ""
  });

  useEffect(() => {
    if (dialogue) {
      setAddCategoryOpen(dialogue);
    }
  }, [dialogue]);

  useEffect(() => {
      if (dialogueData) {
        setMongoId(dialogueData._id);
        setName(dialogueData.name);
      }
    }, [dialogueData]);

  const handleCloseAddCategory = () => {
    setAddCategoryOpen(false);
    dispatch(closeDialog());
    localStorage.setItem("dialogueData", JSON.stringify(dialogueData));
  };

  const handleSubmit = (e: any) => {


    if (!name) {
      let error = {} as ErrorState;
      if (!name) error.name = "Bank Name is required";
      return setError({ ...error });
    } else {
  

      if (dialogueData) {
        let payload:any = {
          bankId: mongoId,
          name : name
        };

        dispatch(updateBank(payload));
      } else {
        let addPayload:any = {
          name : name
        }
        dispatch(createBank(addPayload));
      }

      dispatch(closeDialog());
    }
  };

  return (
    <div>
      <Modal
        open={addCategoryOpen}
        onClose={handleCloseAddCategory}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="create-channel-model">
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {dialogueData ? "Edit Bank" : "Add Bank"}
          </Typography>
          <form>
            <div className="row sound-add-box" style={{ overflowX: "hidden" }}>
              <Input
                type={"text"}
                label={"Bank Name"}
                value={name}
                errorMessage={error.name && error.name}
                onChange={(e) => setName(e.target.value)}
              />
               {error.name && <p className="text-danger">{error.name}</p>}
               </div>
              <div className="mt-3 d-flex justify-content-end">
                <Button
                  onClick={handleCloseAddCategory}
                  btnName={"Close"}
                  newClass={"close-model-btn"}
                />
                <Button
                  onClick={handleSubmit}
                  btnName={dialogueData ? "Update" : "Submit"}
                  type={"button"}
                  newClass={"submit-btn"}
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
    </div>
  );
};

export default BankDialogue;
