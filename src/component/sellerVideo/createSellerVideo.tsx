import React, { useEffect, useState } from "react";
import { Box, Modal, Typography } from "@mui/material";
import Selector from "../../extra/Selector";
import Input from "../../extra/Input";
import ReactSelect from "react-select";
import Button from "../../extra/Button";
import { useSelector } from "react-redux";
import { allUsers } from "../../store/userSlice";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { closeDialog } from "../../store/dialogSlice";
import { RootStore, useAppDispatch } from "@/store/store";

import { allHashTag } from "@/store/postSlice";
import { projectName } from "@/util/config";
import hashTagIcon from "@/assets/images/HashtagIcon.png";
import { uploadFile, uploadMultipleImage } from "@/store/adminSlice";
import { getAllSeller, getVendorProduct } from "@/store/sellerSlice";
import { allSongCategory } from "@/store/songSlice";
import { addVideoOfSeller, updateFakeVideo } from "@/store/sellerVideoSlice";
import { match } from "assert";

interface CreateFakeVideoProps { }

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

const CreateSellerVideo: React.FC<CreateFakeVideoProps> = () => {
    const { dialogue, dialogueType, dialogueData } = useSelector(
        (state: any) => state.dialogue
    );

    const { songCategoryData } = useSelector(
        (state: RootStore) => state.song
    );
    const { fakeUserData } = useSelector((state: RootStore) => state.user);
    const { allHashTagData } = useSelector((state: RootStore) => state.post);
    const [mongoId, setMongoId] = useState<string>("");
    const [addVideoOpen, setAddVideoOpen] = useState<boolean>(false);
    const { allSeller, allProduct } = useSelector((state: RootStore) => state.seller);
    const [sellerId, setSellerId] = useState<string>("");
    const [caption, setCaption] = useState<string>("");
    const [productId, setProductId] = useState<string>();
    const [soundCategoryId, setSoundCategoryId] = useState<string>();
    const [videoTime, setVideoTime] = useState<number>();
    const [fakePostDataGet, setFakeUserDataGet] = useState<any[]>([]);
    const [oldData, setOldData] = useState<any>([]);
    const [video, setVideo] = useState<{
        file: string;
        thumbnailBlob: File | null;
    }>({
        file: null,
        thumbnailBlob: null,
    });
    const [selectedHashtag, setSelectedHashtag] = useState<any>();
    const [selectedHashTagId, setSelectedHashTagId] = useState<any>([]);
    const [videoPath, setVideoPath] = useState<string | null>(null);
    const [thumbnail, setThumbnail] = useState<any>();
    const [thumbnailBlob, setThumbnailBlob] = useState<Blob | null>(null);
    const [productsLoaded, setProductsLoaded] = useState<boolean>(false);
    const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
    const [fileData, setFileData] = useState<File | null>(null);
    const [previewVideoUrl, setPreviewVideoUrl] = useState<string | null>(null);
    const [error, setError] = useState({
        caption: "",
        video: "",
        fakeUserId: "",
        hashTag: "",
        country: "",
        sellerId: "",
        productId: "",
        soundCategoryId: ""
    });



    const dispatch = useAppDispatch();
    useEffect(() => {
        setAddVideoOpen(dialogue);
        if (dialogueData) {
            setMongoId(dialogueData?._id);
            setCaption(dialogueData?.caption || dialogueData?.video?.caption);
            setProductId(dialogueData?.productId || dialogueData?.video?.ProuctId);
            setVideoPath(dialogueData?.videoUrl || null);
            setPreviewVideoUrl(dialogueData?.videoUrl || dialogueData?.video?.videoUrl)
            setThumbnail(dialogueData?.videoImage || []);
            setVideoTime(dialogueData?.videoTime || dialogueData?.video?.videoTime);
            setSelectedHashtag(dialogueData?.hashTags);
            // setSelectedHashTagId(dialogueData?.video?.hashTagId)
            setSellerId(dialogueData?.sellerId || dialogueData?.video?.sellerId)
            setPreviewImageUrl(dialogueData?.videoImage || dialogueData?.video?.videoImage)
            setOldData(dialogueData);
        }
    }, [dialogue, dialogueData]);

    useEffect(() => {
        if (dialogueData?.productId || dialogueData?.video?.productId) {
            const matchedProduct = allProduct?.find(
                (product) => product._id === (dialogueData?.productId || dialogueData?.video?.productId)
            );

            if (matchedProduct) {
                setProductId(matchedProduct._id);
            }
        }
    }, [dialogueData, allProduct]);

    useEffect(() => {
        if (dialogueData?.hashTagId || dialogueData?.video?.hashTagId) {
            const matchedHashtags = allHashTagData?.filter((hashtag) =>
                (Array.isArray(dialogueData?.video?.hashTagId) && dialogueData.video.hashTagId.includes(hashtag._id)) ||
                (Array.isArray(dialogueData?.hashTags) && dialogueData.hashTags.includes(hashtag._id))
            );
            // Set the selected hashtags
            setSelectedHashtag(matchedHashtags);
        }
    }, [dialogueData, allHashTagData]);
    


    useEffect(() => {
        const payload: any = {
            type: "fakeUser",
            start: 1,
            limit: 100,
            startDate: "All",
            endDate: "All",
        };
        dispatch(allUsers(payload));
    }, []);

    useEffect(() => {
        setFakeUserDataGet(fakeUserData);
    }, [fakeUserData]);




    useEffect(() => {
        dispatch(getAllSeller())
        dispatch(allSongCategory());
    }, [])

    useEffect(() => {
        if (sellerId) {
            dispatch(getVendorProduct({ sellerId }))
                .then(() => {
                    setProductsLoaded(true);
                })
                .catch(err => {
                    console.error("Error fetching products:", err);
                });
        }
    }, [dispatch, sellerId]);


    let folderStructure: string = `${projectName}/admin/videoUrl`;

    const getVideoUrl: any = async (file, thumbnailFile) => {

        const formData = new FormData();

        formData.append("folderStructure", folderStructure);
        formData.append("keyName", file.name);
        formData.append("content", file);

        const payloadformData: any = {
            data: formData,
        };

        if (formData) {
            const response: any = await dispatch(
                uploadFile(payloadformData)
            ).unwrap();

            if (response?.data?.status) {

                if (response.data.url) {
                    setVideo({
                        file: response.data.url,
                        thumbnailBlob: thumbnailFile,
                    });
                    setVideoPath(response.data.url);
                }
            }
        }
    };



   
    const handleVideoUpload = async () => {
        // For update mode, if no new file is selected, use existing URLs
        if (!fileData && dialogueData?.videoUrl && dialogueData?.videoImage) {
            return {
                videoUrl: dialogueData.videoUrl,
                videoImage: dialogueData.videoImage
            };
        }

        // For new entry or update with new file
        if (!fileData) {
            setError((prev) => ({ ...prev, video: "Please select a valid video file!" }));
            return null;
        }

        try {
            // Create form data for upload
            const formData = new FormData();
            formData.append("folderStructure", `${projectName}/admin/videoImage`);
            formData.append("keyName", fileData.name);
            formData.append("content", fileData);

            // Generate and handle thumbnail
            let thumbnailBlob = null;
            try {
                thumbnailBlob = await generateThumbnailBlob(fileData);
            } catch (thumbnailError) {
                console.error("Thumbnail generation failed:", thumbnailError);
                setError((prev) => ({ ...prev, video: "Failed to generate thumbnail." }));
                return null;
            }

            if (thumbnailBlob) {
                const thumbnailFileName = `${fileData.name.replace(/\.[^/.]+$/, "")}.jpeg`;
                const thumbnailFile = new File([thumbnailBlob], thumbnailFileName, { type: "image/jpeg" });
                formData.append("content", thumbnailFile);
            }

            // Upload files
            const response = await dispatch(uploadMultipleImage(formData)).unwrap();

            if (response?.data?.status) {
                return {
                    videoUrl: response.data.urls[0],
                    videoImage: response.data.urls[1],
                };
            } else {
                throw new Error("Upload failed: Invalid response from server.");
            }
        } catch (error) {
            console.error("File upload failed:", error);
            setError((prev) => ({ ...prev, video: "Failed to upload video. Please try again." }));
            return null;
        }
    };


    const generateThumbnailBlob = async (file: File) => {
        return new Promise((resolve) => {
            const video = document.createElement("video");
            video.preload = "metadata";

            video.onloadedmetadata = () => {
                video.currentTime = 1; // Set to capture the frame at 1 second
            };

            video.onseeked = async () => {
                const canvas = document.createElement("canvas");
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const ctx = canvas.getContext("2d");
                ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);

                // Convert the canvas to blob
                canvas.toBlob((blob) => {
                    resolve(blob);
                }, "image/jpeg");
            };

            const objectURL = URL.createObjectURL(file);
            video.src = objectURL;

            return () => {
                URL.revokeObjectURL(objectURL);
            };
        });
    };

    const handleCloseAddCategory = () => {
        setAddVideoOpen(false);
        dispatch(closeDialog());
    };

    const handleSelectChangeHashTag = (selected: any | null) => {
        setSelectedHashtag(selected || []);
        const selectedIds = selected?.map((option: any) => option?._id);
        const updatedData = selectedIds?.join(",");
        setSelectedHashTagId(updatedData);
        if (!selected) {
            return setError({
                ...error,
                hashTag: `HashTag Is Required`,
            });
        } else {
            return setError({
                ...error,
                hashTag: "",
            });
        }
    };

    const handleRemoveApp = (removedOption: any) => {
        const updatedOptions = selectedHashtag?.filter(
            (option: any) => option._id !== removedOption?._id
        );
        setSelectedHashtag(updatedOptions);
        const selectedIds = updatedOptions?.map((option: any) => option?._id);
        const updatedData = selectedIds?.join(",");
        setSelectedHashTagId(updatedData);
    };

    useEffect(() => {
        const payload: any = {};
        dispatch(allHashTag(payload));
    }, []);

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
            {data?.hashTagBanner && data?.hashTagBanner !== "" ? (
                <img
                    src={data?.hashTagBanner}
                    onError={(e) => {
                        const target: any = e.target as HTMLImageElement;
                        target.src = hashTagIcon;
                    }}
                    alt="hashTagBanner"
                    height={25}
                    width={25}
                    style={{ objectFit: "cover" }}
                />
            ) : (
                <img
                    src={hashTagIcon.src}
                    alt="hashTagBanner"
                    height={25}
                    width={25}
                    style={{ objectFit: "cover" }}
                />
            )}
            <span>{data?.hashTag && data?.hashTag}</span>
        </div>
    );

    const CustomMultiValueHashTag: React.FC<{
        children: React.ReactNode;
        data: any;
    }> = ({ children, data }) => (
        <div className="custom-multi-value">
            {children}
            <span
                className="custom-multi-value-remove"
                onClick={() => handleRemoveApp(data)}
            >
                <HighlightOffIcon />
            </span>
        </div>
    );

    const handleVideo = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            setError((prev) => ({ ...prev, video: "Please select a video!" }));
            return;
        }
        setFileData(file);
        try {
            const videoURL = URL.createObjectURL(file);
            setPreviewVideoUrl(videoURL);

            const video = document.createElement("video");
            video.preload = "metadata";
            video.src = videoURL;

            video.onloadedmetadata = () => {
                setVideoTime(video.duration);
                video.currentTime = 1;
            };

            video.onseeked = async () => {
                const canvas = document.createElement("canvas");
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const ctx = canvas.getContext("2d");
                if (ctx) {
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    canvas.toBlob((blob) => {
                        if (blob) {
                            setThumbnailBlob(blob);
                            setPreviewImageUrl(URL.createObjectURL(blob));
                            setError((prev) => ({ ...prev, video: "" }));
                        }
                    }, "image/jpeg");
                }
            };

            video.onerror = () => {
                setError((prev) => ({ ...prev, video: "Error loading video. Please try a different format." }));
                URL.revokeObjectURL(videoURL);
            };
        } catch (error) {
            console.error("Error processing video file:", error);
            setError((prev) => ({ ...prev, video: "Error processing video file. Please try again." }));
        }
    };


    const handleSubmit = async () => {
        if ((!caption || !productId || !sellerId || selectedHashtag?.length === 0) && !mongoId) {
            let error: any = {};
            if (!caption) error.caption = "Caption Is Required!";
            if (!productId) error.productId = "Product Is Required!";
            if (!fileData) error.video = "Please select video!";
            if (selectedHashTagId?.length === 0) error.hashTag = "Please select hashtag!";
            if (!sellerId) error.sellerId = "Seller is Required!";
            if (!soundCategoryId) error.soundCategoryId = "Sound Category is Required!";

            return setError({ ...error });
        }

        const uploadResult = await handleVideoUpload();
        if (!uploadResult) return; // Stop if upload failed

        let payloadData: any = {
            sellerId: sellerId,
            videoTime: videoTime?.toString() || "",
            videoUrl: uploadResult.videoUrl,  // ✅ FIXED
            videoImage: uploadResult.videoImage,
            caption: caption,
            hashTagId: selectedHashTagId,
            productId: productId,
        };

        try {
            if (mongoId) {
                let payload: any = {
                    data: { ...payloadData, videoId: dialogueData?.video?._id ? dialogueData?.video?._id : dialogueData?._id },
                };
                 dispatch(updateFakeVideo(payload));
            } else {
                let payload: any = { data: payloadData };
                 dispatch(addVideoOfSeller(payload));
            }
        } catch (error) {
            console.error("Dispatch failed:", error);
        }

        dispatch(closeDialog());
    };


    return (
        <div>
            <Modal
                open={addVideoOpen}
                onClose={handleCloseAddCategory}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} className="create-channel-model">
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        {dialogueData ? "Edit Video" : "Add Video"}
                    </Typography>
                    <form>
                        <div className="row sound-add-box videoCreateModel d-flex align-items-end">


                            <div
                                className="col-12 col-sm-12 col-md-6 col-lg-6 mt-2"
                            >
                                <Selector
                                    label={'Seller name'}
                                    selectValue={sellerId}
                                    placeholder={'Enter Sell name...'}
                                    selectData={allSeller.length > 0 ? allSeller : []} // Ensure it's always an array
                                    selectId={true}
                                    errorMessage={error.sellerId && error.sellerId}
                                    isdisabled={dialogueData ? true : false}
                                    onChange={(e) => {
                                        setSellerId(e.target.value);
                                        if (!e.target.value) {
                                            return setError({
                                                ...error,
                                                sellerId: `SellerId Is Required`,
                                            });
                                        } else {
                                            return setError({
                                                ...error,
                                                sellerId: '',
                                            });
                                        }
                                    }}
                                />
                            </div>

                            <div
                                className="col-12 col-sm-12 col-md-6 col-lg-6 mt-2"
                            >
                                <Selector
                                    label={'Product name'}
                                    selectValue={productId}
                                    placeholder={'Enter Product name...'}
                                    selectData={allProduct} // Ensure it's always an array
                                    selectId={true}
                                    errorMessage={error.productId && error.productId}
                                    onChange={(e) => {
                                        setProductId(e.target.value);
                                        if (!e.target.value) {
                                            return setError({
                                                ...error,
                                                productId: `ProuctId Is Required`,
                                            });
                                        } else {
                                            return setError({
                                                ...error,
                                                productId: '',
                                            });
                                        }
                                    }}
                                />
                            </div>

                            <div className="col-lg-6 col-sm-12">
                                <Input
                                    label={"Caption"}
                                    name={"caption"}
                                    placeholder={"Enter Details..."}
                                    value={caption}
                                    errorMessage={error.caption}
                                    onChange={(e) => {
                                        setCaption(e.target.value);
                                        if (!e.target.value) {
                                            setError({ ...error, caption: "Caption Is Required" });
                                        } else {
                                            setError({ ...error, caption: "" });
                                        }
                                    }}
                                />
                            </div>

                            <div className="col-12 col-lg-6 col-sm-6 mt-2">
                                <Input
                                    label={"Video Time (Seconds)"}
                                    name={"videoTime"}
                                    accept={"video/*"}
                                    placeholder={"Video Time"}
                                    value={videoTime?.toString() || ""}
                                    disabled={true}
                                />
                            </div>


                            <div className="col-12 mt-3 country-dropdown">
                                <label>HashTag</label>
                                <ReactSelect
                                    isMulti
                                    options={allHashTagData || []}
                                    value={selectedHashtag}
                                    isClearable={false}
                                    onChange={(selected) => handleSelectChangeHashTag(selected)}
                                    getOptionValue={(option) => option?._id}
                                    formatOptionLabel={(option) => (
                                        <div
                                            className="optionShow-option"
                                            style={{ display: "flex", alignItems: "center" }}
                                        >
                                            {option?.hashTagBanner &&
                                                option?.hashTagBanner !== "" && (
                                                    <img
                                                        src={option?.hashTagBanner}
                                                        height={25}
                                                        width={25}
                                                        alt="Banner"
                                                        onError={(e) => {
                                                            const target: any = e.target as HTMLImageElement;
                                                            target.src = hashTagIcon;
                                                        }}
                                                    />
                                                )}

                                            <span>{option?.hashTag ? option?.hashTag : ""}</span>
                                        </div>
                                    )}
                                    components={{
                                        Option: CustomOptionHashTag,
                                        MultiValue: CustomMultiValueHashTag,
                                    }}
                                    isDisabled={!!dialogueData} // Disable when editing
                                />
                                {error.hashTag && (
                                    <p className="errorMessage">
                                        {error.hashTag && error.hashTag}
                                    </p>
                                )}
                            </div>
                           
                            <div className="col-12 mt-2">
                                <Input
                                    label={`Video`}
                                    id={`video`}
                                    type={`file`}
                                    accept={`video/*`}
                                    errorMessage={error.video}
                                    onChange={handleVideo}
                                    style={{
                                        marginLeft: "5px"
                                    }}
                                />
                            </div>

                            <div className="col-12 d-flex flex-wrap gap-4">
                                <div className="d-flex flex-column">
                                    {previewVideoUrl && (
                                        <div style={{ height: "150px", width: "120px" }}>
                                            <video
                                                src={previewVideoUrl}
                                                autoPlay
                                                muted
                                                controls
                                                className="mt-2"
                                                height="100%"
                                                width="100%"
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="d-flex flex-column">
                                    {previewImageUrl && (
                                        <div className="mt-2">
                                            <img
                                                src={previewImageUrl}
                                                width={120}
                                                height={150}
                                                alt="Thumbnail"
                                            />
                                        </div>
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
export default CreateSellerVideo;
