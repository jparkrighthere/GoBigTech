import crypto from 'crypto';

function hash(title: string, companyName: string): string {
  // 타이틀과 회사 이름을 조합하여 문자열 생성
  const inputString = `${title}:${companyName}`;

  // SHA-256 해시 함수 사용
  const hash = crypto.createHash('sha256');
  hash.update(inputString);
  return hash.digest('hex'); // 해시값을 16진수 문자열로 반환
}

export default hash;
