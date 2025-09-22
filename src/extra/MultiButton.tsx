import React, { useEffect } from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

export default function MultiButton(props: any) {
  const { multiButtonSelect, setMultiButtonSelect, label } = props;

  const handleAlignment = (event: any, newAlignment: string) => {
    if (newAlignment !== null && newAlignment !== undefined) {
      setMultiButtonSelect(newAlignment);
      if (typeof window !== "undefined") {
        if (
          multiButtonSelect === "Add Items" ||
          multiButtonSelect === "Updated Items"
        ) {
        
          localStorage.setItem(
            "multiButton1",
            JSON.stringify(newAlignment || label[0])
          );
        } else if (
          multiButtonSelect === "User" ||
          multiButtonSelect === "Seller"
        ) {
         
          localStorage.setItem(
            "multiButton2",
            JSON.stringify(newAlignment || label[0])
          );
        } else if (label.length === 2 && label.includes("Profile") && label.includes("Product")) {
       
          localStorage.setItem(
            "multiButton4",
            JSON.stringify(newAlignment || label[0])
          );
        } else if (label.length === 4 && label.includes("Order") && label.includes("Transaction")) {
          
          localStorage.setItem(
            "multiButton5",
            JSON.stringify(newAlignment || label[0])
          );
        } else if (label.length === 2 && label.includes("User") && label.includes("Seller")) {
          localStorage.setItem(
            "multiButton6",
            JSON.stringify(newAlignment || label[0])
          );
        }
        else  {
          localStorage.setItem(
            "multiButton",
            JSON.stringify(newAlignment || label[0])
          );
        }
      }

    }
  }



  const multiButtonGetItemGet =
    typeof window !== "undefined" && localStorage?.getItem("multiButton");
  const multiButtonGetItem =
    multiButtonGetItemGet && multiButtonGetItemGet;

  useEffect(() => {
    if (setMultiButtonSelect) {
      setMultiButtonSelect(multiButtonGetItem ? multiButtonGetItem : label[0]);
    }
  }, []);

  return (
    <>
      {multiButtonSelect === "Add Items" || multiButtonSelect === "Updated Items" || multiButtonSelect === "User" ||
        multiButtonSelect === "Seller" ? (
        <div className="multiButton1">
          {label?.map((item: any, index: number) => (
            <ToggleButtonGroup
              key={index} // Moved key to the outer element
              value={multiButtonSelect}
              exclusive={true}
              onChange={handleAlignment}
              aria-label="text alignment"
            >
              <ToggleButton value={item} aria-label={item}>
                <span className="text-capitalize">{item}</span>
              </ToggleButton>
            </ToggleButtonGroup>
          ))}
        </div>
      ) : (
        <div className="multiButton">
          {label?.map((item: any, index: number) => (
            <ToggleButtonGroup
              key={index} // Moved key to the outer element
              value={multiButtonSelect}
              exclusive={true}
              onChange={handleAlignment}
              aria-label="text alignment"
            >
              <ToggleButton value={item} aria-label={item}>
                <span className="text-capitalize">{item}</span>
              </ToggleButton>
            </ToggleButtonGroup>
          ))}
        </div>
      )}
    </>
  );

}