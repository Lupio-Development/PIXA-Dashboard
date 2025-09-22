import RootLayout from "@/component/layout/Layout";
import Button from "@/extra/Button";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const AttributeInfo = () => {
    const router = useRouter();
    const [attributeDetails, setAttributeDetails] = useState(null);



    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedAttributes = localStorage.getItem("attributes");
            if (storedAttributes) {
                setAttributeDetails(JSON.parse(storedAttributes));
            }
        }
    }, []);

    return (
        <div style={{ padding: "10px" }}>
            <div className="d-flex justify-content-between">
                <h3
                    style={{
                        fontWeight: "500",
                        fontSize: "25px",
                        marginTop: "5px",
                        marginBottom: "4px",
                        paddingLeft: "10px",
                    }}
                >
                    Attribute Info
                </h3>

                {/* <div className="d-flex justify-content-end">
                <Button
                    btnName={"Back"}
                    type={"button"}
                    onClick={() => { router.back() }}
                    newClass={"submit-btn"}
                    style={{
                        borderRadius: "0.5rem",
                        width: "88px",
                        marginRight: "30px",
                    }}
                />
            </div> */}
            </div>
            {attributeDetails && (
                <div className="row"
                    style={{
                        backgroundColor: "#F9F9F9",
                        marginLeft: "10px"
                    }}
                >
                    <div className="row g-4">
                        {attributeDetails.attributes?.map((item, index) => (
                            <div key={index} className="col-12 col-sm-6 col-md-3 d-flex">
                                <div
                                    style={{
                                        width: "100%",
                                        borderRadius: "10px",
                                        overflow: "hidden",
                                        display: "flex",
                                        flexDirection: "column",
                                        background: "#FAFAFF",
                                        boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 10px", // Smooth shadow
                                        borderTopLeftRadius: "30px",
                                        borderTopRightRadius: "30px",
                                    }}
                                >
                                    {/* Header */}
                                    <div
                                        style={{
                                            background: "#27dec0",
                                            color: "#fff",
                                            padding: "10px",
                                            textAlign: "center",
                                            borderTopLeftRadius: "30px",
                                            borderTopRightRadius: "30px",
                                            fontSize: "18px",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {item?.name}
                                    </div>

                                    {/* List Container (Fixed Height + Scrollable) */}
                                    <div
                                        style={{
                                            flex: "1",
                                            padding: "10px",
                                            height: "300px", // Fixed height
                                            overflowY: "auto", // Enable scroll when content overflows
                                        }}
                                    >
                                        <ul style={{ listStyle: "disc", paddingLeft: "20px", marginBottom: 0 }}>
                                            {item?.values?.map((data, index) => (
                                                <>
                                                    <li key={index} className="pb-2">{data}</li>

                                                </>

                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>


                </div>
            )}
        </div>

    );
};

AttributeInfo.getLayout = function getLayout(page: React.ReactNode) {
    return <RootLayout>{page}</RootLayout>;
};

export default AttributeInfo;
