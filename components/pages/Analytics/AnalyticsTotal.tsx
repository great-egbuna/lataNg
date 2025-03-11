import React from "react";

import AnalyticsCard from "@/components/ui/Cards/AnalyticsCard";

export default function AnalyticsTotal() {
  return (
    <>
      <AnalyticsCard
        text_one={"Total views"}
        text_two={"25,000"}
        text_three={"Total view of all products"}
        textClassName={"text-white"}
      />
      <AnalyticsCard
        text_one={"Total product clicks"}
        text_two={"5,000"}
        text_three={"Total product clicks"}
        className={"bg-white"}
      />

      <AnalyticsCard
        text_one={"Total phone clicks"}
        text_two={"100,000"}
        text_three={"Total phone clicks"}
        className={"bg-white"}
      />

      <AnalyticsCard
        text_one={"Total message clicks"}
        text_two={"2000"}
        text_three={"Total message clicks"}
        className={"bg-white"}
      />
    </>
  );
}
