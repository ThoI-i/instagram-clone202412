
import { ValidationRules, checkPasswordStrength } from "./validation.js";
import { debounce } from '../util/debounce.js';

// 모든 input별로 이전 값을 저장할 객체를 만듦
const previousValues = {
  emailOrPhone: '',
  name: '',
  username: '',
  password: ''
};

// 회원 가입정보를 서버에 전송하기
async function fetchToSignUp(userData) {

  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });

  // alert(data.message);
  if (response.ok) window.location.href = '/'; // 로그인 페이지 이동
  else alert(data.message);
}




// 초기화 함수
function initSignUp() {
  // form submit이벤트
  const $form = document.querySelector('.auth-form');

  // 초기에 가입 버튼 비활성화
  const $submitButton = $form.querySelector('.auth-button');
  $submitButton.disabled = true;

  // 입력 태그들을 읽어서 객체로 관리
  const $inputs = {
    emailOrPhone: $form.querySelector('input[name="email"]'),
    name: $form.querySelector('input[name="name"]'),
    username: $form.querySelector('input[name="username"]'),
    password: $form.querySelector('input[name="password"]'),
  };

  // 비밀번호 숨기기 토글 활성화
  createPasswordToggle($inputs.password);

  // 디바운스가 걸린 validateField 함수
  const debouncedValidate = debounce(async ($input) => {
    // === bug fix part ===
    /*
      원인: validateField는 비동기(async)로 작동함 
            따라서 await을 걸지 않으면 아래쪽 함수 updateSubmitButton과 동시에 작동되어
            버그가 발생함
      해결 방안: validateField에 await을 걸어 실행이 끝날때까지 updateSubmitButton이
             호출되지 않고 대기하도록 만들어줌
    */
    await validateField($input); // 가입버튼 활성화코드는 이 코드 이후에 실행해야 함
    updateSubmitButton($inputs, $submitButton); // 가입 버튼 활성화/비활성화 처리
  }, 700);

  // input 이벤트 핸들러
  const handleInput = ($input) => {
    removeErrorMessage($input.closest('.form-field'));

    // 디바운스 + 비동기 검증
    debouncedValidate($input);
  };

  const handleBlur = $input => { 
    const fieldName = $input.name;
    const currentValue = $input.value.trim();

    // 빈값이거나 값이 바뀐 적이 있을 때만 혹은 이전 값이랑 달라졌을 때만 검증
    if (!currentValue || previousValues[fieldName] !== currentValue) {
      previousValues[fieldName] = currentValue; // 이전 값 갱신
      removeErrorMessage($input.closest('.form-field'));

      // 디바운스가 아니라, blur 시점에는 바로 검증할 수도 있음
      validateField($input);
      updateSubmitButton($inputs, $submitButton);
    }
  };

  // 4개의 입력창에 입력 이벤트 바인딩
  Object.values($inputs).forEach(($input) => {
    $input.addEventListener('input', () => handleInput($input));
    $input.addEventListener('blur', () => handleBlur($input));
  });

  // 폼 이벤트 핸들러 바인딩
  $form.addEventListener('submit', (e) => {
    e.preventDefault(); // 폼 전송시 발생하는 새로고침 방지

    const { emailOrPhone, name, username, password } = $inputs;

    const payload = {
      emailOrPhone: emailOrPhone.value,
      name: name.value,
      username: username.value,
      password: password.value,
    };

    // 서버로 데이터 전송
    fetchToSignUp(payload);
  });
}

// ==== 함수 정의 ==== //
// 입력값을 검증하고 에러메시지를 렌더링하는 함수
async function validateField($input) {

  // 각 입력들이 유효한지 확인
  let isValid = true;

  // 이게 어떤태그인지 알아오기
  const fieldName = $input.name;
  // 입력값 읽어오기
  const inputValue = $input.value.trim();
  // input의 부모 가져오기
  const $formField = $input.closest('.form-field');

  // 1. 빈 값 체크
  if (!inputValue) {
    isValid = false;
    // console.log(fieldName, ' is empty!');
    showError($formField, ValidationRules[fieldName]?.requiredMessage); // 에러메시지 렌더링
  } else {
    // 2. 상세 체크 (패턴검증, 중복검증)
    // 2-1. 이메일, 전화번호 검증
    if (fieldName === 'email') {
      isValid = await validateEmailOrPhone($formField, inputValue);
    } else if (fieldName === 'password') {
      isValid = validatePassword($formField, inputValue);
    } else if (fieldName === 'username') {
      isValid = await validateUsername($formField, inputValue);
    } 
  }

  // 각 input에 검사결과를 저장
  $input.dataset.isValid = isValid.toString();

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
      return false;
    } else { // 서버에 통신해서 중복체크
      const data = await fetchToCheckDuplicate('email', inputValue);
      if (!data.available) {
        showError($formField, data.message);
        return false;
      }
    }
  } else {
    // 전화번호  체크
    // 전화번호 처리(숫자만 추출)
    const numbers = inputValue.replace(/[^0-9]/g, '');
    if (!ValidationRules.phone.pattern.test(numbers)) {
      // 패턴 체크
      showError($formField, ValidationRules.phone.message);
      return false;
    } else {
      // 서버에 통신해서 중복체크
      const data = await fetchToCheckDuplicate('phone', numbers);
      if (!data.available) {
        showError($formField, data.message);
        return false;
      }
    }
  }
  return true;

}

// 비밀번호 검증 (길이, 강도체크)
function validatePassword($formField, inputValue) {
  // 길이 확인
  if (!ValidationRules.password.patterns.length.test(inputValue)) {
    showError($formField, ValidationRules.password.messages.length);
    return false;
  }

  // 강도 체크
  const strength = checkPasswordStrength(inputValue);
  switch (strength) {
    case 'weak': // 에러로 볼것임
      showError($formField, ValidationRules.password.messages.weak);
      return false;
    case 'medium': // 에러는 아님
      showPasswordFeedback(
        $formField,
        ValidationRules.password.messages.medium,
        'warning'
      );
      return true;
    case 'strong': // 에러는 아님
      showPasswordFeedback(
        $formField,
        ValidationRules.password.messages.strong,
        'success'
      );
      return true;
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
    return false;
  }

  // 중복검사
  const data = await fetchToCheckDuplicate('username', inputValue);
  if (!data.available) {
    showError($formField, data.message);
    return false;
  }
  return true;
}

/**
 * 비밀번호 표시/숨기기 토글 기능 생성
 */
function createPasswordToggle(passwordInput) {

  const $toggle = document.querySelector('.password-toggle');

  passwordInput.addEventListener('input', (e) => {
    $toggle.style.display = e.target.value.length > 0 ? 'block' : 'none';
  });

  $toggle.addEventListener('click', () => {
    const isCurrentlyPassword = passwordInput.type === 'password';
    passwordInput.type = isCurrentlyPassword ? 'text' : 'password';
    $toggle.textContent = isCurrentlyPassword ? '숨기기' : '패스워드 표시';
  });
}

/**
 * 모든 필드의 유효성 상태를 확인해, 회원가입 버튼 활성/비활성 제어
 */
function updateSubmitButton($inputs, $submitButton) {
  const allFieldsValid = Object.values($inputs).every((input) => {
    return input.value.trim() !== '' && input.dataset.isValid === 'true';
  });
  console.log('all: ', allFieldsValid);

  $submitButton.disabled = !allFieldsValid;
}


//====== 메인 실행 코드 ======//
document.addEventListener('DOMContentLoaded', initSignUp);