import jwt from 'jsonwebtoken'
// create token and saving that in cookies
const sendToken = (user, statusCode, res, message = "") => {

    const token = jwt.sign({ id: user._id, name: user.name, email: user.email, phone: user?.phone || "" }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES,
    });

    // Options for cookies
    const options = {
        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        sameSite: "Strict",
        secure: true,
    };

    return res.status(statusCode).cookie("token", token, options).json({ data: { user, token }, status: true, message: message ? message : "User logged in successfully", });
};

export default sendToken;

    // res.cookie('token', token, {
    //   httpOnly: true,
    //   expires: new Date(Date.now() + process.env.JWT_EXPIRES_IN * 1000),
    // });
  