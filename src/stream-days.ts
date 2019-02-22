/**
 * stream-days
 * Create a Readable stream of Date objects separated by one day
 */

namespace debug {
    export const stream = require('debug')('streamDays')
}

import { Readable } from 'readable-stream'
import { utcDate } from '@hamroctopus/utc-date'
import is from '@sindresorhus/is'
import moment from 'moment'
import ow from 'ow'


/**
 * Create a Readable stream of Date objects from `start` to `end`,
 * each separated by one day. Omit `end` for an infinite stream of
 * dates.
 *
 * @remarks
 *
 * The first date in the stream will always be equal to
 * `start`. Subsequent dates will each be separated by 24 hours. If
 * `end` is n * 24 hours after `start`, a date equal to `end` will be
 * pushed. No date after `end` will be pushed.
 *
 *
 * @param start - Date of first object in stream (default: current UTC
 * date)
 * @param end - Date after which no more Date objects should be
 * pushed, if desired
 * @returns Readable stream of Date objects
 */
export default function streamDays(start: Date = utcDate(), end?: Date): Readable {
    debug.stream(`Creating Readable stream between ${start} and ${end}`)

    ow(start, ow.date.is(start => (is.undefined(end) || start.getTime() <= end.getTime()) || `Expected \`${start}\` to be before or same as \`${end}\``))

    const current = moment.utc(start)

    return new Readable({
        objectMode: true,
        read() {
            if (is.undefined(end) || current.isSameOrBefore(end)) {
                this.push(current.toDate())
            } else {
                this.push(null)
            }
            current.add(1, 'day')
        }
    })
}

//  LocalWords:  streamDays
