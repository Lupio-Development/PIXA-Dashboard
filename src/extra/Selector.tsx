import React from "react";

export default function Selector(props: any) {
  const {
    label,
    placeholder,
    selectValue,
    paginationOption,
    id,
    labelShow,
    selectData,
    onChange,
    defaultValue,
    errorMessage,
    isdisabled,
    selectId,
    data,
    type
  } = props;

  return (
    <div className="selector-custom">
      {labelShow === false ? (
        " "
      )
        :
        type === true ?
          <label htmlFor={id} className="custom-input">
            {label}
          </label>
          : (
            <label htmlFor={id} className="label-selector-custom">
              {label}
            </label>
          )}

      <div className="form-group row">
        <div className="form-outline col-12">
          <select
            id="formControlLg"
            className=" form-select py-2 text-capitalize"
            aria-label={label}
            value={selectValue ? selectValue : ""}
            aria-placeholder={placeholder}
            defaultValue={defaultValue ? defaultValue : ""}
            onChange={onChange}
            style={{ borderRadius: "30px", maxHeight: "200px" }}
            disabled={data?.isFake == false || isdisabled == true}
            
          >
            {paginationOption === false ? ( 
              ""
            ) : (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {selectData?.map((item: any, index: number) => {
              const displayValue = selectId
                ? (item as { _id: string; name: string; fullName?: string })
                  .fullName ||
                (item as { _id: string; name: string; fullName?: string })
                  .name ||
                  item?.productName  

                  ||

                item?.sellerFullName
                : typeof item === "string"
                  ? item.toLowerCase()
                  : item; 


              return (
                <option
                  value={
                    selectId
                      ? (item as { _id: string })._id
                      : typeof item === "string"
                        ? item.toLowerCase()
                        : item
                  }
                  key={index}
                  className="py-2"
                >
                  {item ? displayValue : `${label} does not found`}
                </option>
              );
            })}
          </select>
        </div>
      </div>
      {errorMessage && (
        <p className="errorMessage">{errorMessage && errorMessage}</p>
      )}
    </div>
  );
}
