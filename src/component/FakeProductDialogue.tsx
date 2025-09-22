import React, { useEffect, useState } from 'react';
import Button from '../extra/Button';
import Input from '../extra/Input';
import { useDispatch, useSelector } from 'react-redux';
import { getCountry, addFakeUser } from '../store/userSlice';
import { closeDialog } from '../store/dialogSlice';
import ReactSelect from 'react-select';
import { RootStore, useAppDispatch } from '@/store/store';
import { projectName } from '@/util/config';
import { uploadFile } from '@/store/adminSlice';
import { createFakeSeller, getAllRealSeller, getAllSeller } from '@/store/sellerSlice';
import { getCategories } from '@/store/categorySlice';
import { createFakeProduct, getCategoryOrSubCategory, getFakeProduct, getProduct, updateFakeProduct } from '@/store/productSlice';
import ReactDropzone, { FileWithPath, Accept } from "react-dropzone";
import { uploadMultipleFiles } from '@/store/postSlice';
import AddIcon from "@mui/icons-material/Add";
import { Box, IconButton, Modal, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Selector from '@/extra/Selector';
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Chip from "@mui/material/Chip";
import Select from "@mui/material/Select";
import { Theme, useTheme } from '@mui/material/styles';
import { getDefaultCurrency } from '@/store/currencySlice';


interface ErrorState {
    shippingCharge: string;
    productName: string;
    description: string;
    price: any;
    images: string;
    categoryId: any;
    subCategoryId: any;
    sellerId: any;
}

function FakeProductDialogue() {
    const AgeNumber = Array.from(
        { length: 100 - 18 + 1 },
        (_, index) => index + 18
    );
    const { dialogueData } = useSelector((state: any) => state.dialogue);
    const { currency } = useSelector((state: any) => state.currency);
    const dispatch = useAppDispatch();
    const [productName, setProductName] = useState<string>('');
    const [image, setImage] = useState<any>();
    const [imagePath, setImagePath] = useState<string>(
        dialogueData ? dialogueData?.image : ''
    );
    const [userName, setUserName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState<string>('');
    const [shippingCharge, setShippingCharge] = useState<string>('');
    const [categoryId, setCategoryId] = useState<string>();
    const [subCategoryId, setSubCategoryId] = useState<string>();
    const [catData, setCatData] = useState<any[]>([]);
    const [subCateData, setSubCatData] = useState<any[]>();
    const [images, setImages] = useState<File[]>([]);
    const [attributeId, setAttributeId] = useState<string>();
    const [personName, setPersonName] = useState<Record<string, string[]>>({});

    const theme = useTheme();
    const [sellerId, setSellerId] = useState<string>();
    const { allSeller , allRealSeller } = useSelector((state: RootStore) => state.seller);
    const [file, setFile] = useState<any>([])
    const [selectedAttributes, setSelectedAttributes] = useState([]); // Store selected attributes as an 
    const [imageUrl, setImageUrl] = useState([]);
    const [isRemove, setIsRemove] = useState(false);
    const [existingImageUrls, setExistingImageUrls] = useState([]);
    const [newImageFiles, setNewImageFiles] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [removedIndices, setRemovedIndices] = useState<number[]>([]);
    

    // array
    const [error, setError] = useState<ErrorState>({
        productName: '',
        images: '',
        description: '',
        price: '',
        shippingCharge: '',
        categoryId: '',
        subCategoryId: '',
        sellerId: '',
    });

    const { categoryOrSubCategoryData } = useSelector((state: RootStore) => state.product);
    const categoryWiseSubCategory = categoryOrSubCategoryData?.find(item => item?._id === categoryId);
    const subCategoryNames = categoryWiseSubCategory?.subCategories?.map(subCat => ({
        _id: subCat._id,
        name: subCat.name,
        attributes: subCat.attributes,
    })) || [];

    useEffect(() => {
        dispatch(getDefaultCurrency())
    }, [])

    useEffect(() => {
        if (categoryId) {
            const newSubCategories = categoryWiseSubCategory?.subCategories || [];
            setSubCategoryId(newSubCategories.length > 0 ? newSubCategories[0]._id : ""); // ✅ Reset to first subcategory or empty
        }
    }, [categoryId, categoryWiseSubCategory]);

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
    function getStyles(name, personName, theme) {
        return {
            fontWeight: personName.includes(name)
                ? theme.typography.fontWeightMedium
                : theme.typography.fontWeightRegular,
        };
    }

    useEffect(() => {
        if (categoryId) {
            const newSubCategories = categoryWiseSubCategory?.subCategories || [];
            setSubCategoryId(newSubCategories.length > 0 ? newSubCategories[0]._id : ""); // ✅ Reset to first subcategory or empty
        }
    }, [categoryId, categoryWiseSubCategory]);

    const findattributeData = subCategoryNames?.filter((item) => item?._id === subCategoryId);
    const attributeName = findattributeData?.[0]?.attributes?.map((item) => item?.name)

    // In your useEffect for dialogueData
    useEffect(() => {
        if (dialogueData) {
            setProductName(dialogueData?.productName || "");
            setImage(dialogueData?.image || "");
            setPrice(dialogueData?.price);
            setShippingCharge(dialogueData?.shippingCharges);
            if(dialogueData?.type === "real"){
                const matchedSellerData = allRealSeller?.filter(seller => 
                    seller.sellerFullName == dialogueData?.seller?.sellerFullName
                );
                
                setSellerId(matchedSellerData?.[0]?._id);
            }else {
                const matchedSeller = allSeller?.filter(seller => 
                    seller.sellerFullName == dialogueData?.seller?.sellerFullName
                );
                
                setSellerId(matchedSeller?.[0]?._id);
            }
           
            
            setCategoryId(dialogueData?.category?._id || dialogueData?.category)
            setSubCategoryId(dialogueData?.subCategory?._id || dialogueData?.subCategory)
            setDescription(dialogueData?.description)
            setUserName(dialogueData?.userName)
            // Set existing images properly
            if (dialogueData?.images && dialogueData.images.length > 0) {
                const urls = dialogueData.images.filter(img => typeof img === 'string');
                setExistingImageUrls(urls);
                setImages(urls); // For display purposes
            }
        }
    }, [dialogueData]);

    useEffect(() => {
        if (dialogueData?.productAttributes?.length > 0) {
            const initialPersonName: any = {};
            const initialSelectedAttributes = dialogueData.productAttributes.map(attr => {
                initialPersonName[attr.name] = attr.values || [];
                return { name: attr.name, values: attr.values || [] };
            });

            setPersonName(initialPersonName);
            setSelectedAttributes(initialSelectedAttributes);
        }
    }, [dialogueData]);



    const handleChange = (event, attribute) => {
        const { value } = event.target;
        const newValue = typeof value === "string" ? value.split(",") : value;


        setPersonName((prev) => {
            return { ...prev, [attribute]: newValue };
        });

        setSelectedAttributes((prev) => {
            const updatedAttributes = prev.map(attr =>
                attr.name === attribute ? { ...attr, values: newValue } : attr
            );

            if (!updatedAttributes.find(attr => attr.name === attribute)) {
                updatedAttributes.push({ name: attribute, values: newValue });
            }

            return [...updatedAttributes];
        });
    };


    useEffect(() => {
        dispatch(getCategoryOrSubCategory())
    }, [])

    useEffect(() => {
        if(dialogueData?.type === "real"){
            dispatch(getAllRealSeller())
        }else {

            dispatch(getAllSeller())
        }
    }, [])


    useEffect(() => {
    }, [personName, selectedAttributes]);


    const handleSubmit = async () => {
        // Validation checks
        if (
            !productName ||
            !description ||
            !price ||
            !shippingCharge ||
            !(newImageFiles.length > 0 || existingImageUrls.length > 0) ||
            !categoryId ||
            price < shippingCharge ||
            Number(price) < 0 ||  // Convert to number before comparison
            !subCategoryId ||
            !sellerId
        ) {
            let error = {} as ErrorState;
            if (!productName) error.productName = 'Product Name Is Required!';
            if (!description) error.description = "Description is required!";
            if (!price) error.price = "Price is required!";
            if (!shippingCharge) error.shippingCharge = "Shipping Charge is required!";
            if (price < shippingCharge) error.shippingCharge = "Shipping Charge can not greater than price"
            if (!(newImageFiles.length > 0 || existingImageUrls.length > 0)) error.images = "At least one image is required!";
            if (!categoryId) error.categoryId = "Category is required!";
            if (!subCategoryId) error.subCategoryId = "SubCategory is required!";
            if (!sellerId) error.sellerId = "SellerId is required!";
            if (Number(price) < 0) error.price = "Price can not less than 0"
            return setError({ ...error });
        }

        setIsSubmitting(true);

        try {
            // 1. Upload new images first
            const newUploadedUrls = await handleFileUpload();

            // 2. Combine existing URLs with newly uploaded URLs
            const allImageUrls = [...existingImageUrls, ...newUploadedUrls];

            // 3. Create payload with complete image URLs
            const jsonData: any = {
                productName,
                description,
                price: parseInt(price),
                category: categoryId,
                subCategory: subCategoryId,
                sellerId,
                shippingCharges: parseInt(shippingCharge),
                images: allImageUrls,
                productAttributes: selectedAttributes,
            };

            if (dialogueData) {
                jsonData.productId = dialogueData._id;
                jsonData.removeImageIndexes = removedIndices
            }

            const payload: any = { data: jsonData };

            // 4. Submit to appropriate API based on edit or create
            if (dialogueData) {
                const response = await dispatch(updateFakeProduct(payload)).unwrap();
                if (response) {
                    if (dialogueData?.type === "real") {

                        dispatch(getProduct({ type: "real", start: 1, limit: 10 ,startDate : "All" , endDate : "All"}));
                    } else {
                        dispatch(getFakeProduct({ type: "fake", start: 1, limit: 10 , startDate : "All" , endDate : "All" }));

                    }
                }
            } else {
                const response = await dispatch(createFakeProduct(payload)).unwrap();
                if (response) {
                    if (dialogueData?.type === "real") {

                        dispatch(getProduct({ type: "real", start: 1, limit: 10,startDate : "All" , endDate : "All" }));

                    } else {
                        dispatch(getFakeProduct({ type: "fake", start: 1, limit: 10 , startDate : "All" , endDate : "All" }));

                    }
                }
            }

            dispatch(closeDialog());
        } catch (error) {
            console.error("Error submitting product:", error);
        } finally {
            setIsSubmitting(false);
        }
    };




    const handleCloseAddCategory = () => {
        // setAddCategoryOpen(false);
        dispatch(closeDialog());
        localStorage.setItem("dialogueData", JSON.stringify(dialogueData));
    };



    // const onPreviewDrop = async (acceptedFiles: FileWithPath[]) => {
    //     const validImages = acceptedFiles.filter((file) =>
    //         file.type.startsWith("image/")
    //     );

    //     if (validImages.length !== acceptedFiles.length) {
    //         alert("Only image files are allowed!");
    //         return;
    //     }

    //     const updatedImages = [...images, ...acceptedFiles];

    //     const formData = new FormData();

    //     formData.append("folderStructure", folderStructure);
    //     updatedImages.forEach((file) => {
    //         formData.append("content", file);
    //     });

    //     const payloadformData: any = {
    //         data: formData,
    //     };

    //     if (formData) {
    //         const response: any = await dispatch(
    //             uploadMultipleFiles(payloadformData)
    //         ).unwrap();

    //         if (response?.data?.status) {
    //             if (response.data.urls) {
    //                 setImages((prevImages) => [...prevImages, ...response.data.urls]);
    //             }
    //         }
    //     }
    // };

    let folderStructure: string = `${projectName}/admin/productImage`;



    const handleFileUpload = async () => {
        if (newImageFiles.length === 0) {
            return []; // No new files to upload
        }

        try {
            const formData = new FormData();
            formData.append("folderStructure", folderStructure);

            newImageFiles.forEach(file => formData.append("content", file));

            const payloadformData: any = { data: formData };

            const response: any = await dispatch(uploadMultipleFiles(payloadformData)).unwrap();

            if (response?.data?.status && response.data.urls) {
                return response.data.urls;
            }

            return [];
        } catch (error) {
            console.error("Error uploading files:", error);
            return [];
        }
    };


    // Modified onPreviewDrop to handle new files only
    const onPreviewDrop = (acceptedFiles) => {
        const validImages = acceptedFiles.filter((file) =>
            file.type.startsWith("image/")
        );

        if (validImages.length !== acceptedFiles.length) {
            alert("Only image files are allowed!");
            return;
        }

        // Store new files separately
        setNewImageFiles((prevFiles) => [...prevFiles, ...validImages]);

        // Update images for display
        setImages((prevImages) => [...prevImages, ...validImages]);

        setError((prevError) => ({
            ...prevError,
            images: ""
        }));
    };
    const removeImage = (imageToRemove, index) => {
        setImages((prevImages) => prevImages.filter((_, i) => i !== index));

        if (typeof imageToRemove === "string") {
            // Remove from existing image URLs
            setExistingImageUrls((prevUrls) => prevUrls.filter((url) => url !== imageToRemove));

            const originalIndex = dialogueData?.postImage?.findIndex(
                (img) => img.url === imageToRemove
            );

            if (originalIndex !== -1 && originalIndex !== undefined) {
                setRemovedIndices((prev) => [...prev, originalIndex]);
            }
        } else {
            // Find the index of the file in newImageFiles
            setNewImageFiles((prevFiles) =>
                prevFiles.filter((file, i) => i !== index)
            );
        }
    };






    return (
        <div>
            <div className="general-setting fake-user p-4">
                <div className=" userSettingBox">
                    <form>
                        <div className="row d-flex  align-items-center">
                            <div className="col-12 col-sm-6 col-md-6 col-lg-6 mb-1 mb-sm-0">
                                <p className="mb-0 fakeseller">Product</p>
                            </div>

                            <div
                                className="col-12 d-flex justify-content-end align-items-center"
                                style={{
                                    paddingTop: '8px',
                                    marginTop: '11px',
                                }}
                            >

                            </div>
                            <div className="row mt-3">
                                <div className="col-12 col-sm-12 col-md-6 col-lg-6 mt-2">
                                    <Input
                                        label={'Product Name'}
                                        name={'Product Name'}
                                        placeholder={'Enter Productname...'}
                                        errorMessage={error.productName}
                                        defaultValue={dialogueData && dialogueData.productName}
                                        onChange={(e) => {
                                            setProductName(e.target.value);
                                            if (!e.target.value) {
                                                return setError({
                                                    ...error,
                                                    productName: `Product name Is Required`,
                                                });
                                            } else {
                                                return setError({
                                                    ...error,
                                                    productName: '',
                                                });
                                            }
                                        }}
                                    />
                                </div>

                                <div className="col-12 col-sm-12 col-md-6 col-lg-6 mt-2">
                                    <Input
                                        type={'number'}
                                        label={`Price (${currency?.symbol})`}
                                        name={'Price'}
                                        placeholder={'Enter Price...'}
                                        errorMessage={error.price}
                                        defaultValue={dialogueData && dialogueData.price}
                                        onChange={(e) => {
                                            setPrice(e.target.value);
                                            if (!e.target.value) {
                                                return setError({
                                                    ...error,
                                                    price: `Price Is Required`,
                                                });
                                            } else if (e.target.value < 0) {
                                                return setError({
                                                    ...error,
                                                    price: 'Price can not less than 0',
                                                });
                                            }
                                            else {
                                                return setError({
                                                    ...error,
                                                    price: '',
                                                });
                                            }
                                        }}
                                    />
                                </div>

                                <div className="col-12 col-sm-12 col-md-6 col-lg-6 mt-2">
                                    <Input
                                        label={`Shipping Charge (${currency?.symbol})`}
                                        name={'shippingcharge'}
                                        type={'number'}
                                        placeholder={'Enter Shipping Charge...'}
                                        errorMessage={error.shippingCharge && error.shippingCharge}
                                        defaultValue={dialogueData && dialogueData.shippingCharges}
                                        onChange={(e) => {
                                            setShippingCharge(e.target.value);
                                            if (!e.target.value) {
                                                return setError({
                                                    ...error,
                                                    shippingCharge: `Shipping Charge Is Required`,
                                                });
                                            } else if (e.target.value > price) {
                                                return setError({
                                                    ...error,
                                                    shippingCharge: `Shipping Charge can not greter than price`,
                                                });
                                            }

                                            else {
                                                return setError({
                                                    ...error,
                                                    shippingCharge: '',
                                                });
                                            }
                                        }}
                                    />
                                </div>

                                <div
                                    className="col-12 col-sm-12 col-md-6 col-lg-6 mt-2"
                                >
                                    <Selector
                                        label={'Seller name'}
                                        selectValue={sellerId}
                                        placeholder={'Enter Details...'}
                                        selectData={dialogueData?.type !== "real" ? allSeller : allRealSeller} // Ensure it's always an array
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
                                        label={'Category'}
                                        selectValue={categoryId}
                                        placeholder={'Enter Details...'}
                                        selectData={categoryOrSubCategoryData}
                                        selectId={true}
                                        errorMessage={error.categoryId && error.categoryId}
                                        disabled={dialogueData ? true : false}
                                        onChange={(e) => {
                                            setCategoryId(e.target.value);
                                            if (!e.target.value) {
                                                return setError({
                                                    ...error,
                                                    categoryId: `Category Is Required`,
                                                });
                                            } else {
                                                return setError({
                                                    ...error,
                                                    categoryId: '',
                                                });
                                            }
                                        }}
                                    />
                                </div>

                                <div
                                    className="col-12 col-sm-12 col-md-6 col-lg-6 mt-2"
                                >
                                    <Selector
                                        label={'Sub Category'}
                                        selectValue={subCategoryId}
                                        placeholder={'Enter Details...'}
                                        selectData={subCategoryNames}
                                        selectId={true}
                                        errorMessage={error.subCategoryId && error.subCategoryId}
                                        disabled={dialogueData ? true : false}
                                        onChange={(e) => {
                                            setSubCategoryId(e.target.value);
                                            if (!e.target.value) {
                                                return setError({
                                                    ...error,
                                                    subCategoryId: `Sub Category Is Required`,
                                                });
                                            } else {
                                                return setError({
                                                    ...error,
                                                    subCategoryId: '',
                                                });
                                            }
                                        }}
                                    />
                                </div>
                                {
                                    attributeName?.length > 0 &&
                                    <h3 className='sellerinformation mt-3'>Attribute</h3>
                                }

                                <div className="d-flex flex-wrap" style={{ paddingRight: "20px" }}>
                                    {attributeName?.map((item) => {

                                        // Find the corresponding attribute from findattributeData
                                        const attribute = findattributeData?.[0]?.attributes?.find(
                                            (attr) => attr?.name === item
                                        );

                                        return (
                                            <div key={item}>
                                                <FormControl sx={{ m: 1, width: 300 }}>
                                                    <InputLabel id={`select-label-${item}`}>{item}</InputLabel>
                                                    <Select
                                                        labelId={`select-label-${item}`}
                                                        id={`select-${item}`}
                                                        multiple
                                                        value={personName[item] || []} // Ensure it's an array for each attribute
                                                        onChange={(event) => handleChange(event, item)}
                                                        input={<OutlinedInput id={`select-multiple-chip-${item}`} label="Chip" />}
                                                        renderValue={(selected) => (
                                                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                                                {selected?.map((value) => (
                                                                    <Chip key={value} label={value} />
                                                                ))}
                                                            </Box>
                                                        )}
                                                        MenuProps={MenuProps}
                                                    >
                                                        {attribute?.values?.map((name) => (
                                                            <MenuItem key={name} value={name} style={getStyles(name, personName[item] || [], theme)}>
                                                                {name}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </div>
                                        );
                                    })}
                                </div>


                                <div className="col-12 mt-3 text-about">
                                    <label className="custom-input">Description</label>
                                    <textarea
                                        cols={6}
                                        rows={6}
                                        value={description}
                                        onChange={(e) => {
                                            setDescription(e.target.value);
                                            if (!e.target.value) {
                                                return setError({
                                                    ...error,
                                                    description: `Description Is Required`,
                                                });
                                            } else {
                                                return setError({
                                                    ...error,
                                                    description: "",
                                                });
                                            }
                                        }}
                                    ></textarea>
                                    {error.description && (
                                        <p className="errorMessage">{error.description && error.description}</p>
                                    )}
                                </div>

                                <div className="col-12 mt-2">
                                    <div className="custom-input">
                                        <label htmlFor="">Images</label>
                                        <>
                                            <ReactDropzone
                                                onDrop={(acceptedFiles: FileWithPath[]) =>
                                                    onPreviewDrop(acceptedFiles)
                                                }
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
                                                    {error.images && (
                                                        <div className="pl-1 text__left">
                                                            <span className="text-red">{error.images}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </>
                                    </div>
                                </div>

                                <div className="col-12 d-flex justify-content-start">
                                    <div className="row image-show-multi">
                                        {images?.length > 0 && (
                                            <>
                                                {images?.map((file: any, index: number) => {
                                                    return (
                                                        <div key={index} className="image-grid-multi ">
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
                                                                        src={file ? file : ""}
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
                                                    );
                                                })}
                                            </>
                                        )}
                                    </div>
                                </div>


                            </div>
                            <div className='d-flex justify-content-end mt-4 gap-2'>
                                <Button
                                    newClass={'submit-btn'}
                                    btnName={'Submit'}
                                    type={'button'}
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                />
                                <Button
                                    onClick={handleCloseAddCategory}
                                    btnName={"Close"}
                                    newClass={"close-model-btn"}
                                />
                            </div>

                        </div>
                    </form>


                </div>
            </div>
        </div>
    );
}



export default FakeProductDialogue;
