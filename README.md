This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

(Uses latest Next.JS 15)

## Setup

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

All routes in (routes) folder and index route is page.tsx at route of said folder.

## Notes

The Applications purpose is to analyse user input with user defined regex expressions, users should be able to:
* Input data in a textarea
* Add and save regular expressions
* Display extracted data with selected regex pattern
* Modify existing patterns and save
* App is a single page web application dashboard split into 2 sections

### Considerations

**Computation**

The bulk of computation is going to be the regex matching, so it must be considered where this computation should take place.

If user enters large text or abnormal regex pattern, browser can hang and get the classic "aw snap" issue.

There are 3 approaches that can be used for this type of computation:

1) Everything computed client-side in real time. (Simplist approach)
2) Everything computed server-side using Next server route. (Would require heavy validation to protect API route and server)
3) Everything computed in a worker agent, this worker can offload the computation to another thread on the cpu and so allow the app to not be slowed down.

After consideration, the app should use option 3 in this scenario.

**Storage**

Other limitations include local-storage limits so this needs to be handled if this max limit is reached, ideally db is used, but not required in this app.


**State**

Requirements of the app is that the states react to each other from the main section and the side bar components. (e.g. if text changes, matches change)

Simplist approach would be to store the state in parent container and then lift the state up from the components.

But for this example, I will use a **context provider**, just for demonstration purposes of react/next state management.

Third-party state management like Redux would be overkill, so not used here.