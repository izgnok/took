import { request } from '../request';
import { handleApiError } from '../errorHandling';

// {
//     "userSeq": Long,
//     "shopSeq": Long,
//     "price": Int,
//     "shipCost": Int,
//     "productList": [
//       {
//         "productName": String,
//         "optionDetails": String,
//         "etc": String"
//       },
//     ]
//   }
// 공동구매 상품 주문 정보 등록
export const writePurchaseApi = async (params) => {
  try {
    const response = await request.post('/api/purchase/save', params);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

//공동구매 전체 구매 정보 조회
// 응답
// {
// 	"purchaseInfoResponseList": [
// 		    {
// 		        "purchaseSeq": Long,
// 		        "userSeq": Long,
// 		        "shopSeq": Long,
// 		        "price": Int,
// 		        "shipCost": Int,
// 		        "productList": [
// 		            {
// 		                "productSeq": Long,
// 		                "productName": Stirng,
// 		                "optionDetails": String,
// 		                "etc": String
// 		            },
// 		        ],
// 		        "total": Int
// 		    }
// 		]
// 	"listTotal": Int
// }

export const getAllPurchaseApi = async (shopSeq) => {
  try {
    const response = await request.get(`/api/purchase/selectAll/${shopSeq}`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// 개인 구매 정보 조회
// 응답
// {
//   "purchaseSeq": Long,
//   "userSeq": Long,
//   "shopSeq": Long,
//   "price": Int,
//   "shipCost": Int,
//   "productList": [
//       {
//           "productSeq": Long,
//           "productName": String,
//           "optionDetails": String,
//           "etc": String
//       },

//   ],
//   "total": Int
// }
export const getMyPurchaseApi = async ({ userSeq, shopSeq }) => {
  try {
    const response = await request.get(
      `/api/purchase/select/${shopSeq}/${userSeq}`
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// : 상품 주문 정보 삭제
export const deleteMyPurchaseApi = async (purchaseSeq) => {
  try {
    await request.delete(`/api/purchase/delete/${purchaseSeq}`);
    return true;
  } catch (error) {
    return handleApiError(error);
  }
};

//{
//   "price": Int,
//   "shipCost": Int,
//   "productList": [
//     {
//       "productName": String,
//       "optionDetails": String,
//       "etc": String
//     },
//   ]
// }
// : 상품 주문 정보 수정
export const updateMyPurchaseApi = async ({ purchaseSeq, params }) => {
  try {
    await request.put(`/api/purchase/update/${purchaseSeq}`, params);
    return true;
  } catch (error) {
    return handleApiError(error);
  }
};