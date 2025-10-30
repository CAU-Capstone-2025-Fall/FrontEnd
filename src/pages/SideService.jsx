import React from "react";
import { useLocation } from "react-router-dom";
import AgeCalculator from "../components/AgeCalculator";
import BmiCalculator from "../components/BmiCalculator";
import CarePlanner from "../components/CarePlanner";
import SurveyForm from "../components/SurveyForm";

export default function SideService() {
  const location = useLocation();
  const user = location.state?.user;

  return (
    <div>
      <h2>입양 도구 모음</h2>
      <AgeCalculator />
      <BmiCalculator />
      {/* <CarePlanner /> */}
      <SurveyForm user={user} />
    </div>
  );
}