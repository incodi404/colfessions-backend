function timeStamp() {
    const time = Date.now()
    const date = new Date(time)
    const customDate = `${date.toDateString()} AT ${date.toLocaleTimeString()}`

    return {time, customDate}
}

export {
    timeStamp
}