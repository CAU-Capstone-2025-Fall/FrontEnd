// src/pages/Report.jsx

import RecommandContainer from '../containers/RecommandContainer';

export default function Report({ user }) {
  return (
    <div className="report-page" style={{ padding: '20px' }}>
      <RecommandContainer user={user.username} />
    </div>
  );
}
