import { useState } from 'react';
import RescueDogCounselor from '../components/RescueDogCounselor';

const TestChat = () => {
  const [showCounselor, setShowCounselor] = useState(false);
  const [selectedKeywords, setSelectedKeywords] = useState([]);

  const handleOpen = () => setShowCounselor(true);
  const handleClose = () => setShowCounselor(false);

  return 
};

export default TestChat;
