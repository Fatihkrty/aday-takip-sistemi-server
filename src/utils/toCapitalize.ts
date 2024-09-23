export default function toCapitalize(value: string) {
  return value
    .split(' ')
    .map((x) => x.charAt(0).toLocaleUpperCase('tr-TR') + x.slice(1))
    .join(' ');
}
