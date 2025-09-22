import React, { useEffect, useState } from "react";
import NewTitle from "../extra/Title";
import { RootStore } from "../store/store";
import CreateFakePost from "../component/post/CreateFakePost";
import { useSelector } from "react-redux";
import RootLayout from "@/component/layout/Layout";
import SongCategory from "@/component/song/SongCategory";
import Song from "@/component/song/Song";
import CreateSongCategory from "@/component/song/CreateSongCategory";
import CreateSong from "@/component/song/CreateSong";

interface ManagePostProps {}

const ManageSong = (props) => {
  const { dialogue, dialogueType, dialogueData } = useSelector(
    (state: RootStore) => state.dialogue
  );

  const [multiButtonSelect, setMultiButtonSelect] =
    useState<string>("Song");
  const [startDate, setStartDate] = useState<string>("All");
  const [endDate, setEndDate] = useState<string>("All");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedSubTab = localStorage.getItem("multiButton");
      try {
        const parsed = storedSubTab ? JSON.parse(storedSubTab) : "Song";
        setMultiButtonSelect(parsed);
      } catch (e) {
        console.error("Error parsing sub-tab from localStorage:", e);
        setMultiButtonSelect("Song");
      }
    }
  }, []);

  return (
    <div className="userPage channelPage pt-0">
      {dialogueType === "fakePost" && <CreateFakePost />}
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
            labelData={["Song", "Song Category"]}
          />
        </div>
      </div>
      {multiButtonSelect === "Song" && (
        <Song startDate={startDate} endDate={endDate} />
      )}
      {multiButtonSelect === "Song Category" && (
        <SongCategory startDate={startDate} endDate={endDate} />
      )}
      {(dialogueType === "createSongCategory" && <CreateSongCategory />) ||
        (dialogueType === "createSong" && <CreateSong />)}
    </div>
  );
};
ManageSong.getLayout = function getLayout(page) {
  return <RootLayout>{page}</RootLayout>;
};

export default ManageSong;
