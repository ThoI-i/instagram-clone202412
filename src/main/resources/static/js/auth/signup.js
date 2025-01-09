
import { ValidationRules, checkPasswordStrength } from "./validation.js";
import { debounce } from '../util/debounce.js';


// 회원 가입정보를 서버에 전송하기
async function fetchToSignUp(userData) {

  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });

  const data = await response.json();
  
  alert(data.message);
}


// 초기화 함수
function initSignUp() {

  // form submit이벤트
  const $form = document.querySelector('.auth-form');

  // 입력 태그들을 읽어서 객체로 관리
  const $inputs = {
    emailOrPhone: $form.querySelector('input[name="email"]'),
    name: $form.querySelector('input[name="name"]'),
    username: $form.querySelector('input[name="username"]'),
    password: $form.querySelector('input[name="password"]'),
  };

  // 디바운스가 걸린 validateField 함수
  const debouncedValidate = debounce(validateField, 700);

  const handleInput = ($input) => {
    removeErrorMessage($input.closest('.form-field'));
    debouncedValidate($input); // 입력값 검증 함수 호출
  };

  // 4개의 입력창에 입력 이벤트 바인딩
  Object.values($inputs).forEach($input => { 
    $input.addEventListener('input', () => handleInput($input));
    $input.addEventListener('blur', () => handleInput($input));
  });


  // 폼 이벤트 핸들러 바인딩
  $form.addEventListener('submit', e => {
    e.preventDefault(); // 폼 전송시 발생하는 새로고침 방지

    // 사용자가 입력한 모든 입력값 읽어오기
    // const emailOrPhone = document.querySelector('input[name="email"]').value;
    // const name = document.querySelector('input[name="name"]').value;
    // const username = document.querySelector('input[name="username"]').value;
    // const password = document.querySelector('input[name="password"]').value;

    // const payload = {
    //   emailOrPhone: emailOrPhone,
    //   name: name,
    //   username: username,
    //   password: password,
    // };

    // 서버로 데이터 전송
    // fetchToSignUp(payload);
    
  });

}

// ==== 함수 정의 ==== //
// 입력값을 검증하고 에러메시지를 렌더링하는 함수
function validateField($input) {

  // 이게 어떤태그인지 알아오기
  const fieldName = $input.name;
  // 입력값 읽어오기
  const inputValue = $input.value.trim();
  // input의 부모 가져오기
  const $formField = $input.closest('.form-field');
  
  // 1. 빈 값 체크
  if (!inputValue) {
    // console.log(fieldName, ' is empty!');
    showError($formField, ValidationRules[fieldName]?.requiredMessage); // 에러메시지 렌더링
  } else {
    // 2. 상세 체크 (패턴검증, 중복검증)
    // 2-1. 이메일, 전화번호 검증
    if (fieldName === 'email') {
      validateEmailOrPhone($formField, inputValue);
    } else if (fieldName === 'password') {
      validatePassword($formField, inputValue);
    } else if (fieldName === 'username') {
      validateUsername($formField, inputValue);
    }
  }

}

/**
 * 에러 메시지를 표시하고, 필드에 error 클래스를 부여
 */
function showError($formField, message) {
  $formField.classList.add('error');
  const $errorSpan = document.createElement('span');
  $errorSpan.classList.add('error-message');
  $errorSpan.textContent = message;
  $formField.append($errorSpan);
}

/**
 * 에러 및 비밀번호 피드백을 제거한다.
 */
function removeErrorMessage($formField) {
  $formField.classList.remove('error');
  const error = $formField.querySelector('.error-message');
  const feedback = $formField.querySelector('.password-feedback');
  if (error) error.remove();
  if (feedback) feedback.remove();
}

// 서버에 중복체크 API 요청을 보내고 결과를 반환
async function fetchToCheckDuplicate(type, value) {
  const response = await fetch(`/api/auth/check-duplicate?type=${type}&value=${value}`);
  return await response.json();
  
}

// 이메일 또는 전화번호를 상세검증
async function validateEmailOrPhone($formField, inputValue) {

  // 이메일 체크
  if (inputValue.includes('@')) {
    if (!ValidationRules.email.pattern.test(inputValue)) { // 패턴 체크
      showError($formField, ValidationRules.email.message);
    } else { // 서버에 통신해서 중복체크
      const data = await fetchToCheckDuplicate('email', inputValue);
      if (!data.available) {
        showError($formField, data.message);
      }
    }
  } else {
    // 전화번호  체크
    // 전화번호 처리(숫자만 추출)
    const numbers = inputValue.replace(/[^0-9]/g, '');
    if (!ValidationRules.phone.pattern.test(numbers)) {
      // 패턴 체크
      showError($formField, ValidationRules.phone.message);
    } else {
      // 서버에 통신해서 중복체크
      const data = await fetchToCheckDuplicate('phone', numbers);
      if (!data.available) {
        showError($formField, data.message);
      }
    }
  }

}

// 비밀번호 검증 (길이, 강도체크)
function validatePassword($formField, inputValue) {
  // 길이 확인
  if (!ValidationRules.password.patterns.length.test(inputValue)) {
    showError($formField, ValidationRules.password.messages.length);
  }

  // 강도 체크
  const strength = checkPasswordStrength(inputValue);
  switch (strength) {
    case 'weak': // 에러로 볼것임
      showError($formField, ValidationRules.password.messages.weak);
      break;
    case 'medium': // 에러는 아님
      showPasswordFeedback(
        $formField,
        ValidationRules.password.messages.medium,
        'warning'
      );
      break;
    case 'strong': // 에러는 아님
      showPasswordFeedback(
        $formField,
        ValidationRules.password.messages.strong,
        'success'
      );
      break;
  }

}

/**
 * 비밀번호 강도 피드백 표시
 */
function showPasswordFeedback($formField, message, type) {
  const $feedback = document.createElement('span');
  $feedback.className = `password-feedback ${type}`;
  $feedback.textContent = message;
  $formField.append($feedback);
}

/**
 * 사용자 이름(username) 필드 검증
 */
async function validateUsername($formField, inputValue) {

  if (!ValidationRules.username.pattern.test(inputValue)) {
    showError($formField, ValidationRules.username.message);
  }

  // 중복검사
  const data = await fetchToCheckDuplicate('username', inputValue);
  if (!data.available) {
    showError($formField, data.message);
  }
}


//====== 메인 실행 코드 ======//
document.addEventListener('DOMContentLoaded', initSignUp);
