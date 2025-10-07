import React from "react";
import AgeCalculator from "../components/AgeCalculator";
import BmiCalculator from "../components/BmiCalculator";
import CarePlanner from "../components/CarePlanner";
import SurveyForm from "../components/SurveyForm";

export default function SideService() {
  return (
    <div>
      <h2>입양 도구 모음</h2>
      <AgeCalculator />
      <BmiCalculator />
      {/* <CarePlanner /> */}
      <SurveyForm />
    </div>
  );
}