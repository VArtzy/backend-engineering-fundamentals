import * as v from 'valibot'

const FollowSchema = v.object({
    did: v.integer(),
    tid: v.integer()
})

export default FollowSchema
