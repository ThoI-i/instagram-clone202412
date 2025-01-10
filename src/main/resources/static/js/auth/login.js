
// 로그인 form 가져오기
const $loginForm = document.querySelector('.auth-form');

// 서버와 통신하여 로그인 검증을 수행
async function handleLogin(e) {
  e.preventDefault(); 

  // 사용자가 입력한 유저네임과 비밀번호를 가져옴
  const username = $loginForm.querySelector('input[name=username]').value;
  const password = $loginForm.querySelector('input[name=password]').value;

  // 서버로 보낼 데이터
  const payload = {
    username,
    password
  };

  // API 통신 보내기
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const data = await response.json();

  alert(data.message);
  
}

function initLogin() {
  $loginForm.addEventListener('submit', handleLogin);
}

document.addEventListener('DOMContentLoaded', initLogin);