import streamDays from '../src/stream-days'
import { Writable } from 'readable-stream'
import * as moment from 'moment'


let dates: Date[] = []

const sink = new Writable({
    objectMode: true,
    write(date: Date, _: string, callback: any) {
        dates.push(date)
        callback()
    }
})


const start = moment.utc().toDate()
const end = moment.utc().add(2, 'days').toDate()
streamDays(start, end).pipe(sink)

sink.on('finish', () => console.log(dates))
