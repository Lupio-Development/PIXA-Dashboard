"use-client";

import React, { useEffect, useState } from "react";
import { Box, Modal, Typography } from "@mui/material";
import { closeDialog } from "../../store/dialogSlice";
import {  useSelector } from "react-redux";
import Input from "../../extra/Input";
import Button from "../../extra/Button";
import { RootStore, useAppDispatch } from "@/store/store";
import { createDocumentTypetSetting, updateDocuemtTypeSetting, updateReportSetting } from "@/store/settingSlice";


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
  title: string;
}
const DocumentTypeDialog = () => {
  const { dialogue, dialogueData } = useSelector(
    (state: RootStore) => state.dialogue
  );
  const dispatch = useAppDispatch();
  const [addCategoryOpen, setAddCategoryOpen] = useState(false);
  const [mongoId, setMongoId] = useState<string>("");
  const [title, setTittle] = useState<string>("");
  const [error, setError] = useState<ErrorState>({
    title: "",
  });

  useEffect(() => {
    if (dialogueData) {
      setTittle(dialogueData?.title);
    }
  }, [dialogue, dialogueData]);

  const handleCloseAddCategory = () => {
    setAddCategoryOpen(false);
    dispatch(closeDialog());
    localStorage.setItem("dialogueData", JSON.stringify(dialogueData));
  };

  useEffect(() => {
    setAddCategoryOpen(dialogue);
    setMongoId(dialogueData?._id);
  }, [dialogue]);

  const handleSubmit = () => {
    if (!title) {
      let error = {} as ErrorState;
      if (!title) {
        error.title = "title is required";
      }
      return setError({ ...error });
    } else {
      let payload: any;
      if (mongoId) {
        payload = {
            title: title,

          documentTypeId: mongoId,
        };
        dispatch(updateDocuemtTypeSetting(payload));
      } else {
        payload = {
          title,
        };
        dispatch(createDocumentTypetSetting(payload));
      }
    }
    dispatch(closeDialog());
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
            {dialogueData ? "Edit Document Type" : "Add Document Type"}
          </Typography>
          <form>
            <div className="row sound-add-box" style={{ overflowX: "hidden" }}>
              <div className="col-12 mt-2">
                <Input
                  label={"Title"}
                  name={"Title"}
                  placeholder={"Enter Title"}
                  value={title}
                  type={"text"}
                  errorMessage={error.title && error.title}
                  onChange={(e) => {
                    const value = e.target.value;
                    setTittle(value);
                    if (!value) {
                      setError({
                        ...error,
                        title: "Title Is Required",
                      });
                    } else {
                      setError({
                        ...error,
                        title: "",
                      });
                    }
                  }}
                />
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
                    width: "88px",
                    marginLeft: "10px",
                  }}
                />
              </div>
            </div>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default DocumentTypeDialog;
