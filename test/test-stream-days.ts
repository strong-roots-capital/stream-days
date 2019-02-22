import test from 'ava'
import is from '@sindresorhus/is'
import * as moment from 'moment'
import { utcDate } from '@hamroctopus/utc-date'
import { Writable } from 'readable-stream'

/**
 * Library under test
 */

import streamDays from '../src/stream-days'

test.beforeEach((t: any) => {
    t.context.dates = []
    t.context.sink = new Writable({
        objectMode: true,
        write(date: Date, _: string, callback: any) {
            t.context.dates.push(date)
            callback()
        }
    })
})

/*********************************************************************
 * Test cases
 *********************************************************************/

test('should return a Readable stream', t => {
    t.true(is.nodeStream(streamDays()))
})

test.cb('should return a stream that pushes Date objects', (t: any) => {
    const start = moment.utc().startOf('day')
    const end = start.clone().add(1, 'day')
    streamDays(start.toDate(), end.toDate()).pipe(t.context.sink)

    t.context.sink.on('finish', () => {
        t.true(is.date(t.context.dates[0]))
        t.end()
    })
})

test('should throw ArgumentError when `end` is before `start`', (t: any) => {
    const start = moment.utc().startOf('day')
    const end = start.clone().subtract(1, 'day')
    const error = t.throws(() => {
        streamDays(start.toDate(), end.toDate()).pipe(t.context.sink)
    }, Error)
    t.is(error.name, 'ArgumentError')
})

test.cb('should push one date when `start` equals `end`', (t: any) => {
    const start = moment.utc().startOf('day')
    const end = start.clone().add(1, 'day')
    streamDays(start.toDate(), end.toDate()).pipe(t.context.sink)

    t.context.sink.on('finish', () => {
        t.true(is.date(t.context.dates[0]))
        t.end()
    })
})

const shouldFirstPushDateEqualToStart = (t: any, start?: Date, end: Date = utcDate()) => {
    streamDays(start, end).pipe(t.context.sink)
    t.context.sink.on('finish', () => {
        t.deepEqual(t.context.dates[0], is.undefined(start) ? utcDate() : start)
        t.end()
    })
}
shouldFirstPushDateEqualToStart.title = (_ = '', start?: Date, end: Date = utcDate()) => `should first push a Date equivalent to start when start is ${start}`

test.cb(shouldFirstPushDateEqualToStart)
test.cb(shouldFirstPushDateEqualToStart, moment.utc().startOf('day').toDate())
test.cb(shouldFirstPushDateEqualToStart, new Date(0))


const shouldFinallyPushDateWithinOneDayOfEnd = (t: any, start: Date, end: Date) => {
    streamDays(start, end).pipe(t.context.sink)
    t.context.sink.on('finish', () => {
        const lastDate = t.context.dates[t.context.dates.length - 1]
        const diffInHours = Math.abs(moment.utc(lastDate).diff(end, 'hours'))
        t.true(diffInHours >= 0)
        t.true(diffInHours < 24)
        t.end()
    })
}
shouldFinallyPushDateWithinOneDayOfEnd.title = (_ = '', start: Date, end: Date) => `should finally push a Date within one day of end when end is ${end}`

test.cb(shouldFinallyPushDateWithinOneDayOfEnd, moment.utc().startOf('day').toDate(), moment.utc().toDate())
test.cb(shouldFinallyPushDateWithinOneDayOfEnd, moment.utc().startOf('day').toDate(), moment.utc().startOf('day').add(1, 'days').toDate())
test.cb(shouldFinallyPushDateWithinOneDayOfEnd, moment.utc().startOf('day').toDate(), moment.utc().startOf('day').add(5, 'days').toDate())
test.cb(shouldFinallyPushDateWithinOneDayOfEnd, moment.utc().startOf('day').toDate(), moment.utc().startOf('day').add(10, 'days').toDate())
test.cb(shouldFinallyPushDateWithinOneDayOfEnd, moment.utc().startOf('day').toDate(), moment.utc().startOf('day').add(50, 'days').toDate())
test.cb(shouldFinallyPushDateWithinOneDayOfEnd, moment.utc().startOf('day').toDate(), moment.utc().startOf('day').add(100, 'days').toDate())
test.cb(shouldFinallyPushDateWithinOneDayOfEnd, moment.utc().startOf('day').toDate(), moment.utc().startOf('day').add(500, 'days').toDate())
test.cb(shouldFinallyPushDateWithinOneDayOfEnd, moment.utc().startOf('day').toDate(), moment.utc().startOf('day').add(1000, 'days').toDate())


