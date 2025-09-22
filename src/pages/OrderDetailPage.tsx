import RootLayout from "@/component/layout/Layout";
import { getDefaultCurrency } from "@/store/currencySlice";
import { getOrderInfo } from "@/store/sellerSlice";
import { RootStore } from "@/store/store";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";


interface ShippingAddress {
    name: string;
    address: string;
    city: string;
    country: string;
    state: string;
    zipCode: string;
}

interface OrderItem {
    productId?: {
        _id?: any;
        productName?: string;
        mainImage?: string;
    };
    purchasedTimeProductPrice: number;
    purchasedTimeShippingCharges: number;
    commissionPerProductQuantity: number;
    productQuantity: number;
    status: number;

    itemDiscount: number;
    productAttributes: {
        name: string;
        values: string[];
    }[];
    deliveredServiceName?: string; // ✅ Add this property
    trackingId?: string; // ✅ Add this property
    trackingLink?: string; // ✅ Add this property
}


interface OrderInfo {
    orderId?: string;
    items?: OrderItem[];
    total?: number;
    shippingAddress?: ShippingAddress;
    promoCode?: any;
    totalItems: number;
    productCode: string;
    totalQuantity: number;
    paymentGateway: string
}


const OrderDetailPage = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { orderInfo } = useSelector((state: any) => state.seller) as {
        orderInfo: OrderInfo;
    }
    const { currency } = useSelector((state: any) => state.currency)
    const [itemDiscount, setItemDiscount] = useState("");

    const id = router.query.id;

    const orderId =
        typeof window !== "undefined" ? localStorage.getItem("orderId") : null;


    useEffect(() => {
        dispatch(getOrderInfo(orderId || id))
        dispatch(getDefaultCurrency())
    }, [])



    return (
        <div className="row" style={{ margin: "10px" }}>
            {/* Left Section */}
            <div className="col-9 border_order text-light" style={{ height: "100vh" }}>
                <div className="payment-setting-box user-table border-0">
                    <div className="mt-3 primeMain table-custom text-dark">
                        <h5
                            style={{
                                fontWeight: "500",
                                fontSize: "20px",
                                marginTop: "5px",
                                marginBottom: "4px",
                                marginLeft: "5px"
                            }}
                        >
                            OrderId : {orderInfo?.orderId}
                        </h5>
                        <div className="table-responsive">


                            <table width="100%" className="primeTable text-center table-container mt-3">
                                <thead className="sticky-top bg-warning text-dark">
                                    <tr>
                                        <th className="fw-bold py-3">No</th>
                                        <th className="fw-bold py-3">Product Code</th>

                                        <th className="fw-bold py-3">Item Detail</th>
                                        <th className="fw-bold py-3">{`Price (${currency?.symbol})`} </th>
                                        <th className="fw-bold py-3">{`Quantity`} </th>

                                        <th className="fw-bold py-3">{`Shipping Charge (${currency?.symbol})`}</th>
                                        <th className="fw-bold py-3">{`Admin Commission (${currency?.symbol})`}</th>
                                        <th className="fw-bold py-3">{`Total (${currency?.symbol})`} </th>


                                        <th className="fw-bold py-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orderInfo?.items?.length > 0 ? (
                                        orderInfo?.items?.map((mapData: any, index) => (
                                            <tr key={index} className="border-bottom">
                                                {/* Order Number */}
                                                <td>
                                                    <span className="text-dark">{index + 1}</span>
                                                </td>

                                                <td>{mapData?.productCode}</td>

                                                {/* Product Image & Name */}
                                                <td>
                                                    <div className="d-flex align-items-center justify-content-center">
                                                        <img
                                                            src={mapData.productId?.mainImage}
                                                            width={55}
                                                            height={55}
                                                            style={{ borderRadius: "10px", objectFit: "cover" }}
                                                            alt=""
                                                        />
                                                        <div className="ms-3 text-start">
                                                            <p className="fs-6 text-dark mb-1">{mapData.productId?.productName}</p>

                                                            {/* ✅ Show all attributes in the first row only, with line breaks */}
                                                            {mapData?.productAttributes?.map((attr, i) => (
                                                                <p key={i} className="text-dark small mb-1">
                                                                    <strong>{attr.name}:</strong> {attr.values.join(", ")}
                                                                </p>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Product Price */}
                                                <td>{mapData?.purchasedTimeProductPrice * mapData?.productQuantity || 0}</td>

                                                <td>{mapData?.productQuantity || 0}</td>

                                                {/* Shipping Charges */}
                                                <td>{mapData?.purchasedTimeShippingCharges || 0}</td>

                                                {/* Commission Per Product */}
                                                <td>{mapData?.commissionPerProductQuantity || 0}</td>

                                                {/* Status */}


                                                {/* Total */}
                                                <td>{orderInfo?.total || 0}</td>

                                                <td>
                                                    {
                                                        mapData?.status === 1 ? <button className="btnpending">Pending</button> :
                                                            mapData?.status === 2 ? <button className="btn1">Confirmed</button> :
                                                                mapData?.status === 3 ? <button className="btn2">Out Of Delivery</button> :
                                                                    mapData?.status === 4 ? <button className="btn3">Delivered</button> :
                                                                        mapData?.status === 5 ? <button className="btn4">Cancel</button> : ""
                                                    }
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={7} className="text-center" style={{ height: "358px", borderBottom: "none" }}>
                                                No Data Found!
                                            </td>
                                        </tr>
                                    )}
                                </tbody>




                            </table>
                        </div>

                        <div className="borderclass">
                            <div
                                className="p-0"
                                style={{
                                    marginTop: "550px",
                                    borderTop: "1px solid #dbdbdb",
                                }}
                            >
                                <div className="d-flex justify-content-between">
                                    <div>
                                        <h6 className="text-dark mb-3 mt-3">
                                            Total Item : <span className="detailPage">{orderInfo?.totalItems || 0}</span>
                                        </h6>
                                        <h6 className="text-dark">
                                            Total Quantity : <span className="detailPage">{orderInfo?.totalQuantity || 0}</span>
                                        </h6>
                                    </div>

                                    {orderInfo?.items?.map((data, index) => (
                                        <div key={index} style={{
                                            marginRight: "53px"
                                        }}>
                                            <h6 className="text-dark fw-normal mb-3 mt-3">
                                                {`Amount `}: <span className="detailPage">{`${data?.purchasedTimeProductPrice} ${currency?.symbol}` || 0}</span>
                                            </h6>
                                            <h6 className="text-dark mb-3 mt-3">
                                                {`Discount`} : <span className="detailPage text-danger">{`-${data?.itemDiscount} ${currency?.symbol}` || 0}</span>
                                            </h6>
                                            <h6 className="text-dark mb-4 mt-3">
                                                {`Shipping Charge`} : <span className="detailPage text-success">{`+${data?.purchasedTimeShippingCharges} ${currency?.symbol}` || 0}</span>
                                            </h6>


                                        </div>
                                    ))}

                                </div>

                            </div>
                        </div>

                        {
                            orderInfo?.items?.map((data) => {
                                return (
                                    <div className="d-flex justify-content-end mt-4"
                                        style={{
                                            background: "#FF3F50",
                                            paddingTop: "14px",
                                            paddingBottom: "14px",
                                            borderBottomLeftRadius: "26px",
                                            borderBottomRightRadius: "26px",
                                            paddingRight: "80px"

                                        }}
                                    >
                                        <span className="text-white fw-bold"
                                            style={{
                                                fontSize: "18px"
                                            }}
                                        >

                                            {`Total Amount`} : {(data?.purchasedTimeProductPrice + data?.purchasedTimeShippingCharges) - data?.itemDiscount}
                                        </span>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>



            </div>

            {/* Right Section */}
            <div className="col-3"

            >
                <div className="text-dark p-3 border rounded-3">
                    <div className="d-flex justify-content-between align-items-center">
                        <h5 className="logistic-details">Logistics Details</h5>
                        <a
                            className="btn-track-order1 rounded-pill shadow-sm d-flex justify-content-center"
                            href={orderInfo?.items?.[0]?.trackingLink} // Use first tracking link
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Track Order
                        </a>



                    </div>
                    {
                        orderInfo?.items?.map((data, index) => {
                            return (
                                <>
                                    <div key={index} className="mt-3">
                                        <p className="mb-0 me-2 fontSize"

                                        >Delivered Service Name:</p>
                                        <p className="mt-1 detail detailPage">{data?.deliveredServiceName || "N/A"}</p>
                                    </div>
                                    <div key={index} className="mt-3">
                                        <p className="mb-0 me-2 fontSize">Tracking Id:</p>
                                        {

                                            <p className="detailPage mt-1 detail">{data?.trackingId || "N/A"}</p>

                                        }
                                    </div>
                                    <div key={index} className="mt-3">
                                        <p className="mb-0 me-2 fontSize">Tracking Id:</p>
                                        {
                                            data?.trackingLink ?
                                                <a href={data?.trackingLink} target="_blank" className="fw-bold mt-1 detail" style={{ cursor: "pointer" }}>{data?.trackingLink}</a> :
                                                <p className="detailPage mt-1 detail">{"N/A"}</p>

                                        }
                                    </div>
                                </>
                            );
                        })
                    }
                </div>
                <div className="border rounded-3 text-dark p-3 mt-3">
                    <h5 className="mb-3 logistic-details">Shipping Address</h5>

                    <div>
                        <p className="mb-1 fontSize">Address : </p>
                        <p className="detailPage detail">{orderInfo?.shippingAddress?.address || "N/A"}</p>
                    </div>
                    <div>
                        <p className="mb-1 fontSize">City : </p>
                        <p className="detailPage detail">{orderInfo?.shippingAddress?.city || "N/A"}</p>
                    </div>
                    <div>
                        <p className="mb-1 fontSize">Country : </p>
                        <p className="detailPage detail">{orderInfo?.shippingAddress?.country || "N/A"}</p>
                    </div>
                    <div>
                        <p className="mb-1 fontSize">State : </p>
                        <p className="detailPage detail">{orderInfo?.shippingAddress?.state || "N/A"}</p>
                    </div>
                    <div>
                        <p className="mb-1 fontSize">ZipCode : </p>
                        <p className="detailPage detail">{orderInfo?.shippingAddress?.zipCode || "N/A"}</p>
                    </div>
                </div>

                {
                    orderInfo?.promoCode &&

                    <div className="border rounded-3 text-dark p-3 mt-3">
                        <h5 >Promocode</h5>
                        <div>
                            <p className="mb-1 fontSize mt-4">PromoCode : </p>
                            <p className="fw-semibold detail detailPage">{orderInfo?.promoCode?.code || "N/A"}</p>


                        </div>

                        <div>
                            <p className="mb-1 fontSize mt-4">Discount : </p>
                            <p className="fw-semibold detail detailPage">
                                {orderInfo?.promoCode?.discount
                                    ? `${orderInfo.promoCode.discount} (${orderInfo.promoCode.discountType === 1 ? currency?.symbol : "%"
                                    })`
                                    : "N/A"}
                            </p>
                        </div>

                        <div>
                            <p className="mb-1 fontSize mt-4">Minimum Order Value : </p>
                            <p className="fw-semibold detail detailPage">
                                {orderInfo?.promoCode?.minOrderValue
                                    ? `${orderInfo.promoCode.minOrderValue}`
                                    : "N/A"}
                            </p>
                        </div>

                        <div>
                            <p className="mb-1 fontSize mt-4">Conditions : </p>
                            <p className="fw-semibold detail detailPage">
                                {orderInfo?.promoCode?.minOrderValue
                                    ? `${orderInfo.promoCode.conditions?.join(",")}`
                                    : "N/A"}
                            </p>
                        </div>
                    </div>
                }


            </div>
        </div>

    )
}

OrderDetailPage.getLayout = function getLayout(page) {
    return <RootLayout>{page}</RootLayout>;
};


export default OrderDetailPage