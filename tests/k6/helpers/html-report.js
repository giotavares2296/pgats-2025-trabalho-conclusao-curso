import { htmlReport as reporter } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';

export function htmlReport(data) {
  return reporter(data);
}
