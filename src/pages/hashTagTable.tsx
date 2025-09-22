"use-client";
import RootLayout from "../component/layout/Layout";
import React from "react";
import NewTitle from "../extra/Title";
import { RootStore, useAppSelector } from "../store/store"; // Assuming RootState is defined in the Redux store
import HashTagShow from "@/component/hashTag/HashTagShow";
import CreateHashTag from "@/component/hashTag/CreateHashTag";
import useClearSessionStorageOnPopState from "@/extra/ClearStorage";


const HashTagTable = (props) => {
  const {dialogueType } = useAppSelector(
    (state: RootStore) => state.dialogue
  );
  useClearSessionStorageOnPopState("multiButton");

  return (
    <>
      <div className="userPage pt-0"
      
      >
       
          <HashTagShow />
        {dialogueType === "CreateHashTag" && <CreateHashTag />}
      </div>
    </>
  );
};

HashTagTable.getLayout = function getLayout(page) {
  return <RootLayout>{page}</RootLayout>;
};

export default HashTagTable;
