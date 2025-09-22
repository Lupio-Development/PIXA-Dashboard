import Button from "@/extra/Button";
import useClearSessionStorageOnPopState from "@/extra/ClearStorage";
import Input from "@/extra/Input";
import Selector from "@/extra/Selector";
import { closeDialog } from "@/store/dialogSlice";
import { RootStore, useAppDispatch } from "@/store/store";
import { updateFakeUser } from "@/store/userSlice";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import EditIcon from "@mui/icons-material/Edit";
import { getUserPost } from "@/store/postSlice";
import { getUserVideo } from "@/store/videoSlice";
import { projectName } from "@/util/config";
import { uploadFile } from "@/store/adminSlice";
import ReactSelect from "react-select";
import female from "@/assets/images/8.jpg"

export default function UserProfile(props) {
  useClearSessionStorageOnPopState("multiButton");

  const AgeNumber = Array.from(
    { length: 100 - 18 + 1 },
    (_, index) => index + 18
  );
  const { dialogueData } = useSelector((state: any) => state.dialogue);
  const [hasMounted, setHasMounted] = useState(false);
  const [postData, setPostData] = useState(null);

  useEffect(() => {
    setHasMounted(true);
    // Retrieve postData from localStorage on the client side
    const storedData =
      typeof window !== "undefined" && localStorage.getItem("postData");
    if (storedData) setPostData(JSON.parse(storedData));
  }, []);

  const { countryData } = useSelector((state: any) => state.user);

  const dispatch = useAppDispatch();
  const router = useRouter();
  const [gender, setGender] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [nickName, setNickName] = useState<string>("");
  const [mobileNumber, setMobileNumber] = useState<string>("");
  const [ipAddress, setIpAddress] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [countryDataSelect, setCountryDataSelect] = useState<any>();
  const [image, setImage] = useState("");
  const [bio, setBio] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [imagePath, setImagePath] = useState<string>(
    dialogueData ? dialogueData?.image : ""
  );
  const [age, setAge] = useState<string>("");

  const id = router.query.id;
  const type = router.query.type

  const [error, setError] = useState<any>({
    name: "",
    nickName: "",
    bio: "",
    mobileNumber: "",
    email: "",
    ipAddress: "",
    gender: "",
    country: "",
    age: "",
    image: "",
  });

  useEffect(() => {
    if (postData) {
      setName(postData?.name);
      setNickName(postData?.userName);
      setGender(postData?.gender);
      setAge(postData?.age);
      setEmail(postData?.email);
      setIpAddress(postData?.ipAddress);
      setBio(postData?.bio);
      setMobileNumber(postData?.mobileNumber);
      // setCountry(postData?.country);
      setImagePath(
        postData?.image
          ? postData?.image
          : postData?.userImage
      );
      const selectedCountry = countryData.find((item: any) => {
        return (
          item?.name?.common?.toLowerCase() === postData?.country?.toString().toLowerCase() ||
          item?.name?.name?.common?.toLowerCase() === postData?.country?.toString().toLowerCase()
        );
      });
      
      
      if (selectedCountry) {
        setCountryDataSelect(selectedCountry);
      } else {
        setCountryDataSelect(postData?.country); // Fallback if no match is found
      }
    }
  }, [postData, id]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !nickName || !email || !age || !gender) {
      let errors: any = {};
      if (!name) errors.name = "Name Is Required !";
      if (!nickName) errors.nickName = "User name Is Required !";

      if (!email) errors.email = "Email Is Required !";
      if (!gender) errors.gender = "Gender Is Required !";
      if (!country) errors.country = "Country is Required !";
      if (!age) errors.age = "Age is required !";

      setError(errors);
    } else {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("userName", nickName);
      formData.append("gender", gender);
      formData.append("age", age);
      formData.append("country", country);
      formData.append("email", email);
      formData.append("mobileNumber", mobileNumber);
      formData.append("image", image[0]);


      const data = {
        name: name,
        userName: nickName,
        gender: gender,
        age: age,
        country: countryDataSelect.name.common,
        email: email,
        mobileNumber: mobileNumber,
        image: image,
      }
      const payload: any = {
        id: postData?._id,
        data: data,
      };

      dispatch(updateFakeUser(payload));
      dispatch(closeDialog());
      router.back();

      localStorage.setItem("multiButton", JSON.stringify("Fake User"));
    }
  };

  let folderStructure: string = `${projectName}/admin/userImage`;

  const handleImage = async (event: any) => {
    event.preventDefault(); // Prevent unintended navigation

    if (type !== "ViewFakeUser") {
      const file = event.target.files[0];
      if (!file) return; // Ensure a file is selected

      const formData = new FormData();

      formData.append("folderStructure", folderStructure);
      formData.append("keyName", file.name);
      formData.append("content", file);

      // Create a payload for your dispatch
      const payloadformData: any = {
        data: formData,
      };

      if (formData) {
        const response: any = await dispatch(uploadFile(payloadformData)).unwrap();

        if (response?.data?.status) {
          if (response.data.url) {
            setImage(response.data.url);
            setImagePath(response.data.url);
          }
        }
      }
    }
    // Get the uploaded file from the event

  };


  const CustomOption: React.FC<{
    innerProps: any;
    label: string;
    data: any;
  }> = ({ innerProps, label, data }) => (
    <div
      {...innerProps}
      className="country-optionList my-2"
      style={{ cursor: "pointer" }}
    >
      <img
        src={data?.flags?.png && data?.flags?.png}
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
        country: "",
      });
    }
  };

  return (
    <div
      style={{
        paddingLeft: "35px",
        paddingRight: "35px",
        maxHeight: "400px",
      }}
    >
      <div
        className="row"
        style={{
          borderRadius: "5px",
          paddingLeft: "10px",
        }}
      >
        <div className="avatar-setting col-3">
          <div className="userSettingBox">
            <div className="image-avatar-box">
              <div className="cover-img-user"></div>
              <div className="avatar-img-user" style={{ cursor: "pointer" }}>
                <div className="profile-img" style={{ paddingTop: "14px" }}>
                  {(postData?.isFake === true) && (
                    <label
                      htmlFor="image"

                      onChange={type !== "ViewFakeUser" ? (e) => handleImage(e) : undefined}

                    >
                      <div className="avatar-img-icon">

                        {
                          type !== "ViewFakeUser" &&
                          <EditIcon className=" cursorPointer" />
                        }
                      </div>
                      <input
                        type="file"
                        name="image"
                        id="image"
                        accept="image/*" // Restrict to images if needed
                        disabled={type === "ViewFakeUser" ? true : false}
                        style={{ display: "none" }}

                      />
                      {imagePath ? (
                        <img src={imagePath ? imagePath : female.src} alt="Profile Avatar" />
                      ) : (
                        <img src={imagePath ? imagePath : female.src} />
                      )}
                    </label>
                  )}
                  {postData?.isFake === false && (
                    <img src={imagePath
                      || female.src
                    } alt="Profile Avatar"

                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="general-setting fake-user col-9">
          <div className=" userSettingBox">
            <form>
              <div className="row d-flex  align-items-center">
                <div className="col-12 col-sm-6 col-md-6 col-lg-6 mb-1 mb-sm-0">
                  <h5 className="mb-0">Profile Setting</h5>
                </div>


              </div>

              <div className="row mt-3">
                <div className="col-12 col-sm-12 col-md-6 col-lg-6 mt-2">
                  <Input
                    type={"text"}
                    label={"Name"}
                    name={"name"}
                    placeholder={"Enter Details..."}
                    value={name}
                    readOnly={postData?.isFake !== true || type === "ViewFakeUser"}

                    errorMessage={error.name && error.name}
                    onChange={(e: any) => {
                      setName(e.target.value);
                      if (!e.target.value) {
                        return setError({
                          ...error,
                          name: `Name Is Required`,
                        });
                      } else {
                        return setError({
                          ...error,
                          name: "",
                        });
                      }
                    }}
                  />
                </div>
                <div className="col-12 col-sm-12 col-md-6 col-lg-6 mt-2">
                  <Input
                    label={"User name"}
                    name={"nickName"}
                    value={nickName}
                    readOnly={postData?.isFake !== true || type === "ViewFakeUser"}

                    placeholder={"Enter Details..."}
                    errorMessage={error.nickName && error.nickName}


                    onChange={(e) => {
                      setNickName(e.target.value);
                      if (!e.target.value) {
                        return setError({
                          ...error,
                          nickName: `User name Is Required`,
                        });
                      } else {
                        return setError({
                          ...error,
                          nickName: "",
                        });
                      }
                    }}
                  />
                </div>
                <div className="col-12 col-sm-12 col-md-6 col-lg-6 mt-2">
                  <Input
                    label={"E-mail Address"}
                    name={"email"}
                    value={email}
                    readOnly={postData?.isFake !== true || type === "ViewFakeUser"}
                    errorMessage={error.email && error.email}
                    placeholder={"Enter Details..."}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (!e.target.value) {
                        return setError({
                          ...error,
                          email: `Email Is Required`,
                        });
                      } else {
                        return setError({
                          ...error,
                          email: "",
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
                      isDisabled={postData?.isFake === false || type === "ViewFakeUser"}
                      formatOptionLabel={(option) => (
                        <div className="optionShow-option">
                          <img
                            height={30}
                            width={30}
                            src={option?.flags?.png ? option?.flags?.png : ""}
                          />
                          <span className="ms-2">
                            {option?.name?.common ? option?.name?.common : ""}
                          </span>
                        </div>
                      )}
                      components={{
                        Option: CustomOption,
                      }}
                    />
                  </div>
                </div>

                <div className="col-12 col-sm-12 col-md-6 col-lg-6 mt-2">
                  <Selector
                    label={"Gender"}
                    selectValue={gender}
                    placeholder={"Select Gender"}
                    selectData={["Male", "Female"]}
                    readOnly={postData?.isFake === false}
                    isdisabled={type === "ViewFakeUser" ? true : false}
                    errorMessage={error.gender && error.gender}
                    data={postData}
                    onChange={(e) => {
                      setGender(e.target.value);
                      if (!e.target.value) {
                        return setError({
                          ...error,
                          gender: `Gender Is Required`,
                        });
                      } else {
                        return setError({
                          ...error,
                          gender: "",
                        });
                      }
                    }}
                  />
                </div>
                <div className="col-12 col-sm-12 col-md-6 col-lg-6 mt-2">
                  <Selector
                    label={"Age"}
                    selectValue={age}
                    placeholder={"Select Age"}
                    errorMessage={error.age && error.age}
                    readOnly={postData?.isFake === false}
                    isdisabled={type === "ViewFakeUser" ? true : false}

                    data={postData}
                    selectData={AgeNumber}
                    onChange={(e) => {
                      setAge(e.target.value);
                      if (!e.target.value) {
                        return setError({
                          ...error,
                          age: `Age Is Required`,
                        });
                      } else {
                        return setError({
                          ...error,
                          age: "",
                        });
                      }
                    }}
                  />
                </div>
                <div className="col-12 col-sm-12 col-md-6 col-lg-6 mt-3">
                  <Input
                    label={"Login Type"}
                    name={"email"}
                    value={
                      postData?.loginType === 1
                        ? "Mobile Number "
                        : postData?.loginType === 2
                          ? "Google "
                          : postData?.loginType === 4 ? "Email-Password" :
                            "Quick"
                    }
                    disabled={postData?.isFake === true}
                    readOnly={postData?.isFake === false}
                  />
                </div>




              </div>
            </form>

            <div className=" d-flex justify-content-end">
              {(postData?.isFake == true && type != "ViewFakeUser") && (
                <Button
                  newClass={"submit-btn"}
                  btnName={"Submit"}
                  type={"button"}
                  onClick={(e: any) => handleSubmit(e)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
