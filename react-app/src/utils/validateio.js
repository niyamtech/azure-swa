export function isValidTfn(input) {
  if (!input) return false;
  const digits = input.replace(/\s+/g, "");
  if (!/^\d{8,9}$/.test(digits)) return false;

  const weights = digits.length === 9 ? [1, 4, 3, 7, 5, 8, 6, 9, 10] : [1, 4, 3, 7, 5, 8, 6, 9];
  const sum = digits
    .split("")
    .reduce((total, digit, index) => total + parseInt(digit, 10) * weights[index], 0);

  return sum % 11 === 0;
}

export function isValidAbn(input) {
  if (!input) return false;
  const digits = input.replace(/\s+/g, "");
  if (!/^\d{11}$/.test(digits)) return false;

  const weights = [10, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
  const adjusted = `${Number(digits[0]) - 1}${digits.slice(1)}`;

  const sum = adjusted
    .split("")
    .reduce((total, digit, index) => total + parseInt(digit, 10) * weights[index], 0);

  return sum % 89 === 0;
}

export function formatTfn(input) {
  return input.replace(/\s+/g, "").replace(/(\d{3})(?=\d)/g, "$1 ").trim();
}

export function formatAbn(input) {
  return input
    .replace(/\s+/g, "")
    .replace(/(\d{2})(\d{3})(\d{3})(\d{3})/, "$1 $2 $3 $4")
    .trim();
}
