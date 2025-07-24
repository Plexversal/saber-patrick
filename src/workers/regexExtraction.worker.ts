self.onmessage = function (event) {
    const { pattern, text } = event.data

    var matches = text.match(new RegExp(pattern, "gi")) ;
    if(matches) {
        self.postMessage({
            matches: matches
        });
    } else {
        self.postMessage({
            error: 'No matches found'
        });
    }

}