import ratelimit from "../config/upstash.js";


const rateLimiter = async (req,res,next) => {
    try{
        const {success} = await ratelimit.limit("vinit")
        // user_id or ip for individual rl ...now it is for all

        if(!success){
            return res.status(429).json({
                message:"Too many request holdd onnnn!!"
            })
        }

        next()
    }
    catch(error){
        console.log("rate limit error",error)
        next(error)
    }
}

export default rateLimiter