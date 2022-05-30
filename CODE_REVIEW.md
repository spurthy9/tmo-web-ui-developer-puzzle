#### Code review

- Need to display spinner while making the book search api call in order to have better user experience.
- Need to have error handling for book search api call and null/undefined/empty check should be added before mapping the response object.
- Reducers are not available for failedAddToReadingList and failedRemoveFromReadingList actions. Due to which test cases are failing.
- Wherever we are using subscription need to be unsubscribed in ngDestroy in order to prevent the memory leak issue.
- Better to use async pipe to display the data from store selectors instead to use subscribe for every selectors, as we no need to explicitly unsubscribe them.
- Test case naming convention should be proper

#### Accessibility issues - Manually found (Fixed all the below issues)

- Reading List close button does not have a label
- Javascript text is not being highlighted
- Added aria disabled for the want to read button
- Modified the label for want to read button (Added book title to the label)
- Images need to have 'alt' attribute.

#### Issues from automated scan (Fixed)

- Background and foreground colours do not have a sufficient contrast ratio.

#### Fixed issues from code review section

- Error handling for the book search api and null/undefined/empty check is added for the response object
- Reducers are added
- Added test cases for Reading list component, book search component, book reducer, book effects, reading list effects and reducer

