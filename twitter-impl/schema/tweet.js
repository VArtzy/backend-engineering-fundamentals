import * as v from 'valibot'

const TweetSchema = v.object({
    uid: v.integer(),
    text: v.pipe(v.string(), v.maxLength(200))
})

export default TweetSchema
