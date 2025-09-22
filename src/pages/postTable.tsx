import React, { useEffect, useState } from "react";
import NewTitle from "../extra/Title";
import Post from "../component/post/Post";
import FakePost from "../component/post/FakePost";
import { RootStore } from "../store/store";
import CreateFakePost from "../component/post/CreateFakePost";
import { useSelector } from "react-redux";
import RootLayout from "@/component/layout/Layout";
import PostDialogue from "@/component/post/PostDialogue";

interface ManagePostProps {}

const ManagePost = () => {
  const { dialogueType } = useSelector((state: RootStore) => state.dialogue);

  const [multiButtonSelect, setMultiButtonSelect] =
    useState<string>("Real Post");
  const [startDate, setStartDate] = useState<string>("All");
  const [endDate, setEndDate] = useState<string>("All");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedSubTab = localStorage.getItem("multiButton");
      try {
        const parsed = storedSubTab ? JSON.parse(storedSubTab) : "Real Post";
        setMultiButtonSelect(parsed);
      } catch (e) {
        console.error("Error parsing sub-tab from localStorage:", e);
        setMultiButtonSelect("Real Post");
      }
    }
  }, []);

  return (
    <>
      <div className="userPage channelPage pt-0">
        {dialogueType === "fakePost" && <CreateFakePost />}
        {dialogueType === "postDetail" && <PostDialogue />}
        <div>
          <div className="dashboardHeader primeHeader mb-3 p-0">
            <NewTitle
              dayAnalyticsShow={true}
              setEndDate={setEndDate}
              setStartDate={setStartDate}
              startDate={startDate}
              endDate={endDate}
              name={`Sound`}
              titleShow={false}
              multiButtonSelect={multiButtonSelect}
              setMultiButtonSelect={setMultiButtonSelect}
              labelData={["Real Post", "Fake Post"]}
            />
          </div>
        </div>
        {multiButtonSelect === "Real Post" && (
          <Post startDate={startDate} endDate={endDate}  />
        )}
        {multiButtonSelect === "Fake Post" && (
          <FakePost startDate={startDate} endDate={endDate} />
        )}
      </div>
    </>
  );
};
ManagePost.getLayout = function getLayout(page) {
  return <RootLayout>{page}</RootLayout>;
};

export default ManagePost;
