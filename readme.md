# stream-days [![Build status](https://travis-ci.org/strong-roots-capital/stream-days.svg?branch=master)](https://travis-ci.org/strong-roots-capital/stream-days) [![npm version](https://img.shields.io/npm/v/@strong-roots-capital/stream-days.svg)](https://npmjs.org/package/@strong-roots-capital/stream-days) [![codecov](https://codecov.io/gh/strong-roots-capital/stream-days/branch/master/graph/badge.svg)](https://codecov.io/gh/strong-roots-capital/stream-days)

> Create a Readable stream of Date objects separated by one day

## Install

``` shell
npm install @strong-roots-capital/stream-days
```

## Use

``` typescript
import streamDays from '@strong-roots-capital/stream-days'
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
//=> [ 2019-02-22T22:42:00.812Z, 2019-02-23T22:42:00.812Z, 2019-02-24T22:42:00.812Z ]
```
