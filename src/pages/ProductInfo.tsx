
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeDialog } from "@/store/dialogSlice";
import Button from "../extra/Button";
import RootLayout from "@/component/layout/Layout";
import Title from "@/extra/Title";
import { getDefaultCurrency } from "@/store/currencySlice";
import { RootStore } from "@/store/store";
import male from "@/assets/images/male.png";

const ProductInfo = () => {
    const dispatch = useDispatch();
    const { dialogueData } = useSelector((state: any) => state.dialogue);
    const [data, setData] = useState([]);
    const products = dialogueData?.selectedProducts || [];
    const { currency } = useSelector((state: any) => state.currency)
    const productDetailData = typeof Window !== "undefined" && JSON.parse(localStorage.getItem("productInfo"));


    useEffect(() => {
        setData(productDetailData?.selectedProducts); // Ensures rehydration matches SSR output
    }, []);


    useEffect(() => {
        dispatch(getDefaultCurrency())
    }, [])

    return (
        <>
            <h5 className="mb-0"
                style={{
                    marginLeft: "24px"
                }}
            >Product Details</h5>
            <div
                className="d-flex flex-wrap"
                style={{
                    gap: "24px",
                    marginTop: "24px",
                    marginLeft: "24px",
                }}
            >
                {data?.length > 0 ? data?.map((item) => (
                    <div
                        key={item.productId} // Use a unique identifier instead of index
                        className="col-2 product-card"
                        style={{
                            padding: "8px",
                            border: "1px solid #EFEFEF",
                            borderRadius: "32px",
                            minWidth: "320px",
                        }}
                    >
                        <div>
                            <img
                                src={item?.mainImage || male.src}
                                width={300}
                                height={300}
                                className="image-rounded"
                                alt="Product"
                            />
                        </div>

                        <div>
                            <p className="product-text">Product Name</p>
                            <b className="linene-floral">{item?.productName}</b>
                        </div>

                        <div className="d-flex justify-content-between">

                            <div style={{ marginTop: "20px" }}>
                                <p className="product-text">Product Price</p>
                                <b className="linene-floral">
                                    {`${currency?.symbol} ${item?.price.toFixed(2)}`}
                                </b>
                            </div>

                            <div style={{ marginTop: "20px" }}>
                                <p className="product-text">Shippping Charge</p>
                                <b className="linene-floral">
                                    {item?.shippingCharges !== undefined && item?.shippingCharges !== null
                                        ? `${currency?.symbol} ${item.shippingCharges.toFixed(2)}`
                                        : "-"}
                                </b>

                            </div>
                        </div>


                    </div>
                )) : <div
                    className="d-flex justify-content-center align-items-center"
                    style={{
                        height: "60vh",  // Adjust height as needed
                        width: "100%",
                        fontSize: "24px",
                    }}
                >
                    No Data Found
                </div>}

            </div>

        </>

    );
};

ProductInfo.getLayout = function getLayout(page: React.ReactNode) {
    return <RootLayout>{page}</RootLayout>;
};

export default ProductInfo;
