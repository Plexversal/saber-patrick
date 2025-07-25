self.onmessage = function (event) {
    const { pattern, text } = event.data

    try {
        let matches = text.match(new RegExp(pattern, "gi"))
        if(matches) {
        self.postMessage({
            matches: matches
        });
    } else {
        self.postMessage({
            matches: ['No matches found']
        });
        }
    } catch(err) {
        self.postMessage({
            error: err
        });
    }


}