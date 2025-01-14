import { fetchWithAuth } from "./api.js";


// 현재 로그인한 사용자 정보를 요청하기
export async function getCurrentUser() {

  const response = await fetchWithAuth(`/api/profiles/me`);

  if (!response.ok) {
    alert('로그인한 사용자 정보를 불러오는 데 실패했습니다.');
    return;
  }

  return await response.json();
}