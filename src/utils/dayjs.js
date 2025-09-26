const dayjs = require('dayjs');
const relativeTime = require('dayjs/plugin/relativeTime');
require('dayjs/locale/vi');

dayjs.extend(relativeTime);
dayjs.locale('vi');

module.exports = dayjs;
