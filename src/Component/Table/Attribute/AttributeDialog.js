import React, { useEffect, useState } from "react";
import Button from "../../extra/Button";
import Input from "../../extra/Input";
import { CLOSE_DIALOGUE } from "../../store/dialogue/dialogue.type";
import { connect, useDispatch, useSelector } from "react-redux";

import {
  createAttribute,
  updateAttribute,
} from "../../store/attribute/attribute.action";

const AttributeDialog = () => {
  const { dialogueData } = useSelector((state) => state.dialogue);


  const [mongoId, setMongoId] = useState("");
  const [name, setName] = useState();
  const [detail, setDetail] = useState("");
  const [addDetail, setAddDetail] = useState([]);

  const [error, setError] = useState({
    name: "",
    detail: "",
  });

  useEffect(() => {
    setMongoId(dialogueData?._id);
    setName(dialogueData?.name);
    setAddDetail(dialogueData?.value);
  }, [dialogueData]);
  const dispatch = useDispatch();

  const addCountryList = (e) => {
    e?.preventDefault();
    setAddDetail((old) => {
      if (!Array.isArray(old)) {
        old = [];
      }
      return [...old, detail.charAt(0).toUpperCase() + detail.slice(1)]; // Capitalize the detail before adding
    });
    setDetail("");
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addCountryList(event);
    }
  };

  const onRemove = (id) => {
    setAddDetail((old) => {
      if (!Array.isArray(old)) {
        old = [];
      }
      return old.filter((array, index) => {
        return index !== id;
      });
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || detail) {
      let error = {};
      if (!name) error.name = "Name is required!";

      if (!detail) error.detail = "Details are required!";

      setError({ ...error });
    } else {


      const data = {
        name,
        value: addDetail,
      };
      if (mongoId) {
        dispatch(updateAttribute(mongoId, data));
      } else {
        dispatch(createAttribute(data));
      }

      dispatch({ type: CLOSE_DIALOGUE });
    }
  };

  return (
    <div className="mainDialogue fade-in">
      <div className="Dialogue">
        <div className="dialogueHeader">
          <div className="headerTitle text-white fw-bold">Attribute</div>
          <div
            className="closeBtn "
            onClick={() => {
              dispatch({ type: CLOSE_DIALOGUE });
            }}
          >
            <i class="fa-solid fa-xmark"></i>
          </div>
        </div>
        <div className="dialogueMain">
          <div className="row">
            <div className="col-12">
              <Input
                label={`Name`}
                id={`name`}
                type={`text`}
                value={name}
                placeholder={`Enter name`}
                errorMessage={error.name && error.name}
                onChange={(e) => {
                  const capitalizedValue =
                    e.target.value.charAt(0).toUpperCase() +
                    e.target.value.slice(1);
                  setName(capitalizedValue); // Set the capitalized value as the name
                  if (!capitalizedValue) {
                    setError({
                      ...error,
                      name: `Name Is Required`,
                    });
                  } else {
                    setError({
                      ...error,
                      name: "",
                    });
                  }
                }}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-12 w-100">
              <div>
                <div className="d-flex align-items-center">
                  {name === "Colors" ? (
                    <>
                      <div
                        className={`prime-input ${
                          detail ? "col-11" : "col-12"
                        } `}
                      >
                        <label>Value</label>
                        <input
                          type="color"
                          className={`form-input text-capitalize`}
                          required=""
                          style={{ cursor: "pointer", padding: "5px" }}
                          value={detail}
                          onKeyPress={handleKeyPress}
                          onChange={(e) => {
                            setDetail(e.target.value);
                            if (!e.target.value) {
                              return setError({
                                ...error,
                                detail: "Details is Required!",
                              });
                            } else {
                              return setError({
                                ...error,
                                detail: "",
                              });
                            }
                          }}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <Input
                        type={`text`}
                        label={`Value`}
                        value={detail}
                        errorMessage={error.detail && error.detail}
                        newClass={`${
                          detail ? "col-11" : "col-12"
                        } text-capitalize`}
                        placeholder={`Enter detail`}
                        onChange={(e) => {
                          setDetail(e.target.value);
                          if (!e.target.value) {
                            return setError({
                              ...error,
                              detail: `Details Is Required`,
                            });
                          } else {
                            return setError({
                              ...error,
                              detail: "",
                            });
                          }
                        }}
                        onKeyPress={handleKeyPress}
                      />
                    </>
                  )}
                  {detail !== "" && (
                    <div
                      className=" px-3 text-white d-flex align-items-center justify-content-center"
                      style={{
                        
                        borderRadius: "5px",
                        cursor: "pointer",
                        backgroundColor: "#DEF213",
                        padding: "6px 0px",
                        marginTop: `${name === "Colors" ? "12px":"0px"}`
                      }}
                      onClick={addCountryList}
                    >
                      <span className="text-dark">ADD</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div>
              <div className="form-group mb-2">
              
              </div>
              <div className="mb-2">
                <div
                  className="displayCountry"
                  style={{ overflow: "auto" , border : "none" }}
                >
                  {addDetail?.map((item, id) => {
                    return (
                      <>
                        <span
                          className="ms-1 my-1 text-capitalize"
                          style={{
                            backgroundColor: " #2E2D3C",
                            padding: "5px",
                            color: " #FFF",
                            borderRadius: "5px",
                            fontSize: "12px",
                            padding : "8px 10px"
                          }}
                        >
                          {item}
                          <i
                            class="fa-solid fa-circle-xmark ms-2 my-2"
                            style={{
                              background : "#22202D"
                            }}
                            onClick={() => {
                              onRemove(id);
                            }}
                          ></i>
                        </span>
                      </>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="dialogueFooter">
          <div className="dialogueBtn">
            {!mongoId ? (
              <>
                <Button
                  btnName={`Submit`}
                  btnColor={`btnBlackPrime text-dark`}
                  style={{ borderRadius: "5px", width: "80px" }}
                  newClass={`me-2`}
                  onClick={handleSubmit}
                />
              </>
            ) : (
              <>
                <Button
                  btnName={`Update`}
                  btnColor={`btnBlackPrime text-dark`}
                  style={{ borderRadius: "5px", width: "80px" }}
                  newClass={`me-2`}
                  onClick={handleSubmit}
                />
              </>
            )}
            <Button
              btnName={`Close`}
              btnColor={`bg-danger text-white`}
              style={{ borderRadius: "5px", width: "80px" }}
              onClick={() => {
                dispatch({ type: CLOSE_DIALOGUE });
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default connect(null, { createAttribute, updateAttribute })(
  AttributeDialog
);
