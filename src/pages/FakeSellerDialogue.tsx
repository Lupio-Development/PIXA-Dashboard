import React, { useEffect, useState } from 'react';
import Button from '../extra/Button';
import Input from '../extra/Input';
import Selector from '../extra/Selector';
import { useSelector } from 'react-redux';
import { getCountry, addFakeUser } from '../store/userSlice';
import { closeDialog } from '../store/dialogSlice';
import ReactSelect from 'react-select';
import { useAppDispatch } from '@/store/store';
import { projectName } from '@/util/config';
import { uploadFile } from '@/store/adminSlice';
import { createFakeSeller, updateFakeSeller } from '@/store/sellerSlice';
import RootLayout from '@/component/layout/Layout';
import { useRouter } from 'next/router';

interface ErrorState {
    firstName: string;
    lastName: string;
    businessName: string;
    address: string;
    nickName: string;
    mobileNumber: string;
    email: string;
    country: string;
    image: string;
    landMark: string;
    city: string;
    pinCode: any;
    state: string;
    bankBusinessName: string;
    bankName: string;
    IfscCode: string;
    accountNumber: string;
    branchName: string;
    businessTag: string;
    imageUrl : string;
}

function FakeSellerDialogue() {
    const router = useRouter();
    const AgeNumber = Array.from(
        { length: 100 - 18 + 1 },
        (_, index) => index + 18
    );
    const { dialogueData } = useSelector((state: any) => state.dialogue);
    const { countryData } = useSelector((state: any) => state.user);
    const hasPermission = useSelector((state: any) => state.admin.admin.flag);
    const dispatch = useAppDispatch();
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [businessName, setBusinessName] = useState<string>('');
    const [bankBusinessName, setBankBusinessName] = useState<string>('');
    const [nickName, setNickName] = useState<string>('');
    const [mobileNumber, setMobileNumber] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [countryDataSelect, setCountryDataSelect] = useState<any>({});
    const [image, setImage] = useState<any>();
    const [imagePath, setImagePath] = useState<string>(
        dialogueData ? dialogueData?.image : ''
    );
    const [city, setCity] = useState<string>("");
    const [imageUrl , setImageUrl] = useState("");
    const [pinCode, setPinCode] = useState<string>()
    const [address, setAddress] = useState<string>("");
    const [landMark, setLandMark] = useState<string>("");
    const [state, setState] = useState<string>("");
    const [country, setCountry] = useState<string>("");
    const [accountNumber, setAccountNumber] = useState<string>('');
    const [bankName, setBankName] = useState<string>('');
    const [IfscCode, setIfscCode] = useState<string>();
    const [branchName, setBranchName] = useState<string>('');
    const [businessTag, setBusinessTag] = useState<string>('');
    const [fileData, setFileData] = useState<any>();
    const [error, setError] = useState<ErrorState>({
        firstName: '',
        lastName: '',
        businessName: '',
        address: '',
        nickName: '',
        mobileNumber: '',
        email: '',
        country: '',
        image: '',
        landMark: '',
        city: '',
        pinCode: '',
        state: '',
        bankBusinessName: '',
        bankName: '',
        accountNumber: '',
        IfscCode: '',
        branchName: '',
        businessTag: '',
        imageUrl : '',
    });




    useEffect(() => {
        dispatch(getCountry());
    }, []);

    useEffect(() => {
        if (countryData?.length > 0) {
            const defaultCountry = countryData.find(
                (country) => country?.name?.common === countryDataSelect
            );

            if (defaultCountry) {
                setCountryDataSelect(defaultCountry);
            }
        }
    }, [countryData]);

    useEffect(() => {
        if (dialogueData) {
            setFirstName(dialogueData?.sellerFullName || "");
            setLastName(dialogueData?.sellerUsername || "");
            setMobileNumber(dialogueData?.mobileNumber || "");
            setEmail(dialogueData?.email || "");
            setAddress(dialogueData?.address?.address || "");
            setLandMark(dialogueData?.address?.landMark || "");
            setCity(dialogueData?.address?.city || "");
            setState(dialogueData?.address?.state || "");
            setPinCode(dialogueData?.address?.pinCode || "");
            setBankBusinessName(dialogueData?.bankDetails?.bankBusinessName || "");
            setBankName(dialogueData?.bankDetails?.bankName || "");
            setAccountNumber(dialogueData?.bankDetails?.accountNumber || "");
            setIfscCode(dialogueData?.bankDetails?.IFSCCode || "");
            setBranchName(dialogueData?.bankDetails?.branchName || "");
            setBusinessTag(dialogueData?.businessTag || "");
            setImage(dialogueData?.image || "");
        }
    }, [dialogueData]);



    const handleSubmit = async () => {
        if (
            !firstName ||
            !lastName ||
            !address ||
            !mobileNumber ||
            !email ||
            !countryDataSelect ||
            !image ||
            !landMark ||
            !city ||
            !pinCode ||
            !state ||
            !bankBusinessName ||
            !bankName ||
            !accountNumber ||
            !IfscCode ||
            !branchName ||
            !businessTag
        ) {
            let error = {} as ErrorState;
            if (!firstName) error.firstName = 'Full name Is Required !';
            if (!lastName) error.lastName = 'User name Is Required !';
            if (!businessName) error.businessName = "Business name is Required !";
            if (!address) error.address = "Address is Required !";
            if (!city) error.city = "City is Required !"
            if (!nickName) error.nickName = 'User name Is Required !';
            if (!mobileNumber) error.mobileNumber = 'Mobile Number Is Required !';
            if (!email) {
                error.email = 'Email Is Required !';
            }
            if (!email.includes("@")) {
                error.email = "Email must contain '@' "
            }
            if (!image) error.image = 'Image Is Required !';
            if (!countryDataSelect) error.country = 'Country is required !';
            if (!landMark) error.landMark = 'Landmark is required !';
            if (!pinCode) error.pinCode = "PinCode is required !";
            if (!state) error.state = "State is required !";
            if (!bankBusinessName) error.bankBusinessName = "Bank Business name is required !";
            if (!bankName) error.bankName = "Bank name is required !";
            if (!accountNumber) error.accountNumber = "Account number is required !"
            if (!IfscCode) error.IfscCode = "IFSC Code is required !";
            if (!branchName) error.branchName = "Branch Name is required !";
            if (!businessTag) error.businessTag = "Business Tag is required !"

            return setError({ ...error });
        } else {

            const uploadedImageUrl = await handleFileUpload();


            const jsonData: any = {
                mobileNumber,
                sellerFullName: firstName,
                sellerUsername: lastName,
                businessName,
                businessTag,
                email,
                address,
                landMark,
                city,
                state,
                pinCode,
                country: countryDataSelect?.name?.common,
                bankBusinessName,
                bankName,
                accountNumber,
                IFSCCode: IfscCode,
                branchName,
                image: uploadedImageUrl
            };

            if (dialogueData) {
                jsonData.sellerId = dialogueData._id; // Assuming dialogueData contains sellerId
            }

            const payload: any = {
                data: jsonData,
            };

            if (dialogueData) {
                dispatch(updateFakeSeller(payload))
            } else {

                dispatch(createFakeSeller(payload));
            }


            dispatch(closeDialog());
        }
    };

    const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImage(e.target.files[0]);
            setImagePath(URL.createObjectURL(e.target.files[0]));
            setFileData(e.target.files[0]);
            setError({ ...error, image: '' });
        }
    };

    const CustomOption: React.FC<{
        innerProps: any;
        label: string;
        data: any;
    }> = ({ innerProps, label, data }) => (
        <div
            {...innerProps}
            className="country-optionList my-2"
            style={{ cursor: 'pointer' }}
        >
            <img
                src={data?.flags?.svg && data?.flags?.png}
                alt={label}
                height={30}
                width={30}
            />
            <span className="ms-2">{data?.name?.common && data?.name?.common}</span>
        </div>
    );

    const handleSelectChange = (selected: any | null) => {
        setCountryDataSelect(selected);

        if (!selected) {
            return setError({
                ...error,
                country: `Country Is Required`,
            });
        } else {
            return setError({
                ...error,
                country: '',
            });
        }
    };

    let folderStructure: string = `${projectName}/admin/sellerImage`;

    const handleFileUpload: any = async (event: any) => {
        try {
            const formData = new FormData();

            formData.append("folderStructure", folderStructure);
            formData.append("keyName", fileData?.name);
            formData.append("content", fileData);

            // Create a payload for your dispatch
            const payloadformData: any = {
                data: formData,
            };

            if (formData) {
                const response: any = await dispatch(
                    uploadFile(payloadformData)
                ).unwrap();
                if (response?.data?.status) {
                    if (response.data.url) {
                        setImage(response?.data?.url);
                        setImagePath(response?.data?.url);
                        setImageUrl(response?.data?.url)

                        return response.data.url; // Return the image URL
                    }
                }
            }
        } catch (error) {
            console.log("error", error.message)
        }
        // Get the uploaded file from the event
    };

    const handleCloseAddCategory = () => {
        dispatch(closeDialog());
        localStorage.setItem("dialogueData", JSON.stringify(dialogueData));
    };


    return (
        <div>
            <div className="general-setting fake-user p-4">
                <div className=" userSettingBox">
                    <form>
                        <div className="row d-flex  align-items-center">
                            <div className="col-12 col-sm-6 col-md-6 col-lg-6 mb-1 mb-sm-0">
                                <p className="mb-0 fakeseller">Fake Seller</p>
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
                                <h3 className='sellerinformation'>Seller Information</h3>
                                <div className="col-12 col-sm-12 col-md-6 col-lg-6 mt-3">
                                    <Input
                                        label={'Full Name'}
                                        name={'Full Name'}
                                        placeholder={'Enter FullName...'}
                                        errorMessage={error.firstName}
                                        defaultValue={dialogueData && dialogueData.sellerFullName}
                                        onChange={(e) => {
                                            setFirstName(e.target.value);
                                            if (!e.target.value) {
                                                return setError({
                                                    ...error,
                                                    firstName: `Full Name Is Required`,
                                                });
                                            } else {
                                                return setError({
                                                    ...error,
                                                    firstName: '',
                                                });
                                            }
                                        }}
                                    />
                                </div>

                                <div className="col-12 col-sm-12 col-md-6 col-lg-6 mt-3">
                                    <Input
                                        label={'User Name'}
                                        name={'User Name'}
                                        placeholder={'Enter Username...'}
                                        errorMessage={error.lastName}
                                        defaultValue={dialogueData && dialogueData.sellerUsername}
                                        onChange={(e) => {
                                            setLastName(e.target.value);
                                            if (!e.target.value) {
                                                return setError({
                                                    ...error,
                                                    lastName: `User Name Is Required`,
                                                });
                                            } else {
                                                return setError({
                                                    ...error,
                                                    lastName: '',
                                                });
                                            }
                                        }}
                                    />
                                </div>


                                <div className="col-12 col-sm-12 col-md-6 col-lg-6 mt-2">
                                    <Input
                                        label={'Mobile Number'}
                                        name={'mobileNumber'}
                                        type={'number'}
                                        placeholder={'Enter Mobile number...'}
                                        errorMessage={error.mobileNumber && error.mobileNumber}
                                        defaultValue={dialogueData && dialogueData.mobileNumber}
                                        onChange={(e) => {
                                            setMobileNumber(e.target.value);
                                            if (!e.target.value) {
                                                return setError({
                                                    ...error,
                                                    mobileNumber: `Mobile Number Is Required`,
                                                });
                                            } else {
                                                return setError({
                                                    ...error,
                                                    mobileNumber: '',
                                                });
                                            }
                                        }}
                                    />
                                </div>

                                <div className="col-12 col-sm-12 col-md-6 col-lg-6 mt-2">
                                    <Input
                                        label={'E-mail Address'}
                                        name={'email'}
                                        errorMessage={error.email && error.email}
                                        defaultValue={dialogueData && dialogueData.email}
                                        placeholder={'Enter Details...'}
                                        onChange={(e) => {
                                            const emailValue = e.target.value;
                                            setEmail(emailValue);

                                            if (!emailValue) {
                                                setError({
                                                    ...error,
                                                    email: "Email is required",
                                                });
                                            } else if (!emailValue.includes("@")) {
                                                setError({
                                                    ...error,
                                                    email: "Email must contain '@'",
                                                });
                                            } else {
                                                setError({
                                                    ...error,
                                                    email: "",
                                                });
                                            }
                                        }}

                                    />
                                </div>



                                <div className="col-12 col-sm-12 col-md-6 col-lg-6 mt-2 ">
                                    <Input
                                        type={'file'}
                                        label={'Image'}
                                        accept={'image/png, image/jpeg'}
                                        errorMessage={error.image && error.image}
                                        onChange={handleImage}
                                    />

                                    <img
                                        src={imagePath && imagePath}
                                        alt=""
                                        draggable={false}
                                        className={`${(!imagePath || imagePath === '') && 'd-none'
                                            } `}
                                        data-class={`showImage`}
                                        style={{ width: '100px', height: '100px', objectFit: "cover" }}
                                    />

                                </div>
                                <br></br>



                                <h3 className='mt-5 sellerinformation'>Address Information</h3>

                                <div className="col-12 col-sm-12 col-md-6 col-lg-6 mt-2">
                                    <Input
                                        label={'Address'}
                                        name={'Address'}
                                        placeholder={'Enter Address...'}
                                        errorMessage={error.address && error.address}
                                        defaultValue={dialogueData && dialogueData.address.address}
                                        onChange={(e) => {
                                            setAddress(e.target.value);
                                            if (!e.target.value) {
                                                return setError({
                                                    ...error,
                                                    address: `Address Is Required`,
                                                });
                                            } else {
                                                return setError({
                                                    ...error,
                                                    address: '',
                                                });
                                            }
                                        }}
                                    />
                                </div>

                                <div className="col-12 col-sm-12 col-md-6 col-lg-6 mt-2">
                                    <Input
                                        label={'Landmark'}
                                        name={'LandMark'}
                                        placeholder={'Enter Landmark...'}
                                        errorMessage={error.landMark && error.landMark}
                                        defaultValue={dialogueData && dialogueData.address.landMark}
                                        onChange={(e) => {
                                            setLandMark(e.target.value);
                                            if (!e.target.value) {
                                                return setError({
                                                    ...error,
                                                    landMark: `LandMark Is Required`,
                                                });
                                            } else {
                                                return setError({
                                                    ...error,
                                                    landMark: '',
                                                });
                                            }
                                        }}
                                    />
                                </div>

                                <div className="col-12 col-sm-12 col-md-6 col-lg-6 mt-2">
                                    <Input
                                        label={'City'}
                                        name={'City'}
                                        placeholder={'Enter City...'}
                                        errorMessage={error.city && error.city}
                                        defaultValue={dialogueData && dialogueData.address.city}
                                        onChange={(e) => {
                                            setCity(e.target.value);
                                            if (!e.target.value) {
                                                return setError({
                                                    ...error,
                                                    city: `City Is Required`,
                                                });
                                            } else {
                                                return setError({
                                                    ...error,
                                                    city: '',
                                                });
                                            }
                                        }}
                                    />
                                </div>


                                <div className="col-12 col-sm-12 col-md-6 col-lg-6 mt-2">
                                    <Input
                                        type="text"
                                        label={'State'}
                                        name={'State'}
                                        placeholder={'Enter State...'}
                                        errorMessage={error.state && error.state}
                                        defaultValue={dialogueData && dialogueData.address.state}
                                        onChange={(e) => {
                                            setState(e.target.value);
                                            if (!e.target.value) {
                                                return setError({
                                                    ...error,
                                                    state: `State Is Required`,
                                                });
                                            } else {
                                                return setError({
                                                    ...error,
                                                    state: '',
                                                });
                                            }
                                        }}
                                    />
                                </div>

                                <div className="col-12 col-sm-12 col-md-6 col-lg-6 mt-2">
                                    <div className="custom-input">
                                        <label>Country</label>
                                        <ReactSelect
                                            options={countryData || []}
                                            value={countryDataSelect}
                                            isClearable={false}
                                            onChange={(selected) => handleSelectChange(selected)}
                                            getOptionValue={(option) => option?.name?.common}
                                            className="mt-2"
                                            formatOptionLabel={(option) => (
                                                <div className="optionShow-option">
                                                    <img
                                                        height={30}
                                                        width={30}
                                                        alt={option?.name?.common}
                                                        src={option?.flags?.png ? option?.flags?.png : "https://upload.wikimedia.org/wikipedia/en/4/41/Flag_of_India.svg"}
                                                    />
                                                    <span className="ms-2">  {option?.name?.common
                                                        ? option?.name?.common
                                                        : "India"}</span>
                                                </div>
                                            )}
                                            components={{
                                                Option: CustomOption,
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="col-12 col-sm-12 col-md-6 col-lg-6 mt-2">
                                    <Input
                                        type="number"
                                        label={'Pincode'}
                                        name={'Pincode'}
                                        placeholder={'Enter Pincode...'}
                                        errorMessage={error.pinCode && error.pinCode}
                                        defaultValue={dialogueData && dialogueData.address.pinCode}
                                        onChange={(e) => {
                                            setPinCode(e.target.value);
                                            if (!e.target.value) {
                                                return setError({
                                                    ...error,
                                                    pinCode: `PinCode Is Required`,
                                                });
                                            } else {
                                                return setError({
                                                    ...error,
                                                    pinCode: '',
                                                });
                                            }
                                        }}
                                    />
                                </div>



                               

                                <h3 className='mt-5 sellerinformation'>Account Details</h3>

                                <div className="col-12 col-sm-12 col-md-6 col-lg-6 mt-2">
                                    <Input
                                        label={'Business Name'}
                                        name={'Business Name'}
                                        placeholder={'Enter Business Name...'}
                                        errorMessage={error.businessName && error.businessName}
                                        defaultValue={dialogueData && dialogueData.businessName}
                                        onChange={(e) => {
                                            setBusinessName(e.target.value);
                                            if (!e.target.value) {
                                                return setError({
                                                    ...error,
                                                    businessName: `Business Name Is Required`,
                                                });
                                            } else {
                                                return setError({
                                                    ...error,
                                                    businessName: '',
                                                });
                                            }
                                        }}
                                    />
                                </div>

                                <div className="col-12 col-sm-12 col-md-6 col-lg-6 mt-2">
                                    <Input
                                        label={'Business Tag'}
                                        name={'Business Tag'}
                                        placeholder={'Enter Business Tag...'}
                                        errorMessage={error.businessTag && error.businessTag}
                                        defaultValue={dialogueData && dialogueData.businessTag}
                                        onChange={(e) => {
                                            setBusinessTag(e.target.value);
                                            if (!e.target.value) {
                                                return setError({
                                                    ...error,
                                                    businessTag: `Business Tag Is Required`,
                                                });
                                            } else {
                                                return setError({
                                                    ...error,
                                                    businessTag: '',
                                                });
                                            }
                                        }}
                                    />
                                </div>



                                <div className="col-12 col-sm-12 col-md-6 col-lg-6 mt-2">
                                    <Input
                                        type="text"
                                        label={'Bank Business name'}
                                        name={'State'}
                                        placeholder={'Enter Bank Business name...'}
                                        errorMessage={error.bankBusinessName && error.bankBusinessName}
                                        defaultValue={dialogueData && dialogueData.bankDetails?.bankBusinessName}
                                        onChange={(e) => {
                                            setBankBusinessName(e.target.value);
                                            if (!e.target.value) {
                                                return setError({
                                                    ...error,
                                                    bankBusinessName: `Bank Business name Is Required`,
                                                });
                                            } else {
                                                return setError({
                                                    ...error,
                                                    bankBusinessName: '',
                                                });
                                            }
                                        }}
                                    />
                                </div>

                                <div className="col-12 col-sm-12 col-md-6 col-lg-6 mt-2">
                                    <Input
                                        type="text"
                                        label={'Bank name'}
                                        name={'State'}
                                        placeholder={'Enter Bank Name...'}
                                        errorMessage={error.bankName && error.bankName}
                                        defaultValue={dialogueData && dialogueData.bankDetails?.bankName
                                        }
                                        onChange={(e) => {
                                            setBankName(e.target.value);
                                            if (!e.target.value) {
                                                return setError({
                                                    ...error,
                                                    bankName: `Bank name Is Required`,
                                                });
                                            } else {
                                                return setError({
                                                    ...error,
                                                    bankName: '',
                                                });
                                            }
                                        }}
                                    />
                                </div>


                                <div className="col-12 col-sm-12 col-md-6 col-lg-6 mt-2">
                                    <Input
                                        type="number"
                                        label={'Account number'}
                                        name={'State'}
                                        placeholder={'Enter Account number...'}
                                        errorMessage={error.accountNumber && error.accountNumber}
                                        defaultValue={dialogueData && dialogueData.bankDetails.accountNumber}
                                        onChange={(e) => {
                                            setAccountNumber(e.target.value);
                                            if (!e.target.value) {
                                                return setError({
                                                    ...error,
                                                    accountNumber: `Account number Is Required`,
                                                });
                                            } else {
                                                return setError({
                                                    ...error,
                                                    accountNumber: '',
                                                });
                                            }
                                        }}
                                    />
                                </div>

                                <div className="col-12 col-sm-12 col-md-6 col-lg-6 mt-2">
                                    <Input
                                        type="text"
                                        label={'IFSC Code'}
                                        name={'IFSC Code'}
                                        placeholder={'Enter IFSC Code...'}
                                        errorMessage={error.IfscCode && error.IfscCode}
                                        defaultValue={dialogueData && dialogueData.bankDetails.IFSCCode}
                                        onChange={(e) => {
                                            setIfscCode(e.target.value);
                                            if (!e.target.value) {
                                                return setError({
                                                    ...error,
                                                    IfscCode: `IFSC Code Is Required`,
                                                });
                                            } else {
                                                return setError({
                                                    ...error,
                                                    IfscCode: '',
                                                });
                                            }
                                        }}
                                    />
                                </div>

                                <div className="col-12 col-sm-12 col-md-6 col-lg-6 mt-2">
                                    <Input
                                        type="text"
                                        label={'Branch Name'}
                                        name={'Branch Name'}
                                        placeholder={'Enter Branch Name...'}
                                        errorMessage={error.branchName && error.branchName}
                                        defaultValue={dialogueData && dialogueData.bankDetails.branchName}
                                        onChange={(e) => {
                                            setBranchName(e.target.value);
                                            if (!e.target.value) {
                                                return setError({
                                                    ...error,
                                                    branchName: `Branch Name Is Required`,
                                                });
                                            } else {
                                                return setError({
                                                    ...error,
                                                    branchName: '',
                                                });
                                            }
                                        }}
                                    />
                                </div>


                            </div>
                            <div className='d-flex justify-content-end mt-4 gap-2'>
                                <Button
                                    newClass={'submit-btn'}
                                    btnName={'Submit'}
                                    type={'button'}
                                    onClick={handleSubmit}
                                />
                                <Button
                                    onClick={handleCloseAddCategory} // Use `replace` to prevent history clutter
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

FakeSellerDialogue.getLayout = function getLayout(page: React.ReactNode) {
    return <RootLayout>{page}</RootLayout>;
};

export default FakeSellerDialogue;
