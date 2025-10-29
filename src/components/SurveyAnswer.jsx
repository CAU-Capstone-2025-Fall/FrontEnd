export default function SurveyAnswers({ answers }) {
  return (
    <ul>
      {Object.entries(answers).map(([key, value]) => (
        <li key={key}>
          <b>{key}</b>: {Array.isArray(value) ? value.join(', ') : value}
        </li>
      ))}
    </ul>
  );
}