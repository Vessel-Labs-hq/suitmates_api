"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateHelper = void 0;
const luxon_1 = require("luxon");
class DateHelper {
    static addToCurrent(duration) {
        const dt = luxon_1.DateTime.now();
        return dt.plus(duration).toJSDate();
    }
    static isAfterCurrent(date) {
        const d1 = luxon_1.DateTime.fromJSDate(date ?? new Date());
        const d2 = luxon_1.DateTime.now();
        return d2 > d1;
    }
}
exports.DateHelper = DateHelper;
//# sourceMappingURL=date.utils.js.map