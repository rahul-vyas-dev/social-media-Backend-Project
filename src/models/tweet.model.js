import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const tweetSchema = new Schema({
    content: {
        type: String,
        required: true,
        maxlength: 280
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }
}, { timestamps: true});

tweetSchema.plugin(mongooseAggregatePaginate);
tweetSchema.methods.validateUser = function(userId) {
    return this.owner.toString() === userId.toString();
}
export const Tweet = mongoose.model("Tweet", tweetSchema);