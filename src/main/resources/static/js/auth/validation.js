// src/main/resources/static/js/auth/validation.js
export const ValidationRules = {
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: '올바른 이메일 형식이 아닙니다.',
    requiredMessage: '이메일 또는 전화번호를 입력해주세요.',
  },
  phone: {
    pattern: /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/,
    message: '올바른 전화번호 형식이 아닙니다.',
    requiredMessage: '이메일 또는 전화번호를 입력해주세요.',
  },
  password: {
    patterns: {
      length: /.{8,}/,
      letter: /[A-Za-z]/,
      number: /\d/,
      special: /[!@#$%^&*]/,
      uppercase: /[A-Z]/,
      lowercase: /[a-z]/,
    },
    messages: {
      length: '비밀번호는 8자 이상이어야 합니다.',
      weak: '비밀번호가 너무 약합니다.',
      medium: '비밀번호를 더 강력하게 만드세요.',
      strong: '강력한 비밀번호입니다.',
    },
    requiredMessage: '비밀번호를 입력해주세요.',
  },
  name: {
    requiredMessage: '성명을 입력해주세요.',
  },
  username: {
    pattern: /^[a-zA-Z0-9._]{1,30}$/,
    message: '사용자 이름은 영문, 숫자, 밑줄, 마침표만 사용할 수 있습니다.',
    requiredMessage: '사용자 이름을 입력해주세요.',
  },
};

// 비밀번호 강도 체크 함수
export function checkPasswordStrength(password) {

  const rules = ValidationRules.password.patterns;
  let score = 0;

  if (rules.length.test(password)) score++;
  if (rules.letter.test(password)) score++;
  if (rules.number.test(password)) score++;
  if (rules.special.test(password)) score++;
  if (rules.uppercase.test(password)) score++;
  if (rules.lowercase.test(password)) score++;

  if (score <= 2) return 'weak';
  if (score <= 4) return 'medium';
  return 'strong';
}