const shouldFinallyPushDateEqualToEndIfEndIsEvenNumberOfDaysAwayFromStart = (t: any, start: Date, end: Date) => {
    streamDays(start, end).pipe(t.context.sink)
    t.context.sink.on('finish', () => {
        const lastDate = t.context.dates[t.context.dates.length - 1]
        t.deepEqual(lastDate, end)
        t.end()
    })
}
shouldFinallyPushDateEqualToEndIfEndIsEvenNumberOfDaysAwayFromStart.title = (_ = '', start: Date, end: Date) => `should finally push a Date equal to end when end is n days away from start (${end})`

test.cb(shouldFinallyPushDateEqualToEndIfEndIsEvenNumberOfDaysAwayFromStart, moment.utc().startOf('day').toDate(), moment.utc().startOf('day').add(1, 'days').toDate())
test.cb(shouldFinallyPushDateEqualToEndIfEndIsEvenNumberOfDaysAwayFromStart, moment.utc().startOf('day').toDate(), moment.utc().startOf('day').add(5, 'days').toDate())
test.cb(shouldFinallyPushDateEqualToEndIfEndIsEvenNumberOfDaysAwayFromStart, moment.utc().startOf('day').toDate(), moment.utc().startOf('day').add(10, 'days').toDate())
test.cb(shouldFinallyPushDateEqualToEndIfEndIsEvenNumberOfDaysAwayFromStart, moment.utc().startOf('day').toDate(), moment.utc().startOf('day').add(50, 'days').toDate())
test.cb(shouldFinallyPushDateEqualToEndIfEndIsEvenNumberOfDaysAwayFromStart, moment.utc().startOf('day').toDate(), moment.utc().startOf('day').add(100, 'days').toDate())
test.cb(shouldFinallyPushDateEqualToEndIfEndIsEvenNumberOfDaysAwayFromStart, moment.utc().startOf('day').toDate(), moment.utc().startOf('day').add(500, 'days').toDate())
test.cb(shouldFinallyPushDateEqualToEndIfEndIsEvenNumberOfDaysAwayFromStart, moment.utc().startOf('day').toDate(), moment.utc().startOf('day').add(1000, 'days').toDate())


const shouldPushDatesInEqual24HourIncrementsFromStartUntilEndIsReached = (t: any, start: Date, end: Date) => {
    streamDays(start, end).pipe(t.context.sink)
    t.context.sink.on('finish', () => {
        const current = moment.utc(start)
        while (current.isSameOrBefore(end)) {
            const date = t.context.dates.shift()
            t.deepEqual(current.toDate(), date)
            current.add(1, 'day')
        }
        t.is(t.context.dates.length, 0)
        t.end()
    })
}
shouldPushDatesInEqual24HourIncrementsFromStartUntilEndIsReached.title = (_ = '', start: Date, end: Date) => `should push dates in equal 24 hour increments from start until end is reached ${start.toISOString()} ${end.toISOString()}`

test.cb(shouldPushDatesInEqual24HourIncrementsFromStartUntilEndIsReached, moment.utc().startOf('day').toDate(), moment.utc().startOf('day').toDate())
test.cb(shouldPushDatesInEqual24HourIncrementsFromStartUntilEndIsReached, moment.utc().startOf('day').toDate(), moment.utc().startOf('day').add(1, 'days').toDate())
test.cb(shouldPushDatesInEqual24HourIncrementsFromStartUntilEndIsReached, moment.utc().startOf('day').toDate(), moment.utc().startOf('day').add(5, 'days').toDate())
test.cb(shouldPushDatesInEqual24HourIncrementsFromStartUntilEndIsReached, moment.utc().startOf('day').toDate(), moment.utc().startOf('day').add(10, 'days').toDate())
test.cb(shouldPushDatesInEqual24HourIncrementsFromStartUntilEndIsReached, moment.utc().startOf('day').toDate(), moment.utc().startOf('day').add(50, 'days').toDate())
test.cb(shouldPushDatesInEqual24HourIncrementsFromStartUntilEndIsReached, moment.utc().startOf('day').toDate(), moment.utc().startOf('day').add(100, 'days').toDate())
test.cb(shouldPushDatesInEqual24HourIncrementsFromStartUntilEndIsReached, moment.utc().startOf('day').toDate(), moment.utc().startOf('day').add(500, 'days').toDate())
test.cb(shouldPushDatesInEqual24HourIncrementsFromStartUntilEndIsReached, moment.utc().startOf('day').toDate(), moment.utc().startOf('day').add(1000, 'days').toDate())

//  LocalWords:  shouldFirstPushDateEqualToStart
