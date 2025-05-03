import * as v from 'valibot'

const UserSchema = v.object({
    name: v.pipe(v.string(), v.minLength(2), v.maxLength(26)),
    password: v.pipe(v.string(), v.minLength(8), v.maxLength(26))
})

export default UserSchema
