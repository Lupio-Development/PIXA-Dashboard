import { Box, IconButton, Modal, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import Selector from "../../extra/Selector";
import Input from "../../extra/Input";
import Button from "../../extra/Button";
import AddIcon from "@mui/icons-material/Add";
import { useSelector } from "react-redux";
import ReactSelect from "react-select";
import { allUsers } from "../../store/userSlice";
import { closeDialog } from "../../store/dialogSlice";
import CloseIcon from "@mui/icons-material/Close";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import ReactDropzone, { FileWithPath, Accept } from "react-dropzone";
import {
  addFakePost,
  updateFakePost,
  uploadMultipleFiles,
  allHashTag,
} from "../../store/postSlice";
import { RootStore, useAppDispatch } from "@/store/store";
import { projectName } from "@/util/config";
import hashTagIcon from "@/assets/images/hashTagPlace.png";

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

const CreateFakePost = () => {
  const { dialogue, dialogueData } = useSelector((state: RootStore) => state.dialogue);
  const { fakeUserData } = useSelector((state: RootStore) => state.user);
  const { allHashTagData } = useSelector((state: RootStore) => state.post);
  
  const [mongoId, setMongoId] = useState<string>("");
  const [caption, setCaption] = useState<string>("");
  const [selectedHashtag, setSelectedHashtag] = useState<any[]>([]);
  const [fakeUserId, setFakeUserId] = useState<any>(null);
  
  // Track existing image URLs (from the server) and new image files separately
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  
  // Combined images for display
  const [displayImages, setDisplayImages] = useState<(string | File)[]>([]);
  
  // Track removed image indices
  const [removedIndices, setRemovedIndices] = useState<number[]>([]);
  
  const [error, setError] = useState({
    caption: "",
    images: "",
    fakeUserId: "",
    hashTag: "",
  });

  const dispatch = useAppDispatch();
  const folderStructure = `${projectName}/admin/postImage`;

  // Set initial state when modal opens
  useEffect(() => {
    if (dialogue) {
      // Reset states when opening the modal
      if (!dialogueData) {
        setMongoId("");
        setCaption("");
        setFakeUserId(null);
        setSelectedHashtag([]);
        setExistingImages([]);
        setNewImageFiles([]);
        setDisplayImages([]);
        setRemovedIndices([]);
        setError({
          caption: "",
          images: "",
          fakeUserId: "",
          hashTag: "",
        });
      } else {
        // Fill data for edit mode
        setMongoId(dialogueData?._id || "");
        setCaption(dialogueData?.caption || "");
        setFakeUserId(dialogueData?.userId || null);
        
        // Handle hashtags
        const hashtags = dialogueData?.hashTags || 
          (dialogueData?.hashTagId?.map(item => item) || []);
        setSelectedHashtag(hashtags);
        
        // Handle images
        const imageUrls = dialogueData?.postImage?.map(post => post.url) || [];
        setExistingImages(imageUrls);
        setDisplayImages(imageUrls);
        setNewImageFiles([]);
        setRemovedIndices([]);
      }
    }
  }, [dialogue, dialogueData]);

  // Fetch users and hashtags
  useEffect(() => {
    const payload : any = {
      type: "fakeUser",
      start: 1,
      limit: 100,
      startDate: "All",
      endDate: "All",
    };
    dispatch(allUsers(payload));
    dispatch(allHashTag({}));
  }, [dispatch]);

  // Handle file drop
  const onPreviewDrop = (acceptedFiles: FileWithPath[]) => {
    const validImages = acceptedFiles.filter(file => file.type.startsWith("image/"));

    if (validImages.length !== acceptedFiles.length) {
      alert("Only image files are allowed!");
      return;
    }

    // Update new files
    setNewImageFiles(prevFiles => [...prevFiles, ...validImages]);
    
    // Update display images
    setDisplayImages(prevImages => [...prevImages, ...validImages]);

    // Clear error
    setError(prev => ({ ...prev, images: "" }));
  };

  // Remove image
  const removeImage = (imageToRemove: string | File, index: number) => {
    // Remove from display images
    setDisplayImages(prevImages => prevImages.filter((_, i) => i !== index));
    
    // If it's a string (URL), it's an existing image
    if (typeof imageToRemove === 'string') {
      setExistingImages(prevUrls => prevUrls.filter(url => url !== imageToRemove));
      
      // Find the original index in the server's images array
      const originalIndex = dialogueData?.postImage?.findIndex(img => img.url === imageToRemove);
      if (originalIndex !== -1 && originalIndex !== undefined) {
        setRemovedIndices(prev => [...prev, originalIndex]);
      }
    } else {
      // If it's a File, remove from new files
      setNewImageFiles(prevFiles => prevFiles.filter(file => file !== imageToRemove));
    }
    
    // Clear error if needed
    if (error.images) {
      setError(prev => ({ ...prev, images: "" }));
    }
  };

  // Close modal
  const handleCloseAddCategory = () => {
    dispatch(closeDialog());
  };

  // Handle hashtag selection
  const handleSelectChangeHashTag = (selected : any) => {
    const selectedOptions = selected || [];
    setSelectedHashtag(selectedOptions);
    
    if (selectedOptions.length === 0) {
      setError(prev => ({ ...prev, hashTag: "HashTag Is Required" }));
    } else {
      setError(prev => ({ ...prev, hashTag: "" }));
    }
  };

  // Remove hashtag
  const handleRemoveHashtag = (removedOption: any) => {
    const updatedOptions = selectedHashtag.filter(option => option._id !== removedOption._id);
    setSelectedHashtag(updatedOptions);
    
    if (updatedOptions.length === 0) {
      setError(prev => ({ ...prev, hashTag: "HashTag Is Required" }));
    }
  };

  // Upload files
  const handleFileUpload = async () => {
    if (newImageFiles.length === 0) {
      return []; // No new files to upload
    }

    try {
      const formData = new FormData();
      formData.append("folderStructure", folderStructure);

      newImageFiles.forEach(file => formData.append("content", file));

      const payloadformData : any = { data: formData };
      const response : any = await dispatch(uploadMultipleFiles(payloadformData)).unwrap();

      if (response?.data?.status && response.data.urls) {
        return response.data.urls;
      }
      return [];
    } catch (error) {
      console.error("Error uploading files:", error);
      return [];
    }
  };

  // Submit form
  const handleSubmit = async () => {
    // Validate form
    let hasError = false;
    const newErrors = { ...error };
    
    if (!caption) {
      newErrors.caption = "Caption Is Required !";
      hasError = true;
    }
    
    if (!fakeUserId && !mongoId) {
      newErrors.fakeUserId = "User Is Required !";
      hasError = true;
    }
    
    if (displayImages.length === 0) {
      newErrors.images = "Please select an Image!";
      hasError = true;
    } else if (displayImages.length > 5) {
      newErrors.images = "Please select maximum 5 Image!";
      hasError = true;
    }
    
    if (selectedHashtag.length === 0) {
      newErrors.hashTag = "HashTag Is Required";
      hasError = true;
    }
    
    if (hasError) {
      setError(newErrors);
      return;
    }

    // Upload new files
    const newUploadedUrls = await handleFileUpload();
    
    // Combine existing and new URLs
    const allImageUrls = [...existingImages, ...newUploadedUrls];
    
    // Prepare hashtag IDs
    const hashTagIds = selectedHashtag.map(tag => tag._id).join(",");
    
    // Prepare payload
    const payloadData = {
      caption,
      postImage: allImageUrls,
      hashTagId: hashTagIds,
      removeImageIndexes: removedIndices,
    };

    if (mongoId) {
      // Update existing post
      const payload : any = {
        data: payloadData,
        fakeUserId: fakeUserId?._id ? fakeUserId?._id : fakeUserId,
        id: mongoId,
      };
      dispatch(updateFakePost(payload));
    } else {
      // Create new post
      const payload : any = { 
        data: payloadData, 
        fakeUserId: fakeUserId?._id ? fakeUserId?._id : fakeUserId 
      };
      dispatch(addFakePost(payload));
    }
    
    dispatch(closeDialog());
  };

  // Render selected hashtags
  const renderSelectedHashtags = () => {
    return selectedHashtag?.map((option: any) => (
      <div
        key={option?._id}
        className="optionShow-option mx-2"
        style={{ display: "flex", alignItems: "center" }}
      >
        <img
          src={option?.hashTagBanner ? option?.hashTagBanner : option ? option  : hashTagIcon?.src}
          height={25}
          width={25}
          style={{
            objectFit: "cover",
            width: "25px",
            height: "25px",
            marginRight: "8px",
          }}
          alt="Banner"
        />
        <span>{option?.hashTag ? option?.hashTag : "Demo"}</span>
      </div>
    ));
  };

  // Custom components for ReactSelect
  const CustomOptionHashTag: React.FC<{
    innerProps: any;
    label: string;
    data: any;
  }> = ({ innerProps, data }) => (
    <div
      {...innerProps}
      className="country-optionList"
      style={{ height: "40px" }}
    >
      <img
        src={
          data?.hashTagBanner && data?.hashTagBanner !== ""
            ? data?.hashTagBanner || data?.hashTagId?.[0]?.hashTagIcon
            : hashTagIcon?.src
        }
        alt="hashTagBanner"
        height={25}
        width={25}
        style={{ objectFit: "cover", width: "25px", height: "25px" }}
      />
      <span>{data?.hashTag && data?.hashTag}</span>
    </div>
  );

  const CustomMultiValueHashTag = ({ children, data }) => (
    <div className="custom-multi-value">
      <img
        src={data?.hashTagBanner || hashTagIcon?.src}
        alt="hashTagBanner"
        height={25}
        width={25}
        style={{
          objectFit: "cover",
          width: "25px",
          height: "25px",
          marginRight: "8px",
        }}
      />
      {children}
      <span
        className="custom-multi-value-remove"
        onClick={() => handleRemoveHashtag(data)}
      >
        <HighlightOffIcon />
      </span>
    </div>
  );

  return (
    <div>
      <Modal
        open={dialogue}
        onClose={handleCloseAddCategory}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="create-channel-model">
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {dialogueData ? "Edit Post" : "Add Post"}
          </Typography>
          <form>
            <div className="row sound-add-box">
              {!dialogueData && (
                <div className="col-12 col-lg-6 col-sm-6 mt-2 country-dropdown">
                  <Selector
                    label={"Fake User"}
                    selectValue={fakeUserId}
                    placeholder={"Enter Details..."}
                    selectData={fakeUserData}
                    selectId={true}
                    errorMessage={error.fakeUserId}
                    onChange={(e) => {
                      setFakeUserId(e.target.value);
                      setError(prev => ({
                        ...prev,
                        fakeUserId: e.target.value ? "" : "Fake User Is Required"
                      }));
                    }}
                  />
                </div>
              )}
              <div className={`${dialogueData ? "col-12" : "col-lg-6"} col-sm-12 mt-2`}>
                <Input
                  label={"Caption"}
                  name={"caption"}
                  placeholder={"Enter Details..."}
                  value={caption}
                  errorMessage={error.caption}
                  onChange={(e) => {
                    setCaption(e.target.value);
                    setError(prev => ({
                      ...prev,
                      caption: e.target.value ? "" : "Caption Is Required"
                    }));
                  }}
                />
              </div>
              <div className="col-12 mt-2 country-dropdown">
                <label>HashTag</label>
                {dialogueData ? (
                  <div
                    className="readonly-hashtags d-flex align-items-center"
                    style={{
                      borderRadius: "30px",
                      padding: "10px",
                      border: "1px solid #cbd5e1",
                      minHeight: "40px",
                    }}
                  >
                    {renderSelectedHashtags()}
                  </div>
                ) : (
                  <ReactSelect
                    isMulti
                    options={allHashTagData || []}
                    value={selectedHashtag || selectedHashtag?.[0]}
                    isClearable={false}
                    onChange={(selected) => handleSelectChangeHashTag(selected)}
                    getOptionValue={(option) => option?._id}
                    formatOptionLabel={(option) => (
                      <div
                        className="optionShow-option"
                        style={{ display: "flex", alignItems: "center" }}
                      >
                    
                        <span>{option?.hashTag ? option?.hashTag : ""}</span>
                      </div>
                    )}
                    components={{
                      Option: CustomOptionHashTag,
                      MultiValue: CustomMultiValueHashTag,
                    }}
                  />
                )}
                {error.hashTag && (
                  <p className="errorMessage">
                    {error.hashTag && error.hashTag}
                  </p>
                )}
              </div>
              <div className="col-12 mt-2">
                <div className="custom-input">
                  <label>Images</label>
                  <>
                    <ReactDropzone
                      onDrop={(acceptedFiles: FileWithPath[]) => onPreviewDrop(acceptedFiles)}
                      accept={"image/*" as unknown as Accept}
                    >
                      {({ getRootProps, getInputProps }) => (
                        <section className="mt-4">
                          <div {...getRootProps()}>
                            <input {...getInputProps()} />
                            <div
                              style={{
                                height: "130px",
                                width: "130px",
                                borderRadius: "11px",
                                border: "2px dashed rgb(185 191 199)",
                                textAlign: "center",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                marginTop: "10px",
                              }}
                            >
                              <AddIcon
                                sx={{
                                  fontSize: "40px",
                                  color: "rgb(185 191 199)",
                                }}
                              />
                            </div>
                          </div>
                        </section>
                      )}
                    </ReactDropzone>

                    {error.images && (
                      <div className="ml-2 mt-1">
                        <div className="pl-1 text__left">
                          <span className="text-red">{error.images}</span>
                        </div>
                      </div>
                    )}
                  </>
                </div>
              </div>

              <div className="col-12 d-flex justify-content-start">
                <div className="row image-show-multi">
                  {displayImages.length > 0 && (
                    <>
                      {displayImages.map((file: any, index: number) => (
                        <div key={index} className="image-grid-multi">
                          <div className="image-show-multi-box">
                            {typeof file === "object" ? (
                              <img
                                src={file instanceof Blob ? URL.createObjectURL(file) : ""}
                                alt=""
                                className="mt-3 ms-3 rounded float-left mb-2"
                                height="100px"
                                width="100px"
                              />
                            ) : (
                              <img
                                src={file || ""}
                                alt=""
                                className="mt-3 ms-3 rounded float-left mb-2"
                                height="100px"
                                width="100px"
                              />
                            )}
                            <IconButton
                              onClick={() => removeImage(file, index)}
                              style={{
                                position: "absolute",
                                left: "106px",
                                top: "-112px",
                                cursor: "pointer",
                              }}
                            >
                              <CloseIcon />
                            </IconButton>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-3 pt-3 d-flex justify-content-end">
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
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default CreateFakePost;