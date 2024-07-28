const asynchandler = (func) => async (req, res, next) => {
    try {
        await func(req, res, next)
    } catch (error) {
        console.log(error);
    }
} 

export {asynchandler}