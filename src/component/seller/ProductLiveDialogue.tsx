import React, { useEffect, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import Input from "../../extra/Input";
import Button from "../../extra/Button";
import { closeDialog } from "@/store/dialogSlice";
import { projectName } from "@/util/config";
import { uploadMultipleImage } from "@/store/adminSlice";
import { createLiveVideo, getAllSeller, getSellerWiseProduct, getVendorProduct, updateLiveSeller } from "@/store/sellerSlice";
import Selector from "@/extra/Selector";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import { RootStore } from "@/store/store";

interface Props {
    sendAllNotification: (formData: FormData, type: string) => void;
}

const ProductLiveDialogue: any = () => {
    const dispatch = useDispatch();
    const { dialogueData } = useSelector((state: any) => state.dialogue);
    const { allSeller, allProduct } = useSelector((state: RootStore) => state.seller);

    // State variables
    const [sellerId, setSellerId] = useState<string>("");
    const [personName, setPersonName] = useState<string[]>([]);
    const [videoTime, setVideoTime] = useState<number | undefined>(undefined);
    const [fileData, setFileData] = useState<File | null>(null);
    const [previewVideoUrl, setPreviewVideoUrl] = useState<string | null>(null);
    const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
    const [thumbnailBlob, setThumbnailBlob] = useState<Blob | null>(null);
    const [isUpdating, setIsUpdating] = useState<boolean>(false);
    const [productsLoaded, setProductsLoaded] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);


    const [error, setError] = useState<{
        personName: string;
        video: string;
        sellerId: string;
    }>({
        personName: "",
        sellerId: "",
        video: "",
    });

    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;

    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
            },
        },
    };

    useEffect(() => {
        dispatch(getAllSeller());
    }, [dispatch]);



    useEffect(() => {
        if (dialogueData) {
            setIsUpdating(true);

            // Handle seller selection
            if (Array.isArray(allSeller) && allSeller.length > 0) {
                const matchingSeller = allSeller.find(
                    (seller) => seller.sellerFullName === dialogueData?.sellerFullName
                );

                if (matchingSeller) {
                    setSellerId(matchingSeller._id);
                }
            }

            // Set media preview URLs and time
            setPreviewVideoUrl(dialogueData?.videoUrl || null);
            setPreviewImageUrl(dialogueData?.videoImage || null);
            setVideoTime(dialogueData?.videoTime || undefined);
         
        }
    }, [ dialogueData , allProduct , allSeller]);

    useEffect(() => {
        const selectingProduct = allProduct?.filter(product => {
            return dialogueData?.selectedProducts?.some(item => product._id === item?.productId)
         }
     );
         setPersonName(selectingProduct.map(product => product._id));
    } , [allProduct , allSeller])

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



    // Cleanup on unmount
    useEffect(() => {
        return () => {
            setPreviewVideoUrl(null);
            setPreviewImageUrl(null);
            setFileData(null);
            setError({
                personName: "",
                sellerId: "",
                video: ""
            });
        };
    }, []);

    // Video and thumbnail handling functions
    const generateThumbnailBlob = async (file: File): Promise<Blob | null> => {
        return new Promise((resolve, reject) => {
            const video = document.createElement("video");
            video.preload = "metadata";
            video.src = URL.createObjectURL(file);

            video.onloadedmetadata = () => {
                video.currentTime = 1; // Capture frame at 1 second
            };

            video.onseeked = () => {
                const canvas = document.createElement("canvas");
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const ctx = canvas.getContext("2d");
                if (ctx) {
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    canvas.toBlob((blob) => {
                        resolve(blob);
                        URL.revokeObjectURL(video.src);
                    }, "image/jpeg");
                } else {
                    reject(new Error("Could not get canvas context"));
                }
            };

            video.onerror = () => {
                reject(new Error("Error loading video metadata"));
                URL.revokeObjectURL(video.src);
            };
        });
    };

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

    const handleVideoUpload = async () => {
        // For update mode, if no new file is selected, use existing URLs
        if (isUpdating && !fileData && dialogueData?.videoUrl && dialogueData?.videoImage) {
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
            formData.append("folderStructure", `${projectName}/admin/videoUrl`);
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

    const validateForm = () => {
        let isValid = true;
        const newErrors = {
            personName: "",
            sellerId: "",
            video: ""
        };

        if (!sellerId) {
            newErrors.sellerId = "Seller is required!";
            isValid = false;
        }

        if (!personName || personName.length === 0) {
            newErrors.personName = "At least one product must be selected!";
            isValid = false;
        }

        if (!isUpdating && !fileData) {
            newErrors.video = "Please select a video!";
            isValid = false;
        }

        setError(newErrors);
        return isValid;
    };

    const handleSubmit = async () => {

        if (!validateForm()) {
            return;
        }

        setLoading(true); // Start loader


        const uploadResult = await handleVideoUpload();
        if (!uploadResult) return; // Stop if upload failed

        const payload = {
            productIds: personName,
            sellerId,
            video: uploadResult.videoUrl,
            videoImage: uploadResult.videoImage,
            videoTime,
            ...(dialogueData?._id ? { _id: dialogueData._id } : {})
        };

        try {
            if (isUpdating) {
              const response =   await dispatch(updateLiveSeller(payload)).unwrap();

              if(response){
                dispatch(getAllSeller())
              }
            } else {
                await dispatch(createLiveVideo(payload));
            }
            dispatch(closeDialog());
        } catch (error) {
            console.error("Failed to save data:", error);
        }
    };

    const handleChange = (event: any) => {
        const value = event.target.value;
        setPersonName(Array.isArray(value) ? value : [value]);
        setError((prev) => ({ ...prev, personName: "" }));
    };

    const handleSellerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setSellerId(value);

        if (!value) {
            setError((prev) => ({ ...prev, sellerId: "Seller is required" }));
        } else {
            setError((prev) => ({ ...prev, sellerId: "" }));
            // Reset product selection when seller changes
            if (!isUpdating) {
                setPersonName([]);
            }
        }
    };


    return (
        <div className="mainDialogue fade-in">
            <div className="Dialogue">
                <div className="dialogueHeader">
                    <div className="headerTitle fw-bold">Live Seller</div>
                </div>
                <div className="dialogueMain bg-white mx-4 new_notification_box" style={{ overflow: "auto" }}>
                    <div className="col-12 col-lg-12 col-sm-12 mt-2">
                        <div className="row sound-add-box mb-2 mt-2" style={{ overflowX: 'hidden' }}>
                            <Selector
                                label={'Seller'}
                                selectValue={sellerId}
                                placeholder={'Enter Seller name...'}
                                selectData={Array.isArray(allSeller) ? allSeller : []}
                                selectId={true}
                                errorMessage={error.sellerId}
                                isdisabled={dialogueData ? true : false}
                                style={{
                                    marginLeft: "10px",
                                    width: "100%"
                                }}
                                type={true}
                                onChange={handleSellerChange}
                            />
                        </div>

                        <div className="col-md-12 col-12" style={{ paddingRight: "25px", paddingLeft: "0px" }}>
                            <label className="custom-input">Product</label>
                            <FormControl sx={{ m: 1, width: '100%' }}>
                                <InputLabel id="product-select-label">Select Product</InputLabel>
                                <Select
                                    labelId="select-label"
                                    id="select"
                                    multiple
                                    value={personName}
                                    onChange={handleChange}
                                    input={<OutlinedInput id="select-multiple-chip" label="Select Product" />}
                                    renderValue={(selected) => (

                                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                            {(selected as string[]).map((id) => {
                                                const product = allProduct.find((p) => p._id === id);
                                                return product ? <Chip key={id} label={product.productName} /> : null;
                                            })}
                                        </Box>
                                    )}
                                >
                                    {Array.isArray(allProduct) &&
                                        allProduct.map((product) => (
                                            <MenuItem key={product?._id} value={product?._id}>
                                                {product?.productName}
                                            </MenuItem>
                                        ))}
                                </Select>
                                {error?.personName && (
                                    <span className="text-danger mt-1" style={{ fontSize: "14px" }}>
                                        {error.personName}
                                    </span>
                                )}
                            </FormControl>
                        </div>

                        <div className="col-12 col-lg-12 col-sm-12 mt-2">
                            <Input
                                label={"Video Time (Seconds)"}
                                name={"videoTime"}
                                placeholder={"Video Time"}
                                value={videoTime !== undefined ? videoTime.toString() : ""}
                                disabled={true}
                            />
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

                    <div className="dialogueFooter">
                        <div className="dialogueBtn d-flex justify-content-end gap-2">
                            <Button
                                onClick={handleSubmit}
                                btnName={"Submit"}
                                type={"button"}
                                newClass={"submit-btn"}
                                style={{
                                    borderRadius: "0.5rem",
                                    width: "80px",
                                    marginLeft: "10px",
                                }}
                            />
                            <Button
                                onClick={() => dispatch(closeDialog())}
                                btnName={"Close"}
                                newClass={"close-model-btn"}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default connect(null, {})(ProductLiveDialogue);