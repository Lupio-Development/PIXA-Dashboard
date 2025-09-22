"use client";
import RootLayout from "../component/layout/Layout";
import React, { useEffect, useState } from "react";
import VideoIcon from "../assets/icons/VideoIcon.svg";
import UserTotalIcon from "../assets/icons/UserSideBarIcon.svg";
import SongIcon from "../assets/icons/songIcon.svg";
import TotalChannelIcon from "../assets/icons/ChannelIcon.svg";
import NewTitle from "../extra/Title";
import Image from "next/image";
import { useSelector } from "react-redux";
import { dashboardCount, getChartUser, getChartVideo, getChartPost, getRecentOrder, getTopSellingProduct, getChartRevenueAnalytics, getActiveInactiveSeller, getActiveInactiveUser } from "../store/dashSlice";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useAppDispatch } from "@/store/store";
import { ApexOptions } from "apexcharts";
import Seller from "../../src/assets/images/sellerone.svg";
import Product from "../../src/assets/images/product.svg"
import Table from "@/extra/Table";
import RecentOrder from "@/component/dashboard/RecentOrder";
import TopSellingProduct from "@/component/dashboard/TopSellingProduct";
import TopRatingProduct from "@/component/dashboard/TopRatingProduct";
import TopBuyer from "@/component/dashboard/TopBuyer";
import TopSeller from "@/component/dashboard/TopSeller";
import LiveSeller from "@/assets/images/liveSelllerIcon.svg";
import OrderIcon from "@/assets/images/orderIcon.svg";
import LiveUser from "@/assets/images/liveUser.svg";
import dashboardCategory from "@/assets/images/dashboardcategory.svg";
import dashboardSubCateogry from "@/assets/images/dashboardSubCategory.svg";
import AdminCommission from "@/assets/images/adminCommission.svg";
import { data } from "jquery";


