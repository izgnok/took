import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();

export const goToAlarm = () => {
    navigate('/chat/took');
}