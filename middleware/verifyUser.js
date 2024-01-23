module.exports = (roles) => {
    return (req, res, next) => {
        const userRole = req.user?.role;

        if(userRole && roles.includes(userRole)){
            next()
        }
        else{
            res.status(403).json({error: "Forbidden: Insufficient Permission" })
        }
    }
}