const Dashboard = (props) => {
  const {
    dashCount,
    chartAnalyticOfVideos,
    chartAnalyticOfPosts,
    chartAnalyticOfUsers,
    activeInactiveSeller,
    activeInactiveUser,
    totalCommission,
    totalEarningWithCommission,
    totalEarningWithoutCommission,
    recentOrder
  } = useSelector((state: any) => state.dashboard);
  const [multiButtonSelect, setMultiButtonSelect] = useState<string>("Top Selling Product");

  const router = useRouter();
  const dispatch = useAppDispatch();

  let label = [];
  let labelData = [];
  let dataPost = [];
  let dataVideo = [];
  let dataUser = [];
  let dataCommission = [];
  let dataEarningWithCommission = [];
  let dataEarningWithoutCommission = [];
  const [startDate, setStartDate] = useState<string>("All");
  const [endDate, setEndDate] = useState<string>("All");
  const [page, setPage] = useState<any>(1);
  const [size, setSize] = useState(20);

    useEffect(() => {
      if (typeof window !== "undefined") {
        const storedSubTab = localStorage.getItem("multiButton");
        try {
          const parsed = storedSubTab ? JSON.parse(storedSubTab) : "Top Selling Product";
          setMultiButtonSelect(parsed);
        } catch (e) {
          console.error("Error parsing sub-tab from localStorage:", e);
          setMultiButtonSelect("Top Selling Product");
        }
      }
    }, []);

  

  useEffect(() => {
    let payload: any = {
      startDate: startDate,
      endDate: endDate,
    };
    dispatch(dashboardCount(payload));
  }, [dispatch, startDate, endDate]);

  useEffect(() => {
    let payload: any = {
      startDate: startDate,
      endDate: endDate,
      type: "Post",
    };
    dispatch(getChartPost(payload));
  }, [dispatch, startDate, endDate]);

  useEffect(() => {
    let payload: any = {
      startDate: startDate,
      endDate: endDate,
      type: "Video",
    };
    dispatch(getChartVideo(payload));
  }, [dispatch, startDate, endDate]);

  useEffect(() => {
    let payload: any = {
      startDate: startDate,
      endDate: endDate,
      type: "User",
    };
    dispatch(getChartUser(payload));
  }, [dispatch, startDate, endDate]);

  useEffect(() => {
    let payload: any = {
      startDate: startDate,
      endDate: endDate,
    };
    dispatch(getChartRevenueAnalytics(payload));
  }, [dispatch, startDate, endDate]);

  useEffect(() => {
    let payload: any = {
      startDate: startDate,
      endDate: endDate,
    };
    dispatch(getActiveInactiveSeller(payload));
  }, [dispatch, startDate, endDate]);

  useEffect(() => {
    let payload: any = {
      startDate: startDate,
      endDate: endDate,
    };
    dispatch(getActiveInactiveUser(payload));
  }, [dispatch, startDate, endDate]);


  chartAnalyticOfUsers?.forEach((data_: any) => {
    const newDate = data_?._id;
    if (newDate) {
      label?.push(newDate);
      dataUser?.push(data_?.count);
    }
  });

  chartAnalyticOfVideos?.forEach((data_: any) => {

    const newDate = data_?._id;
    if (newDate) {
      label?.push(newDate);
      dataVideo?.push(data_?.count);
    }
  });

  chartAnalyticOfPosts?.forEach((data_: any) => {

    const newDate = data_?._id;
    if (newDate) {
      label?.push(newDate);
      dataPost?.push(data_?.count);
    }
  });

  totalCommission?.forEach((data_: any) => {

    const newDate = data_?._id;

    if (newDate) {
      labelData?.push(newDate);
      dataCommission?.push(data_?.totalCommission.toFixed(2));
    }
  });

  totalEarningWithCommission?.forEach((data_: any) => {

    const newDate = data_?._id;

    if (newDate) {
      labelData?.push(newDate);
      dataEarningWithCommission?.push(data_?.totalEarningWithCommission.toFixed(2));
    }
  });

  totalEarningWithoutCommission?.forEach((data_: any) => {

    const newDate = data_?._id;

    if (newDate) {
      labelData?.push(newDate);
      dataEarningWithoutCommission?.push(data_?.totalEarningWithoutCommission.toFixed(2));
    }
  });


  let labelSet: any = new Set(label);
  // Convert labelSet back to array and sort
  label = [...labelSet].sort(
    (a: any, b: any) => new Date(a).getTime() - new Date(b).getTime()
  );

  let labelSetData: any = new Set(labelData);
  // Convert labelSet back to array and sort
  labelData = [...labelSetData].sort(
    (a: any, b: any) => new Date(a).getTime() - new Date(b).getTime()
  );

  // Ensure all arrays have the same length and are aligned properly with labels
  const maxLength = label?.length;
  const maxLabelLength = labelData?.length;

  for (let i = 0; i < maxLength; i++) {
    if (dataUser[i] === undefined) {
      dataUser[i] = 0;
    }
    if (dataVideo[i] === undefined) {
      dataVideo[i] = 0;
    }
    if (dataPost[i] === undefined) {
      dataPost[i] = 0;
    }
    if (dataCommission[i] === undefined) {
      dataCommission[i] = 0;
    }
    if (dataEarningWithCommission[i] === undefined) {
      dataEarningWithCommission[i] = 0;
    }
    if (dataEarningWithoutCommission[i] === undefined) {
      dataEarningWithoutCommission[i] = 0;
    }
  }

  for (let i = 0; i < maxLabelLength; i++) {
    if (dataCommission[i] === undefined) {
      dataCommission[i] = 0;
    }

    if (dataEarningWithCommission[i] === undefined) {
      dataEarningWithCommission[i] = 0;
    }

    if (dataEarningWithoutCommission[i] === undefined) {
      dataEarningWithoutCommission[i] = 0;
    }
  }

  const totalSeries = {
    labels: label,
    dataSet: [
      {
        name: "Total User",
        data: dataUser,
      },
      {
        name: "Total Video",
        data: dataVideo,
      },
      {
        name: "Total Post",
        data: dataPost,
      },
    ],
  };

  const totalSeriesOfRevenue = {
    labels: labelData,
    dataSet: [
      {
        name: "Total Commission",
        data: dataCommission,
      },
      {
        name: "Total Earning With Commission",
        data: dataEarningWithCommission,
      },
      {
        name: "Total Earning Without Commission",
        data: dataEarningWithoutCommission,
      },
    ],
  };

  const formattedLabels = labelData.map((date) =>
    new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
  );
  

  const optionsTotal: ApexOptions = {
    chart: {
      type: "area",
      stacked: false,
      height: "200px",
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 0,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [20, 100, 100, 100],
      },
    },
    yaxis: {
      show: false,
    },
    xaxis: {
      categories: label,
      // rotate: 0,
      // rotateAlways: true,
      // minHeight: 50,
      // maxHeight: 100,
      labels: {
        offsetX: -4, // Adjust the offset vertically
        // fontSize: 10,
      },
    },

    tooltip: {
      shared: true,
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
      offsetX: -10,
    },
    colors: ["#8B82FC", "#786D81", "#be73f6"],
  };

  const sortedLabelData = labelData
  .filter((date) => date) // Remove undefined or null values
  .map((date) => new Date(date)) // Convert to Date objects if they are in string format
  .sort((a : any, b : any) => a - b) // Ensure chronological order
  .map((date) => date.toISOString().split("T")[0]); // Format as 'YYYY-MM-DD'

  const optionsTotalOfRevenue: ApexOptions = {
    chart: {
      type: "area",
      stacked: false,
      height: "200px",
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 0,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [20, 100, 100, 100],
      },
    },
    yaxis: {
      show: false,
    },
    xaxis: {
      categories: sortedLabelData,
      labels: {
        formatter: (value) => (value ? new Date(value).toLocaleDateString("en-US") : ""),
      },
    },
    tooltip: {
      shared: true,
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
      offsetX: -10,
    },
    colors: ["#8B82FC", "#786D81", "#be73f6"],
  };


  const optionsGradient: ApexOptions = {
    chart: {
      height: 400,
      width: 200,
      type: "radialBar",
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: 0,
        endAngle: 365,
        hollow: {
          margin: 0,
          size: "55%",
          background: "#fff",
          image: undefined,
          imageOffsetX: 0,
          imageOffsetY: 0,
          position: "front",
          dropShadow: {
            enabled: false,
            top: 3,
            left: 0,
            blur: 4,
            opacity: 0.24,
          },
        },
        track: {
          background: "#8B82FC", // Change the background color here
          strokeWidth: "90%",
          margin: 0, // margin is in pixels
          dropShadow: {
            enabled: false,
            top: -3,
            left: 0,
            blur: 4,
            opacity: 0.35,
          },
        },
        dataLabels: {
          show: true,
          name: {
            show: true,
            fontFamily: undefined,
            fontWeight: 700,
            fontSize: "17px",
            color: "#404040",
            offsetY: -10,
          },
          value: {
            formatter: function (val: any) {
              return parseInt(val) + "%";
            },
            color: "#9B7FF8",
            fontWeight: 600,
            fontSize: "30px",
            show: true,
          },
        },
      },
    },
    labels: ["Active User"],
    fill: {
      type: "solid",
      colors: ["#be73f6"],
    },
    stroke: {
      lineCap: "round",
    },
    states: {
      hover: {
        filter: {
          type: "none", // Disables the hover effect
        },
      },
    },
  };

  const optionsGradientOfRevenue: ApexOptions = {
    chart: {
      height: 400,
      width: 200,
      type: "radialBar",
      toolbar: { show: false },
    },
    plotOptions: {
      radialBar: {
        startAngle: 0,
        endAngle: 365,
        hollow: {
          size: "55%",
          background: "#fff",
        },
        track: {
          background: "#8B82FC",
          strokeWidth: "90%",
        },
        dataLabels: {
          show: true,
          name: {
            show: true,
            fontSize: "17px",
            color: "#404040",
            offsetY: -10,
          },
          value: {
            formatter: (val: any) => `${parseInt(val)}%`,
            color: "#9B7FF8",
            fontSize: "30px",
            show: true,
          },
        },
      },
    },
    labels: ["Active Sellers"],
    fill: {
      type: "solid",
      colors: ["#be73f6"],
    },
    stroke: {
      lineCap: "round",
    },

    states: {
      hover: {
        filter: {
          type: "none", // Disables the hover effect
        },
      },
    },
  };

  const activePercentage = (activeInactiveSeller.activeSellers / activeInactiveSeller.totalSellers) * 100;
  const seriesGradientOfRevenue = [activePercentage];

  const activePercentageofUser = (activeInactiveUser.activeUsers / activeInactiveUser.totalUsers) * 100;
  const seriesGradient = [activePercentageofUser];

  const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });


  return (
    <>
      <div className="dashboard " style={{ padding: "15px" }}>
        <div className="dashboardHeader primeHeader !mb-0 !p-0">
          <h4 className="heading-dashboard d-block">Welcome Admin !</h4>
          <NewTitle
            dayAnalyticsShow={true}
            setEndDate={setEndDate}
            setStartDate={setStartDate}
            startDate={startDate}
            endDate={endDate}
            titleShow={true}
            name={`Dashboard`}
          />
        </div>
        <div className="dashBoardMain px-4 pt-2">
          <div className="row dashboard-count-box">
            <div
              className="  adminProfileBox px-2  col-lg-3 col-md-6 col-sm-12 cursor"
              onClick={() => router.push("/userTable")}
            >
              <div className="dashBoxData bg-white">
                <div className="icon icon-sm icon-shape-small  text-center border-radius-xl my-auto icon-data1">
                  <Image src={UserTotalIcon} alt="UserTotalIcon" />
                </div>
                <div className="dashBox-text">
                  <h5 className="text-center">Total User</h5>
                  <h6 className="text-center pt-3 fw-bold custom-text-color">
                    {dashCount?.totalUsers ? dashCount?.totalUsers : 0}
                  </h6>
                </div>
              </div>
            </div>
            <div
              className="  adminProfileBox px-2   col-lg-3 col-md-6 col-sm-12 cursor"
              onClick={() => router.push("/postTable")}
            >
              <div className="dashBoxData bg-white">
                <div className="icon icon-sm icon-shape-small  text-center border-radius-xl my-auto icon-data1">
                  <Image src={TotalChannelIcon} alt="TotalChannelIcon" />
                </div>
                <div className="dashBox-text">
                  <h5 className="text-center">Total Post</h5>
                  <h6 className="text-center pt-3 fw-bold  custom-text-color">
                    {dashCount?.totalPosts ? dashCount?.totalPosts : 0}
                  </h6>
                </div>
              </div>
            </div>
            <div
              className="  adminProfileBox px-2  col-lg-3 col-md-6 col-sm-12  cursor"
              onClick={() => router.push("/videoTable")}
            >
              <div className="dashBoxData bg-white">
                <div className="icon icon-sm icon-shape-small  text-center border-radius-xl my-auto icon-data1">
                  <Image src={VideoIcon} alt="videoIcon" />
                </div>
                <div className="dashBox-text">
                  <h5 className="text-center">Total Video</h5>
                  <h6 className="text-center pt-3  fw-bold custom-text-color">
                    {dashCount?.totalVideos ? dashCount?.totalVideos : 0}
                  </h6>
                </div>
              </div>
            </div>

            <div
              className="  adminProfileBox px-2  col-lg-3 col-md-6 col-sm-12 cursor"
              onClick={() => router.push("/songTable")}
            >
              <div className="dashBoxData bg-white">
                <div className="icon icon-sm icon-shape-small  text-center border-radius-xl my-auto icon-data1">
                  <Image src={SongIcon} alt="SongIcon" />
                </div>
                <div className="dashBox-text">
                  <h5 className="text-center">Total Song </h5>
                  <h6 className="text-center pt-3  fw-bold custom-text-color">
                    {dashCount?.totalSongs ? dashCount?.totalSongs : 0}
                  </h6>
                </div>
              </div>
            </div>

            <div
              className="  adminProfileBox px-2  col-lg-3 col-md-6 col-sm-12 cursor"
              onClick={() => router.push("/SellerMainPage")}
            >
              <div className="dashBoxData bg-white">
                <div className="icon icon-sm icon-shape-small  text-center border-radius-xl my-auto icon-data1">
                  <Image src={Seller} alt="SellerIcon" />
                </div>
                <div className="dashBox-text">
                  <h5 className="text-center">Total Seller </h5>
                  <h6 className="text-center pt-3  fw-bold custom-text-color">
                    {dashCount?.totalSellers ? dashCount?.totalSellers : 0}
                  </h6>
                </div>
              </div>
            </div>

            <div
              className="  adminProfileBox px-2  col-lg-3 col-md-6 col-sm-12 cursor"
              onClick={() => router.push("/ProductMainPage")}
            >
              <div className="dashBoxData bg-white">
                <div className="icon icon-sm icon-shape-small  text-center border-radius-xl my-auto icon-data1">
                  <Image src={Product} alt="ProductIcon" />
                </div>
                <div className="dashBox-text">
                  <h5 className="text-center">Total Product </h5>
                  <h6 className="text-center pt-3  fw-bold custom-text-color">
                    {dashCount?.totalProducts ? dashCount?.totalProducts : 0}
                  </h6>
                </div>
              </div>
            </div>

            <div
              className="  adminProfileBox px-2  col-lg-3 col-md-6 col-sm-12 cursor"
              onClick={() => router.push("/order")}
            >
              <div className="dashBoxData bg-white">
                <div className="icon icon-sm icon-shape-small  text-center border-radius-xl my-auto icon-data1">
                  <Image src={OrderIcon} alt="ProductIcon" />
                </div>
                <div className="dashBox-text">
                  <h5 className="text-center">Total Order </h5>
                  <h6 className="text-center pt-3  fw-bold custom-text-color">
                    {dashCount?.totalOrders ? dashCount?.totalOrders : 0}
                  </h6>
                </div>
              </div>
            </div>

            <div
              className="  adminProfileBox px-2  col-lg-3 col-md-6 col-sm-12 cursor"
            >
              <div className="dashBoxData bg-white">
                <div className="icon icon-sm icon-shape-small  text-center border-radius-xl my-auto icon-data1">

                  <Image src={LiveSeller} alt="SongIcon" />
                </div>
                <div className="dashBox-text">
                  <h5 className="text-center">Total Live Seller</h5>
                  <h6 className="text-center pt-3  fw-bold custom-text-color">
                    {dashCount?.totalLiveSeller ? dashCount?.totalLiveSeller : 0}
                  </h6>
                </div>
              </div>
            </div>

            <div
              className="  adminProfileBox px-2  col-lg-3 col-md-6 col-sm-12 cursor"
            >
              <div className="dashBoxData bg-white">
                <div className="icon icon-sm icon-shape-small  text-center border-radius-xl my-auto icon-data1">
                  <Image src={LiveUser} alt="SongIcon" />
                </div>
                <div className="dashBox-text">
                  <h5 className="text-center">Total Live User </h5>
                  <h6 className="text-center pt-3  fw-bold custom-text-color">
                    {dashCount?.totalLiveUser ? dashCount?.totalLiveUser : 0}
                  </h6>
                </div>
              </div>
            </div>

            <div
              className="  adminProfileBox px-2  col-lg-3 col-md-6 col-sm-12 cursor"
              onClick={() => router.push("/category")}
            >
              <div className="dashBoxData bg-white">
                <div className="icon icon-sm icon-shape-small  text-center border-radius-xl my-auto icon-data1">
                  <img src={dashboardCategory.src} height={20} width={20} />


                </div>
                <div className="dashBox-text">
                  <h5 className="text-center">Total Category </h5>
                  <h6 className="text-center pt-3  fw-bold custom-text-color">
                    {dashCount?.totalCategory ? dashCount?.totalCategory : 0}
                  </h6>
                </div>
              </div>
            </div>

            <div
              className="  adminProfileBox px-2  col-lg-3 col-md-6 col-sm-12 cursor"
              onClick={() => router.push("/subcategory")}
            >
              <div className="dashBoxData bg-white">
                <div className="icon icon-sm icon-shape-small  text-center border-radius-xl my-auto icon-data1">
                  <img src={dashboardSubCateogry.src} />

                </div>
                <div className="dashBox-text">
                  <h5 className="text-center">Total SubCategory </h5>
                  <h6 className="text-center pt-3  fw-bold custom-text-color">
                    {dashCount?.totalSubCategory ? dashCount?.totalSubCategory : 0}
                  </h6>
                </div>
              </div>
            </div>

            <div
              className="adminProfileBox px-2  col-lg-3 col-md-6 col-sm-12 cursor"
              onClick={() => router.push("/adminEarnings")}
            >
              <div className="dashBoxData bg-white">
                <div className="icon icon-sm icon-shape-small  text-center border-radius-xl my-auto icon-data1">
                  <img src={AdminCommission.src} />
                </div>
                <div className="dashBox-text">
                  <h5 className="text-center">Admin Commission </h5>
                  <h6 className="text-center pt-3  fw-bold custom-text-color">
                    {dashCount?.totalAdminCommission ? dashCount?.totalAdminCommission?.toFixed(2) : 0}
                  </h6>
                </div>
              </div>
            </div>

          </div>
          <div className="dashboard-analytics">
            <h6>Data Analysis</h6>
            <div className="row dashboard-chart justify-content-between">
              <div
                className="col-lg-9 col-md-12 col-sm-12 mt-lg-0 mt-4 dashboard-chart-box"
                style={{ position: "relative" }}
              >
                <div
                  id="chart"
                  className="dashboard-user-count"
                  style={{ height: "100%" }}
                >
                  <div className="date-range-picker mb-2 pb-2"></div>
                  <div className="pt-3">
                    <Chart
                      options={optionsTotal}
                      series={
                        totalSeries.dataSet.length > 1
                          ? totalSeries.dataSet
                          : [{ data: [] }]
                      }
                      type="area"
                      height={450}
                    />
                  </div>
                  <span
                    style={{
                      position: "absolute",
                      top: "46%",
                      right: "40%",
                      fontWeight: "500",
                    }}
                  ></span>
                </div>
              </div>
              <div className="col-lg-3 col-md-12  col-sm-12 mt-3 mt-lg-0 dashboard-total-user">
                <div className="user-activity">
                  <h6>Total User Activity</h6>
                  <div
                    id="chart"
                    style={{ display: "flex", justifyContent: "center" }}
                  >
                    <Chart
                      options={optionsGradient}
                      series={seriesGradient}
                      type="radialBar"
                      width={450}
                      height={"360px"}
                    />
                  </div>
                  <div className="total-user-chart">
                    <span></span>
                    <h5>Total Active User</h5>
                  </div>
                  <div className="total-active-chart">
                    <span></span>
                    <h5>Total Inactive User</h5>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="dashboard-analytics">
            <div className="row dashboard-chart justify-content-between">
              <div
                className="col-lg-9 col-md-12 col-sm-12 mt-lg-0 mt-4 dashboard-chart-box"
                style={{ position: "relative" }}
              >
                <div
                  id="chart"
                  className="dashboard-user-count"
                  style={{ height: "100%" }}
                >
                  <div className="date-range-picker mb-2 pb-2"></div>
                  <div className="pt-3">
                    <Chart
                      options={optionsTotalOfRevenue}
                      series={
                        totalSeriesOfRevenue.dataSet.length > 1
                          ? totalSeriesOfRevenue.dataSet
                          : [{ data: [] }]
                      }
                      type="area"
                      height={450}
                    />
                  </div>
                  <span
                    style={{
                      position: "absolute",
                      top: "46%",
                      right: "40%",
                      fontWeight: "500",
                    }}
                  ></span>
                </div>
              </div>
              <div className="col-lg-3 col-md-12  col-sm-12 mt-3 mt-lg-0 dashboard-total-user">
                <div className="user-activity">
                  <h6>Total Seller Activity</h6>
                  <div
                    id="chart"
                    style={{ display: "flex", justifyContent: "center" }}
                  >
                    <Chart
                      options={optionsGradientOfRevenue}
                      series={seriesGradientOfRevenue}
                      type="radialBar"
                      width={450}
                      height={"360px"}
                    />
                  </div>
                  <div className="total-user-chart">
                    <span></span>
                    <h5>Total Active Seller</h5>
                  </div>
                  <div className="total-active-chart">
                    <span></span>
                    <h5>Total Inactive Seller</h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
          </div>
        </div>
        <div className="dashboard-analytics"
          style={{
            marginLeft: "25px"
          }}
        >

          <h6 className="mt-3">Product Analysis Data</h6>
        </div>

        <div className="dashboardHeader primeHeader mb-3 mt-4">
          <NewTitle
            dayAnalyticsShow={false}
            setEndDate={setEndDate}
            setStartDate={setStartDate}
            startDate={startDate}
            endDate={endDate}
            titleShow={false}
            setMultiButtonSelect={setMultiButtonSelect}
            multiButtonSelect={multiButtonSelect}
            name={`Profile`}
            labelData={["Top Selling Product", "Top Rating Product", "Top Seller", "Top Buyer", , "Top Recent Order"]}
          />


        </div>

        <div className="dashboard-analytics recent-order mt-4"
          style={{
            paddingLeft: "32px",
            paddingRight: "32px",
          }}
        >
          {
            multiButtonSelect === "Top Recent Order" &&
            <div className="row bg-white border-0">
              <div className="col-lg-12 col-md-12">
                <div className="m40-top tsBox br-2">
                  <RecentOrder startDate={startDate} endDate={endDate} />
                </div>
              </div>
            </div>
          }

          {
            multiButtonSelect === "Top Selling Product" &&
            <div className="row bg-white">
              <div className="col-lg-12 col-md-12">
                <div className="m40-top tsBox br-2">
                  <TopSellingProduct startDate={startDate} endDate={endDate} />
                </div>
              </div>
            </div>
          }
          {
            multiButtonSelect === "Top Rating Product" &&
            <div className="row bg-white ">
              <div className="col-lg-12 col-md-12">
                <div className="m40-top tsBox br-2">
                  <TopRatingProduct startDate={startDate} endDate={endDate} />
                </div>
              </div>
            </div>
          }

          {
            multiButtonSelect === "Top Buyer" &&
            <div className="col-lg-12 col-md-12 ">
              <div className="m40-top tsBox br-2">
                <TopBuyer startDate={startDate} endDate={endDate} />
              </div>
            </div>
          }

          {
            multiButtonSelect === "Top Seller" &&
            <div className="row bg-white">
              <div className="col-lg-12 col-md-12">
                <div className="m40-top tsBox br-2">
                  <TopSeller startDate={startDate} endDate={endDate} />
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </>
  );
};

Dashboard.getLayout = function getLayout(page: React.ReactNode) {
  return <RootLayout>{page}</RootLayout>;
};

export default Dashboard;
