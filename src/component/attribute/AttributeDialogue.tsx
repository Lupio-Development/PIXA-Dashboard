import Button from "@/extra/Button";
import Input from "@/extra/Input";
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
  height : 600,
  backgroundColor: "background.paper",
  borderRadius: "13px",
  border: "1px solid #C9C9C9",
  boxShadow: "24px",
  padding: "19px",
  overflowX : "auto"
};

const AttributeDialogue = () => {
  const dispatch = useAppDispatch();
  const { dialogue, dialogueData } = useSelector(
    (state: RootStore) => state.dialogue
  );

  const [addOpen, setAddOpen] = useState(false);
  const [mongoId, setMongoId] = useState<string>("");

  const [categoryName, setCategoryName] = useState<string>("");
  const [attributes, setAttributes] = useState<
    { name: string; values: string[] }[]
  >([]);

  const [error, setError] = useState<any>({
    categoryName: "",
    attributes: [],
  });

  useEffect(() => {
    if (dialogue) {
      setAddOpen(dialogue);
    }
  }, [dialogue]);

  useEffect(() => {
    if (dialogueData) {
      setMongoId(dialogueData._id);
      setCategoryName(dialogueData?.category || "");
      setAttributes(dialogueData?.attributes || []);
    }
  }, [dialogueData]);

  // Handle Attribute Change
  const handleAttributeChange = (index: number, field: string, value: any) => {
    const updatedAttributes = [...attributes];
    updatedAttributes[index] = {
      ...updatedAttributes[index],
      [field]: value,
    };
    setAttributes(updatedAttributes);
  };

  // Handle Attribute Values Change
  const handleValuesChange = (index: number, value: string) => {
    const updatedAttributes = [...attributes];
    updatedAttributes[index].values = value.split(",").map((v) => v.trim()); // Convert to Array
    setAttributes(updatedAttributes);
  };

  // Add New Attribute
  const addAttribute = () => {
    setAttributes([...attributes, { name: "", values: [] }]);
  };

  // Remove Attribute
  const removeAttribute = (index: number) => {
    const updatedAttributes = attributes.filter((_, i) => i !== index);
    setAttributes(updatedAttributes);
  };

  const handleSubmit = () => {
    if (!categoryName || attributes.some((attr) => !attr.name || !attr.values.length)) {
      setError({
        categoryName: categoryName ? "" : "Category Name is required!",
        attributes: attributes.map((attr) => ({
          name: attr.name ? "" : "Attribute Name is required!",
          values: attr.values.length ? "" : "At least one value is required!",
        })),
      });
      return;
    }

    handleCloseModal();
  };

  const handleCloseModal = () => {
    setAddOpen(false);
    dispatch(closeDialog());
  };

  return (
    <Modal open={addOpen} onClose={handleCloseModal}>
      <Box sx={style} className="create-channel-model">
        <Typography variant="h6">
          {dialogueData ? "Edit Attribute" : "Add Attribute"}
        </Typography>
        <div className="p-3">
          <Input
            label={"Category Name"}
            name={"categoryName"}
            value={categoryName}
            errorMessage={error.categoryName}
            onChange={(e: any) => setCategoryName(e.target.value)}
          />

          <div className="row">
            {attributes.map((attr, index) => (
              <div key={index} className="col-12 mb-3">
                <div className="card shadow-sm border-0 p-3">
                  <div className="d-flex justify-content-between align-items-center shadow-md">
                    <h6 className="text-black fw-bold">Attribute {index + 1}</h6>
                    {attributes.length > 1 && (
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => removeAttribute(index)}
                      >
                      Close
                      </button>
                    )}
                  </div>
                  <Input
                    label={"Attribute Name"}
                    value={attr.name}
                    errorMessage={error.attributes[index]?.name}
                    onChange={(e: any) => handleAttributeChange(index, "name", e.target.value)}
                  />
                  <Input
                    label={"Attribute Values"}
                    value={attr.values.join(", ")}
                    errorMessage={error.attributes[index]?.values}
                    onChange={(e: any) => handleValuesChange(index, e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Show "Add Attribute" button ONLY when creating a new attribute */}
          {!dialogueData && (
            <button className="btn bg-body-secondary w-100 mb-3" onClick={addAttribute}>
             Add Attribute
            </button>
          )}

          <div className="d-flex justify-content-end">
            <Button onClick={handleCloseModal} btnName={"Close"} newClass={"btn btn-danger"} />
            <Button
              onClick={handleSubmit}
              btnName={dialogueData ? "Update" : "Submit"}
              type={"button"}
              newClass={"btn btn-success ms-2"}
            />
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default AttributeDialogue;
