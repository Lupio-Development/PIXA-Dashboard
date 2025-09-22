import RootLayout from "@/component/layout/Layout";
import Button from "@/extra/Button";
import Input from "@/extra/Input";
import maleImage from "@/assets/images/male.png";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const SellerInfo = () => {
  const [sellerData, setSellerData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const data = JSON.parse(localStorage.getItem("sellerInfo"));
      setSellerData(data);
    }
  }, []);

  return (
    <>
      <div className="d-flex justify-content-end mb-3 px-2 px-sm-3">
        <Button
          btnName="Back"
          type="button"
          onClick={() => router.back()}
          newClass="submit-btn"
          style={{ borderRadius: "0.5rem", width: "88px" }}
        />
      </div>

      <div className="profile-page payment-setting pt-0">
        <div className="payment-setting-box p-2 p-sm-3">
          <div className="row g-4">

            {/* 🧍 Profile Section */}
            <div className="col-12 col-lg-6">
              <div className="withdrawal-box profile-img1 p-3 h-100">
                <h6 className="custom-text-color mb-3">Profile Avatar</h6>
                <div className="row align-items-center">
                  <div className="col-sm-4 text-center mb-3 mb-sm-0">
                    <img
                      src={sellerData?.image || maleImage.src}
                      alt="Seller Avatar"
                      className="img-fluid"
                      style={{
                        width: "100%",
                        maxWidth: "180px",
                        aspectRatio: "2/3",
                        objectFit: "cover",
                        borderRadius: "20px"
                      }}
                    />
                  </div>
                  <div className="col-sm-8">
                    <Input label="Name" value={sellerData?.sellerFullName || "-"} readOnly />
                    <Input label="User Name" value={sellerData?.sellerUsername || "-"} readOnly className="mt-3" />
                    {sellerData?.mobileNumber && (
                      <Input label="Mobile number" value={sellerData.mobileNumber} readOnly className="mt-3" />
                    )}
                    <Input label="Gender" value={sellerData?.gender || "-"} readOnly className="mt-3" />
                  </div>
                </div>
              </div>
            </div>

            {/* 📍 Address Section */}
            <div className="col-12 col-lg-6">
              <div className="withdrawal-box payment-box p-3 h-100">
                <h6 className="custom-text-color mb-3">Address Info</h6>
                <div className="row g-3">
                  <div className="col-sm-6">
                    <Input label="Address" value={sellerData?.address?.address || "-"} readOnly />
                  </div>
                  <div className="col-sm-6">
                    <Input label="Landmark" value={sellerData?.address?.landMark || "-"} readOnly />
                  </div>
                  <div className="col-sm-6">
                    <Input label="City" value={sellerData?.address?.city || "-"} readOnly />
                  </div>
                  <div className="col-sm-6">
                    <Input label="Country" value={sellerData?.address?.country || "-"} readOnly />
                  </div>
                  <div className="col-sm-6">
                    <Input label="Pincode" value={sellerData?.address?.pinCode || "-"} readOnly />
                  </div>
                  <div className="col-sm-6">
                    <Input label="State" value={sellerData?.address?.state || "-"} readOnly />
                  </div>
                </div>
              </div>
            </div>

            {/* 🏦 Bank Info */}
            <div className="col-12 col-lg-6">
              <div className="withdrawal-box payment-box p-3">
                <h6 className="custom-text-color mb-3">Bank Details Info</h6>
                <div className="row g-3">
                  <div className="col-12">
                    <Input label="Bank Business Name" value={sellerData?.bankDetails?.bankBusinessName || "-"} readOnly />
                  </div>
                  <div className="col-sm-6">
                    <Input label="Bank Name" value={sellerData?.bankDetails?.bankName || "-"} readOnly />
                  </div>
                  <div className="col-sm-6">
                    <Input label="Branch Name" value={sellerData?.bankDetails?.branchName || "-"} readOnly />
                  </div>
                  <div className="col-sm-6">
                    <Input label="Account Number" value={sellerData?.bankDetails?.accountNumber || "-"} readOnly />
                  </div>
                  <div className="col-sm-6">
                    <Input label="IFSC Code" value={sellerData?.bankDetails?.IFSCCode || "-"} readOnly />
                  </div>
                </div>
              </div>
            </div>

            {/* 📁 Documents Info */}
            {sellerData?.document?.length > 0 && (
              <div className="col-12 col-lg-6">
                <div className="withdrawal-box payment-box p-3">
                  <h6 className="custom-text-color mb-3">Identity Proof</h6>
                  <div className="col-12">
                    <Input label="Document Type" value={sellerData?.documentType} readOnly />
                  </div>
                  <div className="row g-4 mt-1">
                    <label className=""
                    style={{
                      fontWeight : 500
                    }}
                    >Docucment Image</label>
                    {sellerData.document.map((doc, index) => (
                      <div key={index} className="col-sm-6 col-md-4 mb-2">
                       
                          <img
                            src={doc}
                            alt={doc.name}
                            style={{
                              width: "100%",
                              height: "auto",
                              borderRadius: "10px",
                              objectFit: "cover",
                              border: "1px solid #ccc"
                            }}
                          />
                       
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
};

SellerInfo.getLayout = function getLayout(page) {
  return <RootLayout>{page}</RootLayout>;
};

export default SellerInfo;
