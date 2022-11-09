import moment from 'moment'
import { registerLocale } from 'react-datepicker'
import vi from 'date-fns/locale/vi'
registerLocale('vi', vi)
export const formatTime = (
  ob: Date,
  hour: number,
  minute: number,
  second: number
) => {
  return moment(ob)
    .utcOffset(0)
    .set({
      hour,
      minute,
      second,
    })
    .toDate()
}
