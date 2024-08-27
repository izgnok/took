import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { formatNumber } from '../../utils/format';
import BackButton from '../../components/common/BackButton';
import { makePartyApi } from '../../apis/pay';
import { useUser } from '../../store/user';
import { getDeliveryByRoom } from '../../apis/findByRoom';
import { connectDeliveryToPay, joinDeliveryApi } from '../../apis/delivery';
import { insertAllMemberApi } from '../../apis/payment/jungsan';

function DeliveryPayInputPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { seq } = useUser();
  const { id } = useParams();
  const [deliveryInfo, setDeliveryInfo] = useState();
  const [orderAmounts, setOrderAmounts] = useState([]);
  const [tipAmount, setTipAmount] = useState('');
  const [participants, setParticipants] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadDeliveryInfo();
    // Replace with actual participants data from location.state
    setParticipants(
      Array.isArray(location.state?.users)
        ? location.state.users[0]
        : [
            { userSeq: 1, userName: '참가자1' },
            { userSeq: 2, userName: '참가자2' },
            { userSeq: 3, userName: '참가자3' },
            { userSeq: 4, userName: '참가자4' },
          ]
    );
  }, [location.state]);

  const loadDeliveryInfo = async () => {
    try {
      const res = await getDeliveryByRoom(id);
      setDeliveryInfo(res);
    } catch (err) {
      console.error('Error fetching delivery info', err);
    }
  };

  const handleOrderAmountChange = (index, value) => {
    const formattedValue = formatNumber(value.replace(/,/g, '')); // Remove existing commas and format
    const newOrderAmounts = [...orderAmounts];
    newOrderAmounts[index] = formattedValue;
    setOrderAmounts(newOrderAmounts);
  };

  const handleTipAmountChange = (value) => {
    const formattedValue = formatNumber(value.replace(/,/g, '')); // Remove existing commas and format
    setTipAmount(formattedValue);
  };

  const handleSubmit = async () => {
    const userCosts = participants.map((participant, index) => ({
      userSeq: participant.userSeq,
      cost: Number(orderAmounts[index].replace(/,/g, '') || '0'),
    }));
    const deliveryTip = Number(tipAmount.replace(/,/g, '') || '0');
    
    try {
      const partySeq = await makeParty();
      await connectPartyToDelivery(id, partySeq);
      await requestPayment(partySeq, userCosts, deliveryTip);
      await joinDelivery();

      // Show success modal
      setShowModal(true);

      // Navigate to the previous page after 2 seconds
      setTimeout(() => {
        navigate(-1);
      }, 2000);
    } catch (err) {
      console.error('Error processing payment', err);
    }
  };

  const joinDelivery = async () => {
    try {
      await joinDeliveryApi({ deliverySeq: id, userSeq: seq });
      console.log('User joined delivery successfully');
    } catch (err) {
      console.error('Error joining delivery', err);
      throw err;
    }
  };

  const makeParty = async () => {
    try {
      const res = await makePartyApi({
        userSeq: seq,
        title: deliveryInfo?.storeName || 'Default Store Name',
        category: 1,
      });
      return res.partySeq;
    } catch (err) {
      console.error('Error creating party', err);
      throw err;
    }
  };

  const connectPartyToDelivery = async (deliverySeq, partySeq) => {
    try {
      await connectDeliveryToPay({ deliverySeq, partySeq });
      console.log('Party connected to delivery successfully');
    } catch (err) {
      console.error('Error connecting party to delivery', err);
      throw err;
    }
  };

  const requestPayment = async (partySeq, userCosts, deliveryTip) => {
    try {
      await insertAllMemberApi({
        partySeq,
        userCosts,
        deliveryTip,
      });
      console.log('Payment request successful');
    } catch (err) {
      console.error('Error requesting payment', err);
      throw err;
    }
  };

  return (
    <div className="flex flex-col bg-white max-w-[360px] mx-auto relative h-screen overflow-y-scroll">
      <div className="flex items-center px-4 py-3">
        <BackButton />
        <div className="mt-2.5 flex-grow text-center text-lg font-bold text-black">
          주문 금액
        </div>
      </div>

      <div className="mt-2 w-full border-0 border-solid bg-neutral-400 bg-opacity-40 border-neutral-400 border-opacity-40 min-h-[0.5px]" />

      <div className="flex flex-col items-center mt-8">
        <div className="text-left w-64 mb-1">배달 팁</div>
        <div className="text-left shadow-md rounded-xl border border-neutral-200 py-2 mb-6 w-64">
          <input
            type="text"
            className="text-lg ml-5"
            placeholder="배달 팁(원)"
            value={tipAmount}
            onChange={(e) => handleTipAmountChange(e.target.value)}
          />
        </div>
        {participants.map((participant, index) => (
          <div key={participant.userSeq} className="mb-6 w-64">
            <div className="text-left mb-1">{participant.userName}</div>
            <div className="text-left shadow-md rounded-xl border border-neutral-200 py-2 mx-1">
              <input
                type="text"
                className="text-lg ml-5"
                placeholder="주문 금액(원)"
                value={orderAmounts[index] || ''}
                onChange={(e) => handleOrderAmountChange(index, e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>

      <button
        className="py-3 px-10 place-self-center bg-main text-white text-[1.1rem] font-bold rounded-xl cursor-pointer mt-8 w-80"
        onClick={handleSubmit}
      >
        확인
      </button>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="text-lg font-semibold text-center">
              정산 요청이 완료되었습니다
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default DeliveryPayInputPage;
